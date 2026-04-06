'use client'

import Table from "./Table";
import { FiHome } from "react-icons/fi";
import { useBrandingContext } from "@/context/BrandingContext";
import { OpdNull, OpdTahunNull, TahunNull } from "@/components/global/OpdTahunNull";

const ControlPokin = () => {

    const { branding } = useBrandingContext();

    if((branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') && (branding?.opd?.value === undefined || branding?.opd?.value === null)){
        return(
            <OpdNull />
        )
    } else if(branding?.tahun?.value === undefined || branding?.tahun?.value === null){
        return(
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
                        <h1 className="font-bold text-lg uppercase">Control Pokin {branding?.tahun?.label || ''}</h1>
                        {(branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') ?
                            <h1 className="text-sm">{branding?.opd?.label || ''}</h1>
                            :
                            <div className="">
                                <h1 className="text-sm">{branding?.user?.nama_opd || ''}</h1>
                            </div>
                        }
                    </div>
                    <div className="flex m-2">
                        {(branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') ?
                            <Table kode_opd={branding?.opd?.value || ""} tahun={branding?.tahun?.value}/>
                            :
                            (branding?.tahun?.value === undefined) ?
                                <div className="w-full">
                                    <TahunNull />
                                </div>
                                :
                                <Table kode_opd={branding?.user?.kode_opd} tahun={branding?.tahun?.value} />
                        }
                    </div>
                </div>
            </>
        )
    }
    
}

export default ControlPokin;