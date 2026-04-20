// Vercel serverless function — email capture form handler
// Appends lead data to a Google Sheet via Google Sheets API (service account auth)
// Optionally adds contact to Brevo for automated nurture sequence
// Optionally sends a confirmation email via Gmail SMTP
//
// Required environment variables (set in Vercel project settings):
//   GOOGLE_CLIENT_EMAIL  — service account email
//   GOOGLE_PRIVATE_KEY   — service account private key (with literal \n)
//   GOOGLE_SHEET_ID      — spreadsheet ID from the Google Sheet URL
//
// Optional environment variables (Brevo email automation):
//   BREVO_API_KEY        — Brevo API key (from Settings > API Keys in Brevo)
//   BREVO_LIST_ID        — Brevo list ID for neutrino-early-access (integer)
//                          If either is missing, Brevo step is silently skipped.
//
// Optional environment variables (Gmail SMTP confirmation):
//   GMAIL_APP_PASSWORD   — Gmail app password for getmarketingai@gmail.com
//                          If missing, confirmation email is silently skipped.

const { google } = require('googleapis');
const https = require('https');
const nodemailer = require('nodemailer');

// Send confirmation email via Gmail SMTP — fire-and-forget, never throws
async function sendConfirmation(toEmail, gmailAppPassword) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: 'getmarketingai@gmail.com',
        pass: gmailAppPassword,
      },
    });

    await transporter.sendMail({
      from: '"MarketingAI" <getmarketingai@gmail.com>',
      to: toEmail,
      subject: "You're on the list",
      text: "Thanks for signing up. We'll be in touch when we're ready for early access.\n\n— The Neutrino team",
      html: "<p>Thanks for signing up. We'll be in touch when we're ready for early access.</p><p>— The Neutrino team</p>",
    });

    console.log('Confirmation email sent to:', toEmail);
  } catch (err) {
    console.warn('Confirmation email failed:', err.message);
  }
}

// Add contact to Brevo list — fire-and-forget, never throws
async function addToBrevo(email, brevoApiKey, brevoListId) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      email,
      listIds: [parseInt(brevoListId, 10)],
      updateEnabled: true,
    });

    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/contacts',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': brevoApiKey,
        'content-length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('Brevo contact added:', email);
        } else {
          console.warn('Brevo add failed:', res.statusCode, data);
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.warn('Brevo request error:', err.message);
      resolve();
    });

    req.write(payload);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  // CORS — allow same-origin + any neutrino.au subdomain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body — Vercel automatically parses JSON and URL-encoded bodies
  const body = req.body || {};
  const email = (body.email || '').trim().toLowerCase();

  // Basic email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  // Check env vars are present
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !sheetId) {
    console.error('Missing Google Sheets environment variables');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  // Row: timestamp, email, UTM fields, form location
  const row = [
    new Date().toISOString(),
    email,
    body.utm_source    || '',
    body.utm_medium    || '',
    body.utm_campaign  || '',
    body.utm_content   || '',
    body.utm_term      || '',
    body.form_location || '',
  ];

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Run Google Sheets write + Brevo add + confirmation email in parallel.
    // Google Sheets is the source of truth — its failure returns a 500.
    // Brevo and Gmail confirmation are optional — failures are logged but never block the response.
    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoListId = process.env.BREVO_LIST_ID;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    const sheetsWrite = sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Leads!A:H',   // Append to "Leads" sheet, columns A–H
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    const brevoAdd = (brevoApiKey && brevoListId)
      ? addToBrevo(email, brevoApiKey, brevoListId)
      : Promise.resolve();

    const confirmEmail = gmailAppPassword
      ? sendConfirmation(email, gmailAppPassword)
      : Promise.resolve();

    await Promise.all([sheetsWrite, brevoAdd, confirmEmail]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Google Sheets append error:', err.message);
    return res.status(500).json({ error: 'Could not save your email. Please try again.' });
  }
};
