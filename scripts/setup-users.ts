
import { doc } from '../src/lib/googleSheets';

async function main() {
    console.log('Initializing Google Sheets connection...');
    await doc.loadInfo();

    let usersSheet = doc.sheetsByTitle['users'];

    if (!usersSheet) {
        console.log('Creating "users" sheet...');
        usersSheet = await doc.addSheet({
            headerValues: ['email', 'password', 'name', 'role', 'status', 'created_at'],
            title: 'users'
        });
    } else {
        console.log('"users" sheet already exists.');
    }

    // Check if admin exists
    const rows = await usersSheet.getRows();
    const adminEmail = 'admin@perkeso.gov.my';
    const existingAdmin = rows.find(row => row.get('email') === adminEmail);

    if (!existingAdmin) {
        console.log('Creating default admin user...');
        // Plain password for internal use - easier to manage
        const password = 'admin123';

        await usersSheet.addRow({
            email: adminEmail,
            password: password, // Plain password
            name: 'Admin PERKESO',
            role: 'admin',
            status: 'active',
            created_at: new Date().toISOString()
        });
        console.log(`Admin user created: ${adminEmail} / ${password}`);
    } else {
        console.log('Admin user already exists.');
    }

    console.log('Setup complete!');
}

main().catch(console.error);
