'use client'

import { FiHome } from "react-icons/fi";
import TableOpd from "@/components/pages/review/TableOpd";
import { getOpdTahun } from "@/components/lib/Cookie";
import { useState, useEffect } from "react";
import Maintenance from "@/components/global/Maintenance";

const ReviewOpd = () => {

    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

    useEffect(() => {
        const data = getOpdTahun();
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
                <p className="mr-1">/ Laporan</p>
                <p className="mr-1">/ Review OPD</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end gap-1">
                        <h1 className="uppercase font-bold">Review Pohon Kinerja OPD || </h1>
                        <h1 className="uppercase font-bold">{SelectedOpd?.label || "-"} ||</h1>
                        <h1 className="uppercase font-bold">{Tahun?.label || "-"}</h1>
                    </div>
                </div>
                <div className="mx-3 mb-3">
                    {/* <Maintenance /> */}
                    <TableOpd
                        tahun={Tahun?.value}
                        kode_opd={SelectedOpd?.value}
                    />
                </div>
            </div>
        </>
    )
}

export default ReviewOpd;