import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY!);
export async function sendMailPDF(to: string[], subject: string, text: string, pdf: Buffer, filename: string) {
  await resend.emails.send({
    from: 'no-reply@yourdomain.com',
    to, subject, text,
    attachments: [{ content: pdf.toString('base64'), filename }]
  });
}
