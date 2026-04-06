'use client'

import { ButtonRedBorder, ButtonGreenBorder } from "@/components/global/Button";
import { TbPencil, TbTrash } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import { LoadingClip, LoadingButtonClip2 } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { ModalCSF } from "./ModalCSF";

interface tematik {
    id: number;
    parent: number;
    tema: string;
    is_active: boolean;
    keterangan: string;
    indikator: indikator[];
}
interface CSF {
    id: number;
    pohon_id: number;
    pernyataan_kondisi_strategis: string | null;
    tahun: string;
    alasan_kondisi: AlasanKondisi[];
}
interface TypeDataGabungan {
    id: number;
    pohon_id: number;
    pernyataan_kondisi_strategis: string | null;
    tahun: string;
    alasan_kondisi: AlasanKondisi[];
    parent: number;
    tema: string;
    is_active: boolean;
    keterangan: string;
    indikator: indikator[];
}
interface DataTerukur {
    id: number;
    alasan_kondisi_id: number;
    data_terukur: string;
    created_at: string;
    updated_at: string;
}
interface AlasanKondisi {
    id: number;
    csf_id: number;
    alasan_kondisi_strategis: string;
    data_terukur: DataTerukur[];
    created_at: string;
    updated_at: string;
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
}
interface Table {
    tahun: number;
}

