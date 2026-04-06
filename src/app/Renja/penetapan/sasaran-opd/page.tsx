'use client'

import { FiHome } from "react-icons/fi";
import { useBrandingContext } from "@/context/BrandingContext";
import TableSasaran from "../../comp/TableSasaran";

const RenjaPenetapanSasaranPage = () => {

    const { branding } = useBrandingContext();
    const opd = (branding?.user?.roles == "super_admin" || branding?.user?.roles == "reviewer") ? branding?.opd?.value : branding?.user?.kode_opd;

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan OPD</p>
                <p className="mr-1">/ Renja</p>
                <p className="mr-1">/ Penetapan</p>
                <p className="mr-1">/ Sasaran OPD</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">Renja Penetapan Sasaran OPD</h1>
                        <h1 className="uppercase font-bold ml-1">{branding?.tahun?.label || ""}</h1>
                    </div>
                </div>
                <TableSasaran
                    tahun={branding?.tahun?.value || 0}
                    kode_opd={opd}
                    menu="penetapan"
                />
            </div>
        </>
    )
}

export default RenjaPenetapanSasaranPage;