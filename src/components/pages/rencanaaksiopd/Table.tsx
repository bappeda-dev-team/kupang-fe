'use client'

import { ButtonGreen, ButtonRed, ButtonSkyBorder, ButtonBlackBorder } from "@/components/global/Button";
import React, { useState, useEffect } from "react";
import { TbCirclePlus, TbPencil, TbRefresh, TbSearch, TbTrash } from "react-icons/tb";
import { ModalRenaksiOpd } from "./ModalRenaksiOpd";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip2, LoadingClip } from "@/components/global/Loading";
import { ModalIndikator2 } from "../Pohon/ModalIndikator";

interface Table {
    kode_opd: string;
    tahun: number;
}
interface RekinAsn {
    kode_opd: string;
    tahun: number;
    token: string;
    id: number;
    sasaran: string;
    indikator: IndikatorSasaranOpd[];
}

interface IndikatorSasaranOpd {
    id: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: {
        id: string;
        indikator_id: string;
        tahun: string;
        target: string;
        satuan: string;
    }
}

interface Sasaran {
    id: number;
    nama_sasaran_opd: string;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    indikator: IndikatorSasaranOpd[];
}

interface SubKegiatan {
    kode_subkegiatan: string;
    nama_subkegiatan: string;
    indikator: {
        id: string;
        indikator: string;
        target: string;
        satuan: string;
    }[];
}

interface RencanaKinerja {
    id_renaksiopd: number;
    rekin_id: string;
    nama_rencana_kinerja: string;
    nip_pegawai: string;
    nama_pegawai: string;
    kode_opd: string;
    tw1: number;
    tw2: number;
    tw3: number;
    tw4: number;
    keterangan: string;
    total_anggaran: number;
    subkegiatan: SubKegiatan[];
}

interface Rekin {
    sasaran_opd_id: number;
    nama_sasaran_opd: string;
    tahun_renaksi: string;
    rencana_kinerja: RencanaKinerja[];
}

export const Table: React.FC<Table> = ({ kode_opd, tahun }) => {

    const [SasaranOpd, setSasaranOpd] = useState<Sasaran[]>([]);

    const [IsOpenIndikator, setIsOpenIndikator] = useState<boolean>(false);
    const [Indikator, setIndikator] = useState<IndikatorSasaranOpd[]>([]);
    const [IsiModalIndikator, setIsiModalIndikator] = useState<string>('');

    const [Loading, setLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);

    const token = getToken();

    useEffect(() => {
        const API_URL_RENAKSI_OPD = process.env.NEXT_PUBLIC_API_URL_RENAKSI_OPD;
        const fetchSasaran = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL_RENAKSI_OPD}/sasaran_opd/all/${kode_opd}/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                // console.log(data);
                if (data == null) {
                    setDataNull(true);
                    setSasaranOpd([]);
                } else {
                    setDataNull(false);
                    setSasaranOpd(data);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchSasaran();
    }, [token, kode_opd, tahun]);

    const handleIndikator = (isi: string, indikator: IndikatorSasaranOpd[]) => {
        if (IsOpenIndikator) {
            setIsOpenIndikator(false);
            setIsiModalIndikator('');
            setIndikator([]);
        } else {
            setIsOpenIndikator(true);
            setIsiModalIndikator(isi);
            setIndikator(indikator);
        }
    }

    if (Loading) {
        return (
            <div className="w-full overflow-auto">
               <LoadingClip className="mx-5 py-5" />     
            </div>
        )
    }
    if (Error) {
        return (
            <div className="w-full overflow-auto">
               <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>   
            </div>
        )
    }

    return (
        <div className="overflow-auto">
            {DataNull ? 
                <h1 className="font-bold mx-5 py-5">Sasaran OPD belum di tambahkan di RENSTRA</h1>
            :
                SasaranOpd.map((data: Sasaran, index: number) => (
                    <div className="my-2" key={data.id || index}>
                        <div
                            className={`flex justify-between border items-center p-5 rounded-xl  border-emerald-500`}
                        >
                            <h1 className="font-semibold">{index + 1}. {data.nama_sasaran_opd || "-"}</h1>
                            <div className="flex items-center">
                                <ButtonBlackBorder
                                    onClick={() => handleIndikator(data.nama_sasaran_opd, data.indikator)}
                                    className="flex items-center justify-center gap-1 text-xs"
                                >
                                    <TbSearch />
                                    Cek Indikator
                                </ButtonBlackBorder>
                            </div>
                        </div>
                        <div className={`transition-all duration-300 ease-in-out mx-2 p-2 border-x border-b border-emerald-500`}>
                            <RekinAsn
                                id={data.id}
                                sasaran={data.nama_sasaran_opd}
                                indikator={data.indikator}
                                kode_opd={kode_opd}
                                tahun={tahun}
                                token={token ? token : ""}
                            />
                        </div>
                    </div>
                ))
            }
            <ModalIndikator2
                isOpen={IsOpenIndikator}
                onClose={() => handleIndikator('', [])}
                isi={IsiModalIndikator}
                data={Indikator}
            />
        </div>
    )
}

