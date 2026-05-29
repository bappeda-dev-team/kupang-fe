'use client'

import { ButtonGreen, ButtonRed } from "@/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { LoadingClip } from "@/components/global/Loading";
import { useState, useEffect } from "react";
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";
import { TahunNull } from "@/components/global/OpdTahunNull";

interface program {
    id: string;
    kode_program: string;
    nama_program: string;
    kode_opd: string;
    tahun: string;
    is_active: boolean;
}

const Table = () => {

    const { branding } = useBrandingContext();
    const [Program, setProgram] = useState<program[]>([]);
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
                const [programRes, opdRes] = await Promise.all([
                    fetch(`${API_URL}/programs`, {
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
                const programResult = await programRes.json();
                const opdResult = await opdRes.json();
                const programData = programResult.data;
                if(programData == null){
                    setDataNull(true);
                    setProgram([]);
                } else if(programResult.code === 401){
                    setError(true);
                } else {
                    setError(false);
                    setDataNull(false);
                    setProgram(programData);
                }
                setProgram(programData);
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

    const hapusProgram = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/programs/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setProgram(Program.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data program Berhasil Dihapus", "success", 1000);
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
                            <th className="border-r border-b px-6 py-3 min-w-[500px]">Nama Program</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode Program</th>
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
                        Program.map((data, index) => (
                        <tr key={data.id}>
                            <td className="border-r border-b px-6 py-4">{index +1}</td>
                            <td className="border-r border-b px-6 py-4">{data.nama_program ? data.nama_program : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.kode_program ? data.kode_program : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.kode_opd ? (OpdMap[data.kode_opd] || data.kode_opd) : "-"}</td>
                            <td className="border-r border-b px-6 py-4">{data.kode_opd ? data.kode_opd : "-"}</td>
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col jutify-center items-center gap-2">
                                    <ButtonGreen className="w-full" halaman_url={`/DataMaster/masterprogramkegiatan/program/${data.id}`}>Edit</ButtonGreen>
                                    <ButtonRed 
                                        className="w-full"
                                        onClick={() => {
                                            AlertQuestion("Hapus?", "Hapus program yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                if(result.isConfirmed){
                                                    hapusProgram(data.id);
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