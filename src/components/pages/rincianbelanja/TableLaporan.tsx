'use client'

import React, { useEffect, useState } from "react";
import { ButtonBlackBorder, ButtonGreen, ButtonGreenBorder, ButtonSky, ButtonSkyBorder } from "@/components/global/Button";
import { TbEye, TbBook, TbKeyFilled, TbPencil, TbPrinter, TbReceipt } from "react-icons/tb";
import { ModalIndikator } from "../Pohon/ModalIndikator";
import { getToken } from "@/components/lib/Cookie";
import { OpdTahunNull, TahunNull } from "@/components/global/OpdTahunNull";
import { LoadingClip } from "@/components/global/Loading";

interface TableLaporan {
    tahun: string;
    kode_opd: string;
    nama_opd?: string;
    nip?: string;
    role: string;
}
interface Target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}

interface IndikatorSubKegiatan {
    id_indikator: string;
    kode_subkegiatan: string;
    kode_opd: string;
    nama_indikator: string;
    targets: Target[];
}
interface IndikatorRencanaKinerja {
    id_indikator: string;
    rencana_kinerja_id: string;
    nama_indikator: string;
    targets: Target[];
}

interface RencanaAksi {
    renaksi_id: string;
    renaksi: string;
    anggaran: number;
}

interface RincianBelanja {
    index: string;
    rencana_kinerja_id: string;
    rencana_kinerja: string;
    pegawai_id: string | null;
    nama_pegawai: string | null;
    indikator: IndikatorRencanaKinerja[];
    total_anggaran: number;
    rencana_aksi: RencanaAksi[] | null;
}

interface LaporanRincianBelanja {
    kode_opd: string;
    kode_subkegiatan: string;
    nama_subkegiatan: string;
    indikator_subkegiatan: IndikatorSubKegiatan[];
    total_anggaran: number;
    rincian_belanja: RincianBelanja[];
}