export const RekinAsn: React.FC<RekinAsn> = ({ id, sasaran, indikator, tahun, token, kode_opd }) => {

    const [Data, setData] = useState<Rekin[]>([]);

    const [ModalTambah, setModaltambah] = useState<boolean>(false);
    const [ModalEdit, setModalEdit] = useState<boolean>(false);

    const [IdRenaksi, setIdRenaksi] = useState<number>(0);
    const [IdRekin, setIdRekin] = useState<string>('');
    const [IdSasaran, setIdSasaran] = useState<number>(0);
    const [IndikatorSasaran, setIndikatorSasaran] = useState<IndikatorSasaranOpd[]>([]);
    const [Rekin, setRekin] = useState<string>('');

    const [Loading, setLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const handleModalTambah = (id_sasaran: number, rekin: string, indikator: IndikatorSasaranOpd[]) => {
        if (ModalTambah) {
            setModaltambah(false);
            setRekin('');
            setIdSasaran(0);
            setIndikatorSasaran([]);
        } else {
            setModaltambah(true);
            setIdSasaran(id_sasaran);
            setRekin(rekin);
            setIndikatorSasaran(indikator);
        }
    }
    const handleModalEdit = (id: number, rekin: string, indikator: IndikatorSasaranOpd[]) => {
        if (ModalEdit) {
            setModalEdit(false);
            setRekin('');
            setIdRenaksi(0);
            setIndikatorSasaran([]);
        } else {
            setModalEdit(true);
            setRekin(rekin);
            setIdRenaksi(id);
            setIndikatorSasaran(indikator);
        }
    }

    const hapusRenaksiOpd = async (id: number) => {
        const API_URL_RENAKSI_OPD = process.env.NEXT_PUBLIC_API_URL_RENAKSI_OPD;
        // console.log(id);
        try {
            const response = await fetch(`${API_URL_RENAKSI_OPD}/rencana-aksi-opd/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert(`response tidak !ok saat hapus data renaksi opd dengan id ${id}`)
            }
            AlertNotification("Berhasil", "Rencana Aksi OPD Berhasil Dihapus", "success", 1000);
            setFetchTrigger((prev) => !prev);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };
    const syncRenaksiOpd = async (id: string) => {
        const API_URL_RENAKSI_OPD = process.env.NEXT_PUBLIC_API_URL_RENAKSI_OPD;
        // console.log(id);
        try {
            const response = await fetch(`${API_URL_RENAKSI_OPD}/rencana-aksi-opd/sync_jadwal/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (result.code === 200) {
                AlertNotification("Berhasil", `${result.data}`, "success", 1000);
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 1000);
            }
            setFetchTrigger((prev) => !prev);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };

    useEffect(() => {
        const API_URL_RENAKSI_OPD = process.env.NEXT_PUBLIC_API_URL_RENAKSI_OPD;
        const fetchRekinById = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL_RENAKSI_OPD}/rencana-aksi-opd/${id}/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                // console.log(data);
                if (data == null || data == undefined) {
                    setDataNull(true);
                    setData([]);
                } else {
                    setDataNull(false);
                    setData(data);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchRekinById();
    }, [token, id, tahun, FetchTrigger]);

    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }

    if (Loading) {
        return (
            <React.Fragment>
                <div className="w-full">
                    <div className="border px-6 py-4 text-center"><LoadingButtonClip2 /> Loading...</div>
                </div>
            </React.Fragment>
        )
    }
    if (Error) {
        return (
            <React.Fragment>
                <div className="w-full">
                    <div className="border px-6 py-4 text-center text-red-500">Cek koneksi internet, terdapat kesalahan server backend atau database</div>
                </div>
            </React.Fragment>
        )
    }

    return (
        <div className="flex flex-col">
            <ButtonSkyBorder
                onClick={() => handleModalTambah(id, sasaran, indikator)}
                className="flex items-center justify-center gap-1 w-full mb-2"
            >
                <TbCirclePlus />
                Tambah Rencana Aksi OPD
            </ButtonSkyBorder>
            <div className="overflow-auto rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="text-xm bg-emerald-500 text-white">
                            <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px] text-center">Aksi/Kegiatan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">Sub Kegiatan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px] text-center">Anggaran</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px] text-center">Nama Pemilik</td>
                            <td colSpan={4} className="border-r border-b px-6 py-3 min-w-[100px] text-center">Jadwal Pelaksanaan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px] text=center">Keterangan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px] text-center">Aksi</td>
                        </tr>
                        <tr className="text-sm bg-emerald-500 text-white">
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">TW1</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">TW2</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">TW3</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">TW4</td>
                        </tr>
                    </thead>
                    <tbody>
                        {Data.length != 0 ?
                            Data.map((data: Rekin, index: number) => (
                                <React.Fragment key={index}>
                                    {data.rencana_kinerja.map((rk: RencanaKinerja, sub_index: number) => (
                                        <tr key={rk.id_renaksiopd || index}>
                                            <td className="border-r border-b px-6 py-4">{sub_index + 1}</td>
                                            <td className="border-r border-b px-6 py-4">{rk.nama_rencana_kinerja || "-"}</td>
                                            {rk.subkegiatan ?
                                                <td className="border-r border-b px-6 py-4">
                                                    {rk.subkegiatan.map((sk: SubKegiatan, sk_index: number) => (
                                                        <React.Fragment key={sk_index}>
                                                            <p>{sk.kode_subkegiatan} - {sk.nama_subkegiatan}</p>
                                                            {/* <ButtonBlackBorder className="flex items-center justify-center gap-1 text-xs">
                                                                <TbSearch />
                                                                Cek Indikator
                                                            </ButtonBlackBorder> */}
                                                        </React.Fragment>
                                                    ))}
                                                </td>
                                                :
                                                <td className="border-r border-b px-6 py-4 italic text-slate-500">tidak ada Sub Kegiatan</td>
                                            }
                                            <td className="border-r border-b px-6 py-4">Rp.{formatRupiah(rk.total_anggaran || 0)}</td>
                                            <td className="border-r border-b px-6 py-4">{rk.nama_pegawai}</td>
                                            <td className="border-r border-b px-6 py-4 text-center">{rk.tw1}</td>
                                            <td className="border-r border-b px-6 py-4 text-center">{rk.tw2}</td>
                                            <td className="border-r border-b px-6 py-4 text-center">{rk.tw3}</td>
                                            <td className="border-r border-b px-6 py-4 text-center">{rk.tw4}</td>
                                            <td className="border-r border-b px-6 py-4">{rk.keterangan || "-"}</td>
                                            <td className="border-r border-b px-6 py-4">
                                                <div className="flex flex-col justify-center items-center gap-2">
                                                    <ButtonSkyBorder
                                                        className="w-full"
                                                        onClick={() => syncRenaksiOpd(rk.rekin_id)}
                                                    >
                                                        <TbRefresh className="mr-1" />
                                                        Sync
                                                    </ButtonSkyBorder>
                                                    <ButtonGreen
                                                        className="w-full"
                                                        onClick={() => handleModalEdit(rk.id_renaksiopd, rk.nama_rencana_kinerja, indikator)}
                                                    >
                                                        <TbPencil className="mr-1" />
                                                        Edit
                                                    </ButtonGreen>
                                                    <ButtonRed className="w-full"
                                                        onClick={() => {
                                                            AlertQuestion("Hapus?", "Hapus Renaksi OPD yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                if (result.isConfirmed) {
                                                                    hapusRenaksiOpd(rk.id_renaksiopd);
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <TbTrash className="mr-1" />
                                                        Hapus
                                                    </ButtonRed>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                            :
                            <tr>
                                <td colSpan={11} className="border-r border-b px-6 py-4">Data Kosong / Belum di Tambahkan</td>
                            </tr>
                        }
                    </tbody>
                </table>
                <ModalRenaksiOpd
                    metode="baru"
                    isOpen={ModalTambah}
                    onClose={() => handleModalTambah(0, '', [])}
                    kode_opd={kode_opd}
                    tahun={String(tahun)}
                    id_rekin={IdRekin}
                    id_sasaran={IdSasaran}
                    rekin={Rekin}
                    indikator={IndikatorSasaran ? IndikatorSasaran : []}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
                <ModalRenaksiOpd
                    metode="lama"
                    isOpen={ModalEdit}
                    onClose={() => handleModalEdit(0, '', [])}
                    id={IdRenaksi}
                    kode_opd={kode_opd}
                    tahun={String(tahun)}
                    id_rekin={IdRekin}
                    rekin={Rekin}
                    indikator={IndikatorSasaran ? IndikatorSasaran : []}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
            </div>
        </div>
    )
} 