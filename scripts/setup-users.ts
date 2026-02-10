
import { doc } from '../src/lib/googleSheets';
import { createHash } from 'crypto';

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
        // Simple hash for demo purposes - in production use bcrypt/argon2
        // But since user wanted "fast script", we use node crypto
        const password = 'password123';
        const hashedPassword = createHash('sha256').update(password).digest('hex');

        await usersSheet.addRow({
            email: adminEmail,
            password: hashedPassword,
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