export const Table: React.FC<Table> = ({ tahun }) => {

    const [Tematik, setTematik] = useState<tematik[]>([]);
    const [CSF, setCSF] = useState<CSF[]>([]);
    const [Data, setData] = useState<tematik[] | CSF[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [LoadingCSF, setLoadingCSF] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const token = getToken();

    // FETCH DATA PERTAMA TEMATIK & CSF
    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const API_URL_CSF = process.env.NEXT_PUBLIC_API_URL_CSF;
        const fetchTematik = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/tematik_pemda/${tahun}`, {
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
        const fetchCSF = async () => {
            setLoadingCSF(true)
            try {
                const response = await fetch(`${API_URL_CSF}/csf/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data === null) {
                    setCSF([]);
                } else if (data.code == 500) {
                    setError(true);
                    setCSF([]);
                } else {
                    setCSF(data);
                }
                setCSF(data);
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoadingCSF(false);
            }
        }
        if (tahun != undefined) {
            fetchTematik();
            fetchCSF();
        }
    }, [tahun, token, FetchTrigger]);
    // FETCH DATA KEDUA PENGGABUNGAN ARRAY
    useEffect(() => {
        if(Tematik && CSF){
            const dataGabungan = GabunganData(CSF, Tematik);
            setData(dataGabungan);
        }
    }, [Tematik, CSF]);

    const hapusTematik = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (!response.ok) {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
                console.error(result);
            } else {
                setTematik(Tematik.filter((data) => (data.id !== id)))
                AlertNotification("Berhasil", "Data Tematik Berhasil Dihapus", "success", 1000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };


    if (Loading || LoadingCSF) {
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
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Kondisi Terukur Yang Diharapkan (Tema)</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Indikator</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Target/Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Keterangan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(DataNull || !Data.length) ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={13}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            Data.map((data: any, index: number) => (
                                <React.Fragment key={data.id}>
                                    <tr>
                                        <td
                                            className="border-r border-b bg-blue-100 border-white px-6 py-4 text-center"
                                        >
                                            {index + 1}
                                        </td>
                                        <TableTematik
                                            data={data}
                                            rowSpan={1}
                                            onDelete={() => hapusTematik(data.id)}
                                            fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                        />
                                    </tr>
                                </React.Fragment>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

interface RowPernyatan {
    rowSpan: number;
    pernyataan_kondisi_strategis: string;
    id_pohon: number;
    hapusCsf: () => void;
    handleModal: () => void;
}
export const RowPernyatan: React.FC<RowPernyatan> = ({ rowSpan, pernyataan_kondisi_strategis, id_pohon, hapusCsf, handleModal }) => {
    return (
        <>
            <td rowSpan={rowSpan}
                className="border-r border-b bg-blue-100 border-white px-6 py-4"
            >
                {pernyataan_kondisi_strategis || "-"}
            </td>
            <td className="h-0"></td>
            <td className="h-0"></td>
            <td
                rowSpan={rowSpan}
                className="border-r border-b bg-blue-100 border-white px-6 py-4 text-center"
            >
                <AksiCsf
                    buttonDelete={true}
                    onDelete={hapusCsf}
                    onEdit={handleModal}
                />
            </td>
        </>
    )
}
interface RowAlasanKondisi {
    alasan_kondisi: AlasanKondisi[];
}
export const RowAlasanKondisi: React.FC<RowAlasanKondisi> = ({ alasan_kondisi }) => {
    return (
        <>
            {alasan_kondisi.map((a: AlasanKondisi, a_index: number) => (
                <tr key={a_index}>
                    <td className="border-r border-b bg-blue-100 border-white px-6 py-4">
                        {a.alasan_kondisi_strategis || "-"}
                    </td>
                    {a.data_terukur && a.data_terukur.length > 0 ? (
                        <td className="border-r border-b bg-blue-100 border-white px-6 py-4">
                            {a.data_terukur.map((dt: DataTerukur, dt_index: number) => (
                                <p key={dt_index} className={`py-2 ${a.data_terukur.length > 1 && dt_index < a.data_terukur.length - 1 ? "border-b border-white" : ""}`}>
                                    {dt.data_terukur || "-"}
                                </p>
                            ))}
                        </td>
                    ) : (
                        <td className="border-r border-b bg-blue-100 border-white px-6 py-4">
                            <p>-</p>
                        </td>
                    )}
                </tr>
            ))
            }
        </>
    )
}
interface AksiCSF {
    buttonDelete: boolean;
    onDelete: () => void;
    onEdit: () => void;
}
export const AksiCsf: React.FC<AksiCSF> = ({ buttonDelete, onDelete, onEdit }) => {
    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <ButtonGreenBorder
                className="flex items-center gap-1 w-full"
                onClick={onEdit}
            >
                <TbPencil />
                CSF
            </ButtonGreenBorder>
            {buttonDelete &&
                <ButtonRedBorder
                    className="flex items-center gap-1 w-full"
                    onClick={() => {
                        AlertQuestion("Hapus?", "Hapus CSF yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                            if (result.isConfirmed) {
                                onDelete();
                            }
                        });
                    }}
                >
                    <TbTrash />
                    Hapus
                </ButtonRedBorder>
            }
        </div>
    )
}
interface TableTematik {
    data: TypeDataGabungan;
    rowSpan?: number;
    onDelete: () => void;
    fetchTrigger: () => void;
}
export const TableTematik: React.FC<TableTematik> = ({ data, rowSpan, onDelete, fetchTrigger }) => {

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<string>("");
    const [DataToEdit, setDataToEdit] = useState<tematik | CSF | null>(null);

    const hapusCsf = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL_CSF;
        try {
            const response = await fetch(`${API_URL}/csf/${id}`, {
                method: "DELETE",
                headers: {
                    // Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (!response.ok) {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
                console.error(result);
            } else {
                AlertNotification("Berhasil", "Data CSF Berhasil dihapus", "success", 1000);
                fetchTrigger();
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };
    const handleModal = (jenis: string, data: tematik | CSF | null) => {
        if (ModalOpen) {
            setModalOpen(false);
            setJenisModal("");
            setDataToEdit(null);
        } else {
            setModalOpen(true);
            setJenisModal(jenis);
            setDataToEdit(data);
        }
    }

    return (
        <React.Fragment>
            {data.pernyataan_kondisi_strategis === null ?
                <>
                    <td rowSpan={rowSpan} colSpan={3} className="border-r border-b bg-blue-100 px-6 py-4 text-center italic text-red-400">CSF Kosong / belum di tambahkan</td>
                    <td rowSpan={rowSpan} className="border-r bg-blue-100 border-b px-6 py-4 text-center">
                        <div className="flex flex-col justify-center items-center gap-2">
                            <ButtonGreenBorder
                                className="flex items-center gap-1 w-full"
                                onClick={() => handleModal("baru", data)}
                            >
                                <TbPencil />
                                CSF
                            </ButtonGreenBorder>
                        </div>
                    </td>
                </>
                :
                // DATA CSF ADA
                <React.Fragment>
                    <td rowSpan={rowSpan} className="border-r bg-blue-100 border-b px-6 py-4 text-center">{data.pernyataan_kondisi_strategis || "-"}</td>
                    {/* ALASAN */}
                    {data.alasan_kondisi?.length > 0 ?
                        data.alasan_kondisi.map((ak: AlasanKondisi, sub_index: number) => (
                            <React.Fragment key={sub_index}>
                                <td rowSpan={rowSpan} className="border-r bg-blue-100 border-b px-6 py-4 text-center">{ak.alasan_kondisi_strategis || "_"}</td>
                                {ak.data_terukur.map((dt: DataTerukur, sub_sub_index: number) => (
                                    <React.Fragment key={sub_sub_index}>
                                        <td rowSpan={rowSpan} className="border-r bg-blue-100 border-b px-6 py-4 text-center">{dt.data_terukur || "-"}</td>
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))
                        :
                        <>
                            <td rowSpan={rowSpan} className="border-r bg-blue-100 border-b px-6 py-4 text-center">-</td>
                            <td rowSpan={rowSpan} className="border-r bg-blue-100 border-b px-6 py-4 text-center">-</td>
                        </>
                    }
                    <td rowSpan={rowSpan} className="border-r bg-blue-100 border-b px-6 py-4 text-center">
                        <div className="flex flex-col justify-center items-center gap-2">
                            <ButtonGreenBorder
                                className="flex items-center gap-1 w-full"
                                onClick={() => handleModal("edit", data)}
                            >
                                <TbPencil />
                                CSF
                            </ButtonGreenBorder>
                            <ButtonRedBorder
                                className="flex items-center gap-1 w-full"
                                onClick={() => {
                                    AlertQuestion("Hapus?", "Hapus CSF yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                        if (result.isConfirmed) {
                                            hapusCsf(data.id);
                                        }
                                    });
                                }}
                            >
                                <TbTrash />
                                Hapus
                            </ButtonRedBorder>
                        </div>
                    </td>
                </React.Fragment>
            }
            <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">{data.tema || "-"}</td>
            {data.indikator ?
                <>
                    <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">
                        {data.indikator?.map((item: indikator) => (
                            <p
                                key={item.id_indikator}
                                className={`${data.indikator.length > 1 && "border-b"} py-3`}
                            >
                                {item.nama_indikator || "-"}
                            </p>
                        ))}
                    </td>
                    <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">
                        {data.indikator?.map((item: indikator) => (
                            item.targets.map((t: target) => (
                                <p
                                    key={t.id_target}
                                    className={`${data.indikator.length > 1 && "border-b"} py-3`}
                                >
                                    {t.target || "-"} / {t.satuan || "-"}
                                </p>
                            ))
                        ))}
                    </td>
                </>
                :
                <>
                    <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">-</td>
                    <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">-</td>
                </>
            }
            <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">{"keterangan" in data ? data.keterangan : "-"}</td>
            <td rowSpan={rowSpan} className="border-r border-b px-6 py-4">
                <div className="flex flex-col jutify-center items-center gap-2">
                    <ButtonGreenBorder
                        className="flex items-center gap-1 w-full"
                        halaman_url={`/tematikpemda/${data.id}`}
                    >

                        <TbPencil />
                        Tema
                    </ButtonGreenBorder>
                    <ButtonRedBorder
                        className="flex items-center gap-1 w-full"
                        onClick={() => {
                            AlertQuestion("Hapus?", "Data Tematik dan CSF akan di hapus?", "question", "Hapus", "Batal").then((result) => {
                                if (result.isConfirmed) {
                                    onDelete
                                }
                            });
                        }}
                    >
                        <TbTrash />
                        Hapus
                    </ButtonRedBorder>
                </div>
            </td>
            {ModalOpen &&
                <ModalCSF
                    isOpen={ModalOpen}
                    onClose={() => handleModal("", null)}
                    onSuccess={fetchTrigger}
                    jenis={JenisModal}
                    data={DataToEdit}
                />
            }
        </React.Fragment>
    )
}

export function GabunganData2(csf: CSF[], tematik: tematik[]) {
    const array1 = new Map(tematik.map((t: tematik) => [t.id, t]));
    const hasil = csf.map((c: CSF) => {
        const ArrayGabungan = array1.get(c.pohon_id);
        return { ...c, ...(ArrayGabungan ?? {}) }
    });

    tematik.forEach((t: tematik) => {
        const gabungan = hasil.some((g: CSF) => g.pohon_id === t.id);
        if (!gabungan) {
            hasil.push({
                id: t.id,
                tema: t.tema,
                parent: t.parent,
                indikator: t.indikator,
                is_active: t.is_active,
                keterangan: t.keterangan,
                pohon_id: 0,
                pernyataan_kondisi_strategis: null,
                tahun: "",
                alasan_kondisi: [],
            });
        }
    });
    return hasil;
}
export function GabunganData(csf: CSF[], tematik: tematik[]) {

    const tematikMap = new Map(tematik.map((t) => [t.id, t]));
    const hasilGabungan: (CSF & tematik)[] = [];

    csf.forEach((c) => {
        const tematikData = tematikMap.get(c.pohon_id);
        hasilGabungan.push({
            ...c,
            ...(tematikData),
        } as any);

        if (tematikData) {
            tematikMap.delete(c.pohon_id);
        }
    });

    tematikMap.forEach((t) => {
        hasilGabungan.push({
            // Isi properti CSF dengan nilai default
            id: t.id,
            pohon_id: t.id,
            pernyataan_kondisi_strategis: null,
            tahun: "",
            alasan_kondisi: [],
            // Properti tematik
            tema: t.tema,
            parent: t.parent,
            indikator: t.indikator,
            is_active: t.is_active,
            keterangan: t.keterangan,
        } as any);
    });

    return hasilGabungan;
}

