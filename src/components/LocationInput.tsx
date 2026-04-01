"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import {
    parseLocationInput,
    formatCoordsStorage,
    getGoogleMapsViewUrl,
    getGoogleMapsDirectionsUrl,
    getWazeUrl,
    ParsedLocation
} from "@/lib/locationParser";

interface LocationInputProps {
    value: string;
    onChange: (coords: string) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
}

export function LocationInput({
    value,
    onChange,
    label = "Koordinat Lokasi",
    placeholder = "Paste URL Google Maps atau masukkan koordinat",
    required = false
}: LocationInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [parsedLocation, setParsedLocation] = useState<ParsedLocation>({
        lat: null,
        lng: null,
        isValid: false,
        displayText: ""
    });

    // Initialize from stored value
    useEffect(() => {
        if (value && value.trim() !== "") {
            const result = parseLocationInput(value);
            if (result.isValid) {
                setInputValue(result.displayText);
                setParsedLocation(result);
            } else {
                // Try parsing stored format (e.g., "3.139,101.686")
                const storedResult = parseLocationInput(value.replace(",", ", "));
                if (storedResult.isValid) {
                    setInputValue(storedResult.displayText);
                    setParsedLocation(storedResult);
                } else {
                    setInputValue(value);
                }
            }
        }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        if (newValue.trim() === "") {
            setParsedLocation({ lat: null, lng: null, isValid: false, displayText: "" });
            onChange("");
            return;
        }

        const result = parseLocationInput(newValue);
        setParsedLocation(result);

        if (result.isValid && result.lat && result.lng) {
            onChange(formatCoordsStorage(result.lat, result.lng));
        }
    };

    const openGoogleMaps = () => {
        if (parsedLocation.isValid && parsedLocation.lat && parsedLocation.lng) {
            window.open(getGoogleMapsViewUrl(parsedLocation.lat, parsedLocation.lng), '_blank');
        }
    };

    const openWaze = () => {
        if (parsedLocation.isValid && parsedLocation.lat && parsedLocation.lng) {
            window.open(getWazeUrl(parsedLocation.lat, parsedLocation.lng), '_blank');
        }
    };

    const openDirections = () => {
        if (parsedLocation.isValid && parsedLocation.lat && parsedLocation.lng) {
            window.open(getGoogleMapsDirectionsUrl(parsedLocation.lat, parsedLocation.lng), '_blank');
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <Input
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                className={parsedLocation.isValid ? "border-green-500" : inputValue ? "border-red-300" : ""}
            />

            {/* Status indicator */}
            {inputValue && (
                <div className={`text-sm ${parsedLocation.isValid ? "text-green-600" : "text-red-500"}`}>
                    {parsedLocation.isValid ? (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Lokasi sah: {parsedLocation.displayText}
                        </span>
                    ) : (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {parsedLocation.displayText || "Format tidak sah"}
                        </span>
                    )}
                </div>
            )}

            {/* Action buttons when location is valid */}
            {parsedLocation.isValid && parsedLocation.lat && parsedLocation.lng && (
                <div className="flex gap-2 pt-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={openGoogleMaps}
                        className="text-xs"
                    >
                        🗺️ Lihat di Maps
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={openDirections}
                        className="text-xs"
                    >
                        🧭 Navigasi
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={openWaze}
                        className="text-xs"
                    >
                        🚗 Waze
                    </Button>
                </div>
            )}

            {/* Help text */}
            <p className="text-xs text-muted-foreground">
                Cara: Buka Google Maps → Share/Copy link → Paste di atas
            </p>
        </div>
    );
}

/**
 * Compact button to view saved location
 */
export function LocationViewButton({ gps }: { gps: string }) {
    if (!gps || gps.trim() === "") {
        return (
            <span className="text-sm text-muted-foreground">Tiada lokasi</span>
        );
    }

    const result = parseLocationInput(gps);
    if (!result.isValid || !result.lat || !result.lng) {
        return (
            <span className="text-sm text-muted-foreground">Lokasi tidak sah</span>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-mono">{result.displayText}</span>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(getGoogleMapsViewUrl(result.lat!, result.lng!), '_blank')}
                className="text-xs h-8 px-2"
            >
                🗺️
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(getGoogleMapsDirectionsUrl(result.lat!, result.lng!), '_blank')}
                className="text-xs h-8 px-2"
            >
                🧭
            </Button>
        </div>
    );
}