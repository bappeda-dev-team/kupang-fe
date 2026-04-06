"use client";

import { useEffect, useState, useMemo } from "react";
import { FiHome } from "react-icons/fi";
import { useBrandingContext } from '@/context/BrandingContext';
import type { PkOpdResponse, PkPegawai } from "./pk-opd-types";
import { getToken, getOpdTahunNew } from "@/components/lib/Cookie";
import { AlertNotification } from "@/components/global/Alert";
import { TablePk } from "./table-pk";
import { TahunNull, OpdNull } from "@/components/global/OpdTahunNull";
import Select from 'react-select';
import { ModalPilihAtasan } from './modal-pilih-atasan';
import type { AtasanOption } from './modal-pilih-atasan';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import DocumentPk from './document-pk'

const PerjanjianKinerja = () => {
    // WARNING PATTERN INI TIDAK BOLEH
    // const token = getToken();
    // const kodeOpd = getOpdTahun().opd.value;
    // const tahun = getOpdTahun().tahun.value;

    // PAKAI STATE
    const [token, setToken] = useState<string | null>(null)
    const [kodeOpd, setKodeOpd] = useState<string | null>(null)
    const [tahun, setTahun] = useState<number | null>(null)
    const [roleUser, setRoleUser] = useState<string[]>([])

    useEffect(() => {
        const opdTahun = getOpdTahunNew()
        const token = getToken()

        if (!opdTahun || !token) return

        setToken(token)

        // set tahun
        if (opdTahun?.tahun?.value != null) {
            setTahun(opdTahun.tahun.value)
        }
        // set kode opd
        if (opdTahun?.opd != null) {
            setKodeOpd(opdTahun.opd.value)
        }
        if (opdTahun?.roles != null) {
            setRoleUser(opdTahun.roles)
        }
    }, [])

    const [data, setData] = useState<PkOpdResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [_submitting, setSubmitting] = useState(false)

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false)
    const [selectedPk, setSelectedPk] = useState<{
        idRekinPemilik: string
        idPohon: number
        kodeOpd: string
        levelPk: number
    } | null>(null)

    const [rekinAtasanList, setRekinAtasanList] = useState<
        RekinOption[]
    >([])


    const [showPilihAtasanModal, setShowPilihAtasanModal] = useState(false)
    const [selectedAtasan, setSelectedAtasan] = useState<{
        nipBawahan: string
    } | null>(null)
    const [atasanList, setAtasanList] = useState<
        AtasanOption[]
    >([])

    const { branding } = useBrandingContext();
    const apiPerencanaan = branding.api_perencanaan;

    useEffect(() => {
        if (!kodeOpd || !tahun || !token) return
        const controller = new AbortController()

        const fetchData = async () => {
            setLoading(true)
            const res = await fetch(
                `${apiPerencanaan}/pk_opd/${kodeOpd}/${tahun}`,
                {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                    signal: controller.signal,
                })
            const json = await res.json()
            setData(json.data)
            setLoading(false)
        }

        fetchData()
        return () => controller.abort()
    }, [token, kodeOpd, tahun])

    // STATE MODAL CETAK PREVIEW
    const [showPreview, setShowPreview] = useState(false)
    const [previewData, setPreviewData] =
        useState<PkPegawaiContext | null>(null)

    const handlePreviewPk = (nipBawahan: string) => {
        if (!data) return

        const cetakData = findPkPegawaiWithContext(data, nipBawahan)

        if (!cetakData) {
            AlertNotification(
                "Gagal",
                "Data PK belum lengkap / belum ada atasan",
                "error",
                1500
            )
            return
        }

        setPreviewData(cetakData)
        setShowPreview(true)
    }

    const getCandidates = (pk: any, levelPk: number): RekinOption[] => {
        return buildCandidates(data, pk, levelPk)
    }


    if (tahun == null) {
        return <TahunNull />
    }

    if (kodeOpd == null) {
        return <OpdNull />
    }

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!data) {
        return <div className="p-6">Data tidak ditemukan</div>;
    }

    return (
        <div className="flex flex-col gap-3">
            {/* HEADER */}
            <div className="header flex items-center">
                <a href="/" className="px-1">
                    <FiHome />
                </a>
                <span>/</span>
                <p className="px-1">Laporan</p>
                <span>/</span>
                <p className="px-1 font-bold">Perjanjian Kinerja ASN</p>
            </div>

            {/* CONTENT */}
            <div className="rounded-xl shadow-lg border-2 bg-white">
                <div className="flex flex-col gap-4 border-b px-5 py-5">
                    <h1 className="font-bold text-lg uppercase">
                        Perjanjian Kinerja ASN {data.tahun}
                    </h1>

                    {/* SEARCH */}
                    <input
                        className="border px-4 py-2 rounded-lg w-full"
                        placeholder="Cari nama ASN"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <TablePk
                            data={data}
                            search={search}
                            roleUser={roleUser}
                            onPreviewPk={handlePreviewPk}
                            getCandidates={getCandidates}
                            onSelectAtasan={({ nipBawahan }) => {
                                const candidates = extractUniqueAtasanFromData(
                                    data,
                                    nipBawahan
                                )

                                setAtasanList(candidates)

                                setSelectedAtasan({ nipBawahan: nipBawahan })

                                setShowPilihAtasanModal(true)
                            }}
                            onSelectPk={({ pk, levelPk }) => {
                                const candidates = buildCandidates(data, pk, levelPk)
                                setRekinAtasanList(candidates)

                                setSelectedPk({
                                    idRekinPemilik: pk.id_rekin_pemilik_pk,
                                    idPohon: pk.id_pohon,
                                    kodeOpd: pk.kode_opd,
                                    levelPk: levelPk
                                })

                                setShowModal(true)
                            }}
                        />
                    </div>
                </div>
            </div>
            {showPilihAtasanModal && selectedAtasan && (
                <ModalPilihAtasan
                    open={showPilihAtasanModal}
                    onClose={() => setShowPilihAtasanModal(false)}
                    atasanList={atasanList}
                    onSubmit={async (nipAtasan) => {
                        if (!selectedAtasan) return
                        setSubmitting(true)

                        try {
                            const res = await fetch(`${apiPerencanaan}/pk_opd/hubungkan_atasan`, {
                                method: "POST",
                                headers: {
                                    Authorization: `${token}`,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    nip_atasan: nipAtasan,
                                    nip_bawahan: selectedAtasan.nipBawahan,
                                    kode_opd: kodeOpd,
                                    tahun: tahun,
                                }),
                            })

                            const json = await res.json()

                            if (res.ok) {
                                setData(json.data)
                                AlertNotification("Berhasil", "Data Atasan Diupdate", "success", 1000)
                                setShowPilihAtasanModal(false)
                                setSelectedAtasan(null)
                            }
                        } catch (err) {
                            console.error(err)
                        } finally {
                            setSubmitting(false)
                        }
                    }}
                />
            )}
            {showModal && selectedPk && (
                <HubungkanModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    rekinAtasanList={rekinAtasanList}
                    onSubmit={async (idRekinAtasan) => {
                        setSubmitting(true)

                        try {
                            const res = await fetch(`${apiPerencanaan}/pk_opd/hubungkan`, {
                                method: "POST",
                                headers: {
                                    Authorization: `${token}`,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    id_rekin_pemilik_pk: selectedPk.idRekinPemilik,
                                    id_rekin_atasan: idRekinAtasan,
                                    id_pohon: selectedPk.idPohon,
                                    kode_opd: selectedPk.kodeOpd,
                                    tahun: tahun,
                                    level_pk: selectedPk.levelPk,
                                }),
                            })

                            const json = await res.json()

                            if (res.ok) {
                                setData(json.data)
                                AlertNotification("Berhasil", "Data PK Diupdate", "success", 1000)
                                setShowModal(false)
                                setRekinAtasanList([])
                            } else {
                                console.log(json)
                                AlertNotification("PK Gagal disimpan", json.message, "error", 5000, true)
                            }
                        } catch (err) {
                            console.error(err)
                            AlertNotification("Gagal", String(err), "error", 2000)
                        } finally {
                            setSubmitting(false)
                        }
                    }}
                />
            )}
            {showPreview && previewData && (
                <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
                    <div className="bg-white w-[90%] h-[90%] rounded-lg shadow-lg flex flex-col">

                        {/* HEADER */}
                        <div className="flex justify-between items-center px-4 py-2 border-b">
                            <h2 className="font-bold">Preview Perjanjian Kinerja</h2>

                            <div className="flex items-center gap-3">
                                {/* DOWNLOAD BUTTON */}
                                <PDFDownloadLink
                                    document={
                                        <DocumentPk
                                            branding={branding.logo}
                                            data={previewData}
                                        />
                                    }
                                    fileName={`PK-${previewData.pegawai.nama_pegawai}-${previewData.pegawai.nip}-${previewData.tahun}.pdf`}
                                >
                                    {({ loading }) => (
                                        <button
                                            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            {loading ? "Menyiapkan..." : "Download PDF"}
                                        </button>
                                    )}
                                </PDFDownloadLink>

                                {/* CLOSE BUTTON */}
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="text-red-500 font-semibold"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>

                        {/* PDF PREVIEW */}
                        <div className="flex-1">
                            <PDFViewer width="100%" height="100%">
                                <DocumentPk
                                    branding={branding.logo}
                                    data={previewData}
                                />
                            </PDFViewer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerjanjianKinerja;


// MODAL
export type RekinOption = {
    id: string
    rekin: string
    namaPegawai: string
    nipPegawai: string
}

type SelectOption = {
    value: string
    label: string
    meta: RekinOption
}

type HubungkanModalProps = {
    open: boolean
    onClose: () => void
    onSubmit: (idRekinAtasan: string) => void
    rekinAtasanList: RekinOption[]
}

const HubungkanModal = ({
    open,
    onClose,
    onSubmit,
    rekinAtasanList,
}: HubungkanModalProps) => {
    const [selected, setSelected] = useState<SelectOption | null>(null)

    const options: SelectOption[] = useMemo(
        () =>
            rekinAtasanList.map((r) => ({
                value: r.id,
                label: `${r.namaPegawai} | ${r.nipPegawai} — ${r.rekin}`,
                meta: r,
            })),
        [rekinAtasanList]
    )

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl w-[500px] p-6 shadow-lg">
                <h2 className="text-lg font-bold mb-4">
                    Pilih Rencana Kinerja Atasan
                </h2>

                <Select
                    options={options}
                    value={selected}
                    onChange={(opt) => setSelected(opt)}
                    placeholder="Cari nama / NIP / rencana kinerja..."
                    isClearable
                    isSearchable
                    className="mb-4"
                />
                {/* PREVIEW */}
                {selected && (
                    <div className="border rounded p-3 bg-slate-50 text-sm mb-5">
                        <p className="font-semibold">{selected.meta.namaPegawai}</p>
                        <p className="text-slate-600">
                            NIP: {selected.meta.nipPegawai}
                        </p>
                        <p className="mt-2">{selected.meta.rekin}</p>
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded"
                    >
                        Batal
                    </button>
                    <button
                        disabled={!selected}
                        onClick={() => selected && onSubmit(selected.value)}
                        className={`px-4 py-2 rounded text-white ${selected
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    )
}

function extractUniqueAtasanFromData(
    data: PkOpdResponse,
    nipBawahan: string
): AtasanOption[] {

    const pegawai = data.pk_item
        .flatMap(l => l.pegawais)
        .find(p => p.nip === nipBawahan)

    if (!pegawai) return []

    return Array.from(
        new Map(
            pegawai.pks
                .filter(pk => pk.nip_atasan)
                .map(pk => [
                    pk.nip_atasan, // UNIQUE KEY
                    {
                        nip: pk.nip_atasan,
                        nama: pk.nama_atasan
                    },
                ])
        ).values()
    )
}

type PkPegawaiContext = {
    kode_opd: string
    nama_opd: string
    tahun: number
    pegawai: PkPegawai
}

function findPkPegawaiWithContext(
    data: PkOpdResponse,
    nipBawahan: string
): PkPegawaiContext | null {

    for (const level of data.pk_item) {
        const pegawai = level.pegawais.find(p => p.nip === nipBawahan)
        if (pegawai) {
            return {
                kode_opd: data.kode_opd,
                nama_opd: data.nama_opd,
                tahun: data.tahun,
                pegawai,
            }
        }
    }

    return null
}

const buildCandidates = (
    data: any,
    pk: any,
    levelPk: number
): RekinOption[] => {
    const sasaranPemdas = data.sasaran_pemdas || []

    // LEVEL 4 -> sasaran pemda
    if (levelPk === 4) {
        return sasaranPemdas.map((sp: any) => ({
            id: String(sp.id_sasaran_pemda),
            rekin: sp.sasaran_pemda,
            nipPegawai: sp.nip_kepala_pemda,
            namaPegawai: sp.nama_kepala_pemda,
        }))
    }

    const targetAtasanLevel = levelPk - 1

    return data.pk_item
        .filter((l: any) => l.level_pk === targetAtasanLevel)
        .flatMap((l: any) =>
            l.pegawais.flatMap((p: any) =>
                p.pks
                    .filter((pkAtasan: any) =>
                        pkAtasan.id_rekin_pemilik_pk !== pk.id_rekin_pemilik_pk &&
                        pkAtasan.id_pohon === pk.id_parent_pohon &&
                        pkAtasan.id_rekin_pemilik_pk !== pk.id_rekin_atasan
                    )
                    .map((pkAtasan: any) => ({
                        id: pkAtasan.id_rekin_pemilik_pk,
                        rekin: pkAtasan.rekin_pemilik_pk,
                        namaPegawai: p.nama_pegawai,
                        nipPegawai: p.nip,
                    }))
            )
        )
}
