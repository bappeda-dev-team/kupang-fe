'use client'

import { ButtonRed, ButtonGreen } from "@/components/global/Button";
import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getOpdTahun } from "@/components/lib/Cookie";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken } from "@/components/lib/Cookie";

interface tematik {
    id: number;
    parent: number;
    pernyataan_kondisi_strategis: string;
    alasan_sebagai_kondisi_strategis: string;
    data_terukur_pendukung_pernyataan: string;
    kondisi_terukur_yang_diharapkan: string;
    kondisi_yang_ingin_diwujudkan: string;
    tema: string;
    keterangan: string;
    indikator: indikator[];
}
interface indikator {
    id_indikator: string;
    nama_indikator: string;
    targets: target[];
}
type target = {
    id_target: string;
    target: string;
    satuan: string;
};

const Table = () => {

    const [Tematik, setTematik] = useState<tematik[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
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
        const fetchTematik = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/pohon_kinerja_admin/findall/${Tahun?.value}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data.tematiks;
                if (data == null) {
                    setDataNull(true);
                    setTematik([]);
                } else if (data.code == 500) {
                    setError(true);
                    setTematik([]);
                } else {
                    setDataNull(false);
                    setTematik(data);
                }
                setTematik(data);
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        if (Tahun?.value != undefined) {
            fetchTematik();
        }
    }, [Tahun, token]);

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Reload Halaman, Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if (Tahun?.value == undefined) {
        return <TahunNull />
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-sky-700 text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Peryataan kondisi strategis (Isu Strategis)</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Alasan Sebagai Kondisi Strategis</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Data Terukur Pendukung Pernyataan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Kondisi Terukur Yang Diharapkan (Tema)</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Keterangan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Target/Satuan</th>
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
                            Tematik.map((data, index) => (
                                <tr key={data.id}>
                                    <td className="border-r border-b bg-yellow-50 px-6 py-4 text-center">{index + 1}</td>
                                    <td className="border-r border-b bg-yellow-50 px-6 py-4 text-center italic">{data.pernyataan_kondisi_strategis || "dalam pengembangan"}</td>
                                    <td className="border-r border-b bg-yellow-50 px-6 py-4 text-center italic">{data.alasan_sebagai_kondisi_strategis || "dalam pengembangan"}</td>
                                    <td className="border-r border-b bg-yellow-50 px-6 py-4 text-center italic">{data.data_terukur_pendukung_pernyataan || "dalam pengembangan"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.tema || "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.keterangan ? data.keterangan : "-"}</td>
                                    {data.indikator ?
                                        <>
                                            <td className="border-r border-b px-6 py-4 text-center">
                                                {data.indikator.map((item: indikator) => (
                                                    <p key={item.id_indikator}>{item.nama_indikator}</p>
                                                ))}
                                            </td>
                                            <td className="border-r border-b px-6 py-4 text-center">
                                                {data.indikator.map((item: indikator) => (
                                                    item.targets.map((t: target) => (
                                                        <p key={t.id_target}>{t.target} / {t.satuan}</p>
                                                    ))
                                                ))}
                                            </td>
                                        </>
                                        :
                                        <>
                                            <td className="border-r border-b px-6 py-4 text-center">-</td>
                                            <td className="border-r border-b px-6 py-4 text-center">-</td>
                                        </>
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;