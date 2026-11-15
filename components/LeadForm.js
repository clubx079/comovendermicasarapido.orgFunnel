'use client';
// Owner sites only. Two steps on the same page: first what and where (nothing personal), then name, WhatsApp and an
// optional email. After "Enviar" the lead is saved and the visitor goes on to Casa-Libre to publish for free
// (Roland, 14 Nov 2026: seller pages capture in the funnel and redirect to Casa-Libre).
import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { capture, distinctId, getAttribution } from '@/lib/analytics';
import { countryOf, checkWhatsapp } from '@/lib/countries';
import { ui, consentText } from '@/lib/voice';

const OPERATIONS = ['Vender', 'Alquilar'];
export const TYPES = ['Casa', 'Departamento', 'Terreno', 'Dúplex', 'Otro'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const push = (event, data) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data }); // never names, phone numbers or emails
  capture(event, data);
};

/** cc: the country of the page. rental: the operation starts on "Alquilar". publishHref: where to go after sending.
 *  variant: 'side' = inside the right-hand card (desktop and tablet); 'inline' = under the answer, on phones. */
export default function LeadForm({ cc = 'py', rental = false, publishHref, privacyHref = '/privacidad/', variant = 'inline' }) {
  const path = usePathname();
  const startedAt = useRef(0);
  const country = countryOf(cc);
  const t = ui(cc);
  const [step, setStep] = useState(1);
  const [v, setV] = useState({ operation: rental ? 'Alquilar' : 'Vender', city: '', type: '', name: '', whatsapp: '', email: '', website: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const id = (k) => `lf-${variant}-${k}`;
  const rootId = variant === 'inline' ? 'formulario' : 'formulario-lateral';
  const side = variant === 'side';
  const meta = { form_location: variant, page_path: path, country: country.code };

  const start = () => {
    if (!startedAt.current) { startedAt.current = Date.now(); push('form_start', meta); }
  };
  const next = (e) => {
    e.preventDefault();
    if (!v.city && !v.type) return setError(t.errBoth);
    if (!v.city) return setError(t.errCity);
    if (!v.type) return setError(t.errType);
    setError(''); setStep(2); push('form_step_complete', { ...meta, operation: v.operation, city: v.city, property_type: v.type });
  };
  const submit = async (e) => {
    e.preventDefault();
    const email = v.email.trim();
    if (v.name.trim().length < 2) return setError(t.errName);
    const wa = checkWhatsapp(v.whatsapp, cc);
    if (!wa.ok) return setError(wa.error);
    if (email && (email.length > 120 || !EMAIL_RE.test(email))) return setError(t.errEmail);
    setError(''); setSending(true);
    try {
      const res = await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...v, ...getAttribution(), posthog_distinct_id: distinctId(), email, country: country.code, page: path, location: variant, elapsed: Date.now() - startedAt.current, consentText: consentText(cc) }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || 'error');
      push('generate_lead', { ...meta, operation: v.operation, city: v.city, property_type: v.type, lead_source: 'form' });
      setDone(true);
      push('lead_redirect', { ...meta, to: 'casa-libre' });
      setTimeout(() => { window.location.assign(publishHref); }, 2200);
    } catch (err) {
      setSending(false);
      setError(err.message && err.message !== 'error' ? err.message : t.errNet);
    }
  };

  const Select = ({ name, label, options, placeholder }) => (
    <div className="lf-field">
      <label htmlFor={id(name)}>{label}</label>
      <select id={id(name)} value={v[name]} onChange={set(name)} onFocus={start}>
        {placeholder ? <option value="" disabled>{placeholder}</option> : null}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  if (done) {
    return (
      <div className={`lead lead-${variant} lead-done`} id={rootId} data-pos="form-done" role="status">
        <p className="lead-kicker">{t.formKicker}</p>
        <p className="lead-h">{t.formDone}</p>
        <p className="lead-go"><a className="btn" href={publishHref}>{t.formGo} <span aria-hidden="true">↗</span></a></p>
      </div>
    );
  }

  return (
    <form className={`lead lead-${variant}`} id={rootId} onSubmit={step === 1 ? next : submit} noValidate data-pos={`form-${variant}`} data-step={step}>
      <p className="lead-kicker">{t.formKicker}</p>
      <p className="lead-h">{t.formHeading[v.operation]}</p>
      <p className="lead-sub">{t.formSub}</p>

      {step === 1 ? (
        <>
          <div className="lf-row">
            {Select({ name: 'operation', label: t.qOperation, options: OPERATIONS })}
            {Select({ name: 'city', label: t.qCity, options: country.formCities, placeholder: t.phCity })}
            {Select({ name: 'type', label: t.qType, options: TYPES, placeholder: t.phType })}
          </div>
          {error ? <p className="lead-err" role="alert">{error}</p> : null}
          <div className="lf-actions">
            <button className="btn lead-btn" type="submit">Continuar</button>
            <span className="lead-step" aria-live="polite">Paso 1 de 2: {t.stepProp}</span>
          </div>
        </>
      ) : (
        <>
          <div className="lf-row">
            <div className="lf-field">
              <label htmlFor={id('name')}>{t.name}</label>
              <input id={id('name')} type="text" autoComplete="name" placeholder={side ? t.name : undefined} value={v.name} onChange={set('name')} maxLength={80} />
            </div>
            <div className="lf-field">
              <label htmlFor={id('wa')}>{t.whatsapp}</label>
              <input id={id('wa')} type="tel" inputMode="tel" autoComplete="tel" placeholder={country.phone.example} value={v.whatsapp} onChange={set('whatsapp')} maxLength={20} />
            </div>
            <div className="lf-field">
              <label htmlFor={id('email')}>Email (opcional)</label>
              <input id={id('email')} type="email" inputMode="email" autoComplete="email" placeholder={side ? 'Email (opcional)' : undefined} value={v.email} onChange={set('email')} maxLength={120} />
            </div>
          </div>
          {/* Hidden from people; bots fill it in. */}
          <div className="lf-hp" aria-hidden="true">
            <label htmlFor={id('web')}>No completes este campo</label>
            <input id={id('web')} type="text" tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} />
          </div>
          {error ? <p className="lead-err" role="alert">{error}</p> : null}
          <div className="lf-actions">
            <button className="btn lead-btn" type="submit" disabled={sending}>{sending ? 'Enviando…' : 'Enviar'}</button>
            <button className="lead-back" type="button" onClick={() => { setStep(1); setError(''); }}>Volver al paso 1</button>
          </div>
          <p className="lead-consent">{t.consentA}<a href={privacyHref}>{t.consentB}</a>.</p>
        </>
      )}
    </form>
  );
}
