'use client'

import { FiHome } from 'react-icons/fi';
import Maintenance from '@/components/global/Maintenance';
import { TahunNull } from '@/components/global/OpdTahunNull';
import { Table } from './Table';
import { useBrandingContext } from '@/context/BrandingContext';

const LaporanTaggingPohon = () => {

    const { branding } = useBrandingContext();
    const tahun = branding?.tahun ? branding?.tahun.value : 0;

    if(tahun === 0 || tahun === undefined){
        return(
            <TahunNull />
        )
    }

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Laporan</p>
                <p>/ Tagging Pohon</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex flex-wrap items-center justify-between border-b px-5 py-5">
                    <h1 className="font-bold text-lg uppercase">Rekap Pohon dengan Tagging di Tahun {tahun || ''}</h1>
                </div>
                <div className="flex m-2">
                    <Table tahun={tahun} />
                </div>
            </div>
        </>
    )
}

export default LaporanTaggingPohon;