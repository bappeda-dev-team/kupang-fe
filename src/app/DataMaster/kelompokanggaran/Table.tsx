'use client'

import { ButtonRed, ButtonSky } from "@/components/global/Button";
import { useState, useEffect } from "react";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { TbCirclePlus, TbTrash } from "react-icons/tb";
import { ModalKelompokAnggaran } from "./ModalKelompokAnggaran";

interface Kelompok {
    id: number;
    tahun: string;
    kelompok: string;
    kode_kelompok: string;
    tahun_view: string;
}

export const Table = () => {

    const [Tahun, setTahun] = useState<Kelompok[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const token = getToken();

    // MODAL TAMBAH
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [ModalTambah, setModalTambah] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchKelompokAnggaran = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/kelompok_anggaran/findall`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                // console.log(data);
                if (result.code === 200 || result.code === 201) {
                    if (data === null) {
                        setError(false);
                        setTahun([]);
                    } else {
                        setError(false);
                        setTahun(data);
                    }
                } else {
                    setError(true);
                    setTahun([]);
                }
                setTahun(data);
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        fetchKelompokAnggaran();
    }, [token, FetchTrigger]);

    const hapustahun = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/kelompok_anggaran/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            const result = await response.json();
            console.log(result);
            setFetchTrigger((prev) => !prev);
            AlertNotification("Berhasil", "Data Kelompok Anggaran Berhasil Dihapus", "success", 1000);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

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
        <div className="mt-3 rounded-xl shadow-lg border">
            <div className="flex items-center justify-between border-b px-5 py-5">
                <div className="flex flex-col items-end">
                    <h1 className="uppercase font-bold">Kelompok Anggaran</h1>
                </div>
                <div className="flex flex-col">
                    <ButtonSky
                        className="flex items-center justify-center"
                        onClick={() => setModalTambah(true)}
                    >
                        <TbCirclePlus className="mr-1" />
                        Tambah
                    </ButtonSky>
                </div>
            </div>
            <TableTahun
                data={Tahun === null ? [] : Tahun}
                hapus={hapustahun}
            />
            <ModalKelompokAnggaran 
                isOpen={ModalTambah}
                onClose={() => setModalTambah(false)}
                onSuccess={() => setFetchTrigger((prev) => !prev)}
            />
        </div>
    )
}

export const TableTahun: React.FC<{ data: Kelompok[], hapus: (id: number) => void }> = ({ data, hapus }) => {

    return (
        <div className="overflow-auto m-2 rounded-t-xl border">
            <table className="w-full">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="border-r border-b px-6 py-3 min-w-[200px]">Tahun</th>
                        <th className="border-r border-b px-6 py-3 min-w-[200px]">Jenis Kelompok Anggaran</th>
                        <th className="border-r border-b px-6 py-3 min-w-[300px]">Kode</th>
                        <th className="border-l border-b px-6 py-3 min-w-[100px]">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {(data.length > 0) ?
                        data.map((data: Kelompok, index: number) => (
                            <tr key={data.id || index}>
                                <td className="border-r border-b px-6 py-4 text-center">{data.tahun || "-"}</td>
                                <td className="border-r border-b px-6 py-4 text-center">{data.kelompok || "-"}</td>
                                <td className="border-r border-b px-6 py-4 text-center">{data.kode_kelompok || "-"}</td>
                                <td className="border-r border-b px-6 py-4">
                                    <div className="flex flex-col jutify-center items-center gap-2">
                                        <ButtonRed
                                            className="flex items-center gap-1 w-full"
                                            onClick={() => {
                                                AlertQuestion("Hapus?", "Hapus Jabatan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        hapus(data.id);
                                                    }
                                                });
                                            }}
                                        >
                                            <TbTrash />
                                            Hapus
                                        </ButtonRed>
                                    </div>
                                </td>
                            </tr>
                        ))
                        :
                        <tr>
                            <td className="px-6 py-3 uppercase" colSpan={13}>
                                Data Kosong / Belum Ditambahkan
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )

}