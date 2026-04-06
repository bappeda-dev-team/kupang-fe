'use client'

import { ButtonGreenBorder, ButtonRed, ButtonSkyBorder } from "@/components/global/Button";
import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TbCirclePlus, TbTrash } from "react-icons/tb";
import { ModalSubKegiatanOpd } from "./ModalSubKegiatanOpd";
import { useBrandingContext } from "@/context/BrandingContext";

interface subkegiatan {
    id: number;
    kode_subkegiatan: string;
    nama_subkegiatan: string;
    kode_opd: string;
    nama_opd: string;
    tahun: string;
}
interface table {
    tahun: number;
    opd: string;
}

const Table: React.FC<table> = ({ tahun, opd }) => {

    const [SubKegiatan, setSubKegiatan] = useState<subkegiatan[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [JenisModal, setJenisModal] = useState<"opd" | "all">("all");
    const token = getToken();
    const { branding } = useBrandingContext();

    // MODAL & TRIGGER
    const [ModalTambah, setModalTambah] = useState<boolean>(false);
    const [fetchTrigger, setfetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchSubKegiatan = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/subkegiatanopd/findall/${opd}/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data === null) {
                    setDataNull(true);
                    setSubKegiatan([]);
                } else if (data.code == 500) {
                    setError(true);
                    setSubKegiatan([]);
                } else {
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
        if (tahun && opd) {
            fetchSubKegiatan();
        }
    }, [opd, tahun, fetchTrigger, token]);

    const handleModal = (jenis: "opd" | "all") => {
        if (ModalTambah) {
            setJenisModal("opd");
            setModalTambah(false);
        } else {
            setJenisModal(jenis);
            setModalTambah(true);
        }
    }

    const hapusSubKegiatan = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/subkegiatanopd/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            setSubKegiatan(SubKegiatan.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data Sub Kegiatan OPD Berhasil Di hapus", "success", 1000);
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
        <>
            <div className="flex flex-wrap items-center gap-1">
                <ButtonSkyBorder
                    className="m-2 flex items-center gap-1"
                    onClick={() => handleModal("opd")}
                >
                    <TbCirclePlus />
                    Tambah Sub Kegiatan OPD
                </ButtonSkyBorder>
                <ButtonGreenBorder
                    className="m-2 flex items-center gap-1"
                    onClick={() => handleModal("all")}
                >
                    <TbCirclePlus />
                    Tambah Sub Kegiatan Baru
                </ButtonGreenBorder>
            </div>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode Sub Kegiatan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[300px]">Nama Sub Kegiatan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Perangkat Daerah</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={5}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            SubKegiatan.map((data: subkegiatan, index: number) => (
                                <tr key={data.id}>
                                    <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{data.kode_subkegiatan}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nama_subkegiatan}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nama_opd}</td>
                                    <td className="border-r border-b px-6 py-4">
                                        <ButtonRed
                                            className="w-full flex items-center gap-1"
                                            onClick={() => {
                                                AlertQuestion("Hapus?", "Hapus Sub Kegiatan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        hapusSubKegiatan(data.id);
                                                    }
                                                });
                                            }}
                                        >
                                            <TbTrash />
                                            Hapus
                                        </ButtonRed>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <ModalSubKegiatanOpd
                    kode_opd={opd}
                    tahun={String(tahun)}
                    isOpen={ModalTambah}
                    jenis={JenisModal}
                    onClose={() => handleModal("all")}
                    onSuccess={() => setfetchTrigger((prev) => !prev)}
                />
            </div>
        </>
    )
}

export default Table;
