# The CMS sign-in relay

The editor at `/admin` commits to GitHub as you, so it needs a GitHub token.
Getting one means exchanging an authorisation code for a token, and that
exchange needs a client secret that cannot live in a browser. This worker holds
the secret and does the exchange.

Three steps, once. About ten minutes.

## 1. Create the GitHub OAuth app

GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App.

| Field | Value |
| --- | --- |
| Application name | `delv. CMS` |
| Homepage URL | `https://delv.health` |
| Authorization callback URL | `https://delv-cms-auth.<your-subdomain>.workers.dev/callback` |

You will not know the callback URL until step 2 finishes, so put a placeholder
in, deploy the worker, then come back and correct it. **It has to match
exactly** — a trailing slash or `http` instead of `https` fails with an error
that does not say which field is wrong.

Keep the page open. You need the **Client ID**, and you need to generate a
**Client secret** and copy it before you navigate away — GitHub shows it once.

## 2. Deploy the worker

From this directory:

```
npx wrangler login
npx wrangler deploy
```

That prints the worker's URL. Then set the two secrets, which are stored
encrypted by Cloudflare and never appear in this repository:

```
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

Go back to the GitHub OAuth app and set the callback URL to the worker's URL
with `/callback` on the end.

## 3. Point the editor at it

In `public/admin/config.yml`, under `backend`, set `base_url` to the worker's
URL — no trailing slash, no path:

```yaml
base_url: https://delv-cms-auth.<your-subdomain>.workers.dev
```

Commit, let Vercel build, then open `https://delv.health/admin` and sign in.

## If it does not work

**The popup opens and closes with nothing happening.** The callback URL on the
GitHub app does not match the worker's. They must agree character for
character.

**"That sign-in did not start here."** The state cookie did not survive. It is
`SameSite=Lax`, so starting the sign-in from somewhere other than the editor
will do this. Start it from `/admin`.

**Signed in, but saving fails.** The token's scope is `repo`, which is needed
because this repository is private. If you narrowed it to `public_repo` the
token cannot see the repository at all.

**Editing from somewhere other than delv.health.** The worker only hands the
token to origins on the list at the top of `worker.js`. Add the origin there
and redeploy; do not replace the list with a wildcard, because the token can
write to every repository you can write to.

## What this costs

Nothing. Cloudflare's free tier is 100,000 requests a day and this is used a
handful of times a week, once per sign-in.
