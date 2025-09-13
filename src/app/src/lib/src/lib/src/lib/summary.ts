export function cleaningPrompt(input: { property: any; reservation: any; }) {
  return `あなたは民泊清掃の現場向けアシスタントです。日本語で簡潔に。
禁止：曖昧語・装飾。出力は次のフォーマット固定。

■作業内容
- ベッド: ...
- 水回り: ...
- 玄関/窓: ...

■補充
- TP: 2ロール以上、シャンプー1、食器洗剤1

■注意事項
- ...

[予約]
物件: ${input.property.name}
チェックアウト: ${input.reservation.end_at}
人数: ${input.reservation.pax ?? ''}

[物件情報]
ベッド構成: ${JSON.stringify(input.property.beds_json)}
ゴミ出し: ${input.property.trash_rules}
駐車: ${input.property.parking}`;
}
