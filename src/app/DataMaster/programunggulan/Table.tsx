'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { TbPencil, TbTrash, TbCircleX, TbCircleCheck, TbMistOff, TbMist, TbCirclePlus, TbHourglass } from "react-icons/tb";
import { ButtonBlackBorder, ButtonSkyBorder, ButtonGreen, ButtonRed } from "@/components/global/Button";
import { AlertQuestion, AlertNotification } from "@/components/global/Alert";
import { useBrandingContext } from "@/context/BrandingContext";
import { ModalProgramUnggulan } from "./ModalProgramUnggulan";

interface Table {
    tahun_awal: string;
    tahun_akhir: string;
}
interface ProgramUnggulan {
    id: number;
    kode_program_unggulan: string;
    nama_program_unggulan: string;
    is_active: boolean;
    rencana_implementasi: string;
    keterangan: string;
    tahun_awal: string;
    tahun_akhir: string;
}

const Table: React.FC<Table> = ({ tahun_akhir, tahun_awal }) => {
    const token = getToken();

    const [Data, setData] = useState<ProgramUnggulan[]>([]);
    const [Loading, setLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const [DataEdit, setDataEdit] = useState<any>(null);
    const [ModalEdit, setModalEdit] = useState<boolean>(false);
    const [ModalBaru, setModalBaru] = useState<boolean>(false);

    const handleModalEdit = (data: ProgramUnggulan | null) => {
        if (ModalEdit) {
            setModalEdit(false);
            setDataEdit(null);
        } else {
            setModalEdit(true);
            setDataEdit(data);
        }
    }
    const handleModalBaru = () => {
        if (ModalBaru) {
            setModalBaru(false);
        } else {
            setModalBaru(true);
        }
    }

    useEffect(() => {
        const fetchProgramUnggulan = async () => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/program_unggulan/findall/${tahun_awal}/${tahun_akhir}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (result.code === 200) {
                    if (data.length === 0) {
                        setDataNull(true);
                    } else {
                        setDataNull(false);
                        setData(data);
                        setError(false);
                    }
                } else {
                    setError(true);
                    setData([]);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
                setError(false);
            }
        }
        fetchProgramUnggulan();
    }, [tahun_akhir, tahun_awal, token, FetchTrigger]);

    const hapusProgramUnggulan = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/program_unggulan/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            setData(Data.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data Program Unggulan Berhasil Dihapus", "success", 1000);
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
                <h1 className="text-red-500 font-bold mx-5 py-5">Error, Periksa koneksi internet atau database server, jika error berlanjut silakan hubungi tim developer</h1>
            </div>
        )
    }

    return (
        <>
            <ButtonSkyBorder
                className="m-3 flex items-center gap-1"
                onClick={handleModalBaru}
            >
                <TbCirclePlus />
                Tambah Program Unggulan
            </ButtonSkyBorder>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-green-500 text-white">
                            <th className="border-r border-b px-6 py-3 text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama Program Unggulan / Hebat</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Rencana Implementasi</th>
                            <th className="border-r border-b px-6 py-3 min-w-[150px]">Status</th>
                            <th className="border-r border-b px-6 py-3 min-w-[150px]">Tahun</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Keterangan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[150px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ? (
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                        ) : (
                            Data.map((item: ProgramUnggulan, index: number) => (
                                <tr key={index}>
                                    <td className="border-x border-b border-green-500 py-4 px-3 text-center">{index + 1}</td>
                                    <td className="border-r border-b border-green-500 px-6 py-4 font-semibold">{item.nama_program_unggulan || "-"}</td>
                                    <td className="border-r border-b border-green-500 px-6 py-4">{item.rencana_implementasi || "-"}</td>
                                    <td className="border-r border-b border-green-500 px-6 py-4">
                                        {item.is_active ? 
                                            <p className="flex items-center gap-1">
                                                <TbCircleCheck />
                                                Digunakan 
                                            </p>
                                            : 
                                            <p className="flex items-center gap-1">
                                                <TbHourglass />
                                                Pending
                                            </p>
                                        }
                                    </td>
                                    <td className="border-r border-b border-green-500 px-6 py-4 text-center">{item.tahun_awal || "-"} - {item.tahun_akhir || "-"}</td>
                                    <td className="border-r border-b border-green-500 px-6 py-4">{item.keterangan || "-"}</td>
                                    <td className="border-r border-b border-green-500 px-6 py-4">
                                        <div className="flex flex-col justify-center items-center gap-2">
                                            <ButtonGreen
                                                className="flex items-center gap-1 w-full"
                                                onClick={() => handleModalEdit(item)}
                                            >
                                                <TbPencil />
                                                Edit
                                            </ButtonGreen>
                                            <ButtonRed className="flex items-center gap-1 w-full" onClick={() => {
                                                AlertQuestion("Hapus?", "Hapus Program Unggulan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        hapusProgramUnggulan(item.id);
                                                    }
                                                });
                                            }}>
                                                <TbTrash />
                                                Hapus
                                            </ButtonRed>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {ModalBaru &&
                <ModalProgramUnggulan
                    jenis="baru"
                    onClose={() => handleModalBaru()}
                    isOpen={ModalBaru}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    tahun_awal={tahun_awal}
                    tahun_akhir={tahun_akhir}
                />
            }
            {ModalEdit &&
                <ModalProgramUnggulan
                    jenis="edit"
                    onClose={() => handleModalEdit(null)}
                    isOpen={ModalEdit}
                    dataEdit={DataEdit}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    tahun_awal={tahun_awal}
                    tahun_akhir={tahun_akhir}
                />
            }
        </>
    )
}

export default Table;
