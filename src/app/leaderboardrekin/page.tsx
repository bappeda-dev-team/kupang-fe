'use client'

import { FiHome } from "react-icons/fi";
import Table from "./Table";
import { useBrandingContext } from "@/context/BrandingContext";
import { OpdNull, OpdTahunNull, TahunNull } from "@/components/global/OpdTahunNull";

const ControlPokin = () => {

    const { branding } = useBrandingContext();

    if (branding?.tahun?.value === undefined || branding?.tahun?.value === null) {
        return (
            <TahunNull />
        )
    }
    else {
        return (
            <>
                <div className="flex items-center">
                    <a href="/" className="mr-1"><FiHome /></a>
                    <p className="mr-1">/ Laporan</p>
                    <p>/ Control Pokin</p>
                </div>
                <div className="mt-3 rounded-xl shadow-lg border">
                    <div className="flex flex-wrap items-center justify-between border-b px-5 py-5">
                        <h1 className="font-bold text-lg uppercase">Leaderboard Rekin {branding?.tahun?.label}</h1>
                    </div>
                    <div className="flex m-2">
                        <Table tahun={branding?.tahun?.value}/>
                    </div>
                </div>
            </>
        )
    }

}

export default ControlPokin;