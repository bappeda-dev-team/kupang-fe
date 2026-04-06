'use client'

import Table from './Table';
import { FiHome } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { getOpdTahun, getUser, getToken } from '@/components/lib/Cookie';
import Maintenance from '@/components/global/Maintenance';
import { TahunNull } from '@/components/global/OpdTahunNull';

const LaporanRincianBelanja = () => {

    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);

    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if (data) {
            if (data.tahun) {
                const tahun_value = {
                    value: data.tahun.value,
                    label: data.tahun.label,
                }
                setTahun(tahun_value);
            }
        }
        if (fetchUser) {
            setUser(fetchUser.user);
        }
    }, [])

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Laporan</p>
                <p>/ List OPD di Tematik</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex flex-wrap items-center justify-between border-b px-5 py-5">
                    <h1 className="font-bold text-lg uppercase">List OPD di Tematik tahun {Tahun?.value}</h1>
                </div>
                <div className="flex flex-wrap m-2">
                    {(Tahun?.value === undefined) ?
                        <div className="w-full">
                            <TahunNull />
                        </div>
                        :
                        <Table 
                            tahun={Tahun?.value}
                        />
                    }
                </div>
            </div>
        </>
    )
}

export default LaporanRincianBelanja;