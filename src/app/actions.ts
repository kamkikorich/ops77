'use server'

import { doc, initSheets } from '@/lib/googleSheets';
import type { PremiseInput, VisitInput } from '@/lib/schemas';
import type { GoogleSpreadsheetRow } from 'google-spreadsheet';

// Initialize sheets on first load (lazy)
let isInit = false;
async function ensureInit() {
    if (!isInit) {
        await initSheets();
        isInit = true;
    }
}

type SheetRow = GoogleSpreadsheetRow<Record<string, unknown>>;

export type PremiseRecord = {
    uuid: string;
    nama_kedai: string;
    no_lot: string;
    status_perkeso: string;
    kod_majikan: string;
    gps: string;
    created_at: string;
};

export type VisitRecord = {
    id: string;
    premis_id: string;
    inspector_id: string;
    status: string;
    catatan: string;
    created_at: string;
};

export type ReportRow = {
    id: string;
    premis_id: string;
    status: string;
    catatan: string;
    created_at: string;
    premises: {
        nama_kedai: string;
        no_lot: string;
        status_perkeso: string;
    };
};

function getRowValue(row: SheetRow, key: string): unknown {
    return row.get(key);
}

function getRowString(row: SheetRow, key: string): string {
    const value = getRowValue(row, key);
    return typeof value === 'string' ? value : String(value ?? '');
}

export async function addPremise(data: PremiseInput) {
    await ensureInit();
    const sheet = doc.sheetsByTitle['premises'];

    // Check if UUID exists
    const rows = await sheet.getRows();
    const existing = (rows as SheetRow[]).find((row) => getRowString(row, 'uuid') === data.uuid);

    if (existing) {
        throw new Error('Premis sudah wujud!');
    }

    await sheet.addRow({
        uuid: data.uuid,
        nama_kedai: data.nama_kedai,
        no_lot: data.no_lot,
        status_perkeso: data.status_perkeso,
        kod_majikan: data.kod_majikan || '',
        gps: data.gps || '',
        created_at: new Date().toISOString()
    });

    return { success: true };
}

export async function addVisit(data: VisitInput) {
    await ensureInit();
    const sheet = doc.sheetsByTitle['visits'];

    await sheet.addRow({
        id: Date.now().toString(), // Simple ID generation
        premis_id: data.premis_id,
        inspector_id: data.inspector_id || 'admin',
        status: data.status,
        catatan: data.catatan || '',
        created_at: new Date().toISOString()
    });

    return { success: true };
}

export async function getPremise(uuid: string) {
    await ensureInit();
    const sheet = doc.sheetsByTitle['premises'];
    const rows = await sheet.getRows();
    const row = (rows as SheetRow[]).find((r) => getRowString(r, 'uuid') === uuid);

    if (!row) return null;

    return {
        uuid: getRowString(row, 'uuid'),
        nama_kedai: getRowString(row, 'nama_kedai'),
        no_lot: getRowString(row, 'no_lot'),
        status_perkeso: getRowString(row, 'status_perkeso'),
        kod_majikan: getRowString(row, 'kod_majikan'),
        gps: getRowString(row, 'gps'),
        created_at: getRowString(row, 'created_at'),
    } satisfies PremiseRecord;
}

export async function updatePremiseStatus(uuid: string, status: string, kod_majikan?: string) {
    await ensureInit();
    const sheet = doc.sheetsByTitle['premises'];
    const rows = await sheet.getRows();
    const row = (rows as SheetRow[]).find((r) => getRowString(r, 'uuid') === uuid);

    if (!row) {
        return { success: false, error: "Premise not found" };
    }

    // Update fields
    row.set('status_perkeso', status);
    if (status === "Sudah Daftar" && kod_majikan) {
        row.set('kod_majikan', kod_majikan);
    } else if (status !== "Sudah Daftar") {
        row.set('kod_majikan', ""); // Clear if not registered
    }

    await row.save();

    // Revalidate the path so the UI updates
    try {
        const { revalidatePath } = await import('next/cache');
        revalidatePath(`/premis/${uuid}`);
    } catch {
        // ignore if not in request context
    }

    return { success: true };
}

export async function getVisits(premis_id: string) {
    await ensureInit();
    const sheet = doc.sheetsByTitle['visits'];
    const rows = await sheet.getRows();
    return (rows as SheetRow[])
        .filter((r) => getRowString(r, 'premis_id') === premis_id)
        .map(
            (r) =>
            ({
                id: getRowString(r, 'id'),
                premis_id: getRowString(r, 'premis_id'),
                inspector_id: getRowString(r, 'inspector_id'),
                status: getRowString(r, 'status'),
                catatan: getRowString(r, 'catatan'),
                created_at: getRowString(r, 'created_at'),
            } satisfies VisitRecord),
        );
}

