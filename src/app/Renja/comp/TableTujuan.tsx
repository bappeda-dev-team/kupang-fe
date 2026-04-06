'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { ButtonSkyBorder, ButtonGreenBorder, ButtonRedBorder } from "@/components/global/Button";
import { useBrandingContext } from "@/context/BrandingContext";
import { useRouter } from "next/navigation";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { ModalIndikatorRenja, ModalEditIndikatorRenja } from "./ModalIndikatorRenja";
import { TbCirclePlus, TbPencil, TbTrash } from "react-icons/tb";

interface Target {
    id: string;
    indikator_id: string;
    tahun: string;
    target: string;
    satuan: string;
}

interface Indikator {
    id: string;
    kode_indikator: string;
    id_tujuan_opd: number;
    indikator: string;
    definisi_operasional: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: Target[];
}

interface TujuanOpd {
    id_tujuan_opd: number;
    tujuan: string;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    indikator: Indikator[];
}

interface Tujuan {
    kode_urusan: string;
    urusan: string;
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
    kode_opd: string;
    nama_opd: string;
    tujuan_opd: TujuanOpd[];
}

interface Table {
    kode_opd: string;
    tahun: string;
    menu: "ranwal" | "rankhir" | "penetapan";
}

const TableTujuan: React.FC<Table> = ({ kode_opd, tahun, menu }) => {

    const { branding } = useBrandingContext();
    const [Data, setData] = useState<Tujuan[]>([]);
    const [Error, setError] = useState<boolean | null>(null);

    const [ModalTambahIndikator, setModalTambahIndikator] = useState<boolean>(false);
    const [ModalEditIndikator, setModalEditIndikator] = useState<boolean>(false);
    const [DataEdit, setDataEdit] = useState<Indikator | null>(null);
    const [IdTujuan, setIdTujuan] = useState<number>(0);

    const [Loading, setLoading] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();
    const router = useRouter();

    useEffect(() => {
        const fetchTujuan = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${branding?.api_perencanaan}/tujuan_opd/${menu}/${kode_opd}/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                if (result.code === 200) {
                    setData(result.data);
                    setError(false);
                } else if (result.code === 401) {
                    AlertNotification("Login Kembali", "", "warning", 2000);
                    if (process.env.NEXT_PUBLIC_DISABLE_AUTH !== "true") {
                        router.push('/login');
                    }
                } else {
                    setData([]);
                    setError(true);
                    AlertNotification("Error", `${result.data || `error saat mengambil data ${menu} tujuan opd`}`, "warning", 2000);
                }
            } catch (err) {
                AlertNotification("Error", `${err}`, "warning", 2000);
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        fetchTujuan();
    }, [kode_opd, tahun, token, router, FetchTrigger])

    const handleFetchTrigger = () => { setFetchTrigger((prev) => !prev) }
    const handleTambahIndikator = (tujuan_id: number) => {
        if (ModalTambahIndikator) {
            setModalTambahIndikator(false);
            setIdTujuan(tujuan_id);
        } else {
            setModalTambahIndikator(true);
            setIdTujuan(tujuan_id);
        }
    }
    const handleEditIndikator = (Data: Indikator | null) => {
        if (ModalEditIndikator) {
            setModalEditIndikator(false);
            setDataEdit(Data);
        } else {
            setModalEditIndikator(true);
            setDataEdit(Data);
        }
    }
    const hapusIndikator = async (kode_indikator: string) => {
        try {
            setProses(true);
            const response = await fetch(`${branding?.api_perencanaan}/tujuan_opd/renja/indikator/delete/${kode_indikator}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            AlertNotification("Berhasil", "Indikator Berhasil Dihapus", "success", 1000);
            handleFetchTrigger();
        } catch (err) {
            AlertNotification("Gagal", `${err}`, "error", 2000);
            console.log(err);
        } finally {
            setProses(false);
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
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="text-xm bg-emerald-500 text-white">
                            <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Urusan & Bidang Urusan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">Tujuan OPD</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px] text-center">Aksi</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Indikator</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Definisi Operasional</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Rumus Perhitungan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Sumber Data</td>
                            <th colSpan={2} className="border-l border-b px-6 py-3 min-w-[100px]">{branding?.tahun?.value || 0}</th>
                        </tr>
                        <tr className="bg-emerald-500 text-white">
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Data.length == 0 ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={13}>
                                    Tidak ada User / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            Data.map((item: Tujuan, index: number) => {
                                const TotalRow = item.tujuan_opd.reduce((total, item) => total + (item.indikator.length === 0 ? 1 : item.indikator.length), 0) + item.tujuan_opd.length + 1;
                                return (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td rowSpan={TotalRow} className="border-x border-b border-emerald-500 py-4 px-3 text-center">
                                                {index + 1}
                                            </td>
                                            <td rowSpan={TotalRow} className="border-r border-b border-emerald-500 px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <p className="border-b border-emerald-500 pb-2">{item.urusan ? `${item.kode_urusan} - ${item.urusan}` : "-"}</p>
                                                    <p>{item.kode_bidang_urusan ? `${item.kode_bidang_urusan} - ${item.nama_bidang_urusan}` : "-"}</p>
                                                </div>
                                            </td>
                                        </tr>
                                        {item.tujuan_opd.map((item: TujuanOpd) => (
                                            <React.Fragment key={item.id_tujuan_opd}>
                                                <tr>
                                                    <td className="border-x border-b border-emerald-500 px-6 py-6 h-full" rowSpan={item.indikator.length !== 0 ? item.indikator.length + 1 : 2}>
                                                        <p className="flex min-h-[100px] bg-white items-center">
                                                            {item.tujuan || "-"}
                                                        </p>
                                                    </td>
                                                    <td className="border-x border-b border-emerald-500 px-6 py-6 h-full" rowSpan={item.indikator.length !== 0 ? item.indikator.length + 1 : 2}>
                                                        <div className="flex justify-center">
                                                            <ButtonSkyBorder
                                                                className="flex items-center gap-1"
                                                                onClick={() => handleTambahIndikator(item.id_tujuan_opd)}
                                                            >
                                                                <TbCirclePlus />
                                                                Indikator
                                                            </ButtonSkyBorder>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* INDIKATOR */}
                                                {item.indikator.length === 0 ? (
                                                    <React.Fragment>
                                                        <tr>
                                                            <td colSpan={30} className="border-x border-b border-emerald-500 px-6 py-6 bg-yellow-500 text-white">indikator tujuan belum di tambahkan</td>
                                                        </tr>
                                                    </React.Fragment>
                                                ) : (
                                                    item.indikator.map((i: Indikator) => (
                                                        <tr key={i.id}>
                                                            <td className="border-x border-b border-emerald-500 px-6 py-6">
                                                                <div className="flex flex-col gap-2">
                                                                    <p>{i.indikator || "-"}</p>
                                                                    <div className="flex items-center justify-center gap-1 pt-2 border-t border-gray-300">
                                                                        <ButtonGreenBorder
                                                                            onClick={() => handleEditIndikator(i)}
                                                                            className="rounded-full"
                                                                        >
                                                                            <TbPencil />
                                                                        </ButtonGreenBorder>
                                                                        <ButtonRedBorder
                                                                            onClick={() => AlertQuestion("Hapus", "Hapus Indikator ini?", "question", "Hapus", "Batal").then((resp) => {
                                                                                if (resp.isConfirmed) {
                                                                                    hapusIndikator(i.kode_indikator);
                                                                                }
                                                                            })}
                                                                        >
                                                                            <TbTrash />
                                                                        </ButtonRedBorder>
                                                                    </div>
                                                                </div>
                                                            </td>
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
                {ModalTambahIndikator &&
                    <ModalIndikatorRenja
                        isOpen={ModalTambahIndikator}
                        onClose={() => handleTambahIndikator(0)}
                        onSuccess={() => handleFetchTrigger()}
                        tujuan_id={String(IdTujuan)}
                        tahun={tahun}
                        jenis="tujuan_opd"
                        menu={menu}
                    />
                }
                {ModalEditIndikator &&
                    <ModalEditIndikatorRenja
                        isOpen={ModalEditIndikator}
                        onClose={() => handleEditIndikator(null)}
                        onSuccess={() => handleFetchTrigger()}
                        Data={DataEdit}
                        jenis="tujuan_opd"
                        menu={menu}
                    />
                }
            </div>
        </>
    )
}

export default TableTujuan;
