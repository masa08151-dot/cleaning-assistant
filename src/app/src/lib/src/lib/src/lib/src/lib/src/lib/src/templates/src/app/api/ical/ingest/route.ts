import { supaAdmin } from '@/src/lib/db';
import { fetchAndNormalizeIcal } from '@/src/lib/ical';
export const runtime = 'nodejs';
export async function GET() {
  const { data: sources, error } = await supaAdmin
    .from('sources').select('id, property_id, url_or_rule')
    .eq('type','ical').eq('active',true);
  if (error) return new Response(error.message,{status:500});
  if (!sources) return new Response('no sources',{status:200});
  let upserts = 0;
  for (const s of sources) {
    const items = await fetchAndNormalizeIcal(s.url_or_rule);
    for (const it of items) {
      const { error: e2 } = await supaAdmin.from('reservations').upsert({
        uid: it.uid, source_id: s.id, property_id: s.property_id,
        start_at: it.start_at, end_at: it.end_at, pax: it.pax, guest_name: it.guest_name,
        raw_json: it, status: 'confirmed'
      }, { onConflict: 'uid' });
      if (!e2) upserts++;
    }
  }
  return new Response(`ok ${upserts}`, { status: 200 });
}
