'use client'

import { ButtonRed, ButtonGreen } from "@/components/global/Button";
import { useState, useEffect } from "react";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { LoadingClip } from "@/components/global/Loading";
import { getOpdTahun } from "@/components/lib/Cookie";
import { OpdTahunNull } from "@/components/global/OpdTahunNull";
import { getToken } from "@/components/lib/Cookie";

interface jabatan {
    id: string;
    nama_jabatan: string;
    kode_jabatan: string;
    operasional_daerah: opd;
}
interface opd {
    kode_opd: string;
    nama_opd: string;
}

const Table = () => {

    const [Jabatan, setJabatan] = useState<jabatan[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
        if(data.opd){
            const valueOpd = {
                value: data.opd.value,
                label: data.opd.label
            }
            setSelectedOpd(valueOpd);
        }
        if(data.tahun){
            const valuetahun = {
                value: data.tahun.value,
                label: data.tahun.label
            }
            setTahun(valuetahun);
        }
     },[]);
     
     useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchJabatan = async() => {
            setLoading(true)
            try{
                const response = await fetch(`${API_URL}/jabatan/findall/${SelectedOpd?.value}`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if(data == null){
                    setDataNull(true);
                    setJabatan([]);
                } else if(result.code === 401){
                    setError(true);
                } else {
                    setError(false);
                    setDataNull(false);
                    setJabatan(data);
                }
                setJabatan(data);
            } catch(err){
                setError(true);
                console.error(err)
            } finally{
                setLoading(false);
            }
        }
        if(SelectedOpd?.value != undefined){
            fetchJabatan();
        }
    }, [SelectedOpd, token]);

    const hapusJabatan = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/jabatan/delete/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setJabatan(Jabatan.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data jabatan Berhasil Dihapus", "success", 1000);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
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
    } else if(SelectedOpd == (undefined)){
        return <OpdTahunNull />
    }

    return(
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama jabatan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode Jabatan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Perangkat Daerah</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Aksi</th>
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
                        Jabatan.map((data, index) => (
                        <tr key={data.id}>
                            <td className="border-r border-b px-6 py-4">{data.nama_jabatan ? data.nama_jabatan : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.kode_jabatan ? data.kode_jabatan : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.operasional_daerah ? data.operasional_daerah.nama_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col jutify-center items-center gap-2">
                                    <ButtonGreen  halaman_url={`/DataMaster/masterjabatan/${data.id}`} className="w-full">Edit</ButtonGreen>
                                    <ButtonRed 
                                        className="w-full"
                                        onClick={() => {
                                            AlertQuestion("Hapus?", "Hapus Jabatan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                if(result.isConfirmed){
                                                    hapusJabatan(data.id);
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
                    }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;