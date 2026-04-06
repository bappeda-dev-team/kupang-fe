'use client'

import { getToken } from "@/components/lib/Cookie";
import React, { useEffect, useState } from "react";
import { ButtonGreenBorder, ButtonSkyBorder } from "@/components/global/Button";
import { TbCirclePlus, TbPencil } from "react-icons/tb";
import { LoadingClip } from "@/components/global/Loading";
import { ModalMatrix, ModalEditMatrix } from "./ModalMatrix";
import { ModalPaguAnggaran } from "./ModalPaguAnggaran";

interface renstra {
    nama: string;
    kode: string;
    jenis: string;
    indikator: Indikator[];
    anggaran: Anggaran[];
    bidang_urusan?: renstra[];
    program?: renstra[]
    kegiatan?: renstra[]
    subkegiatan?: renstra[]
}
interface matrix {
    kode_opd: string
    tahun_awal: string;
    tahun_akhir: string;
    pagu_total: pagu[];
    urusan: renstra[];
}
type combinedData = Anggaran & Partial<Indikator>;
interface Anggaran {
    tahun: string;
    pagu_indikatif: number;
}
interface Indikator {
    id?: string;
    kode: string;
    kode_opd: string;
    indikator: string;
    tahun: string;
    target: Target[];
}
interface IndikatorForm {
    kode: string;
    kode_opd: string;
    indikator: string;
    tahun: string;
    target: string;
    satuan: string;
}
interface Target {
    id: string;
    indikator_id: string;
    target: string;
    satuan: string;
}
interface pagu {
    tahun: string;
    pagu_indikatif: number;
}
interface table {
    jenis: "laporan" | "opd";
    tahun_awal: string;
    tahun_akhir: string;
    tahun_list: string[];
    kode_opd: string;
}
interface Thead {
    jenis: "Urusan" | "Bidang Urusan" | "Program" | "Kegiatan" | "Sub Kegiatan";
    tahun_list: string[];
    type: "laporan" | "opd";
}
interface Tr {
    indikator: Indikator[];
    anggaran: Anggaran[];
    nama: string;
    kode: string;
    kode_opd: string;
    jenis: "Urusan" | "Bidang Urusan" | "Program" | "Kegiatan" | "Sub Kegiatan";
    type: "laporan" | "opd";
    fetchTrigger: () => void;
}
interface TablePagu {
    tahun_list: string[];
    pagu_total: pagu[];
}

