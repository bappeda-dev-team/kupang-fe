'use client'

import React, { useEffect, useState } from "react";
import { ButtonBlackBorder } from "@/components/global/Button";
import { TbEye } from "react-icons/tb";
import { ModalIndikator } from "../Pohon/ModalIndikator";
import { ModalAnggaran } from "./ModalAnggaran";
import { getToken } from "@/components/lib/Cookie";
import { LoadingClip } from "@/components/global/Loading";

interface TableAsn {
    tahun: string;
    nip: string;
}
interface TableRekinAsn {
    renaksi: Renaksi[];
    fetchTrigger: () => void;
}

interface Rincian {
    pegawai_id: string;
    nama_pegawai: string;
    kode_subkegiatan: string;
    indikator_subkegiatan: indikator[];
    nama_subkegiatan: string;
    total_anggaran: number;
    rincian_belanja: RincianBelanja[];
}
interface RincianBelanja {
    rencana_kinerja: string;
    rencana_aksi: Renaksi[];
    indikator: indikator[];
    total_anggaran: number;
}
interface Renaksi {
    renaksi_id: string;
    renaksi: string;
    anggaran: number;
}
interface indikator {
    id_indikator: string;
    id_rekin: string;
    kode: string;
    nama_indikator: string;
    targets: target[];
}
interface target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}

