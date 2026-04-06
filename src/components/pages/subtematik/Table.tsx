'use client'

import { ButtonRed, ButtonGreen, ButtonSky } from "@/components/global/Button";
import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getOpdTahun } from "@/components/lib/Cookie";
import { OpdTahunNull } from "@/components/global/OpdTahunNull";

interface tematik {
    id: number;
    parent: number;
    tema: string;
    taget: string;
    satuan: string;
    keterangan: string;
    indikators: string; 
    sub_tematiks: subtematik[];
}
interface subtematik {
    id: number;
    parent: number;
    tema_sub_tematik: string;
    keterangan: string;
    indikators: string;
}

const Table = () => {

    const [SubTematik, setSubTematik] = useState<tematik[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    
    useEffect(() => {
        const data = getOpdTahun();
        if(data.tahun){
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if(data.opd){
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    },[]);
    
    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchTematik = async() => {
            setLoading(true)
            try{
                const response = await fetch(`${API_URL}/pohon_kinerja_admin/findall/${Tahun?.value}`);
                const result = await response.json();
                const data = result.data.tematiks;
                if(data.length == 0){
                    setDataNull(true);
                    setSubTematik([]);
                } else if(data.code == 500){
                    setError(true);
                    setSubTematik([]);
                } else {
                    setDataNull(false);
                    setSubTematik(data);
                }
                setSubTematik(data);
            } catch(err){
                setError(true);
                console.error(err)
            } finally{
                setLoading(false);
            }
        }
        if(Tahun?.value != undefined){   
            fetchTematik();
        }
    }, [Tahun]);

    const hapusSubTematik = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/delete/${id}`, {
                method: "DELETE",
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setSubTematik(
                SubTematik.map((data) => ({
                    ...data,
                    sub_tematiks: data.sub_tematiks?.filter((item) => item.id !== id),
                }))
            );
            // setSubTematik(SubTematik.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data lembaga Berhasil Dihapus", "success", 1000);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };

    if(Loading){
        return (    
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(Error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if(Tahun?.value == undefined || SelectedOpd?.value == undefined){
        return <OpdTahunNull />
    }

    return(
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Tema / Sub Tema</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Keterangan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                    {DataNull ? 
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={13}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                        :
                        SubTematik.map((data, index) => (
                        <>
                            <tr key={data.id}>
                                <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                <td colSpan={2} className="border-r border-b px-6 py-4 font-semibold">{data.tema}</td>
                                <td className="border-r border-b px-6 py-4">
                                    <div className="flex flex-col jutify-center items-center gap-2">
                                        <ButtonSky className="w-full" halaman_url={`/subtematik/${data.id}/tambah`}>Tambah Sub Tema</ButtonSky>
                                    </div>
                                </td>
                            </tr>
                            {data.sub_tematiks ?
                                data.sub_tematiks.map((item, subindex) => (
                                    <tr key={item.id}>
                                        <td className="border-r border-b px-6 py-4 text-center font-light">{`${index + 1}.${subindex + 1}`}</td>
                                        <td className="border-r border-b px-6 py-4 text-center font-light">{item.tema_sub_tematik ? item.tema_sub_tematik : "-"}</td>
                                        <td className="border-r border-b px-6 py-4 text-center font-light">{item.keterangan ? item.keterangan : "-"}</td>
                                        <td className="border-r border-b px-6 py-4">
                                            <div className="flex flex-col jutify-center items-center gap-2">
                                                <ButtonGreen className="w-full" halaman_url={`/subtematik/${item.id}/edit`}>Edit</ButtonGreen>
                                                <ButtonRed 
                                                    className="w-full"
                                                    onClick={() => {
                                                        AlertQuestion("Hapus?", "Hapus tematik kabupaten yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                            if(result.isConfirmed){
                                                                hapusSubTematik(item.id);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    Hapus
                                                </ButtonRed>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            :
                                <></>
                            }
                        </>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;
