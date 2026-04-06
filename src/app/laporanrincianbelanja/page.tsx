'use client'

import { TableLaporan } from '@/components/pages/rincianbelanja/TableLaporan';
import { FiHome } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { getOpdTahun, getUser, getToken } from '@/components/lib/Cookie';
import Maintenance from '@/components/global/Maintenance';
import { OpdTahunNull, TahunNull } from '@/components/global/OpdTahunNull';

const LaporanRincianBelanja = () => {

    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

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
            if (data.opd) {
                const opd_value = {
                    value: data.opd.value,
                    label: data.opd.label,
                }
                setSelectedOpd(opd_value);
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
                <p>/ Rincian Belanja</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex flex-wrap items-center justify-between border-b px-5 py-5">
                    <h1 className="font-bold text-lg uppercase">Rincian Belanja {Tahun?.label || ''}</h1>
                    {(User?.roles == 'super_admin' || User?.roles == 'reviewer') ?
                        <h1 className="text-sm">{SelectedOpd?.label || ''}</h1>
                        :
                        <div className="">
                            <h1 className="text-sm">{User?.nama_pegawai || ''}</h1>
                            <h1 className="text-sm">{User?.nip || ''}</h1>
                        </div>
                    }
                </div>
                <div className="flex m-2">
                    {(User?.roles == 'super_admin' || User?.roles == 'reviewer' || User?.roles == 'admin_opd') ?
                            <TableLaporan
                                role={User?.roles}
                                tahun={Tahun?.value}
                                kode_opd={(User?.roles == 'super_admin' || User?.roles == 'reviewer') ? SelectedOpd?.value : User?.kode_opd}
                            />
                        :
                        (Tahun?.value === undefined) ?
                            <div className="w-full">
                                <TahunNull />
                            </div>
                            :
                            <TableLaporan
                                role={User?.roles}
                                nip={User?.nip}
                                tahun={Tahun?.value}
                                kode_opd={User?.kode_opd}
                            />
                    }
                </div>
            </div>
        </>
    )
}

export default LaporanRincianBelanja;