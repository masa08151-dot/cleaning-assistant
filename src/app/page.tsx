export default function Home() {
  return (
    <main style={{padding: 24, fontFamily: "system-ui"}}>
      <h1>Cleaning Assistant</h1>
      <p>iCal予約の取り込み / 清掃要約 / PDF日報の自動送信を行います。</p>
      <ol>
        <li>Supabaseに物件とiCal URLを登録</li>
        <li>/api/ical/ingest を1回叩いて初回取り込み</li>
        <li>毎朝、自動でPDFが清掃会社へ送信されます</li>
      </ol>
    </main>
  );
}
　
