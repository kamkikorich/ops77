import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Config variables
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '1jZYDzVQ-_RLga9mexOM3NSsJ1OGLLMu4PlGZzZ8kI9A';

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

export const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

export async function getSheet(title: string) {
  await doc.loadInfo();
  return doc.sheetsByTitle[title];
}

// Helper to initialize sheets if they don't exist
export async function initSheets() {
  await doc.loadInfo();

  if (!doc.sheetsByTitle['premises']) {
    await doc.addSheet({ headerValues: ['uuid', 'nama_kedai', 'no_lot', 'status_perkeso', 'kod_majikan', 'gps', 'created_at'], title: 'premises' });
  }


  if (!doc.sheetsByTitle['visits']) {
    await doc.addSheet({ headerValues: ['id', 'premis_id', 'inspector_id', 'status', 'catatan', 'created_at'], title: 'visits' });
  }

  if (!doc.sheetsByTitle['users']) {
    await doc.addSheet({
      headerValues: ['email', 'password', 'name', 'role', 'status', 'created_at'],
      title: 'users'
    });
  }
}

export async function getUsersSheet() {
  await ensureInit();
  return doc.sheetsByTitle['users'];
}

async function ensureInit() {
  try {
    await doc.loadInfo();
  } catch {
    // optimize: only load if not loaded? doc.loadInfo() is usually idempotent-ish but checking prop might be better
  }
}
