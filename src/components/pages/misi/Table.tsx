'use client'

import { ButtonRed, ButtonGreen, ButtonSky } from "@/components/global/Button";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getOpdTahun } from "@/components/lib/Cookie";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken, getUser } from "@/components/lib/Cookie";
import { TbPencil, TbTrash, TbCirclePlus } from "react-icons/tb";
import { ModalMisi } from "./ModalMisi";
import Select from 'react-select';

interface OptionTypeString {
    label: string;
    value: string;
}

interface MisiPemda {
    id: number;
    id_visi: number;
    misi: string;
    urutan: number;
    tahun_awal_periode: string;
    tahun_akhir_periode: string;
    jenis_periode: string;
    keterangan: string;
}

interface Visi {
    id_visi: number;
    visi: string;
    misi_pemda: MisiPemda[];
}


const Table = () => {

    const [Misi, setMisi] = useState<Visi[]>([]);

    const [PeriodeNotFound, setPeriodeNotFound] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [JenisPeriode, setJenisPeriode] = useState<OptionTypeString | null>(null);

    const [isOpenNewTujuan, setIsOpenNewTujuan] = useState<boolean>(false);
    const [isOpenEditTujuan, setIsOpenEditTujuan] = useState<boolean>(false);
    const [IdMisi, setIdMisi] = useState<number>(0);

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
        if(JenisPeriode != null){
            fetchMisi(JenisPeriode ? JenisPeriode?.value : "RPJMD");
        }
    }, [FetchTrigger, JenisPeriode])

    const fetchMisi = async (jenis: string) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/misi_pemda/findall/tahun/${Tahun?.value}/jenisperiode/${jenis}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const data = result.data;
            // console.log(data);
            if (data.length === 0) {
                setDataNull(true);
                setMisi([]);
            } else if (result.code == 500) {
                setPeriodeNotFound(true);
                setMisi([]);
            } else {
                setDataNull(false);
                setMisi(data);
            }
        } catch (err) {
            setError(true);
            console.error(err)
        } finally {
            setLoading(false);
        }
    }

    const hapusMisi = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // console.log(id);
        try {
            const response = await fetch(`${API_URL}/misi_pemda/delete/${id}`, {
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
            fetchMisi(JenisPeriode ? JenisPeriode?.value : "RPJMD");
            // setFetchTrigger((prev) => !prev);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };

    const handleModalNewMisi = () => {
        if (isOpenNewTujuan) {
            setIsOpenNewTujuan(false);
        } else {
            setIsOpenNewTujuan(true);
        }
    }
    const handleModalEditMisi = (id: number) => {
        if (isOpenEditTujuan) {
            setIsOpenEditTujuan(false);
            setIdMisi(0);
        } else {
            setIsOpenEditTujuan(true);
            setIdMisi(id);
        }
    }

    if (Loading) {
        return (
            <>
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">Misi</h1>
                        <h1 className="uppercase font-bold ml-1">{Tahun ? Tahun?.label : ""}</h1>
                    </div>
                </div>
                <div className="border p-5 rounded-xl shadow-xl">
                    <LoadingClip className="mx-5 py-5" />
                </div>
            </>
        );
    } else if (Error) {
        return (
            <>
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">Misi</h1>
                        <h1 className="uppercase font-bold ml-1">{Tahun ? Tahun?.label : ""}</h1>
                    </div>
                </div>
                <div className="border p-5 rounded-xl shadow-xl">
                    <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
                </div>
            </>
        )
    } else if (Tahun?.value == undefined) {
        return <TahunNull />
    }

    return (
        <>
            <div className="flex items-center justify-between border-b px-5 py-5">
                <div className="flex flex-wrap items-end">
                    <h1 className="uppercase font-bold">Misi</h1>
                    <h1 className="uppercase font-bold ml-1">{Tahun ? Tahun?.label : ""}</h1>
                </div>
            </div>
            <div className="flex flex-wrap justify-between my-5 mx-3">
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
                            fetchMisi(option?.value);
                        }
                    }}
                    isClearable
                    options={jenisOption}
                    placeholder="pilih Jenis Periode ..."
                    value={JenisPeriode}
                    isSearchable
                />
                {JenisPeriode &&
                    <ButtonSky onClick={() => handleModalNewMisi()}>
                        <TbCirclePlus className="mr-1" />
                        Tambah Misi
                    </ButtonSky>
                }
            </div>
            {JenisPeriode == null ?
                <h1 className="px-5 pb-5 pt-2">Pilih Jenis Periode terlebih dahulu</h1>
                :
                <div className="overflow-auto mx-2 mt-2 mb-5 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-emerald-500 text-white">
                                <td className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                                <th className="border-r border-b px-6 py-3 min-w-[300px]">Visi / Misi</th>
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
                                    </td>
                                </tr>
                                :
                                Misi.map((data: Visi, index: number) => {
                                    return (
                                        <React.Fragment key={index}>
                                            {/* Baris Utama */}
                                            <tr>
                                                <td className="border border-emerald-500 px-4 py-4 text-center">{index + 1}</td>
                                                <td className="border-x border-b border-emerald-500 px-6 py-4 font-bold" colSpan={30}>Visi : {data.visi || "-"}</td>
                                            </tr>
                                            {data.misi_pemda.map((item: MisiPemda) => (
                                                <React.Fragment key={item.id}>
                                                    <tr>
                                                        <td className="border border-emerald-500 px-4 py-4 text-center">{index +1}.{item.urutan}</td>
                                                        <td className="border-x border-b border-emerald-500 px-6 py-4">{item.misi}</td>
                                                        <td className="border-x border-b border-emerald-500 px-6 py-4 text-center">{item.tahun_akhir_periode ? `${item.tahun_awal_periode} - ${item.tahun_akhir_periode} (${item.jenis_periode})` : "-"}</td>
                                                        <td className="border-x border-b border-emerald-500 px-6 py-4">{item.keterangan || "-"}</td>
                                                        <td className="border-x border-b border-emerald-500 px-6 py-4">
                                                            <div className="flex flex-col justify-center items-center gap-2">
                                                                <ButtonGreen
                                                                    className="flex items-center gap-1 w-full"
                                                                    onClick={() => handleModalEditMisi(item.id)}
                                                                >
                                                                    <TbPencil />
                                                                    Edit
                                                                </ButtonGreen>
                                                                <ButtonRed className="flex items-center gap-1 w-full" onClick={() => {
                                                                    AlertQuestion("Hapus?", "Hapus Tujuan Pemda yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                        if (result.isConfirmed) {
                                                                            hapusMisi(item.id);
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
                                            ))}
                                        </React.Fragment>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                    {/* MODAL EDIT TUJUAN */}
                    <ModalMisi
                        metode="baru"
                        tahun={Tahun?.value}
                        jenis_periode={JenisPeriode?.value}
                        isOpen={isOpenNewTujuan}
                        onClose={() => handleModalNewMisi()}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                    />
                    {/* MODAL EDIT TUJUAN */}
                    <ModalMisi
                        metode="lama"
                        tahun={Tahun?.value}
                        jenis_periode={JenisPeriode?.value}
                        id={IdMisi}
                        isOpen={isOpenEditTujuan}
                        onClose={() => handleModalEditMisi(0)}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                    />
                </div>
            }
        </>
    )
}

export default Table;
