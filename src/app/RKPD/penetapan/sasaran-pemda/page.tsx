'use client'

import { FiHome } from "react-icons/fi";
import Maintenance from "@/components/global/Maintenance";
import { useBrandingContext } from "@/context/BrandingContext";

const RKPDPenetapanSasaranPage = () => {

    const {branding} = useBrandingContext();
    
    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan Pemda</p>
                <p className="mr-1">/ RKPD</p>
                <p className="mr-1">/ Penetapan</p>
                <p className="mr-1">/ Sasaran Pemda</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">RKPD Penetapan Sasaran Pemda</h1>
                        <h1 className="uppercase font-bold ml-1">{branding?.tahun?.label || ""}</h1>
                    </div>
                </div>
                <Maintenance />
            </div>
        </>
    )
}

export default RKPDPenetapanSasaranPage;