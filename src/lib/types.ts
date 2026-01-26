export interface Inspector {
    email: string;
}

export interface Visit {
    created_at: string;
    status: string;
    inspector?: Inspector;
    catatan: string;
}

export interface Premis {
    uuid: string;
    nama_kedai: string;
    no_lot: string;
    status_perkeso: string;
    visits: Visit[];
}
