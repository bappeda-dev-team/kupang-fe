'use client'

import { ButtonGreen, ButtonRed } from "@/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { useState, useEffect } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";

interface kegiatan {
    id: string;
    nama_kegiatan: string;
    kode_kegiatan: string;
    kode_opd: string;
}

const Table = () => {

    const [Kegiatan, setKegiatan] = useState<kegiatan[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [OpdMap, setOpdMap] = useState<Record<string, string>>({});
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchData = async() => {
            setLoading(true)
            try{
                const [kegiatanRes, opdRes] = await Promise.all([
                    fetch(`${API_URL}/kegiatans`, {
                        headers: {
                            Authorization: `${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    fetch(`${API_URL}/opds`, {
                        headers: {
                            Authorization: `${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                ]);
                const kegiatanResult = await kegiatanRes.json();
                const opdResult = await opdRes.json();
                const data = kegiatanResult.data;
                if(data == null){
                    setDataNull(true);
                    setKegiatan([]);
                } else if(kegiatanResult.code === 401){
                    setError(true);
                } else {
                    setError(false);
                    setDataNull(false);
                    setKegiatan(data);
                }
                setKegiatan(data);
                if(opdResult.data){
                    const map: Record<string, string> = {};
                    opdResult.data.forEach((item: any) => {
                        map[item.kode_opd] = item.nama_opd;
                    });
                    setOpdMap(map);
                }
            } catch(err){
                setError(true);
                console.error(err)
            } finally{
                setLoading(false);
            }
        }
        fetchData();
    }, [token]);

    const hapusKegiatan = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/kegiatans/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setKegiatan(Kegiatan.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data kegiatan Berhasil Dihapus", "success", 1000);
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
    }

    return(
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[500px]">Nama Kegiatan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode Kegiatan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama Perangkat Daerah</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode Perangkat Daerah</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</th>
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
                        Kegiatan.map((data, index) => (
                        <tr key={data.id}>
                            <td className="border-r border-b px-6 py-4">{index + 1}</td>
                            <td className="border-r border-b px-6 py-4">{data.nama_kegiatan ? data.nama_kegiatan : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.kode_kegiatan ? data.kode_kegiatan : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.kode_opd ? (OpdMap[data.kode_opd] || data.kode_opd) : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.kode_opd ? data.kode_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col jutify-center items-center gap-2">
                                    <ButtonGreen className="w-full" halaman_url={`/DataMaster/masterprogramkegiatan/kegiatan/${data.id}`}>Edit</ButtonGreen>
                                    <ButtonRed 
                                        className="w-full"
                                        onClick={() => {
                                            AlertQuestion("Hapus?", "Hapus kegiatan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                if(result.isConfirmed){
                                                    hapusKegiatan(data.id);
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