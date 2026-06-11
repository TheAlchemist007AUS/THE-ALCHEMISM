import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';


export default async function handler(req: Request, res: Response) {
  const { name, brand, email, type, message } = req.body as {
    name?: string;
    brand?: string;
    email?: string;
    type?: string;
    message?: string;
  };

  if (!name || !brand || !email || !type || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailFrom = process.env.EMAIL_FROM;
  const emailPassword = process.env.EMAIL_PASSWORD;
  const emailNotify = process.env.EMAIL_NOTIFY;

  // If secrets aren't configured yet, still accept the submission gracefully
  if (!emailFrom || !emailPassword || !emailNotify) {
    console.log('[Brand Enquiry] Email secrets not configured — logging submission:', {
      name, brand, email, type,
    });
    return res.status(200).json({ ok: true, note: 'Received (email not configured)' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: emailFrom!, pass: emailPassword! },
  });

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0E0C0A;color:#F5F5F5;padding:32px;border:1px solid #443f3b;">
      <h2 style="color:#C9922A;font-size:20px;margin:0 0 24px;letter-spacing:2px;text-transform:uppercase;">
        New Brand Enquiry — The Alchemism
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #443f3b;color:#999;font-size:13px;width:120px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #443f3b;font-size:13px;">${name}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #443f3b;color:#999;font-size:13px;">Brand</td><td style="padding:10px 0;border-bottom:1px solid #443f3b;font-size:13px;">${brand}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #443f3b;color:#999;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #443f3b;font-size:13px;"><a href="mailto:${email}" style="color:#C9922A;">${email}</a></td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #443f3b;color:#999;font-size:13px;">Deal Type</td><td style="padding:10px 0;border-bottom:1px solid #443f3b;font-size:13px;">${type}</td></tr>
      </table>
      <div style="margin-top:24px;">
        <p style="color:#999;font-size:13px;margin:0 0 8px;">Message</p>
        <p style="font-size:14px;line-height:1.6;white-space:pre-wrap;margin:0;">${message}</p>
      </div>
      <p style="margin-top:32px;font-size:11px;color:#666;">Submitted via thealchemism.com/resources</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"The Alchemism" <${emailFrom}>`,
      to: emailNotify!,
      replyTo: email,
      subject: `Brand Enquiry: ${brand} — ${type}`,
      html,
    });

    // Auto-reply to the enquirer
    await transporter.sendMail({
      from: `"The Alchemism" <${emailFrom}>`,
      to: email,
      subject: 'We received your enquiry — The Alchemism',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0E0C0A;color:#F5F5F5;padding:32px;border:1px solid #443f3b;">
          <h2 style="color:#C9922A;font-size:18px;margin:0 0 16px;letter-spacing:2px;text-transform:uppercase;">
            Enquiry Received
          </h2>
          <p style="font-size:14px;line-height:1.7;color:#ccc;">Hey ${name},</p>
          <p style="font-size:14px;line-height:1.7;color:#ccc;">
            We've received your brand enquiry for <strong style="color:#F5F5F5;">${brand}</strong> and will be in touch within 48 hours with a tailored proposal.
          </p>
          <p style="font-size:14px;line-height:1.7;color:#ccc;">
            In the meantime, feel free to explore our resources and community at
            <a href="https://thealchemism.com" style="color:#C9922A;">thealchemism.com</a>.
          </p>
          <p style="font-size:14px;line-height:1.7;color:#ccc;margin-top:24px;">— The Alchemism</p>
          <p style="margin-top:32px;font-size:11px;color:#666;">
            If you didn't submit this enquiry, please ignore this email.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Brand Enquiry] Email send failed:', err);
    return res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
}
