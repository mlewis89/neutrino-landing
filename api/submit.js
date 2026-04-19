// Vercel serverless function — email capture form handler
// Appends lead data to a Google Sheet via Google Sheets API (service account auth)
//
// Required environment variables (set in Vercel project settings):
//   GOOGLE_CLIENT_EMAIL  — service account email
//   GOOGLE_PRIVATE_KEY   — service account private key (with literal \n)
//   GOOGLE_SHEET_ID      — spreadsheet ID from the Google Sheet URL

const { google } = require('googleapis');

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

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

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

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Leads!A:H',   // Append to "Leads" sheet, columns A–H
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Google Sheets append error:', err.message);
    return res.status(500).json({ error: 'Could not save your email. Please try again.' });
  }
};
