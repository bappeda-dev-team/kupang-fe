'use client'

import { ButtonRed, ButtonGreen, ButtonSky } from "@/components/global/Button";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TahunNull, OpdTahunNull } from "@/components/global/OpdTahunNull";
import { getToken, getUser, getOpdTahun } from "@/components/lib/Cookie";
import { TbPencil, TbTrash, TbCirclePlus } from "react-icons/tb";
import { ModalTujuanOpd } from "./ModalTujuanOpd";

interface Periode {
    id: number;
    tahun_awal: string;
    tahun_akhir: string;
}

interface Target {
    id: string;
    target: string;
    satuan: string;
    tahun: string;
}

interface Indikator {
    id: string;
    indikator: string;
    definisi_operasional: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: Target[];
}

interface Periode {
    id: number;
    tahun_awal: string;
    tahun_akhir: string;
}

interface TujuanOpd {
    id_tujuan_opd: number;
    tujuan: string;
    periode: Periode;
    indikator: Indikator[];
}

interface tujuan {
    kode_urusan: string;
    urusan: string;
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
    kode_opd: string;
    nama_opd: string;
    tujuan_opd: TujuanOpd[];
}

interface Periode_Header {
    id: number;
    tahun_awal: string;
    tahun_akhir: string;
    tahun_list: string[];
}

interface table {
    id_periode: number;
    tahun_awal: string;
    tahun_akhir: string;
    jenis: string;
    tahun_list: string[];
    tipe: 'laporan' | 'opd';
}

