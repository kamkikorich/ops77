import { config } from 'dotenv';
config();

import { doc } from '../src/lib/googleSheets';

async function main() {
    console.log('Initializing Google Sheets connection...');
    await doc.loadInfo();

    const usersSheet = doc.sheetsByTitle['users'];
    if (!usersSheet) {
        console.error('Users sheet not found!');
        return;
    }

    const rows = await usersSheet.getRows();
    console.log(`Found ${rows.length} existing users`);

    // Users to add
    const newUsers = [
        { email: 'kup@perkeso.gov.my', password: 'perkeso123', name: 'KUP', role: 'user', status: 'active' },
        { email: 'ahmad@perkeso.gov.my', password: 'perkeso123', name: 'Ahmad', role: 'user', status: 'active' },
        { email: 'kasman@perkeso.gov.my', password: 'perkeso123', name: 'Kasman', role: 'user', status: 'active' },
        { email: 'kerani@perkeso.gov.my', password: 'perkeso123', name: 'Kerani', role: 'user', status: 'active' },
    ];

    for (const user of newUsers) {
        const existing = rows.find(row => row.get('email') === user.email);
        if (existing) {
            console.log(`User ${user.email} already exists, updating...`);
            existing.set('password', user.password);
            existing.set('status', user.status);
            await existing.save();
        } else {
            console.log(`Adding user: ${user.email}`);
            await usersSheet.addRow({
                email: user.email,
                password: user.password,
                name: user.name,
                role: user.role,
                status: user.status,
                created_at: new Date().toISOString()
            });
        }
    }

    // Also ensure admin exists
    const adminEmail = 'admin@perkeso.gov.my';
    const existingAdmin = rows.find(row => row.get('email') === adminEmail);
    if (!existingAdmin) {
        console.log('Adding admin user...');
        await usersSheet.addRow({
            email: adminEmail,
            password: 'admin123',
            name: 'Admin PERKESO',
            role: 'admin',
            status: 'active',
            created_at: new Date().toISOString()
        });
    } else {
        console.log('Admin user already exists');
    }

    console.log('\n=== Users in sheet ===');
    const updatedRows = await usersSheet.getRows();
    updatedRows.forEach(row => {
        console.log(`${row.get('email')} | ${row.get('password')} | ${row.get('role')} | ${row.get('status')}`);
    });

    console.log('\nSetup complete!');
}

main().catch(console.error);