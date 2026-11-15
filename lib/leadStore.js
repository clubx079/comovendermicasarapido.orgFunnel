// Server only (imported by app/api/lead/route.js). Saves a lead in its country's Casa-Libre database
// (public.funnel_leads, AiroBase / PostgREST, secret key), and falls back to data/leads.jsonl on this
// server when the database is not configured or the insert fails, so no lead is ever lost.
//
// Env, read at request time (never at build time, never NEXT_PUBLIC):
//   AIROBASE_URL_<CC>         e.g. AIROBASE_URL_PY = https://<id>.db.airosofts.com
//   AIROBASE_SECRET_KEY_<CC>  that database's secret key
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const FILE = path.join(process.cwd(), 'data', 'leads.jsonl');
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

const str = (v, max) => {
  const s = String(v ?? '').trim();
  return s ? s.slice(0, max) : null;
};

/** The visitor's attribution from the request body: { utm, referrer, posthog_distinct_id }, cleaned. */
export function attributionOf(b = {}) {
  const utm = {};
  const src = b.utm && typeof b.utm === 'object' ? b.utm : {};
  for (const k of UTM_KEYS) { const v = str(src[k], 200); if (v) utm[k] = v; }
  return {
    utm: Object.keys(utm).length ? utm : null,
    referrer: str(b.referrer, 500),
    posthog_distinct_id: str(b.posthog_distinct_id, 200),
  };
}

async function insertDb(row) {
  const cc = row.country.toUpperCase();
  const url = process.env[`AIROBASE_URL_${cc}`];
  const key = process.env[`AIROBASE_SECRET_KEY_${cc}`];
  if (!url || !key) throw new Error(`AIROBASE_URL_${cc} / AIROBASE_SECRET_KEY_${cc} not set`);
  const res = await fetch(`${url.replace(/\/+$/, '')}/rest/v1/funnel_leads`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(row),
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(`PostgREST ${res.status}${body?.code ? ` ${body.code}` : ''}${body?.message ? `: ${String(body.message).slice(0, 200)}` : ''}`);
  }
}

/** Saves the row (a funnel_leads row). Returns { saved: 'db' | 'db-fallback' | 'file' }; throws only when everything fails.
 *  fallbackRow: a second shape of the same lead to try when the database refuses the first (a site key the
 *  table's check constraint does not allow yet). */
export async function saveLead(row, fallbackRow = null) {
  let reason;
  try {
    await insertDb(row);
    return { saved: 'db' };
  } catch (e) {
    reason = e?.name === 'TimeoutError' ? 'timeout' : String(e?.message || e);
  }
  if (fallbackRow && /23514|check constraint/i.test(reason)) {
    try {
      await insertDb(fallbackRow);
      console.error(`[lead] database refused site "${row.site}" (${reason}); saved as "${fallbackRow.site}".`);
      return { saved: 'db-fallback' };
    } catch (e) {
      reason = `${reason}; fallback: ${String(e?.message || e)}`;
    }
  }
  console.error(`[lead] database insert failed (${row.site}/${row.country}): ${reason} — saving to data/leads.jsonl`);
  await mkdir(path.dirname(FILE), { recursive: true });
  await appendFile(FILE, JSON.stringify({ ...row, receivedAt: new Date().toISOString(), dbError: reason }) + String.fromCharCode(10), 'utf8');
  return { saved: 'file' };
}