export async function getPremiseWithVisits(uuid: string) {
    const premise = await getPremise(uuid);
    if (!premise) return null;

    const visits = await getVisits(uuid);
    // Sort visits desc
    visits.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return { ...premise, visits };
}

export async function checkPremiseExists(uuid: string) {
    const premise = await getPremise(uuid);
    return !!premise;
}

export async function getReport(filterType: 'range' | 'year', startDate?: string, endDate?: string, year?: number) {
    await ensureInit();
    const visitsSheet = doc.sheetsByTitle['visits'];
    const premisesSheet = doc.sheetsByTitle['premises'];

    const visitRows = await visitsSheet.getRows();
    const premiseRows = await premisesSheet.getRows();

    // Create premise map for joining
    const premiseMap = new Map<string, ReportRow['premises']>();
    (premiseRows as SheetRow[]).forEach((row) => {
        premiseMap.set(getRowString(row, 'uuid'), {
            nama_kedai: getRowString(row, 'nama_kedai'),
            no_lot: getRowString(row, 'no_lot'),
            status_perkeso: getRowString(row, 'status_perkeso'),
        });
    });

    // Filter visits
    const filteredVisits = (visitRows as SheetRow[]).filter((row) => {
        const date = new Date(getRowString(row, 'created_at'));

        if (filterType === 'range' && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            return date >= start && date <= end;
        } else if (filterType === 'year' && year) {
            return date.getFullYear() === year;
        }
        return true;
    });

    // Sort by date desc
    filteredVisits.sort(
        (a, b) => new Date(getRowString(b, 'created_at')).getTime() - new Date(getRowString(a, 'created_at')).getTime(),
    );

    // Map to result format
    return filteredVisits.map(
        (row) =>
        ({
            id: getRowString(row, 'id'),
            premis_id: getRowString(row, 'premis_id'),
            status: getRowString(row, 'status'),
            catatan: getRowString(row, 'catatan'),
            created_at: getRowString(row, 'created_at'),
            premises: premiseMap.get(getRowString(row, 'premis_id')) || {
                nama_kedai: 'Unknown',
                no_lot: 'Unknown',
                status_perkeso: 'Unknown',
            },
        } satisfies ReportRow),
    );
}


// ... existing code ...

const USERS_SHEET_TITLE = 'users';

export async function checkUser(email: string) {
    await ensureInit();
    const sheet = doc.sheetsByTitle[USERS_SHEET_TITLE];
    if (!sheet) return null;

    // In efficient implementation, we might want to load all rows once and cache, 
    // or use a better search. For now, we scan rows.
    const rows = await sheet.getRows();
    const user = rows.find(row => row.get('email') === email);

    if (user) {
        return {
            email: user.get('email'),
            password: user.get('password'),
            name: user.get('name'),
            role: user.get('role'),
            status: user.get('status')
        };
    }
    return null;
}


export interface ActionState {
    error?: string;
    success?: string | boolean;
}

export async function registerUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    // const name = formData.get('name') as string; // if we had a name field

    if (!email || !password) {
        return { error: 'Sila isi semua maklumat.' };
    }

    try {
        await ensureInit();
        let sheet = doc.sheetsByTitle[USERS_SHEET_TITLE];
        if (!sheet) {
            // Should be created by script, but just in case
            await initSheets();
            sheet = doc.sheetsByTitle[USERS_SHEET_TITLE];
        }

        const rows = await sheet.getRows();
        const existing = rows.find(row => row.get('email') === email);

        if (existing) {
            return { error: 'Emel sudah didaftarkan.' };
        }

        const { createHash } = await import('crypto');
        const hashedPassword = createHash('sha256').update(password).digest('hex');

        await sheet.addRow({
            email,
            password: hashedPassword,
            name: email.split('@')[0], // Default name from email for now
            role: 'user',
            status: 'pending', // Default status
            created_at: new Date().toISOString()
        });

        return { success: 'Pendaftaran berjaya. Sila tunggu kelulusan admin.' };

    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'Ralat semasa mendaftar. Sila cuba lagi.' };
    }
}

export async function loginUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Sila isi semua maklumat.' };
    }

    try {
        const user = await checkUser(email);

        if (!user) {
            return { error: 'Emel atau kata laluan salah.' };
        }

        const { createHash } = await import('crypto');
        const hashedPassword = createHash('sha256').update(password).digest('hex');

        if (user.password !== hashedPassword) {
            return { error: 'Emel atau kata laluan salah.' };
        }

        if (user.status !== 'active') {
            return { error: 'Akaun anda belum diaktifkan. Sila hubungi admin.' };
        }

        return { success: true };

    } catch (error) {
        console.error('Login error:', error);
        return { error: 'Ralat semasa log masuk.' };
    }
}
