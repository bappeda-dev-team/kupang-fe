'use client'

import { ButtonGreen, ButtonRed, ButtonSky } from "@/components/global/Button";
import React, { useState, useEffect } from "react";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { TbPencil, TbTrash, TbCirclePlus } from "react-icons/tb";
import { ModalSubKegiatan } from "./ModalSubKegiatan";

interface SubKegiatan {
    id: string;
    kode_subkegiatan: string;
    nama_sub_kegiatan: string;
}

const Table = () => {

    const [SubKegiatan, setSubKegiatan] = useState<SubKegiatan[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();
    
    // MODAL
    const [ModalTambah, setModalTambah] = useState<boolean>(false);
    const [ModalEdit, setModalEdit] = useState<boolean>(false);
    const [IdSubKegiatan, setIdSubKegiatan] = useState<string>('');
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const handleEdit = (id: string) => {
        if(ModalEdit){
            setModalEdit(false);
            setIdSubKegiatan('');
        } else {
            setModalEdit(true);
            setIdSubKegiatan(id);
        }
    }

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchSubKegiatan = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/sub_kegiatan/findall`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.sub_kegiatan;
                if (data == null) {
                    setDataNull(true);
                    setSubKegiatan([]);
                } else if (result.code === 401) {
                    setError(true);
                } else {
                    setError(false);
                    setDataNull(false);
                    setSubKegiatan(data);
                }
                setSubKegiatan(data);
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        fetchSubKegiatan();
    }, [token, FetchTrigger]);

    const hapusSubKegiatan = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/sub_kegiatan/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("gagal hapus sub kegiatan dengan response !ok, cek koneksi internet atau server");
            }
            setSubKegiatan(SubKegiatan.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data sub kegiatan Berhasil Dihapus", "success", 1000);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err)
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
        <>
            <ButtonSky 
                onClick={() => setModalTambah(true)}
                className="flex items-center gap-1 m-2"
            >
                <TbCirclePlus />
                Tambah Sub Kegiatan
            </ButtonSky>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Nama Sub Kegiatan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[70px]">Aksi</th>
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
                            SubKegiatan.map((item: SubKegiatan, index: number) => {

                                return (
                                    <tr key={item.id || index}>
                                        <td className="border-x border-b px-6 py-4 text-center">{index + 1}</td>
                                        <td className="border-r border-b px-6 py-4">
                                            {item.kode_subkegiatan || "-"}
                                        </td>
                                        <td className="border-r border-b px-6 py-4">
                                            {item.nama_sub_kegiatan || "-"}
                                        </td>
                                        <td className="border-r border-b px-6 py-4">
                                            <div className="flex flex-col justify-center items-center gap-2">
                                                <ButtonGreen
                                                    className="flex items-center gap-1 w-full"
                                                    onClick={() => handleEdit(item.id)}
                                                >
                                                    <TbPencil />
                                                    Edit
                                                </ButtonGreen>
                                                <ButtonRed
                                                    className="flex items-center gap-1 w-full"
                                                    onClick={() => {
                                                        AlertQuestion("Hapus?", "Hapus Sub Kegiatan?", "question", "Hapus", "Batal").then((result) => {
                                                            if (result.isConfirmed) {
                                                                hapusSubKegiatan(item.id);
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
                                );
                            })
                        }
                    </tbody>
                </table>
                {/* MODAL TAMBAH */}
                <ModalSubKegiatan
                    metode="baru"
                    onClose={() => setModalTambah(false)}
                    isOpen={ModalTambah}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
                {/* MODAL EDIT */}
                <ModalSubKegiatan
                    id={IdSubKegiatan}
                    metode="lama"
                    onClose={() => setModalEdit(false)}
                    isOpen={ModalEdit}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
            </div>
        </>
    )
}

export default Table;