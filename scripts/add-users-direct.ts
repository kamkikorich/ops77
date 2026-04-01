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

    const usersSheet = doc.sheetsByTitle['users'];
    if (!usersSheet) {
        console.error('Users sheet not found!');
        return;
    }

    // Load all cells to see the structure
    await usersSheet.loadCells('A1:Z10');

    console.log('\n=== Current Sheet Content ===');
    for (let row = 0; row < 6; row++) {
        const email = usersSheet.getCell(row, 0).value;
        const password = usersSheet.getCell(row, 1).value;
        const name = usersSheet.getCell(row, 2).value;
        const role = usersSheet.getCell(row, 3).value;
        const status = usersSheet.getCell(row, 4).value;
        if (email) {
            console.log(`Row ${row + 1}: ${email} | ${password} | ${name} | ${role} | ${status}`);
        }
    }

    // Define desired users with plain passwords
    const desiredUsers = [
        { email: 'admin@perkeso.gov.my', password: 'admin123', name: 'Admin PERKESO', role: 'admin', status: 'active' },
        { email: 'kup@perkeso.gov.my', password: 'perkeso123', name: 'KUP', role: 'user', status: 'active' },
        { email: 'ahmad@perkeso.gov.my', password: 'perkeso123', name: 'Ahmad', role: 'user', status: 'active' },
        { email: 'kasman@perkeso.gov.my', password: 'perkeso123', name: 'Kasman', role: 'user', status: 'active' },
        { email: 'kerani@perkeso.gov.my', password: 'perkeso123', name: 'Kerani', role: 'user', status: 'active' },
    ];

    // Update passwords directly in cells
    console.log('\n=== Updating Passwords ===');
    for (let row = 1; row < 10; row++) {
        const email = usersSheet.getCell(row, 0).value as string;
        if (!email) continue;

        const desired = desiredUsers.find(u => u.email === email);
        if (desired) {
            const currentPassword = usersSheet.getCell(row, 1).value as string;
            if (currentPassword !== desired.password) {
                console.log(`Updating ${email}: ${currentPassword?.substring(0, 20)}... -> ${desired.password}`);
                usersSheet.getCell(row, 1).value = desired.password;
                usersSheet.getCell(row, 4).value = 'active';
            } else {
                console.log(`${email} already has correct password`);
            }
        }
    }

    // Save all changes
    await usersSheet.saveUpdatedCells();

    // Show final result
    console.log('\n=== Final Users List ===');
    await usersSheet.loadCells('A1:Z10');
    for (let row = 1; row < 10; row++) {
        const email = usersSheet.getCell(row, 0).value;
        const password = usersSheet.getCell(row, 1).value;
        const role = usersSheet.getCell(row, 3).value;
        const status = usersSheet.getCell(row, 4).value;
        if (email) {
            console.log(`${email} | ${password} | ${role} | ${status}`);
        }
    }

    console.log('\n✅ Setup complete!');
}

main().catch(console.error);