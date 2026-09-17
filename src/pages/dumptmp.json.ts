/* Temporary: dumps the data modules as JSON so the migration cannot mistype
   copy that has been through client review. Deleted once the move is done. */
import type { APIRoute } from 'astro';
import * as home from '../data/home';
import * as whatWeDo from '../data/what-we-do';
import * as howWeWork from '../data/how-we-work';
import * as forStartups from '../data/for-startups';
import * as scaleUps from '../data/scale-ups';
import * as enterprise from '../data/enterprise';
import * as whoWeAre from '../data/who-we-are';
import * as contact from '../data/contact';
import * as privacy from '../data/privacy';

const plain = (m: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(m).filter(([k]) => k !== 'default'));

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        home: plain(home),
        'what-we-do': plain(whatWeDo),
        'how-we-work': plain(howWeWork),
        'for-startups': plain(forStartups),
        'scale-ups': plain(scaleUps),
        enterprise: plain(enterprise),
        'who-we-are': plain(whoWeAre),
        contact: plain(contact),
        privacy: plain(privacy),
      },
      null,
      1,
    ),
    { headers: { 'content-type': 'application/json' } },
  );
