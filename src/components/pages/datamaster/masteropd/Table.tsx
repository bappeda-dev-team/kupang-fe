'use client'

import { ButtonGreen, ButtonRed } from "@/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { useState, useEffect } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";

interface opd {
    id: string;
    kode_opd: string;
    nama_opd: string;
    singkatan: string;
    alamat: string;
    telepon: string;
    fax: string;
    email: string;
    website: string;
    nama_kepala_opd: string;
    nip_kepala_opd: string;
    pangkat_kepala: string;
    id_lembaga: lembaga;
}

interface lembaga {
    id: string;
    nama_lembaga: string;
    is_active: boolean; 
}

const Table = () => {

    const [Opd, setOpd] = useState<opd[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchOpd = async() => {
            setLoading(true)
            try{
                const response = await fetch(`${API_URL}/opd/findall`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                      },
                });
                const result = await response.json();
                const data = result.data;
                if(data == null){
                    setDataNull(true);
                    setOpd([]);
                } else if(result.code === 401){
                    setError(true);
                } else {
                    setDataNull(false);
                    setOpd(data);
                    setError(false);
                }
                setOpd(data);
            } catch(err){
                setError(true);
                console.error(err)
            } finally{
                setLoading(false);
            }
        }
        fetchOpd();
    }, [token]);

    const hapusOpd = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/opd/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                  },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setOpd(Opd.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data Perangkat Daerah Berhasil Dihapus", "success", 1000);
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
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode Perangkat Daerah</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama Perangkat Daerah</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama Kepala Perangkat Daerah</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">NIP Kepala Perangkat Daerah</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Pangkat Kepala Perangkat Daerah</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode Lembaga</th>
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
                        Opd.map((data, index) => (
                        <tr key={data.id}>
                            <td className="border-r border-b px-6 py-4">{index + 1}</td>
                            <td className="border-r border-b px-6 py-4">{data.kode_opd ? data.kode_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.nama_opd ? data.nama_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.nama_kepala_opd ? data.nama_kepala_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.nip_kepala_opd ? data.nip_kepala_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.pangkat_kepala ? data.pangkat_kepala : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.id_lembaga ? data.id_lembaga.id : "-"}</td>
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col jutify-center items-center gap-2">
                                    <ButtonGreen className="w-full" halaman_url={`/DataMaster/masteropd/${data.id}`}>Edit</ButtonGreen>
                                    <ButtonRed 
                                        className="w-full"
                                        onClick={() => {
                                            AlertQuestion("Hapus?", "Hapus Perangkat Daerah yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                if(result.isConfirmed){
                                                    hapusOpd(data.id);
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