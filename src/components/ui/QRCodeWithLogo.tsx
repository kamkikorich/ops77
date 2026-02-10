"use client";

import QRCode from "react-qr-code";

interface QRCodeWithLogoProps {
    value: string;
    size?: number;
    logoSrc?: string;
    logoSize?: number;
}

export function QRCodeWithLogo({
    value,
    size = 200,
    logoSrc = "/perkeso-logo-new.jpg",
    logoSize,
}: QRCodeWithLogoProps) {
    // Logo should be ~25% of QR size for optimal scanning
    const calculatedLogoSize = logoSize || Math.floor(size * 0.28);

    return (
        <div
            className="relative inline-block bg-white p-2"
            style={{ width: size + 16, height: size + 16 }}
        >
            <QRCode
                value={value}
                size={size}
                level="H" // High error correction (30%) - allows logo overlay
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
            />
            {/* Logo overlay in center */}
            <div
                className="absolute bg-white rounded-full p-1 shadow-sm"
                style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: calculatedLogoSize,
                    height: calculatedLogoSize,
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={logoSrc}
                    alt="OPS Kesan PERKESO Keningau"
                    className="w-full h-full object-contain rounded-full"
                />
            </div>
        </div>
    );
}
