'use client'

import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { OpdNull, TahunNull } from "@/components/global/OpdTahunNull";
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";
import { ButtonBlackBorder } from "@/components/global/Button";
import { TbFileDatabase } from "react-icons/tb";

interface Table {
    tahun: number;
}

interface Pokin {
    kode_opd: string;
    nama_opd: string;
    tematik: Tematik[];
    persentase_cascading: string;
}
interface Tematik {
    nama: string;
}

const Table: React.FC<Table> = ({ tahun }) => {

    const [Data, setData] = useState<Pokin[]>([]);
    const [Error, setError] = useState<boolean | null>(null);

    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();
    const { branding } = useBrandingContext();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchIkuOpd = async () => {
            setLoading(true);
            setError(false);
            try {
                const response = await fetch(`${API_URL}/pohon_kinerja_opd/leaderboard_pokin_opd/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                if (result.code === 200) {
                    setData(result.data);
                } else if (result.code === 401) {
                    if (process.env.NEXT_PUBLIC_DISABLE_AUTH !== "true") {
                        window.location.href = "/login";
                    }
                } else {
                    setData([]);
                    setError(true);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        if (tahun != undefined) {
            fetchIkuOpd();
        }
    }, [token, tahun]);

    const clonePokinRekin = async (kode_opd: string) => {
        const payload = {
            //key : value
            kode_opd: kode_opd,
            tahun_sumber: String(tahun),
            tahun_tujuan: String(tahun + 1),
        };
        console.log(payload);
        AlertNotification("Dalam Pengembangan", "", "info", 3000);
        // try {
        //     setProses(true);
        //     const response = await fetch(`${branding?.api_perencanaan}/clone`, {
        //         method: "POST",
        //         headers: {
        //             Authorization: `${token}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(payload),
        //     });
        //     const result = await response.json();
        //     if (result.code === 200 || result.code === 201) {
        //         AlertNotification("Berhasil", "Berhasil Clone Pokin", "success", 1000);
        //     } else {
        //         AlertNotification(`Gagal`, `${result.data}`, "error", 2000);
        //         console.log(result);
        //     }
        // } catch (err) {
        //     AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        // } finally {
        //     setProses(false);
        // }
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
    } else if (branding?.tahun?.value === undefined) {
        return <TahunNull />
    } else {
        return (
            <>
                <div className="overflow-auto m-2 rounded-t-xl border w-full">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-orange-500 text-white">
                                <th className="border-r border-b px-6 py-3 text-center">No</th>
                                <th className="border-r border-b px-6 py-3 w-[350px]">Perangkat Daerah</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Tema</th>
                                <th className="border-r border-b px-6 py-3 w-[100px]">Persentase Cascading</th>
                                <th className="border-r border-b px-6 py-3 w-[100px]">Aksi</th>
                            </tr>
                            <tr className="bg-orange-700 text-white">
                                <th className="border-r border-b px-2 py-1 text-center">1</th>
                                <th className="border-r border-b px-2 py-1 text-center">2</th>
                                <th className="border-r border-b px-2 py-1 text-center">3</th>
                                <th className="border-r border-b px-2 py-1 text-center">4</th>
                                <th className="border-r border-b px-2 py-1 text-center">5</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!Data || Data.length === 0) ?
                                <tr>
                                    <td className="px-6 py-3" colSpan={30}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                                :
                                Data.map((item: Pokin, index: number) => (
                                    <tr key={index}>
                                        <td className="border-x border-b border-orange-500 py-4 px-3 text-center">
                                            {index + 1}
                                        </td>
                                        <td className="border-r border-b border-orange-500 px-6 py-4">
                                            {item.nama_opd || "-"}
                                        </td>
                                        <td className="border-r border-b border-orange-500 px-6 py-4">
                                            {item.tematik ?
                                                item.tematik.map((t: Tematik, index_tematik: number) => (
                                                    <div key={index_tematik} className="flex items-center">
                                                        <p className="py-1 px-2 my-2 bg-emerald-600 text-white rounded-lg">{t.nama || "tematik tanpa nama"}</p>
                                                    </div>
                                                ))
                                                :
                                                <p>-</p>
                                            }
                                        </td>
                                        <td className="border-r border-b font-bold border-orange-500 px-6 py-4 text-center">
                                            {item.persentase_cascading || "0%"}
                                        </td>
                                        <td className="border-r border-b font-bold border-orange-500 px-6 py-4 text-center">
                                            <div className="flex items-center-gap-1">
                                                {item.persentase_cascading === "100%" &&
                                                    <ButtonBlackBorder 
                                                        className="flex items-center gap-1"
                                                        disabled={Proses}
                                                        onClick={() => AlertQuestion("Clone Pokin", `Clone Pokin ke ${branding?.tahun?.value}?`, "question", "Clone", "Batal").then((resp) => {
                                                            if(resp.isConfirmed){
                                                                clonePokinRekin(item.kode_opd);
                                                            }
                                                        })}
                                                    >
                                                        <TbFileDatabase />
                                                        Clone
                                                    </ButtonBlackBorder>
                                                }
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
}

export default Table;
