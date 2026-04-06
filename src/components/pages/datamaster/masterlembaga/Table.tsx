'use client'

import { ButtonRed, ButtonGreen } from "@/components/global/Button";
import { useState, useEffect } from "react";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";

interface lembaga {
    id: string;
    nama_lembaga: string;
    kode_lembaga: string;
    nama_kepala_pemda: string;
    nip_kepala_pemda: string;
    jabatan_kepala_pemda: string;
}

const Table = () => {

    const [Lembaga, setLembaga] = useState<lembaga[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchLembaga = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/lembaga/findall`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data.length == 0) {
                    setDataNull(true);
                    setLembaga([]);
                } else if (data.code == 500) {
                    setError(true);
                    setLembaga([]);
                } else if (result.code === 401) {
                    setError(true);
                } else {
                    setError(false);
                    setDataNull(false);
                    setLembaga(data);
                }
                setLembaga(data);
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        fetchLembaga();
    }, [token]);

    // const hapusLembaga = async (id: any) => {
    //     const API_URL = process.env.NEXT_PUBLIC_API_URL;
    //     try {
    //         const response = await fetch(`${API_URL}/lembaga/delete/${id}`, {
    //             method: "DELETE",
    //             headers: {
    //                 // Authorization: `${token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         })
    //         if (!response.ok) {
    //             alert("cant fetch data")
    //         }
    //         setLembaga(Lembaga.filter((data) => (data.id !== id)))
    //         AlertNotification("Berhasil", "Data lembaga Berhasil Dihapus", "success", 1000);
    //     } catch (err) {
    //         AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
    //     }
    // };

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white">
                            <th className="border-r border-b px-6 py-3 max-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Id Lembaga</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama Lembaga</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode Lembaga</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Jabatan Kepala Pemda</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama Kepala Pemda</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">NIP Kepala Pemda</th>
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
                            Lembaga.map((data, index) => (
                                <tr key={data.id}>
                                    <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{data.id ? data.id : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nama_lembaga ? data.nama_lembaga : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.kode_lembaga ? data.kode_lembaga : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.jabatan_kepala_pemda ? data.jabatan_kepala_pemda : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.nama_kepala_pemda ? data.nama_kepala_pemda : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.nip_kepala_pemda ? data.nip_kepala_pemda : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">
                                        <div className="flex flex-col jutify-center items-center gap-2">
                                            <ButtonGreen className="w-full" halaman_url={`/DataMaster/masterlembaga/${data.id}`}>Edit</ButtonGreen>
                                            {/* <ButtonRed
                                                className="w-full"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus Lembaga yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                        if (result.isConfirmed) {
                                                            hapusLembaga(data.id);
                                                        }
                                                    });
                                                }}
                                            >
                                                Hapus
                                            </ButtonRed> */}
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