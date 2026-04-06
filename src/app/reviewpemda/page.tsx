'use client'

import { FiHome } from "react-icons/fi";
import TablePemda from "@/components/pages/review/TablePemda";
import { getOpdTahun } from "@/components/lib/Cookie";
import { useState, useEffect } from "react";
import Maintenance from "@/components/global/Maintenance";

const ReviewPemda = () => {

    const [Tahun, setTahun] = useState<any>(null);

    useEffect(() => {
        const data = getOpdTahun();
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
    }, []);

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Laporan</p>
                <p className="mr-1">/ Review Pemda</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end gap-1">
                        <h1 className="uppercase font-bold">Review Pohon Kinerja Pemda</h1>
                        <h1 className="uppercase font-bold">{Tahun?.label}</h1>
                    </div>
                </div>
                <div className="mx-3 mb-3">
                    {/* <Maintenance /> */}
                    <TablePemda 
                        tahun={Tahun?.value}
                    />
                </div>
            </div>
        </>
    )
}

export default ReviewPemda;