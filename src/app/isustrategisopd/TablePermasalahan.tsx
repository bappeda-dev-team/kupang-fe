'use client'

import { useState, useEffect } from "react";
import { ButtonRedBorder } from "@/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TbTrash } from "react-icons/tb";
import { LoadingBeat } from "@/components/global/Loading";
import { PerangkatDaerah } from "@/types";

interface table {
    tahun: number;
    kode_opd: string;
}
interface PohonData {
    id: number;
    id_permasalahan: number;
    parent: number | null;
    nama_pohon: string;
    level_pohon: number;
    perangkat_daerah: PerangkatDaerah;
    jenis_masalah: string;
}

const TablePermasalahan: React.FC<table> = ({ tahun, kode_opd }) => {

    const [Data, setData] = useState<PohonData[]>([]);
    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL_PERMASALAHAN;
        const fetchPermasalahanTerpilih = async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await fetch(`${API_URL}/permasalahan_terpilih/findall?kode_opd=${kode_opd}&tahun=${tahun}`, {
                    headers: {
                        'Content-Type': "application-json",
                    }
                });
                const result = await response.json();
                const data = result.data;
                if (result.code === 200) {
                    setData(data);
                    // console.log(data);
                } else {
                    setError(true);
                    console.log(result.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (kode_opd && tahun) {
            fetchPermasalahanTerpilih();
        }
    }, [tahun, kode_opd]);

    const hapusPermasalahan = async(id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL_PERMASALAHAN;
        console.log(id);
        try{
            const response = await fetch(`${API_URL}/permasalahan/${id}/hapus_permasalahan_terpilih`, {
                method: "DELETE",
                headers: {
                    "Content-Type" : "application/json",
                }
            });
            const result = await response.json();
            if(result.code === 200){
                AlertNotification("Berhasil", "Data Permasalahan berhasil di hapus", "success", 2000, true);
                setData(Data.filter((data) => (data.id !== id)));
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
                console.log(result.data);
            }
        } catch(err){
            console.error(err);
        }
    }

    if (Error) {
        return (
            <div className="text-red-500">
                Error data permasalahan, Periksa koneksi internet, jika error berlajut silakan hubungi tim developer
            </div>
        )
    } else if(Loading) {
        return(
            <div className="border rounded-lg m-2">
                <LoadingBeat />
            </div>
        )
    }

    return (
        <div className="overflow-auto mb-2 mx-2 rounded-t-xl border">
            <table className="w-full">
                <thead>
                    <tr className="bg-orange-500 text-white">
                        <th className="border-r border-b px-6 py-3 text-center w-[50px]">No</th>
                        <th className="border-r border-b px-6 py-3">Permasalahan</th>
                        <th className="border-r border-b px-6 py-3">Jenis</th>
                        <th className="border-r border-b px-6 py-3 w-[50px]">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {Data.length === 0 ?
                        <tr>
                            <td colSpan={4} className="border-x border-b border-orange-500 py-4 px-3 text-center">
                                Data Permasalahan Kosong / Pilih dahulu permasalahan di menu Renstra-Permasalahan
                            </td>
                        </tr>
                        :
                        Data.map((data: PohonData, index: number) => (
                            <tr key={index}>
                                <td className="border-x border-b border-orange-500 py-4 px-3 text-center">
                                    {index + 1}
                                </td>
                                <td className="border-r border-b border-orange-500 px-6 py-4">
                                    {data.nama_pohon || "-"}
                                </td>
                                <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                    {data.jenis_masalah || "-"}
                                </td>
                                <td className="border-r border-b border-orange-500 px-6 py-4">
                                    <div className="flex flex-col jutify-center items-center gap-2">
                                        <ButtonRedBorder
                                            className="flex items-center gap-1 w-full"
                                            onClick={() => {
                                                AlertQuestion("Hapus?", "Data Permasalahan akan di hapus?", "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        hapusPermasalahan(data.id);
                                                    }
                                                });
                                            }}
                                        >
                                            <TbTrash />
                                            Hapus
                                        </ButtonRedBorder>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TablePermasalahan;