'use client'

import { ButtonRed, ButtonGreen, ButtonSky } from "@/components/global/Button";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getOpdTahun } from "@/components/lib/Cookie";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken, getUser } from "@/components/lib/Cookie";
import { TbPencil, TbTrash, TbCirclePlus } from "react-icons/tb";
import { ModalVisi } from "../visi/ModalVisi";
import Select from 'react-select';

interface OptionTypeString {
    label: string;
    value: string;
}
interface Periode {
    tahun_awal: string;
    tahun_akhir: string;
}

interface Visi {
    id: number;
    visi: string;
    tahun_awal_periode: string;
    tahun_akhir_periode: string;
    jenis_periode: string;
    keterangan: string;
}

const Table = () => {

    const [Visi, setVisi] = useState<Visi[]>([]);

    const [PeriodeNotFound, setPeriodeNotFound] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [JenisPeriode, setJenisPeriode] = useState<OptionTypeString | null>(null);

    const [isOpenNewTujuan, setIsOpenNewTujuan] = useState<boolean>(false);
    const [isOpenEditTujuan, setIsOpenEditTujuan] = useState<boolean>(false);
    const [IdVisi, setIdVisi] = useState<number>(0);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [Tahun, setTahun] = useState<any>(null);
    const [User, setUser] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
    }, []);

    const jenisOption = [
        { label: "RPJMD", value: "RPJMD" },
        { label: "RPD", value: "RPD" }
    ];

    useEffect(() => {
        fetchVisi(JenisPeriode ? JenisPeriode?.value : "RPJMD");
    }, [FetchTrigger, JenisPeriode])

    const fetchVisi = async (jenis: string) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/visi_pemda/findall/tahun/${Tahun?.value}/jenisperiode/${jenis}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const data = result.data;
            // console.log(data);
            if (data === null) {
                setDataNull(true);
                setVisi([]);
            } else if (result.code == 500) {
                setPeriodeNotFound(true);
                setVisi([]);
            } else {
                setDataNull(false);
                setVisi(data);
            }
        } catch (err) {
            setError(true);
            console.error(err)
        } finally {
            setLoading(false);
        }
    }

    const hapusVisi = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // console.log(id);
        try {
            const response = await fetch(`${API_URL}/visi_pemda/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("response !ok saat hapus data tujuan pemda")
            }
            AlertNotification("Berhasil", "Data Tujuan Pemda Berhasil Dihapus", "success", 1000);
            fetchVisi(JenisPeriode ? JenisPeriode?.value : "RPJMD");
            // setFetchTrigger((prev) => !prev);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };

    const handleModalNewTujuan = () => {
        if (isOpenNewTujuan) {
            setIsOpenNewTujuan(false);
        } else {
            setIsOpenNewTujuan(true);
        }
    }
    const handleModalEditTujuan = (id: number) => {
        if (isOpenEditTujuan) {
            setIsOpenEditTujuan(false);
            setIdVisi(0);
        } else {
            setIsOpenEditTujuan(true);
            setIdVisi(id);
        }
    }

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if (Tahun?.value == undefined) {
        return <TahunNull />
    }

    return (
        <>
            <div className="flex my-5 ml-3">
                <Select
                    styles={{
                        control: (baseStyles) => ({
                            ...baseStyles,
                            borderRadius: '8px',
                            minWidth: '157.562px',
                            minHeight: '38px'
                        })
                    }}
                    onChange={(option) => {
                        setJenisPeriode(option);
                        if (option) {
                            fetchVisi(option?.value);
                        }
                    }}
                    isClearable
                    options={jenisOption}
                    placeholder="pilih Jenis Periode ..."
                    value={JenisPeriode}
                    isSearchable
                />
            </div>
            {JenisPeriode == null ?
                <h1 className="px-5 pb-5 pt-2">Pilih Jenis Periode terlebih dahulu</h1>
                :
                <div className="overflow-auto mx-2 mt-2 mb-5 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-emerald-500 text-white">
                                <th className="border-r border-b px-6 py-3 min-w-[300px]">Visi</th>
                                <th className="border-r border-b px-6 py-3 min-w-[300px]">Periode</th>
                                <th className="border-r border-b px-6 py-3 min-w-[100px]">keterangan</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DataNull ?
                                <tr>
                                    <td className="px-6 py-3 flex flex-wrap items-center gap-5" colSpan={30}>
                                        <p>Data Kosong / Belum Ditambahkan</p>
                                        <ButtonSky
                                        onClick={() => handleModalNewTujuan()}
                                        >
                                            <TbCirclePlus className="mr-1"/>
                                            Tambah Visi
                                        </ButtonSky>
                                    </td>
                                </tr>
                                :
                                Visi.map((data: Visi, index: number) => {
                                    return (
                                        <React.Fragment key={index}>
                                            {/* Baris Utama */}
                                            <tr>
                                                <td className="border-x border-b border-emerald-500 px-6 py-4">{data.visi || "-"}</td>
                                                <td className="border-x border-b border-emerald-500 px-6 py-4 text-center">{data.tahun_akhir_periode ? `${data.tahun_awal_periode} - ${data.tahun_akhir_periode} (${data.jenis_periode})` : "-"}</td>
                                                <td className="border-x border-b border-emerald-500 px-6 py-4">{data.keterangan || "-"}</td>
                                                <td className="border-x border-b border-emerald-500 px-6 py-4">
                                                    <div className="flex flex-col justify-center items-center gap-2">
                                                        <ButtonGreen
                                                            className="flex items-center gap-1 w-full"
                                                            onClick={() => handleModalEditTujuan(data.id)}
                                                        >
                                                            <TbPencil />
                                                            Edit
                                                        </ButtonGreen>
                                                        <ButtonRed className="flex items-center gap-1 w-full" onClick={() => {
                                                            AlertQuestion("Hapus?", "Hapus Tujuan Pemda yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                if (result.isConfirmed) {
                                                                    hapusVisi(data.id);
                                                                }
                                                            });
                                                        }}>
                                                            <TbTrash />
                                                            Hapus
                                                        </ButtonRed>
                                                    </div>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                    {/* MODAL EDIT TUJUAN */}
                    <ModalVisi
                        metode="baru"
                        isOpen={isOpenNewTujuan}
                        onClose={() => handleModalNewTujuan()}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                    />
                    {/* MODAL EDIT TUJUAN */}
                    <ModalVisi
                        metode="lama"
                        id={IdVisi}
                        isOpen={isOpenEditTujuan}
                        onClose={() => handleModalEditTujuan(0)}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                    />
                </div>
            }
        </>
    )
}

export default Table;
