'use client'

import { ButtonGreen, ButtonRed } from "@/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { LoadingClip } from "@/components/global/Loading";
import { useState, useEffect } from "react";
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";
import { TahunNull } from "@/components/global/OpdTahunNull";

interface urusan {
    id: number;
    nama_urusan: string;
    kode_urusan: string;
    tahun: number;
}

const Table = () => {

    const { branding } = useBrandingContext();
    const [Urusan, setUrusan] = useState<urusan[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchUrusan = async() => {
            setLoading(true)
            try{
                const response = await fetch(`${API_URL}/urusans`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                if (response.status === 401) {
                    setError(true);
                    setDataNull(false);
                    setUrusan([]);
                    return;
                }

                const result = await response.json();
                const data = Array.isArray(result?.data) ? result.data : [];

                if (!response.ok) {
                    setError(true);
                    setDataNull(false);
                    setUrusan([]);
                    return;
                }

                setError(false);
                setDataNull(data.length === 0);
                setUrusan(data);
            } catch(err){
                setError(true);
                console.error(err)
            } finally{
                setLoading(false);
            }
        }
        fetchUrusan();
    }, [token]);

    const hapusUrusan = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/urusans/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setUrusan(Urusan.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data Urusan Berhasil Dihapus", "success", 1000);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if (branding?.tahun?.value == undefined) {
        return <TahunNull />;
    }

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
                            <th className="border-r border-b px-6 py-3 min-w-[500px]">Nama Urusan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode Urusan</th>
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
                        Urusan.map((data, index) => (
                        <tr key={data.id}>
                            <td className="border-r border-b px-6 py-4">{index + 1}</td>
                            <td className="border-r border-b px-6 py-4">{data.nama_urusan? data.nama_urusan : "-"}</td>
                            <td className="border-r border-b px-6 py-4 text-center">{data.kode_urusan ? data.kode_urusan : "-"}</td>
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col jutify-center items-center gap-2">
                                    <ButtonGreen className="w-full" halaman_url={`/DataMaster/masterprogramkegiatan/urusan/${data.id}`}>Edit</ButtonGreen>
                                    <ButtonRed 
                                        className="w-full"
                                        onClick={() => {
                                            AlertQuestion("Hapus?", "Hapus urusan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                if(result.isConfirmed){
                                                    hapusUrusan(data.id);
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
