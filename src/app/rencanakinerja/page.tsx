'use client'

import { useEffect, useState } from 'react';
import { getOpdTahun, getUser } from '@/components/lib/Cookie';
import { TablePerencanaan } from '@/components/pages/rencanakinerja/Table';
import { FiHome } from 'react-icons/fi';
import { AlertNotification } from '@/components/global/Alert';
import { useRouter } from 'next/navigation';
import { TahunNull } from '@/components/global/OpdTahunNull';
import { useBrandingContext } from '@/context/BrandingContext';
import { IsLoadingBranding } from '@/components/global/Loading';

const RencanaKinerja = () => {

    const { branding, LoadingBranding } = useBrandingContext();

    if (LoadingBranding) {
        return <IsLoadingBranding />
    } else {
        if (branding?.tahun?.value == undefined) {
            return (
                <>
                    <div className="mt-3 rounded-xl shadow-lg border">
                        <TahunNull />
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className="flex items-center">
                        <a href="/" className="mr-1"><FiHome /></a>
                        <p className="mr-1">/ Perencanaan</p>
                        <p>/ Rencana Kinerja</p>
                    </div>
                    <div className="mt-3 rounded-xl shadow-lg border">
                        <TablePerencanaan/>
                    </div>
                </>
            )
        }
    }

}

export default RencanaKinerja;