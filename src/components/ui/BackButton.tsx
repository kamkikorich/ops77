"use client";

import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
    href?: string;
    label?: string;
    className?: string;
}

export function BackButton({ href, label = "Kembali", className = "" }: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    return (
        <Button
            variant="ghost"
            onClick={handleBack}
            className={`flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 pl-0 hover:bg-transparent ${className}`}
        >
            <ArrowLeft size={20} />
            <span>{label}</span>
        </Button>
    );
}