export const TableLaporan: React.FC<TableLaporan> = ({ tahun, kode_opd, nama_opd, nip, role }) => {

    const [Laporan, setLaporan] = useState<LaporanRincianBelanja[]>([]);

    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);

    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchLaporan = async (url: string) => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/${url}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                const result = await response.json();
                const data = result.data;
                if (result.code === 200 || result.code === 201) {
                    if (data === null) {
                        setLaporan([]);
                        setDataNull(true);
                        setError(false);
                    } else {
                        setLaporan(data);
                        setDataNull(false);
                        setError(false);
                    }
                } else {
                    setDataNull(false);
                    setError(true);
                }
            } catch (err) {
                setDataNull(false);
                setError(true);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (role != undefined) {
            if (role == 'super_admin' || role == 'admin_opd' || role == 'reviewer') {
                fetchLaporan(`rincian_belanja/laporan?kode_opd=${kode_opd}&tahun=${tahun}`)
            } else {
                fetchLaporan(`rincian_belanja/pegawai/${nip}/${tahun}`)
            }
        } else {
            setError(true);
        }
    }, [role, kode_opd, nip, tahun, token]);

    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }

    if (Loading) {
        return (
            <div className="w-full border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="w-full border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if (tahun == undefined) {
        return <TahunNull />
    } else if (role == 'super_admin' || role == 'reviewer') {
        if (kode_opd == undefined) {
            return (
                <>
                    <div className="w-full flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <OpdTahunNull />
                    </div>
                </>
            )
        }
    }

    return (
        <div className="overflow-auto m-3 rounded-t-xl border w-full">
            <table className="w-full">
                <thead className="bg-green-500 text-white">
                    <tr>
                        <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                        <th className="border-r border-b px-6 py-3 min-w-[200px]">Pemilik</th>
                        <th className="border-r border-b px-6 py-3 min-w-[300px]">Rencana Kinerja</th>
                        <th className="border-r border-b px-6 py-3 min-w-[300px]">Indikator Kinerja</th>
                        <th className="border-r border-b px-6 py-3 min-w-[100px]">Target/Satuan</th>
                        <th className="border-r border-b px-6 py-3 min-w-[170px]">Anggaran</th>
                    </tr>
                </thead>
                {DataNull ?
                    <tbody>
                        <tr>
                            <td className="px-6 py-3" colSpan={30}>
                                Data Kosong / Belum Ditambahkan
                            </td>
                        </tr>
                    </tbody>
                    :
                    Laporan.map((data: LaporanRincianBelanja, index: number) => (
                        <tbody key={index}>
                            <tr className="bg-emerald-100 text">
                                <td className="border-r border-b px-6 py-4">{index + 1}</td>
                                <td colSpan={2} className="border-r border-b px-6 py-4">Sub Kegiatan: {data.nama_subkegiatan || "-"} ({data.kode_subkegiatan || "tanpa kode"})</td>
                                {data.indikator_subkegiatan === null ?
                                    <React.Fragment>
                                        <td className="border-r border-b px-6 py-4 text-center">-</td>
                                        <td className="border-r border-b px-6 py-4 text-center">-</td>
                                    </React.Fragment>
                                    :
                                    data.indikator_subkegiatan.map((i: IndikatorSubKegiatan, index_isk: number) => (
                                        <React.Fragment key={index_isk}>
                                            <td className="border-r border-b px-6 py-4">{i.nama_indikator || "-"}</td>
                                            {i.targets.map((t: Target, index_target: number) => (
                                                <React.Fragment key={index_target}>
                                                    <td className="border-r border-b px-6 py-4 text-center">{t.target || "-"} {t.satuan || "-"}</td>
                                                </React.Fragment>
                                            ))}
                                        </React.Fragment>
                                    ))
                                }
                                <td className="border-r border-b px-6 py-4">Rp.{formatRupiah(data.total_anggaran)}</td>
                            </tr>
                            {data.rincian_belanja.map((rekin: RincianBelanja, index_rb: number) => (
                                <React.Fragment key={index_rb}>
                                    <tr>
                                        <td rowSpan={rekin.indikator ? rekin.indikator.length : 2} className="border-r border-b px-6 py-4">{index + 1}.{index_rb + 1}</td>
                                        <td rowSpan={rekin.indikator ? rekin.indikator.length : 2} className="border-r border-b px-6 py-4">{rekin.nama_pegawai || "-"}</td>
                                        <td rowSpan={rekin.indikator ? rekin.indikator.length : 2} className="border-r border-b px-6 py-4">{rekin.rencana_kinerja || "-"}</td>
                                        {/* Kolom indikator pertama */}
                                        {rekin.indikator === null ? (
                                            <React.Fragment>
                                                <td className="border-r border-b px-6 py-4">-</td>
                                                <td className="border-r border-b px-6 py-4 text-center">-</td>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <td className="border-r border-b px-6 py-4">{rekin.indikator[0].nama_indikator || "-"}</td>
                                                {rekin.indikator[0].targets.length === 0 || rekin.indikator[0].targets === null ? (
                                                    <td className="border-r border-b px-6 py-4 text-center">-</td>
                                                ) : (
                                                    rekin.indikator[0].targets.map((t: Target, index_t: number) => (
                                                        <td key={t.id_target || index_t} className="border-r border-b px-6 py-4 text-center">{t.target || "-"} {t.satuan || "-"}</td>
                                                    ))
                                                )}
                                            </React.Fragment>
                                        )}
                                        <td rowSpan={rekin.indikator ? rekin.indikator.length : 2} className="border-r border-b px-6 py-4">Rp.{formatRupiah(rekin.total_anggaran || 0)}</td>
                                    </tr>
                                    {/* Baris-baris untuk indikator selanjutnya */}
                                    {rekin.indikator ?
                                        rekin.indikator.slice(1).map((i: IndikatorRencanaKinerja, index_i) => (
                                            <tr key={i.id_indikator || index_i}>
                                                <td className="border-r border-b px-6 py-4">{i.nama_indikator || "-"}</td>
                                                {i.targets.length === 0 || i.targets === null ? (
                                                    <td className="border-r border-b px-6 py-4 text-center">-</td>
                                                ) : (
                                                    i.targets.map((t: Target, index_t: number) => (
                                                        <td key={t.id_target || index_t} className="border-r border-b px-6 py-4 text-center">{t.target || "-"} {t.satuan || "-"}</td>
                                                    ))
                                                )}
                                            </tr>
                                        ))
                                        :
                                            <tr>
                                                <td className="border-r border-b px-6 py-4">-</td>
                                                <td className="border-r border-b px-6 py-4 text-center">-</td>
                                            </tr>
                                    }
                                    {rekin.rencana_aksi === null ?
                                        <tr>
                                            <td colSpan={5} className="border-r border-b px-6 py-4 text-red-500">Renaksi Belum di tambahkan di rencana kinerja</td>
                                            <td className="border-r border-b px-6 py-4">Rp.0</td>
                                        </tr>
                                        :
                                        rekin.rencana_aksi.map((renaksi: RencanaAksi, index_renaksi: number) => (
                                            <tr key={renaksi.renaksi_id || index_renaksi}>
                                                <td colSpan={5} className="border-r border-b px-6 py-4">Renaksi {index_renaksi + 1}: {renaksi.renaksi}</td>
                                                <td className="border-r border-b px-6 py-4">Rp.{formatRupiah(renaksi.anggaran || 0)}</td>
                                            </tr>
                                        ))
                                    }
                                </React.Fragment>
                            ))}
                        </tbody>
                    ))
                }
            </table>
        </div>
    )
}