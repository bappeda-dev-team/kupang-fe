'use client'

import { FiHome } from "react-icons/fi";
import Table from "./Table";
import { useBrandingContext } from "@/context/BrandingContext";

const SasaranOpd = () => {

    const { branding } = useBrandingContext();

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan OPD</p>
                <p className="mr-1">/ Renja</p>
                <p className="mr-1">/ Sasaran OPD</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex flex-wrap items-center justify-between border-b px-5 py-5">
                    <h1 className="font-bold text-lg uppercase">Renja - Sasaran OPD {branding?.tahun?.label || ''}</h1>
                    {(branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') ?
                        <h1 className="text-sm">{branding?.opd?.label || ''}</h1>
                        :
                        <div className="">
                            <h1 className="text-sm">{branding?.user?.nama_opd || ''}</h1>
                        </div>
                    }
                </div>
                <Table 
                    kode_opd={(branding?.user?.roles == "super_admin" || branding?.user?.roles == 'reviewer') ? branding?.opd?.value : branding?.user?.kode_opd}
                    tahun={branding?.tahun?.value || 0}
                />
            </div>
        </>
    )
}

export default SasaranOpd;