const Table: React.FC<table> = ({ tipe, id_periode, tahun_awal, tahun_akhir, jenis, tahun_list }) => {

    const [Tujuan, setTujuan] = useState<tujuan[]>([]);

    const [PeriodeNotFound, setPeriodeNotFound] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);

    const [isOpenNewTujuan, setIsOpenNewTujuan] = useState<boolean>(false);
    const [isOpenEditTujuan, setIsOpenEditTujuan] = useState<boolean>(false);
    const [IdTujuan, setIdTujuan] = useState<number>(0);
    const [IdTema, setIdTema] = useState<number>(0);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [Tahun, setTahun] = useState<any>(null);
    const [User, setUser] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
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
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, []);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        let url = '';
        if (User?.roles == 'super_admin') {
            url = `tujuan_opd/findall/${SelectedOpd?.value}/tahunawal/${tahun_awal}/tahunakhir/${tahun_akhir}/jenisperiode/${jenis}`
        } else {
            url = `tujuan_opd/findall/${User?.kode_opd}/tahunawal/${tahun_awal}/tahunakhir/${tahun_akhir}/jenisperiode/${jenis}`
        }
        const fetchTujuanOpd = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/${url}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data.length == 0) {
                    setDataNull(true);
                    setTujuan([]);
                } else if (result.code == 500) {
                    setPeriodeNotFound(true);
                    console.log(result.data);
                    setTujuan([]);
                } else if(result.code == 200 || result.code == 201){
                    setDataNull(false);
                    setTujuan(data);
                    setError(false);
                } else {
                    setDataNull(false);
                    setTujuan([]);
                    setError(true);
                    console.log(result.data);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        if (User?.roles !== undefined) {
            fetchTujuanOpd();
        }
    }, [token, User, Tahun, FetchTrigger, SelectedOpd, tahun_awal, tahun_akhir, jenis]);

    const hapusTujuanOpd = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // console.log(id);
        try {
            const response = await fetch(`${API_URL}/tujuan_opd/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("response !ok saat hapus data tujuan opd")
            }
            AlertNotification("Berhasil", "Data Tujuan OPD Berhasil Dihapus", "success", 1000);
            setFetchTrigger((prev) => !prev);
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
            setIdTujuan(0);
        } else {
            setIsOpenEditTujuan(true);
            setIdTujuan(id);
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
                <h1 className="text-red-500 font-bold mx-5 py-5">Error, Periksa koneksi internet atau database server, jika error masih berlanjut hubungi tim developer</h1>
            </div>
        )
    } else if (PeriodeNotFound && Tahun?.value != undefined) {
        return (
            <div className="flex flex-col gap-3 border p-5 rounded-xl shadow-xl">
                <h1 className="text-yellow-500 font-base mx-5">Tahun {Tahun?.value} tidak tersedia di data periode / periode dengan tahun {Tahun?.value} belum di buat</h1>
                <h1 className="text-yellow-500 font-bold mx-5">Tambahkan periode dengan tahun {Tahun?.value} di halaman Master Periode (Super Admin)</h1>
            </div>
        )
    } else if (Tahun?.value == undefined) {
        return <TahunNull />
    } else if(User?.roles == 'super_admin'){
        if (SelectedOpd?.value == undefined) {
            return (
                <>
                    <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <OpdTahunNull />
                    </div>
                </>
            )
        }
    }

    return (
        <div>
            {tipe === 'opd' &&
                <div className="flex items-center justify-between px-5 py-2">
                    <ButtonSky onClick={() => handleModalNewTujuan()}>
                        <TbCirclePlus className="mr-1" />
                        Tambah Tujuan OPD
                    </ButtonSky>
                </div>
            }
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Urusan & Bidang Urusan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Tujuan OPD</th>
                            {tipe === 'opd' &&
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                            }
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Definisi Operasional</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Rumus Perhitungan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Sumber Data</th>
                            {tahun_list.map((item: any) => (
                                <th key={item} colSpan={2} className="border-l border-b px-6 py-3 min-w-[100px]">{item}</th>
                            ))}
                        </tr>
                        <tr className="bg-emerald-500 text-white">
                            {tahun_list.map((item: any) => (
                                <React.Fragment key={item}>
                                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ?
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            Tujuan.map((data: tujuan, index: number) => {

                                const TotalRow = data.tujuan_opd.reduce((total, item) => total + (item.indikator.length === 0 ? 1 : item.indikator.length), 0) + data.tujuan_opd.length + 1;

                                return (
                                    // URUSAN DAN BIDANG URUSAN
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td className="border-x border-b border-emerald-500 px-6 py-4 text-center" rowSpan={TotalRow}>{index + 1}</td>
                                            <td className="border-x border-b border-emerald-500 px-6 py-6" rowSpan={TotalRow}>
                                                <div className="flex flex-col gap-2">
                                                    <p className="border-b border-emerald-500 pb-2">{data.urusan ? `${data.kode_urusan} - ${data.urusan}` : "-"}</p>
                                                    <p>{data.kode_bidang_urusan ? `${data.kode_bidang_urusan} - ${data.nama_bidang_urusan}` : "-"}</p>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* TUJUAN DAN AKSI */}
                                        {data.tujuan_opd.map((item: TujuanOpd) => (
                                            <React.Fragment key={item.id_tujuan_opd}>
                                                <tr>
                                                    <td className="border-x border-b border-emerald-500 px-6 py-6 h-full" rowSpan={item.indikator.length !== 0 ? item.indikator.length + 1 : 2}>
                                                        <p className="flex min-h-[100px] bg-white items-center">
                                                            {item.tujuan || "-"}
                                                        </p>
                                                    </td>
                                                    {tipe === 'opd' &&
                                                        <td className="border-x border-b border-emerald-500 px-6 py-6" rowSpan={item.indikator.length !== 0 ? item.indikator.length + 1 : 2}>
                                                            <div className="flex flex-col justify-center items-center gap-2">
                                                                <ButtonGreen
                                                                    className="flex items-center gap-1 w-full"
                                                                    onClick={() => handleModalEditTujuan(item.id_tujuan_opd)}
                                                                >
                                                                    <TbPencil />
                                                                    Edit
                                                                </ButtonGreen>
                                                                <ButtonRed className="flex items-center gap-1 w-full" onClick={() => {
                                                                    AlertQuestion("Hapus?", "Hapus Tujuan Pemda yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                        if (result.isConfirmed) {
                                                                            hapusTujuanOpd(item.id_tujuan_opd);
                                                                        }
                                                                    });
                                                                }}>
                                                                    <TbTrash />
                                                                    Hapus
                                                                </ButtonRed>
                                                            </div>
                                                        </td>
                                                    }
                                                </tr>
                                                {/* INDIKATOR */}
                                                {item.indikator.length === 0 ? (
                                                    <React.Fragment>
                                                        <tr>
                                                            <td colSpan={30} className="border-x border-b border-emerald-500 px-6 py-6 bg-yellow-500 text-white">indikator tujuan opd belum di tambahkan</td>
                                                        </tr>
                                                    </React.Fragment>
                                                ) : (
                                                    item.indikator.map((i: Indikator) => (
                                                        <tr key={i.id}>
                                                            <td className="border-x border-b border-emerald-500 px-6 py-6">{i.indikator || "-"}</td>
                                                            <td className="border-x border-b border-emerald-500 px-6 py-6">{i.definisi_operasional || "-"}</td>
                                                            <td className="border-x border-b border-emerald-500 px-6 py-6">{i.rumus_perhitungan || "-"}</td>
                                                            <td className="border-x border-b border-emerald-500 px-6 py-6">{i.sumber_data || "-"}</td>
                                                            {i.target.map((t: Target) => (
                                                                <React.Fragment key={t.id}>
                                                                    <td className="border-x border-b border-emerald-500 px-6 py-6 text-center">{t.target || "-"}</td>
                                                                    <td className="border-x border-b border-emerald-500 px-6 py-6 text-center">{t.satuan || "-"}</td>
                                                                </React.Fragment>
                                                            ))}
                                                        </tr>
                                                    ))
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                </table>
                {/* MODAL EDIT TUJUAN */}
                <ModalTujuanOpd
                    metode="baru"
                    kode_opd={User?.roles == 'super_admin' ? SelectedOpd?.value : User?.kode_opd}
                    tahun={Tahun?.value}
                    tahun_list={tahun_list}
                    periode={id_periode}
                    isOpen={isOpenNewTujuan}
                    onClose={() => handleModalNewTujuan()}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
                {/* MODAL EDIT TUJUAN */}
                <ModalTujuanOpd
                    metode="lama"
                    kode_opd={User?.roles == 'super_admin' ? SelectedOpd?.value : User?.kode_opd}
                    id={IdTujuan}
                    tahun={Tahun?.value}
                    tahun_list={tahun_list}
                    periode={id_periode}
                    isOpen={isOpenEditTujuan}
                    onClose={() => handleModalEditTujuan(0)}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
            </div>
        </div>
    )
}

export default Table;
