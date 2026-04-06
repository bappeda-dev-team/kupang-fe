'use client'

import { useBrandingContext } from "@/context/BrandingContext";
import { IsLoadingBranding } from "@/components/global/Loading";

interface RKPDLayoutProps {
    children: React.ReactNode;
}

export default function RKPDLayout({
    children
}: RKPDLayoutProps) {

    const { LoadingBranding, branding } = useBrandingContext();

    if (LoadingBranding) {
        return <IsLoadingBranding />;
    } else {
        return <>{children}</>
    }
}