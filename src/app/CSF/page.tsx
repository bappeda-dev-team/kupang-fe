'use client'

import { ButtonSky } from "@/components/global/Button";
import { FiHome } from "react-icons/fi";
import { TbCirclePlus } from "react-icons/tb";
import { Table } from "./table";
import { getOpdTahun } from "@/components/lib/Cookie";
import { useState, useEffect } from "react";
import { TahunNull } from "@/components/global/OpdTahunNull";

const CSF = () => {

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

    if(Tahun?.value === undefined){
        return <TahunNull />
    }
    
    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan Pemda</p>
                <p className="mr-1">/ CSF</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">CSF</h1>
                        <h1 className="uppercase font-bold ml-1">{Tahun ? Tahun?.label : ""}</h1>
                    </div>
                    <div className="flex flex-col">
                        <ButtonSky 
                            className="flex items-center justify-center"
                            halaman_url='/tematikpemda/tambah'
                        >
                            <TbCirclePlus className="mr-1"/>
                            Tambah Data
                        </ButtonSky>
                    </div>
                </div>
                <Table
                    tahun={Tahun?.value}
                />
            </div>
        </>
    )
}

export default CSF;