export const TableAsn: React.FC<TableAsn> = ({ tahun, nip }) => {

    const [Rincian, setRincian] = useState<Rincian[]>([]);
    const [ShowRekin, setShowRekin] = useState<boolean>(true);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const [OpenModalIndikator, setOpenModalIndikator] = useState<boolean>(false);
    const [Isi, setIsi] = useState<string>('');
    const [DataIndikator, setDataIndikator] = useState<indikator[]>([]);

    //HANDLE
    const [Loading, setLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchRincianBelanja = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/rincian_belanja/asn/${nip}/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                const result = await response.json();
                const data = result.data;
                if (data === null) {
                    setDataNull(true);
                    setRincian([]);
                } else {
                    setDataNull(false);
                    setRincian(data);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        if (tahun != undefined && nip != undefined) {
            fetchRincianBelanja();
        }
    }, [tahun, nip, token, FetchTrigger]);

    const handleShowRekin = () => {
        if (ShowRekin) {
            setShowRekin(false);
        } else {
            setShowRekin(true);
        }
    }
    const handleModalIndikator = (isi: string, indikator: indikator[]) => {
        if (OpenModalIndikator) {
            setOpenModalIndikator(false);
            setIsi('');
            setDataIndikator([]);
        } else {
            setOpenModalIndikator(true);
            setIsi(isi);
            setDataIndikator(indikator);
        }
    }
    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
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
                <h1 className="text-red-500 font-bold mx-5 py-5">terdapat gangguan di backend/server, Periksa koneksi internet atau database server</h1>
            </div>
        )
    }

    return (
        <div>
            {DataNull ?
                <div className="px-6 py-3 border w-full rounded-xl">
                    Data Kosong / Belum Ditambahkan
                </div>
                :
                Rincian.map((data: Rincian, index: number) => (
                    <React.Fragment key={index}>
                        <div className={`flex gap-2 items-center justify-between w-full p-3 border border-black hover:bg-gray-200 cursor-pointer mt-2 z-0 ${ShowRekin ? 'rounded-t-xl rounded-bl-xl' : 'rounded-xl'}`}>
                            <div className="flex flex-col flex-wrap items-start gap-2">
                                <p className="font-bold">{index + 1}. Sub Kegiatan : ({data.kode_subkegiatan || "no code"}) {data.nama_subkegiatan}</p>
                                <ButtonBlackBorder
                                    onClick={() => handleModalIndikator(`${data.nama_subkegiatan} - ${data.kode_subkegiatan}`, (data.indikator_subkegiatan ? data.indikator_subkegiatan : []))}
                                    className="flex items-center gap-1 z-10"
                                >
                                    <TbEye />
                                    cek indikator
                                </ButtonBlackBorder>
                            </div>
                            <p className="p-2 bg-green-500 rounded-xl min-w-[200px] text-center text-white">{data.total_anggaran ? `Rp.${formatRupiah(data.total_anggaran)}` : "Rp. 0"}</p>
                        </div>
                        {data.rincian_belanja ? 
                            data.rincian_belanja?.map((r: RincianBelanja, r_index: number) => (
                                <div key={r_index} className={`flex flex-wrap gap-2 items-center justify-between transition-all duration-300 ease-in-out border-x border-b border-black ${ShowRekin ? 'opacity-100 ml-3 p-3' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                    <div className="flex items-center gap-2 w-full justify-between">
                                        <div className="flex flex-col items-start gap-2">
                                            <p className="font-semibold">{index + 1}.{r_index + 1} {r.rencana_kinerja}</p>
                                            <ButtonBlackBorder
                                                onClick={() => handleModalIndikator(r.rencana_kinerja, r.indikator)}
                                                className="flex items-center gap-1"
                                            >
                                                <TbEye />
                                                cek indikator
                                            </ButtonBlackBorder>
                                        </div>
                                        <div className="p-2 bg-green-500 rounded-xl min-w-[200px] text-center text-white">Rp. {formatRupiah(r.total_anggaran)}</div>
                                    </div>
                                    <TableRekinAsn
                                        renaksi={r.rencana_aksi}
                                        fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                    />
                                </div>
                            ))
                        :
                                <div className={`flex flex-wrap gap-2 items-center justify-between transition-all duration-300 ease-in-out border-x border-b border-black ${ShowRekin ? 'opacity-100 ml-3 p-3' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                    <div className="flex items-center gap-2 w-full justify-between">
                                        <p className="text-red-500 font-bold">Rencana Kinerja Belum Di Tambahkan</p>
                                    </div>
                                </div>
                        }
                    </React.Fragment>
                ))
            }
            <ModalIndikator
                isOpen={OpenModalIndikator}
                onClose={() => handleModalIndikator('', [])}
                isi={Isi}
                data={DataIndikator}
            />
        </div>
    )
}

export const TableRekinAsn: React.FC<TableRekinAsn> = ({ renaksi, fetchTrigger }) => {

    const [IdRenaksi, setIdRenaksi] = useState<string>('');
    const [NamaRenaksi, setNamaRenaksi] = useState<string>('');
    const [Anggaran, setAnggaran] = useState<number | null>(null);

    const [ModalOpen, setModalOpen] = useState<boolean>(false);

    const handleModalOpen = (id: string, nama: string, anggaran: number) => {
        if (ModalOpen) {
            setIdRenaksi('');
            setNamaRenaksi('');
            setModalOpen(false);
            setAnggaran(0);
        } else {
            setIdRenaksi(id);
            setNamaRenaksi(nama);
            setModalOpen(true);
            setAnggaran(anggaran);
        }
    }
    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }

    return (
        <>
            {(renaksi.length === 0 || renaksi === null) ?
                <div className="flex flex-wrap items-center border-red-500 justify-between rounded-tl-xl rounded-bl-xl border-y border-l py-3 pl-3 w-full">
                    <p>Renaksi belum di tambahkan di rincian rencana kinerja</p>
                </div>
                :
                renaksi.map((r: Renaksi, r_index: number) => (
                    <React.Fragment key={r.renaksi_id || r_index}>
                        <div className="flex items-center gap-2 border-green-500 justify-between rounded-tl-xl rounded-bl-xl border-y border-l py-3 pl-3 w-full">
                            <p>Renaksi ke {r_index + 1} : {r.renaksi}</p>
                            <div
                                onClick={() => handleModalOpen(r.renaksi_id, r.renaksi, r.anggaran)}
                                className="p-2 min-w-[200px] border border-green-500 rounded-xl text-center text-green-500 cursor-pointer hover:bg-green-600 hover:text-white"
                            >
                                Rp.{formatRupiah(r.anggaran || 0)}
                            </div>
                        </div>
                    </React.Fragment>
                ))
            }
            <ModalAnggaran
                isOpen={ModalOpen}
                id={IdRenaksi}
                anggaran={Anggaran}
                nama_renaksi={NamaRenaksi}
                onClose={() => handleModalOpen('', '', 0)}
                onSuccess={() => fetchTrigger()}
            />
        </>
    )
}