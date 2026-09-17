/**
 * The OAuth relay for the CMS at /admin.
 *
 * ## Why this exists
 *
 * The editor commits to GitHub as Sam, so it needs a GitHub access token.
 * Getting one requires exchanging an authorisation code for a token, and that
 * exchange needs the OAuth app's client secret — which cannot live in a
 * browser. So it happens here instead: a worker that holds the secret, talks
 * to GitHub, and hands the token back to the editor window.
 *
 * It is about sixty lines and it runs on Cloudflare's free tier. The
 * alternative was a hosted relay run by someone else, which would have put a
 * third party in the path of a token that can write to this repository.
 *
 * ## The flow
 *
 *   1. The editor opens /auth in a popup.
 *   2. This redirects to GitHub, with a random `state` also set as a cookie.
 *   3. GitHub sends the reader back to /callback with a code.
 *   4. The cookie and the returned state must match, or the request is
 *      refused — without that check, a link from anywhere could start an
 *      authorisation that lands in someone else's session.
 *   5. The code is exchanged for a token here, where the secret is.
 *   6. The token goes to the editor window by postMessage, and only to an
 *      origin on the allow-list.
 *
 * ## Deploying it
 *
 * See README.md in this directory. Two secrets, one command.
 */

/**
 * Where the editor is allowed to be. A token that can write to the repository
 * is posted to this window, so the list is exact rather than a pattern: a
 * wildcard here would hand the token to any subdomain anyone could register.
 */
const ALLOWED_ORIGINS = [
  'https://delv.health',
  'https://www.delv.health',
  'http://localhost:4321',
];

const html = (body, status = 200) =>
  new Response(`<!doctype html><meta charset="utf-8">${body}`, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      /* Nothing here should ever be cached: it carries one-time values. */
      'cache-control': 'no-store',
    },
  });

/** A random, URL-safe value. Used for the CSRF state. */
const randomState = () =>
  [...crypto.getRandomValues(new Uint8Array(16))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      return html('<p>This relay is missing its GitHub credentials.</p>', 500);
    }

    /* ------------------------------------------------------------- /auth */
    if (url.pathname === '/auth') {
      const state = randomState();
      const authorize = new URL('https://github.com/login/oauth/authorize');
      authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      /*
       * `repo` rather than `public_repo`: this repository is private, and the
       * narrower scope cannot see it at all. It is the smallest scope that
       * works, not a comfortable one — the token can write to every
       * repository Sam can write to, which is the reason the relay is his
       * rather than someone else's.
       */
      authorize.searchParams.set('scope', 'repo,user');
      authorize.searchParams.set('state', state);
      authorize.searchParams.set('redirect_uri', `${url.origin}/callback`);

      return new Response(null, {
        status: 302,
        headers: {
          location: authorize.href,
          'set-cookie': `cms_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
          'cache-control': 'no-store',
        },
      });
    }

    /* --------------------------------------------------------- /callback */
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const returned = url.searchParams.get('state');
      const cookie = (request.headers.get('cookie') ?? '')
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith('cms_state='))
        ?.slice('cms_state='.length);

      if (!code) return html('<p>GitHub did not send a code.</p>', 400);
      if (!returned || !cookie || returned !== cookie) {
        return html(
          '<p>That sign-in did not start here, so it was refused. Close this window and try again from the editor.</p>',
          400,
        );
      }

      const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.access_token) {
        /* Deliberately vague to the browser, because the error text from
           GitHub can echo parts of the request back. */
        return html('<p>GitHub would not issue a token.</p>', 502);
      }

      const payload = JSON.stringify({
        token: data.access_token,
        provider: 'github',
      });

      /*
       * The handshake the CMS expects. The first message goes to '*' because
       * the opener's origin is not knowable yet; the reply carries it, and it
       * is checked against the allow-list before the token is sent anywhere.
       */
      return html(`
<title>Signing in…</title>
<p>Signing in…</p>
<script>
  (function () {
    var allowed = ${JSON.stringify(ALLOWED_ORIGINS)};
    var payload = ${JSON.stringify(payload)};
    function receive(e) {
      if (allowed.indexOf(e.origin) === -1) return;
      window.removeEventListener('message', receive, false);
      window.opener.postMessage('authorization:github:success:' + payload, e.origin);
      window.close();
    }
    window.addEventListener('message', receive, false);
    window.opener && window.opener.postMessage('authorizing:github', '*');
  })();
</script>`);
    }

    return html('<p>Nothing here. The editor is at /admin on the site.</p>', 404);
  },
};
