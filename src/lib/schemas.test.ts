import { describe, it, expect } from 'vitest';
import { PremiseSchema, VisitSchema } from './schemas';

describe('PremiseSchema', () => {
    it('should validate valid premise data', () => {
        const validData = {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            nama_kedai: 'Kedai Runcit Ali',
            no_lot: 'A-1-1',
            status_perkeso: 'Belum Daftar',
            gps: '3.123,101.456'
        };
        const result = PremiseSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should reject short shop name', () => {
        const invalidData = {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            nama_kedai: 'Ab',
            no_lot: 'A-1',
            status_perkeso: 'Sudah Daftar'
        };
        const result = PremiseSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('terlalu pendek');
        }
    });

    it('should reject invalid GPS format', () => {
        const invalidData = {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            nama_kedai: 'Kedai Valid',
            no_lot: '123',
            status_perkeso: 'Belum Daftar',
            gps: 'invalid-gps'
        };
        const result = PremiseSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });
});

describe('VisitSchema', () => {
    it('should validate valid visit', () => {
        const valid = {
            premis_id: '123e4567-e89b-12d3-a456-426614174000',
            inspector_id: '123e4567-e89b-12d3-a456-426614174000',
            status: 'Patuh',
            catatan: 'Ok'
        };
        expect(VisitSchema.safeParse(valid).success).toBe(true);
    });

    it('should reject invalid status', () => {
        const invalid = {
            premis_id: '123e4567-e89b-12d3-a456-426614174000',
            inspector_id: '123e4567-e89b-12d3-a456-426614174000',
            status: 'Tak Patuh', // Invalid enum
        };
        expect(VisitSchema.safeParse(invalid).success).toBe(false);
    });
});
