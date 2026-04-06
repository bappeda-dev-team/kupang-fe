'use client'

import { ButtonGreen, ButtonRed } from "@/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { useState, useEffect } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";

interface Usulan {
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

    const [Inisiatif, setInisiatif] = useState<Usulan[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchInisiatif = async() => {
            setLoading(true)
            try{
                const response = await fetch(`${API_URL}/usulan_inisiatif/findall`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                      },
                });
                const result = await response.json();
                const data = result.usulan_inisiatif;
                if(data == null){
                    setDataNull(true);
                    setInisiatif([]);
                } else if(result.code === 401){
                    setError(true);
                } else {
                    setDataNull(false);
                    setInisiatif(data);
                    setError(false);
                }
                setInisiatif(data);
            } catch(err){
                setError(true);
                console.error(err)
            } finally{
                setLoading(false);
            }
        }
        fetchInisiatif();
    }, [token]);

    const hapusMusrenbang = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/usulan_inisiatif/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                  },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setInisiatif(Inisiatif.filter((data) => (data.id !== id)))
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
    }

    return(
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Tahun</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Usulan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Alamat</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Uraian</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Kode OPD</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Status</th>
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
                        Inisiatif.map((data, index) => (
                        <tr key={data.id}>
                            <td className="border-r border-b px-6 py-4">{index + 1}</td>
                            <td className="border-r border-b px-6 py-4">{data.tahun ? data.tahun : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.usulan ? data.usulan : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.alamat ? data.alamat : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.uraian ? data.uraian : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.kode_opd ? data.kode_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.status ? data.status : "-"}</td>
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