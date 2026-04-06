'use client'

import { TablePermasalahan } from '@/components/pages/permasalahan/TablePermasalahan';
import { FiHome } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { getOpdTahun, getUser } from '@/components/lib/Cookie';
import Maintenance from '@/components/global/Maintenance';
import { OpdTahunNull, TahunNull } from '@/components/global/OpdTahunNull';

const PermasalahanaOpd = () => {

    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [User, setUser] = useState<any>(null);

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (data) {
            if (data.tahun) {
                const tahun_value = {
                    value: data.tahun.value,
                    label: data.tahun.label,
                }
                setTahun(tahun_value);
            }
            if (data.opd) {
                const opd_value = {
                    value: data.opd.value,
                    label: data.opd.label,
                }
                setSelectedOpd(opd_value);
            }
        }
    }, []);

    if (User?.roles == 'super_admin' || User?.roles == 'reviewer') {
        if (SelectedOpd?.value == undefined || Tahun?.value == undefined) {
            return (
                <>
                    <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <OpdTahunNull />
                    </div>
                </>
            )
        }
    }
    if (Tahun?.value == undefined) {
        return (
            <>
                <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                    <TahunNull />
                </div>
            </>
        )
    }

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan OPD</p>
                <p className="mr-1">/ Permasalahan</p>
                <p>/ Permasalahan OPD</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex flex-wrap items-center justify-between border-b px-5 py-5">
                    <div className="flex items-center gap-1">
                        <h1 className="font-bold text-xl uppercase">Permasalahan OPD</h1>
                        <h1 className="font-bold text-xl uppercase text-green-500">{Tahun?.label || ''}</h1>
                    </div>
                </div>
                <div className="m-3">
                    <TablePermasalahan
                        tahun={Tahun?.value}
                        kode_opd={(User?.roles == 'super_admin' || User?.roles == 'reviewer') ? SelectedOpd?.value : User?.kode_opd}
                    />
                    {/* <Maintenance /> */}
                </div>
            </div>
        </>
    )
}

export default PermasalahanaOpd;