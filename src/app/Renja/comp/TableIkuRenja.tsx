'use client'

import React, { useEffect, useState } from "react";
import { ButtonBlackBorder } from "@/components/global/Button";
import { TbMistOff, TbCircleCheck, TbCircleX, TbMist } from "react-icons/tb";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { useBrandingContext } from "@/context/BrandingContext";
import { useRouter } from "next/navigation";

interface IKU {
    indikator_id: string;
    asal_iku: string;
    sumber: string;
    is_active: boolean;
    iku_active: boolean;
    definisi_operasional: string;
    rumus_perhitungan: string;
    sumber_data: string;
    indikator: string;
    created_at: string;
    target: Target[];
}

interface Target {
    target: string;
    satuan: string;
}

interface table {
    kode_opd: string;
    tahun: number;
    menu: "ranwal" | "rankhir" | "penetapan";
}

const TableIkuRenja: React.FC<table> = ({ tahun, kode_opd, menu }) => {

    const { branding } = useBrandingContext();
    const router = useRouter();
    const Tahun = branding?.tahun ? branding?.tahun?.value : 0;
    const [IKU, setIKU] = useState<IKU[]>([]);

    const [TableAktif, setTableAktif] = useState<boolean>(true);
    const [TableNonAktif, setTableNonAktif] = useState<boolean>(false);

    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);

    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const fetchIkuRenja = async () => {
            setLoading(true);
            setError(false);
            setDataNull(false);
            try {
                const response = await fetch(`${branding?.api_perencanaan}/iku_renja_opd/${menu}/${kode_opd}/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                if (result.code === 200) {
                    setIKU(result.data);
                    setError(false);
                } else if (result.code === 401) {
                    AlertNotification("Login Kembali", "", "warning", 2000);
                    if (process.env.NEXT_PUBLIC_DISABLE_AUTH !== "true") {
                        router.push('/login');
                    }
                } else {
                    setIKU([]);
                    setError(true);
                    AlertNotification("Error", `${result.data || `error saat mengambil data ${menu} tujuan opd`}`, "warning", 2000);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        if (Tahun != undefined) {
            fetchIkuRenja();
        }
    }, [token, Tahun, kode_opd, TableNonAktif, TableAktif]);

    const UpdateStatusIku = async (id: string,) => {
        const formData = {
            indikator_id: id,
            is_active: !TableAktif,
        }
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${branding?.api_perencanaan}/indikator_utama/opd/status/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "berhasil mengubah status IKU", "success");
                setIKU(IKU.filter((data) => (data.indikator_id !== id)));
            } else {
                console.error(result.data);
                AlertNotification("Gagal", `${result.data}`, "error");
            }
        } catch (err) {
            console.error(err);
            AlertNotification("Gagal", `cek koneksi internet/database server, error catch`, "error");
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
                <h1 className="text-red-500 font-bold mx-5 py-5">Error, Periksa koneksi internet atau database server, jika error berlanjut silakan hubungi tim developer</h1>
            </div>
        )
    }

    return (
        <>
            <div className="flex px-3 py-2 justify-center items-center gap-1">
                <button
                    className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg w-full cursor-pointer 
                        ${TableAktif ? "bg-emerald-500 text-white" : "border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"}
                    `}
                    onClick={() => {
                        setTableAktif(true);
                        setTableNonAktif(false);
                    }}
                >
                    <TbCircleCheck />
                    IKU yang aktif
                </button>
                <button
                    className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg w-full cursor-pointer 
                        ${TableNonAktif ? "bg-orange-500 text-white" : "border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"}
                    `}
                    onClick={() => {
                        setTableAktif(false);
                        setTableNonAktif(true);
                    }}
                >
                    <TbCircleX />
                    IKU yang tidak aktif
                </button>
            </div>
            <div className="overflow-auto mx-2 mb-3 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className={`${TableAktif ? "bg-emerald-500" : "bg-orange-500"} text-white`}>
                            <th className="border-r border-b px-6 py-3 text-center">No</th>
                            <th colSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Indikator Utama</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Rumus Perhitungan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Sumber Data</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">{tahun || ""}</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
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
                            IKU.map((item, index) => (
                                <tr key={item.indikator_id || index}>
                                    <td className={`border-x border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} py-4 px-3 text-center`}>
                                        {index + 1}
                                    </td>
                                    <td className={`border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} px-6 py-4`}>
                                        <p>{item.indikator || "-"}</p>
                                        <p className={`text-gray-500 text-xs`}>({item.asal_iku || "-"})</p>
                                        <p className={`text-red-500 text-xs`}>{item.is_active === false ? "(Tematik tidak aktif)" : ""}</p>
                                    </td>
                                    <td className={`border-r border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} pr-6`}>
                                        <div className={`flex flex-col justify-center items-center gap-2`}>
                                            <ButtonBlackBorder
                                                disabled={Proses}
                                                className={`flex items-center gap-1 w-full text-sm`}
                                                onClick={() => {
                                                    if (TableAktif) {
                                                        AlertQuestion("Non Aktifkan IKU?", "", "question", "NonAktifkan", "Batal").then((result) => {
                                                            if (result.isConfirmed) {
                                                                UpdateStatusIku(item.indikator_id);
                                                            }
                                                        });
                                                    } else {
                                                        AlertQuestion("Aktifkan IKU?", "", "question", "Aktifkan", "Batal").then((result) => {
                                                            if (result.isConfirmed) {
                                                                UpdateStatusIku(item.indikator_id);
                                                            }
                                                        });
                                                    }
                                                }}
                                            >
                                                {TableAktif ?
                                                    <>
                                                        <TbMistOff />
                                                        NonAktifkan
                                                    </>
                                                    :
                                                    <>
                                                        <TbMist />
                                                        Aktifkan
                                                    </>
                                                }
                                            </ButtonBlackBorder>
                                        </div>
                                    </td>
                                    <td className={`border-r border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} px-6 py-4`}>
                                        {item.definisi_operasional || "-"}
                                    </td>
                                    <td className={`border-r border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} px-6 py-4`}>
                                        {item.rumus_perhitungan || "-"}
                                    </td>
                                    <td className={`border-r border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} px-6 py-4`}>
                                        {item.sumber_data || "-"}
                                    </td>
                                    {item.target.map((t: Target, index: number) => (
                                        <React.Fragment key={index}>
                                            <td className={`border-r border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} px-6 py-4 text-center`}>
                                                {t.target || "-"}
                                            </td>
                                            <td className={`border-r border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} px-6 py-4 text-center`}>
                                                {t.satuan || "-"}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default TableIkuRenja;