export const TableRenstra: React.FC<table> = ({ jenis, tahun_awal, tahun_akhir, tahun_list, kode_opd }) => {

    const [Matrix, setMatrix] = useState<matrix[]>([]);

    const [Loading, setLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchMatrix = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/matrix_renstra/opd/${kode_opd}?tahun_awal=${tahun_awal}&tahun_akhir=${tahun_akhir}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                // console.log(data);
                if (result.code === 400) {
                    setDataNull(true);
                    setMatrix([]);
                    console.log(data);
                } else if (result.code === 200) {
                    setDataNull(false);
                    setMatrix(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchMatrix();
    }, [kode_opd, tahun_awal, tahun_akhir, token, FetchTrigger]);

    if (DataNull) {
        return (
            <h1 className="p-5 text-sky-500 font-semibold">Sub Kegiatan OPD belum di pilih pada periode tahun {tahun_awal} sampai {tahun_akhir}</h1>
        )
    }
    if (Loading) {
        return (
            <>
                <LoadingClip />
            </>
        )
    }

    return (
        <>
            {Matrix.map((item: matrix, index: number) => (
                <React.Fragment key={index}>
                    <div className="overflow-auto m-2 rounded-xl border">
                        <TableTotalPagu
                            tahun_list={tahun_list}
                            pagu_total={item.pagu_total}
                        />
                    </div>
                    <div className="overflow-auto m-2 rounded-t-xl border">
                        {item.urusan.length === 0 ?
                            <h1 className="p-5">Sub Kegiatan di periode {tahun_awal} - {tahun_akhir} belum di gunakan di rencana kinerja</h1>
                            :
                            <table className="w-full">
                                {item.urusan.map((u: renstra, u_index: number) => (
                                    <React.Fragment key={u_index}>
                                        <TheadMatrix
                                            tahun_list={tahun_list}
                                            jenis="Urusan"
                                            type={jenis}
                                        />
                                        <tbody>
                                            <TrMatrix
                                                jenis="Urusan"
                                                type={jenis}
                                                indikator={u.indikator}
                                                anggaran={u.anggaran}
                                                kode={u.kode}
                                                nama={u.nama}
                                                kode_opd={item.kode_opd}
                                                fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                            />
                                        </tbody>
                                        {u.bidang_urusan &&
                                            <React.Fragment>
                                                {u.bidang_urusan.map((br: renstra, br_index: number) => (
                                                    <React.Fragment key={br_index}>
                                                        <TheadMatrix
                                                            tahun_list={tahun_list}
                                                            jenis="Bidang Urusan"
                                                            type={jenis}
                                                        />
                                                        <tbody>
                                                            <TrMatrix
                                                                jenis="Bidang Urusan"
                                                                type={jenis}
                                                                indikator={br.indikator}
                                                                anggaran={u.anggaran}
                                                                kode={br.kode}
                                                                nama={br.nama}
                                                                kode_opd={kode_opd}
                                                                fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                            />
                                                        </tbody>
                                                        {br.program &&
                                                            <React.Fragment>
                                                                {br.program.map((p: renstra, p_index: number) => (
                                                                    <React.Fragment key={p_index}>
                                                                        <TheadMatrix
                                                                            tahun_list={tahun_list}
                                                                            jenis="Program"
                                                                            type={jenis}
                                                                        />
                                                                        <tbody>
                                                                            <TrMatrix
                                                                                jenis="Program"
                                                                                type={jenis}
                                                                                indikator={p.indikator}
                                                                                anggaran={u.anggaran}
                                                                                kode={p.kode}
                                                                                nama={p.nama}
                                                                                kode_opd={kode_opd}
                                                                                fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                            />
                                                                        </tbody>
                                                                        {p.kegiatan &&
                                                                            <React.Fragment>
                                                                                {p.kegiatan.map((k: renstra, k_index: number) => (
                                                                                    <React.Fragment key={k_index}>
                                                                                        <TheadMatrix
                                                                                            tahun_list={tahun_list}
                                                                                            jenis="Kegiatan"
                                                                                            type={jenis}
                                                                                        />
                                                                                        <tbody>
                                                                                            <TrMatrix
                                                                                                jenis="Kegiatan"
                                                                                                type={jenis}
                                                                                                indikator={k.indikator}
                                                                                                anggaran={u.anggaran}
                                                                                                kode={k.kode}
                                                                                                nama={k.nama}
                                                                                                kode_opd={kode_opd}
                                                                                                fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                                            />
                                                                                        </tbody>
                                                                                        {k.subkegiatan &&
                                                                                            <React.Fragment>
                                                                                                <TheadMatrix
                                                                                                    tahun_list={tahun_list}
                                                                                                    jenis="Sub Kegiatan"
                                                                                                    type={jenis}
                                                                                                />
                                                                                                {k.subkegiatan.map((sk: renstra, sk_index: number) => (
                                                                                                    <React.Fragment key={sk_index}>
                                                                                                        <tbody>
                                                                                                            <TrMatrix
                                                                                                                jenis="Sub Kegiatan"
                                                                                                                type={jenis}
                                                                                                                indikator={sk.indikator}
                                                                                                                anggaran={u.anggaran}
                                                                                                                kode={sk.kode}
                                                                                                                nama={sk.nama}
                                                                                                                kode_opd={kode_opd}
                                                                                                                fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                                                            />
                                                                                                        </tbody>
                                                                                                    </React.Fragment>
                                                                                                ))}
                                                                                            </React.Fragment>
                                                                                        }
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </React.Fragment>
                                                                        }
                                                                    </React.Fragment>
                                                                ))}
                                                            </React.Fragment>
                                                        }
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        }
                                    </React.Fragment>
                                ))}
                            </table>
                        }
                    </div>
                </React.Fragment>
            ))}
        </>
    )
}
export const TheadMatrix: React.FC<Thead> = ({ jenis, type, tahun_list }) => {
    return (
        <thead>
            <tr className={` 
                ${jenis === "Urusan" && "bg-white text-black"}
                ${jenis === "Bidang Urusan" && "bg-red-500 text-white"}
                ${jenis === "Program" && "bg-blue-500 text-white"}
                ${jenis === "Kegiatan" && "bg-green-700 text-white"}
                ${jenis === "Sub Kegiatan" && "bg-emerald-500 text-white"}
            `}>
                <td rowSpan={2} className="border-r border-b px-6 py-4 w-[200px]">Kode</td>
                <td rowSpan={2} className="border-r border-b px-6 py-4 min-w-[200px]">{jenis}</td>
                {tahun_list.map((item: any) => (
                    <td key={item} colSpan={type === "opd" ? 3 : 2} className="border-r border-b px-6 py-3 min-w-[100px] text-center">{item}</td>
                ))}

            </tr>
            <tr className={`
                ${jenis === "Urusan" && "bg-white text-black"}
                ${jenis === "Bidang Urusan" && "bg-red-500 text-white"}
                ${jenis === "Program" && "bg-blue-500 text-white"}
                ${jenis === "Kegiatan" && "bg-green-700 text-white"}
                ${jenis === "Sub Kegiatan" && "bg-emerald-500 text-white"}
            `}>
                {(jenis === 'Urusan' || jenis === 'Bidang Urusan') ?
                    tahun_list.map((item: string) => (
                        <React.Fragment key={item}>
                            <td colSpan={type === "opd" ? 3 : 2} className="border-l border-b px-6 py-3 min-w-[200px] text-center">Pagu</td>
                        </React.Fragment>
                    ))
                    :
                    tahun_list.map((item: string) => (
                        <React.Fragment key={item}>
                            <td className="border-l border-b px-6 py-3 min-w-[300px] text-center">indikator/target/satuan</td>
                            {type === "opd" &&
                                <td className="border-l border-b px-6 py-3 min-w-[50px] text-center">Aksi</td>
                            }
                            <td className="border-l border-b px-6 py-3 min-w-[200px] text-center">Pagu</td>
                        </React.Fragment>
                    ))
                }
            </tr>
        </thead>
    )
}
export const TrMatrix: React.FC<Tr> = ({ jenis, type, kode_opd, kode, nama, indikator, anggaran, fetchTrigger }) => {

    const [ModalTambah, setModalTambah] = useState<boolean>(false);
    const [ModalEdit, setModalEdit] = useState<boolean>(false);
    const [DataModal, setDataModal] = useState<IndikatorForm[]>([]);
    const [Indikator, setIndikator] = useState<string>("");
    const [Target, setTarget] = useState<string>("");
    const [Satuan, setSatuan] = useState<string>("");

    const [Pagu, setPagu] = useState<number | null>(null);
    const [ModalPagu, setModalPagu] = useState<boolean>(false);

    const [TahunN, setTahunN] = useState<string>('');
    const [IdIndikator, setIdIndikator] = useState<string>('');

    const combinedData = anggaran.map((itemAnggaran) => {
        // Ambil SEMUA indikator yang tahunnya sama
        const matchingIndikators = indikator.filter(
            (itemIndikator) => itemIndikator.tahun === itemAnggaran.tahun
        );

        return {
            ...itemAnggaran,
            // Simpan sebagai array di dalam objek anggaran
            list_indikator: matchingIndikators.length > 0 ? matchingIndikators : [{
                id: "",
                indikator: "-",
                target: []
            }]
        };
    });

    const handleModalTambah = (tahun: string) => {
        if (ModalTambah) {
            setModalTambah(false);
            setTahunN('');
        } else {
            setModalTambah(true);
            setTahunN(tahun);
        }
    }

    const handleModalEdit = (id: string, tahun: string, indikator: string, target: string, satuan: string) => {
        if (ModalEdit) {
            setModalEdit(false);
            setTahunN('');
            setIdIndikator('');
            setIndikator(indikator);
            setTarget(target);
            setSatuan(satuan);
        } else {
            setModalEdit(true);
            setTahunN(tahun);
            setIdIndikator(id);
            setIndikator(indikator);
            setTarget(target);
            setSatuan(satuan);

        }
    }

    const handleModalPagu = (pagu: number, tahun: string) => {
        if (ModalPagu) {
            setModalPagu(false);
            setPagu(pagu);
            setTahunN(tahun);
        } else {
            setModalPagu(true);
            setPagu(pagu);
            setTahunN(tahun);
        }
    }

    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }
    return (
        // terdapat error hidrasi disini
        <>
            {(jenis === 'Urusan' || jenis === 'Bidang Urusan') ?
                <tr>
                    <td className={`border-r border-b px-6 py-4 font-semibold`}>{kode || ""}</td>
                    <td className={`border-r border-b px-6 py-4 w-full`}>{nama || ""}</td>
                    {combinedData.map((i: combinedData, index: number) => (
                        <React.Fragment key={i.id || index}>
                            <td className={`border-r border-b px-6 py-4 w-full text-center`}></td>
                            <td className={`border-r border-b px-6 py-4 w-full text-center`}></td>
                            <td className={`border-r border-b px-6 py-4 w-full`}>Rp.{formatRupiah(i.pagu_indikatif || 0)}</td>
                            {type === "opd" &&
                                <td className={`border-b px-6 py-4 w-full`}></td>
                            }
                        </React.Fragment>
                    ))}
                </tr>
                :
                <tr>
                    <td className={`border-r border-b px-6 py-4 font-semibold`}>{kode || ""}</td>
                    <td className={`border-r border-b px-6 py-4 w-full`}>{nama || ""}</td>
                    {combinedData.map((a, index) => (
                        <React.Fragment key={index}>
                            {/* Kolom Indikator & Target */}
                            <td className="border-r border-b px-6 py-4">
                                {a.list_indikator.map((ind, idx) => (
                                    <div key={ind.id || idx} className={idx > 0 ? "border-t mt-2 pt-2" : ""}>
                                        <p className="font-medium">{ind.indikator || ""}</p>

                                        {/* Render Target di dalam sini jika ingin menyatu */}
                                        <div className="text-sm text-gray-500">
                                            {(ind.target ?? []).map((t, tidx) => (
                                                <span key={tidx}>{t.target || ""} {t.satuan || ""}</span>
                                            ))}
                                        </div>

                                        {/* Tombol Edit/Tambah per Indikator */}
                                        <div className="mt-2">
                                            {ind.id && (
                                                <div className="flex items-center gap-1">
                                                    <ButtonGreenBorder 
                                                        className="flex items-center gap-1"
                                                        onClick={() => handleModalEdit(ind.id || "", a.tahun, ind.indikator, ind.target[0].target, ind.target[0].satuan)}
                                                    >
                                                        <TbPencil />
                                                        Edit
                                                    </ButtonGreenBorder>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </td>
                            <td className="border-r border-b px-6 py-4">
                                <ButtonSkyBorder 
                                    className="flex items-center gap-1"
                                    onClick={() => handleModalTambah(a.tahun)}
                                >
                                    <TbCirclePlus />
                                    <p className="text-sm">Indikator</p>
                                </ButtonSkyBorder>
                            </td>

                            {/* Kolom Pagu (Biasanya pagu anggaran nempel ke tahun, bukan ke per indikator) */}
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col items-center gap-2">
                                    Rp.{formatRupiah(a.pagu_indikatif || 0)}
                                    {jenis === "Sub Kegiatan" &&
                                        <button
                                            type="button"
                                            onClick={() => handleModalPagu(a.pagu_indikatif, a.tahun)}
                                            className="text-sky-400 border border-sky-300 hover:text-sky-600 p-1 rounded-full hover:bg-sky-100 transition-colors"
                                            title="Edit Pagu Anggaran"
                                        >
                                            <TbPencil size={14} />
                                        </button>
                                    }
                                </div>
                            </td>
                        </React.Fragment>
                    ))}
                </tr>
            }
            {/* MODAL TAMBAH */}
            {ModalTambah &&
                <ModalMatrix
                    isOpen={ModalTambah}
                    onClose={() => handleModalTambah('')}
                    metode="baru"
                    nama={nama}
                    jenis={jenis}
                    Data={[]}
                    kode={kode}
                    kode_opd={kode_opd}
                    tahun={TahunN}
                    onSuccess={fetchTrigger}
                />
            }
            {/* MODAL EDIT */}
            {ModalEdit &&
                <ModalEditMatrix
                    id={IdIndikator}
                    isOpen={ModalEdit}
                    onClose={() => handleModalEdit('', '', "", "", "")}
                    nama={nama}
                    jenis={jenis}
                    indikator={Indikator}
                    target={Target}
                    satuan={Satuan}
                    kode={kode}
                    kode_opd={kode_opd}
                    tahun={TahunN}
                    onSuccess={fetchTrigger}
                />
            }
            {/* MODAL PAGU */}
            {ModalPagu &&
                <ModalPaguAnggaran
                    isOpen={ModalPagu}
                    onClose={() => handleModalPagu(0, '')}
                    nama={nama}
                    jenis={jenis}
                    pagu={Pagu || 0}
                    kode={kode}
                    kode_opd={kode_opd}
                    tahun={TahunN}
                    onSuccess={fetchTrigger}
                />
            }
        </>
    )
}
export const TableTotalPagu: React.FC<TablePagu> = ({ tahun_list, pagu_total }) => {

    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }

    return (
        <table className="w-full">
            <tbody>
                <tr>
                    <td rowSpan={2} className={`border-r border-b px-6 py-4 font-semibold`}>Total Pagu OPD</td>
                    {tahun_list.map((item: string) => (
                        <td key={item} className="border-r border-b px-6 py-4 font-semibold text-center">{item}</td>
                    ))}
                </tr>
                <tr>
                    {pagu_total.map((item: pagu, index: number) => (
                        <td key={index} className="border-r border-b px-6 py-4 font-semibold text-center">Rp.{formatRupiah(item.pagu_indikatif)}</td>
                    ))}
                </tr>
            </tbody>
        </table>
    )
}