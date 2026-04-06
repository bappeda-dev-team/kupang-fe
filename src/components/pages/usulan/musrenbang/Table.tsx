'use client'

import { ButtonRed, ButtonGreen } from "@/components/global/Button";
import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getOpdTahun } from "@/components/lib/Cookie";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken } from "@/components/lib/Cookie";

interface musrenbang {
    id: string;
    usulan: string;
    alamat: string;
    uraian: string;
    tahun: string;
    rencana_kinerja_id: string;
    pegawai_id: string;
    kode_opd: string;
    status: string;
}

const Table = () => {

    const [Musrenbang, setMusrenbang] = useState<musrenbang[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const token = getToken();
    
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
        const fetchMusrenbang = async() => {
            setLoading(true)
            try{
                const response = await fetch(`${API_URL}/usulan_musrebang/findall`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.usulan_musrebang;
                if(data == null){
                    setDataNull(true);
                    setMusrenbang([]);
                } else if(result.code == 500){
                    setError(true);
                    setMusrenbang([]);
                } else {
                    setDataNull(false);
                    setMusrenbang(data);
                }
            } catch(err){
                setError(true);
                console.error(err)
            } finally{
                setLoading(false);
            }
        }
        fetchMusrenbang();
    }, [token]);

    const hapusMusrenbang = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/usulan_musrebang/delete/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setMusrenbang(Musrenbang.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data Musrenbang Berhasil Dihapus", "success", 1000);
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
    } else if(Tahun?.value == undefined){
        return <TahunNull />
    }

    return(
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Usulan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Alamat</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Uraian</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Tahun</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Perangkat Daerah</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Status</th>
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
                        Musrenbang.map((data, index) => (
                        <tr key={data.id}>
                            <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                            <td className="border-r border-b px-6 py-4 text-center">{data.usulan ? data.usulan : "-"}</td>
                            <td className="border-r border-b px-6 py-4 text-center">{data.alamat ? data.alamat : "-"}</td>
                            <td className="border-r border-b px-6 py-4 text-center">{data.uraian ? data.uraian : "-"}</td>
                            <td className="border-r border-b px-6 py-4 text-center">{data.tahun ? data.tahun : "-"}</td>
                            <td className="border-r border-b px-6 py-4 text-center">{data.kode_opd ? data.kode_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4 text-center">{data.status ? data.status : "-"}</td>
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col jutify-center items-center gap-2">
                                    <ButtonGreen className="w-full" halaman_url={`/musrenbang/${data.id}`}>Edit</ButtonGreen>
                                    <ButtonRed 
                                        className="w-full"
                                        onClick={() => {
                                            AlertQuestion("Hapus?", "Hapus Musrenbang yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                if(result.isConfirmed){
                                                    hapusMusrenbang(data.id);
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
