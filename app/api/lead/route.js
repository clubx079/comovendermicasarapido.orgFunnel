import { COUNTRIES, checkWhatsapp } from '@/lib/countries';
import { ui, consentText } from '@/lib/voice';
import { saveLead, attributionOf } from '@/lib/leadStore';
import { SITE as site } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Where leads go:
//  1. The Casa-Libre database of the form's country (public.funnel_leads; lib/leadStore.js, env AIROBASE_URL_<CC> /
//     AIROBASE_SECRET_KEY_<CC>, read at request time), with site = SITE.funnelSite (lib/site.js).
//     If the table's check constraint does not allow that site key yet (see migrations/), the lead is saved as
//     'owners' with form_location = this site's key, so it still reaches Admin → Funnels.
//  2. When the database is not configured or fails: data/leads.jsonl on this server (not public, not in git).
//  3. If LEADS_WEBHOOK_URL is set, the same row is also POSTed there.
const hits = new Map(); // ip -> timestamps, for a simple limit of 5 leads per 10 minutes
const TYPES = ['Casa', 'Departamento', 'Terreno', 'Dúplex', 'Otro'];
const OPERATIONS = ['Vender', 'Alquilar'];

const bad = (error, status = 400) => Response.json({ ok: false, error }, { status });

export async function POST(request) {
  let b;
  try { b = await request.json(); } catch { return bad('Datos inválidos.'); }

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'local';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) return bad('Recibimos varios envíos seguidos. Probá de nuevo en unos minutos.', 429);

  // Bots: the hidden field is filled in, or the form was sent faster than a person can.
  if (b.website || !(Number(b.elapsed) >= 2500)) return Response.json({ ok: true }); // accepted silently, not saved

  const cc = b.country === undefined ? site.rootCountry : b.country;
  const country = COUNTRIES[cc];
  if (!country || !site.countries.includes(cc)) return bad('País inválido.');
  const t = ui(cc);
  const v = country.voice;
  const name = String(b.name || '').trim().slice(0, 80);
  if (name.length < 2) return bad(t.errName);
  const wa = checkWhatsapp(b.whatsapp, cc);
  if (!wa.ok) return bad(wa.error);
  if (!country.formCities.includes(b.city) || !TYPES.includes(b.type)) return bad(t.errBoth);
  if (!OPERATIONS.includes(b.operation)) return bad(v === 'voseo' ? 'Elegí si querés vender o alquilar.' : v === 'usted' ? 'Elija si quiere vender o alquilar.' : 'Elige si quieres vender o alquilar.');
  const email = String(b.email || '').trim();
  if (email && (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))) return bad(v === 'voseo' ? 'Revisá tu email.' : v === 'usted' ? 'Revise su email.' : 'Revisa tu email.');

  const lead = {
    site: site.funnelSite,
    country: cc,
    page: String(b.page || '').slice(0, 200),
    form_location: String(b.location || '').slice(0, 20),
    operation: b.operation,
    city: b.city,
    property_type: b.type,
    has_title: null,
    portfolio: null,
    role: null,
    agency: null,
    name,
    whatsapp: wa.e164,
    email: email || null,
    // Proof of consent: what the person saw and accepted, and when. Sending the form is the consent (no checkbox).
    consent: { contact: true, news: false, method: 'submit', text: consentText(cc), at: new Date(now).toISOString() },
    ...attributionOf(b), // utm, referrer, posthog_distinct_id
    ip,
    user_agent: (request.headers.get('user-agent') || '').slice(0, 200),
  };

  try {
    const fallback = lead.site === 'owners' ? null : { ...lead, site: 'owners', form_location: site.funnelSite.slice(0, 20) };
    await saveLead(lead, fallback);
  } catch (e) {
    console.error(`[lead] could not save the lead anywhere: ${e?.code || e?.message || e}`);
    return bad(v === 'voseo' ? 'No pudimos guardar tus datos. Probá de nuevo en un momento.' : 'No pudimos guardar tus datos. Inténtalo de nuevo en un momento.', 500);
  }
  hits.set(ip, [...recent, now]);

  const hook = process.env.LEADS_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(process.env.LEADS_WEBHOOK_SECRET ? { 'x-lead-secret': process.env.LEADS_WEBHOOK_SECRET } : {}) },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(8000),
      });
    } catch { /* the lead is already saved; the webhook can be retried from there */ }
  }
  return Response.json({ ok: true });
}
