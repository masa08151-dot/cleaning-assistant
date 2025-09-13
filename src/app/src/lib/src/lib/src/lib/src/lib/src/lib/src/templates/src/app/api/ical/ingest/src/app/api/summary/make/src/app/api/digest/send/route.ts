import { supaAdmin } from '@/src/lib/db';
import { digestHtml } from '@/src/templates/digest.html';
import { htmlToPdfBuffer } from '@/src/lib/pdf';
import { sendMailPDF } from '@/src/lib/mailer';
import { DateTime } from 'luxon';
export const runtime = 'nodejs';

export async function GET() {
  const today = DateTime.now().setZone('Asia/Tokyo').toFormat('yyyy-MM-dd');
  const { data, error } = await supaAdmin.rpc('list_today_cleanings');
  if (error) return new Response(error.message,{status:500});

  const items = (data ?? []).map((r:any)=>({
    time: DateTime.fromISO(r.reservation.end_at).toFormat('HH:mm'),
    property: r.property.name,
    address: r.property.address ?? '',
    parking: r.property.parking ?? '',
    summary: r.cleaning_job?.summary_text ?? '(要約未作成)'
  })).sort((a:any,b:any)=>a.time.localeCompare(b.time));

  const html = digestHtml(today, items);
  const pdf = await htmlToPdfBuffer(html);

  await sendMailPDF(
    ['cleaning-company@example.com'], // ←清掃会社のメールに変更
    `${today} 本日の清掃予定（${items.length}件）`,
    `添付のPDFをご確認ください。`,
    pdf,
    `cleaning-${today}.pdf`
  );
  return new Response(`sent ${items.length}`, { status: 200 });
}
