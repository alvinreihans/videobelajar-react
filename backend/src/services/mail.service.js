// ─── Service Email (nodemailer) ──────────────────────────────────────
// Mengirim email verifikasi akun. Bila MAIL_HOST diisi di .env → memakai
// SMTP sungguhan; bila kosong → otomatis memakai akun uji Ethereal
// (email tidak benar-benar terkirim, tapi menghasilkan URL preview di console).
import nodemailer from 'nodemailer';
import { mailConfig, APP_URL } from '../config/env.js';

let transporterPromise = null;

async function createTransporter() {
  if (mailConfig.host) {
    return nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: mailConfig.user ? { user: mailConfig.user, pass: mailConfig.pass } : undefined,
    });
  }
  // Tanpa SMTP → akun uji Ethereal.
  const testAccount = await nodemailer.createTestAccount();
  console.log('[mail] Memakai akun uji Ethereal:', testAccount.user);
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

// Transporter dibuat sekali lalu dipakai ulang (lazy singleton).
function getTransporter() {
  if (!transporterPromise) transporterPromise = createTransporter();
  return transporterPromise;
}

// Kirim email berisi tautan verifikasi. Mengembalikan previewUrl bila Ethereal.
export async function sendVerificationEmail(to, token) {
  const link = `${APP_URL}/api/auth/verify-email?token=${token}`;
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: mailConfig.from,
    to,
    subject: 'Verifikasi Email — Video Belajar',
    text:
      `Terima kasih sudah mendaftar di Video Belajar.\n\n` +
      `Klik tautan berikut untuk memverifikasi email kamu:\n${link}\n\n` +
      `Abaikan email ini bila kamu tidak merasa mendaftar.`,
    html:
      `<p>Terima kasih sudah mendaftar di <b>Video Belajar</b>.</p>` +
      `<p>Klik tautan berikut untuk memverifikasi email kamu:</p>` +
      `<p><a href="${link}">${link}</a></p>` +
      `<p style="color:#888">Abaikan email ini bila kamu tidak merasa mendaftar.</p>`,
  });
  const previewUrl = nodemailer.getTestMessageUrl(info) || null;
  if (previewUrl) console.log('[mail] Preview URL verifikasi:', previewUrl);
  return { messageId: info.messageId, previewUrl };
}

export default { sendVerificationEmail };
