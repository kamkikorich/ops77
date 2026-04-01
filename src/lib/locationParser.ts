/**
 * Parse Google Maps URLs and extract coordinates
 * Supports multiple URL formats from Google Maps
 */

export interface ParsedLocation {
    lat: number | null;
    lng: number | null;
    isValid: boolean;
    displayText: string;
}

/**
 * Extract coordinates from various Google Maps URL formats
 *
 * Supported formats:
 * - Short URL: https://maps.app.goo.gl/xxx
 * - Maps URL: https://www.google.com/maps/@lat,lng
 * - Place URL: https://www.google.com/maps/place/.../@lat,lng
 * - Search URL: https://www.google.com/maps/search/?api=1&query=lat,lng
 * - Direct coords: "3.139, 101.686" or "3.139 101.686"
 */
export function parseLocationInput(input: string): ParsedLocation {
    if (!input || input.trim() === '') {
        return { lat: null, lng: null, isValid: false, displayText: '' };
    }

    const trimmed = input.trim();

    // Try direct coordinate format first (e.g., "3.139, 101.686")
    const directCoords = parseDirectCoords(trimmed);
    if (directCoords.isValid) {
        return directCoords;
    }

    // Try Google Maps URL formats
    const urlCoords = parseGoogleMapsUrl(trimmed);
    if (urlCoords.isValid) {
        return urlCoords;
    }

    // Invalid input
    return {
        lat: null,
        lng: null,
        isValid: false,
        displayText: 'Format tidak sah. Masukkan URL Google Maps atau koordinat.'
    };
}

/**
 * Parse direct coordinate input
 * Formats: "3.139, 101.686" or "3.139 101.686" or "-3.139, 101.686"
 */
function parseDirectCoords(input: string): ParsedLocation {
    // Match patterns like "3.139, 101.686" or "3.139 101.686"
    const coordPattern = /^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/;
    const match = input.match(coordPattern);

    if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);

        // Validate coordinate ranges
        if (isValidCoordinate(lat, lng)) {
            return {
                lat,
                lng,
                isValid: true,
                displayText: formatCoordsDisplay(lat, lng)
            };
        }
    }

    return { lat: null, lng: null, isValid: false, displayText: '' };
}

/**
 * Parse Google Maps URL formats
 */
function parseGoogleMapsUrl(url: string): ParsedLocation {
    try {
        // Handle URLs that might not have proper encoding
        const decodedUrl = decodeURIComponent(url);

        // Pattern 1: /@lat,lngzoom (e.g., /@3.139,101.686,19z)
        const mapsPattern1 = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
        const match1 = decodedUrl.match(mapsPattern1);
        if (match1) {
            const lat = parseFloat(match1[1]);
            const lng = parseFloat(match1[2]);
            if (isValidCoordinate(lat, lng)) {
                return {
                    lat,
                    lng,
                    isValid: true,
                    displayText: formatCoordsDisplay(lat, lng)
                };
            }
        }

        // Pattern 2: ?query=lat,lng (search URL)
        const queryPattern = /query=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
        const match2 = decodedUrl.match(queryPattern);
        if (match2) {
            const lat = parseFloat(match2[1]);
            const lng = parseFloat(match2[2]);
            if (isValidCoordinate(lat, lng)) {
                return {
                    lat,
                    lng,
                    isValid: true,
                    displayText: formatCoordsDisplay(lat, lng)
                };
            }
        }

        // Pattern 3: !3dlat!4dlng (embedded maps)
        const embeddedPattern = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/;
        const match3 = decodedUrl.match(embeddedPattern);
        if (match3) {
            const lat = parseFloat(match3[1]);
            const lng = parseFloat(match3[2]);
            if (isValidCoordinate(lat, lng)) {
                return {
                    lat,
                    lng,
                    isValid: true,
                    displayText: formatCoordsDisplay(lat, lng)
                };
            }
        }

        // Pattern 4: ll=lat,lng
        const llPattern = /ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
        const match4 = decodedUrl.match(llPattern);
        if (match4) {
            const lat = parseFloat(match4[1]);
            const lng = parseFloat(match4[2]);
            if (isValidCoordinate(lat, lng)) {
                return {
                    lat,
                    lng,
                    isValid: true,
                    displayText: formatCoordsDisplay(lat, lng)
                };
            }
        }

        // Pattern 5: center=lat,lng
        const centerPattern = /center=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
        const match5 = decodedUrl.match(centerPattern);
        if (match5) {
            const lat = parseFloat(match5[1]);
            const lng = parseFloat(match5[2]);
            if (isValidCoordinate(lat, lng)) {
                return {
                    lat,
                    lng,
                    isValid: true,
                    displayText: formatCoordsDisplay(lat, lng)
                };
            }
        }

        return { lat: null, lng: null, isValid: false, displayText: '' };

    } catch {
        return { lat: null, lng: null, isValid: false, displayText: '' };
    }
}

/**
 * Validate coordinate is within reasonable bounds
 * Malaysia roughly: lat 1-7, lng 99-120
 */
function isValidCoordinate(lat: number, lng: number): boolean {
    // Basic global validation
    if (lat < -90 || lat > 90) return false;
    if (lng < -180 || lng > 180) return false;

    // Malaysia region check (optional, can be relaxed)
    // Lat: 1 to 7, Lng: 99 to 120
    // But allow wider range for flexibility
    return true;
}

/**
 * Format coordinates for display
 */
function formatCoordsDisplay(lat: number, lng: number): string {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

/**
 * Format coordinates for storage (compact format)
 */
export function formatCoordsStorage(lat: number, lng: number): string {
    return `${lat},${lng}`;
}

/**
 * Parse stored GPS string back to coordinates
 */
export function parseStoredCoords(gpsString: string): ParsedLocation {
    if (!gpsString) {
        return { lat: null, lng: null, isValid: false, displayText: '' };
    }
    return parseDirectCoords(gpsString);
}

/**
 * Generate Google Maps URL for viewing location
 */
export function getGoogleMapsViewUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps/@${lat},${lng},19z`;
}

/**
 * Generate Google Maps URL for navigation/directions
 */
export function getGoogleMapsDirectionsUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * Generate Waze URL for navigation
 */
export function getWazeUrl(lat: number, lng: number): string {
    return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

/**
 * Generate a shareable Google Maps URL
 */
export function getGoogleMapsShareUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps/place/${lat},${lng}/@${lat},${lng},19z`;
}