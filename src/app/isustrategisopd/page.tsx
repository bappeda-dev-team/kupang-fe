'use client'

import TableIsuStrategis from './TableIsuStrategis';
import TablePermasalahan from './TablePermasalahan';
import { useBrandingContext } from '@/context/BrandingContext';
import { FiHome } from 'react-icons/fi';
import { OpdTahunNull, TahunNull } from '@/components/global/OpdTahunNull';
import { IsLoadingBranding } from '@/components/global/Loading';

const IsuStrategis = () => {

    const { branding, LoadingBranding } = useBrandingContext()
    const tahun = branding?.tahun ? branding?.tahun.value : 0;

    if(LoadingBranding){
        return <IsLoadingBranding />
    } else {
        if (branding?.tahun?.value === undefined || branding?.tahun?.value === null || (branding?.user?.roles == "super_admin" && branding?.opd?.value === undefined)) {
            if (branding?.user?.roles == "super_admin") {
                return <OpdTahunNull />
            } else {
                return <TahunNull />
            }
        } else {
            return (
                <>
                    <div className="flex items-center">
                        <a href="/" className="mr-1"><FiHome /></a>
                        <p className="mr-1">/ Perencanaan OPD</p>
                        <p className="mr-1">/ Renstra</p>
                        <p className="mr-1">/ Isu Strategis</p>
                        <p>/ Isu Strategis</p>
                    </div>
                    <div className="mt-3 rounded-xl shadow-lg border">
                        <div className="flex items-center justify-between border-b px-5 py-5">
                            <div className="flex flex-wrap items-end">
                                <h1 className="uppercase font-bold">Isu Strategis</h1>
                                <h1 className="uppercase font-bold ml-1 text-emerald-500">{branding?.tahun?.label}</h1>
                            </div>
                        </div>
                        <p className='text-sm italic text-gray-400 ml-3 mt-2'>*data permasalahan per tahun {tahun} (header)</p>
                        <TablePermasalahan
                            tahun={tahun}
                            kode_opd={branding?.user?.roles == 'super_admin' ? branding?.opd?.value : branding?.user?.kode_opd}
                        />
                        <TableIsuStrategis
                            tahun={tahun}
                            kode_opd={branding?.user?.roles == 'super_admin' ? branding?.opd?.value : branding?.user?.kode_opd}
                        />
                    </div>
                </>
            )
        }
    }
}

export default IsuStrategis;