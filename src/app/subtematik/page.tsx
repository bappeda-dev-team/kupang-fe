'use client'

import { FiHome } from "react-icons/fi";
import Table from "@/components/pages/subtematik/Table";
import { getOpdTahun } from "@/components/lib/Cookie";
import { useState, useEffect } from "react";

const SubTematik = () => {

    const [Tahun, setTahun] = useState<any>(null);

    useEffect(() => {
        const data = getOpdTahun();
        if(data.tahun){
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
    },[]);

    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan Kabuaten</p>
                <p className="mr-1">/ Sub Tematik Kabupaten</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">Sub Tematik Kabupaten</h1>
                        <h1 className="uppercase font-bold ml-1">{Tahun ? Tahun?.label : ""}</h1>
                    </div>
                </div>
                <Table />
            </div>
        </>
    )
}

export default SubTematik;