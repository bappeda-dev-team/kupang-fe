'use client'

import { FiHome } from "react-icons/fi";
import Table from "@/components/pages/subkegiatanopd/Table";
import { getOpdTahun, getUser } from "@/components/lib/Cookie";
import { useState, useEffect } from "react";
import Maintenance from "@/components/global/Maintenance";
import { OpdNull, TahunNull } from "@/components/global/OpdTahunNull";

const SubKegiatanOpd = () => {

    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, []);

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan OPD</p>
                <p className="mr-1">/ Sub Kegiatan OPD</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">Sub Kegiatan OPD |</h1>
                        {(User?.roles == 'super_admin' || User?.roles == 'reviewer') &&
                            <h1 className="uppercase font-bold ml-1">{SelectedOpd?.label} |</h1>
                        }
                        <h1 className="uppercase font-bold ml-1">{Tahun?.label}</h1>
                    </div>
                </div>
                {(User?.roles == 'super_admin' || User?.roles == 'reviewer') &&
                    SelectedOpd?.value === undefined ? (
                    <OpdNull />
                ) : (
                    Tahun?.value !== undefined ?
                        <div className="m-1">
                            {/* <Maintenance /> */}
                            <Table
                                opd={(User?.roles == 'super_admin' || User?.roles == 'reviewer') ? SelectedOpd?.value : User?.kode_opd}
                                tahun={Tahun?.value}
                            />
                        </div>
                        :
                        <div className="m-5">
                            <TahunNull />
                        </div>
                )
                }
            </div>
        </>
    )
}

export default SubKegiatanOpd;