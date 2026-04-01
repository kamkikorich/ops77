import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SPREADSHEET_ID = '1KOO0gU9en6SOWLykOQHwGX10dwFs0q67Z4GxF1K4gdo';
const SERVICE_ACCOUNT_EMAIL = 'kehadiran-qr-bot@perkeso-keningau-qr.iam.gserviceaccount.com';
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDadZJRjxfl8I/b
6auvDnLjxL/yh272GUvnTn2tEWIcI68O1Vbpth6WjrxoODuV+we4k8DI0fRzoE1G
KKcxNqAX8kBso0z9gUu9saXf2qLE+wZvRAA0esRXZIJX1yaF9MmONkhltMJX9irA
XB8fyy0jcj6Bx0jXJ6l1wVVBhfk9UvVx7hyIj7uysakBfbqajuZP7c4HsMMeEFVE
B9v6LTsAyy62pyWb/PyvIDgA/hhKDXxWHsMTFczNDT6Z3tyS0u2p91zqEHGFE5ai
Xd1zwgOdJvTOWG+XZmYoEIfj4hx3Ry2dnuI3jjs92cbvgL74AOa40lIXXTqs64tE
/dX1ia/rAgMBAAECggEAApw07GTRy8eVFv61nR0pfZ95U3ems54mNoW1ym5ysci9
umckyktC53uGqNvxU2hikozHkyGY5BQ81qvlxJigzvhwEUIMmvJDZ12ZbYubzXKg
BGAL2dp9exK+CwnSjsi6pWtktcfXEyhvIPgS/drZS/39Iu7TfxzLhcWG/8BJFsNU
MjVGXZ736vUH4e0B/Eo53QpCIyk0zAUBSlDtr0E5sArfXDu2uLgzbHz3fXqTPICE
kfzNm7Qzflm6kVaKUbLVn/ldany4FSlgdR/m5T8zrQw95Av9Bn9VO0FVp8Pk8aHO
VEPOX+nsv1bLgKDX/Czl3F5lRsawuzWxodCiV8IEAQKBgQD214p0ruBSRwNFetXa
+Z+Bmq96UrRUBzI5BFqEq8Ckv/4V6tuthWfW5bCzbkwf5Vs40+aPP3QkFFcwMSCF
tooey3cYZ1erJ/sDbUqANWQRcQKbZVgkxPQsonjgPtgEsckaCswTgSxgLhy8N5fX
LVteveOenkX901edzjJpkTV0AQKBgQDikHUIdksuPbwc3TlEVFHxJA/rXmp9KaBx
Q5phAny+fyaLK/JypDKiwqpT2UaMaEikYb8S5MxRccTttZS8/f87iA+8cBKJ3IWz
VcUWhNkD6I3ZMIL+3EF7aeplpZKyDuzX+Zz3nFK/2uGL1fLHvxBlMasoXj+3CPZe
tlMuU1wz6wKBgGHH5j/smk3ddY1LaHWy1p23kfWp12dF5n4xnE3b35cjutohy93D
7+tv13xsn9kuuOEdB8MNBsvYBuW/QDvXoIUsYkQXg+H4F3Y3EAETpU1HcBnwnmcK
YhNgVPO30UiiyJ/5UPgU/mgnPBjPCOYjQIOaQxWtatpuotGPQecRr5QBAoGBAMjn
9o/pbiN0JRKnbbfU2dDu/Jrn36BbwGWP4B70OLAoSoKRFu5oAmroGmg+PNwXQYtb
Djfv4eq66zkrktjAl4svzVx5OUc84Oa1QQ8GAPcBSn/1D8R2hi6tLmiymVICAC5I
r9O2sH5m1yjMMPzFxgEmOTOT2AY0EVzNaxeiXhm/AoGBAORF4uhaxWm7q2C9qp9v
anpXzf4DQzvBN2tNjxS/AhZWyH20q+Ael2cE+TglZQzV+g3JfNA6smtOaxs+CWtS
i9bRdUxZzkeQG3vPxmJwCO7+OlCYoaHJtZJSDFUHHCOUu0ym1EDbJzEaKt9TCzMx
P599m844XjY2IhZAabhLcNex
-----END PRIVATE KEY-----`;

async function main() {
    console.log('Initializing Google Sheets connection...');

    const serviceAccountAuth = new JWT({
        email: SERVICE_ACCOUNT_EMAIL,
        key: PRIVATE_KEY,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    console.log(`Connected to: ${doc.title}`);
    console.log(`\n=== Sheets in this spreadsheet ===`);

    for (const sheetTitle of Object.keys(doc.sheetsByTitle)) {
        const sheet = doc.sheetsByTitle[sheetTitle];
        console.log(`\n--- ${sheetTitle} ---`);
        console.log(`Row count: ${sheet.rowCount}`);

        await sheet.loadHeaderRow();
        console.log(`Headers: ${sheet.headerValues?.join(', ')}`);

        const rows = await sheet.getRows();
        console.log(`Data rows: ${rows.length}`);
        if (rows.length > 0) {
            console.log('First row:', rows[0]._rawData);
        }
    }
}

main().catch(console.error);