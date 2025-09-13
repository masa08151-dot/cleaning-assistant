import { supaAdmin } from '@/src/lib/db';
import { cleaningPrompt } from '@/src/lib/summary';
export const runtime = 'nodejs';

async function callLLM(prompt: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return '(要約APIキー未設定)';
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method:'POST',
    headers:{ 'Authorization':`Bearer ${key}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ model:'gpt-4o-mini', temperature:0.2,
      messages:[{role:'system',content:'You are a helpful assistant.'},{role:'user',content:prompt}] })
  }).then(r=>r.json());
  return res.choices?.[0]?.message?.content ?? '(要約失敗)';
}

export async function GET() {
  const { data, error } = await supaAdmin.rpc('list_today_cleanings');
  if (error) return new Response(error.message,{status:500});
  if (!data?.length) return new Response('no data',{status:200});
  for (const r of data) {
    const prompt = cleaningPrompt({ property: r.property, reservation: r.reservation });
    const summary = await callLLM(prompt);
    await supaAdmin.from('cleaning_jobs').upsert(
      { reservation_id: r.reservation.id, summary_text: summary },
      { onConflict: 'reservation_id' }
    );
  }
  return new Response(`ok ${data.length}`, { status: 200 });
}
