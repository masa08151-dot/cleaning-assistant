import ical from 'node-ical';
import { DateTime } from 'luxon';

export type NormalizedRes = { uid: string; start_at: string; end_at: string; summary?: string; pax?: number; guest_name?: string; };

export async function fetchAndNormalizeIcal(url: string): Promise<NormalizedRes[]> {
  const data = await ical.async.fromURL(url, {});
  const out: NormalizedRes[] = [];
  for (const k of Object.keys(data)) {
    const ev: any = (data as any)[k];
    if (ev.type !== 'VEVENT') continue;
    const uid = String(ev.uid || `${ev.start}-${ev.summary}-${k}`);
    const start = DateTime.fromJSDate(ev.start, { zone: 'Asia/Tokyo' }).toISO()!;
    const end = DateTime.fromJSDate(ev.end, { zone: 'Asia/Tokyo' }).toISO()!;
    const text = [ev.summary, ev.description].filter(Boolean).join('\n');
    const pax = text?.match(/(guests?|人数)[^\d]*(\d{1,2})/i)?.[2];
    const guest = text?.match(/Guest[:\s]+([A-Za-z\u3040-\u30ff\u4e00-\u9faf ]{2,})/i)?.[1];
    out.push({ uid, start_at: start, end_at: end, summary: ev.summary, pax: pax ? Number(pax) : undefined, guest_name: guest?.trim() });
  }
  return out;
}
