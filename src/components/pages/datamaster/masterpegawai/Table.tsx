'use client'

import { ButtonBlack, ButtonGreen, ButtonRed, ButtonSky } from "@/components/global/Button";
import { useState, useEffect } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import Select from 'react-select';
import { useBrandingContext } from "@/context/BrandingContext";
import { TbSearch, TbCirclePlus } from "react-icons/tb";
import { ModalMasterPegawai } from "./ModalMasterPegawai";
import { ModalJabatanPegawai } from "./ModalJabatanPegawai";

interface OptionTypeString {
    value: string;
    label: string;
}
interface pegawai {
    id: number;
    jabatan_id?: number | null;
    jenis_pegawai?: string;
    kode_opd: string;
    nama: string;
    nama_jabatan?: string;
    nama_opd: string;
    nip: string;
    nama_pegawai: string;
}

const mapApiToPegawai = (item: any): pegawai => ({
    id: Number(item?.id ?? 0),
    jabatan_id: item?.jabatan_id ?? null,
    jenis_pegawai: item?.jenis_pegawai ?? "",
    kode_opd: item?.kode_opd ?? "",
    nama: item?.nama ?? item?.nama_pegawai ?? "",
    nama_pegawai: item?.nama ?? item?.nama_pegawai ?? "",
    nama_jabatan: item?.nama_jabatan ?? "",
    nama_opd: item?.nama_opd ?? "",
    nip: item?.nip ?? "",
});

const Table = () => {

    const { branding } = useBrandingContext();
    const [Pegawai, setPegawai] = useState<pegawai[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchMode, setSearchMode] = useState<'nama' | 'nip'>('nama');
    const [Opd, setOpd] = useState<OptionTypeString | null>(null);
    const [error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [LoadingOpd, setLoadingOpd] = useState<boolean>(false);
    const token = getToken();

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [ModalJabatanOpen, setModalJabatanOpen] = useState<boolean>(false);
    const [DataModal, setDataModal] = useState<pegawai | null>(null);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [NamaOpd, setNamaOpd] = useState<string>("");
    const [KodeOpd, setKodeOpd] = useState<string>("");
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [JenisJabatan, setJenisJabatan] = useState<"tambah" | "edit">("tambah");
    const [JabatanId, setJabatanId] = useState<number | undefined>(undefined);

    const handleModal = (jenis: "tambah" | "edit", Data: pegawai | null, nama_opd: string, kode_opd: string) => {
        if (ModalOpen) {
            setModalOpen(false);
            setJenisModal(jenis);
            setDataModal(Data);
            setNamaOpd(nama_opd);
            setKodeOpd(kode_opd);
        } else {
            setModalOpen(true);
            setJenisModal(jenis);
            setDataModal(Data);
            setNamaOpd(nama_opd);
            setKodeOpd(kode_opd);
        }
    }
    const handleModalJabatan = (Data: pegawai | null, jenis: "tambah" | "edit" = "tambah", jabatanId?: number) => {
        if(ModalJabatanOpen){
            setModalJabatanOpen(false);
            setDataModal(Data);
            setJenisJabatan(jenis);
            setJabatanId(jabatanId);
        } else {
            setModalJabatanOpen(true);
            setDataModal(Data);
            setJenisJabatan(jenis);
            setJabatanId(jabatanId);
        }
    }

    useEffect(() => {
        if (branding?.opd?.value != undefined) {
            try {
                setLoadingOpd(true);
                const opd = {
                    value: branding?.opd?.value,
                    label: branding?.opd?.label,
                }
                setOpd(opd);
            } catch (err) {
                console.log("error parsing opd branding ke opd halaman");
            } finally {
                setLoadingOpd(false);
            }
        }
    }, [branding])

    useEffect(() => {
        if (!Opd?.value) {
            return;
        }
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchPegawai = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/pegawais/opd/${Opd.value}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const unauthorized = response.status === 401 || result?.code === 401;
                if (unauthorized) {
                    setError(true);
                    setPegawai([]);
                    setDataNull(true);
                    return;
                }
                const rawData = Array.isArray(result)
                    ? result
                    : Array.isArray(result?.data)
                        ? result.data
                        : [];
                const data = rawData.map(mapApiToPegawai);
                setDataNull(data.length === 0);
                setPegawai(data);
                setError(false);
            } catch (err) {
                console.error(err);
                setError(true);
                setPegawai([]);
                setDataNull(true);
            } finally {
                setLoading(false);
            }
        };
        fetchPegawai();
        setSearchQuery("");
    }, [token, Opd, branding, FetchTrigger]);

    const handleSearchSubmit = async () => {
        const query = searchQuery.trim();
        if (!query) {
            handleSearchReset();
            return;
        }
        if (!Opd?.value) {
            return;
        }
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsSearching(true);
        try {
            const response = await fetch(`${API_URL}/pegawais/search?${searchMode}=${encodeURIComponent(query)}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const unauthorized = response.status === 401 || result?.code === 401;
            if (unauthorized) {
                setError(true);
                setPegawai([]);
                setDataNull(true);
                return;
            }
            const rawData = Array.isArray(result)
                ? result
                : Array.isArray(result?.data)
                    ? result.data
                    : [];
            const data = rawData.map(mapApiToPegawai);
            setPegawai(data);
            setDataNull(data.length === 0);
            setError(false);
        } catch (err) {
            console.error(err);
            setError(true);
            setPegawai([]);
            setDataNull(true);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchReset = () => {
        setSearchQuery("");
        setDataNull(false);
        setIsSearching(false);
        setFetchTrigger((prev) => !prev);
    };

    const fetchOpd = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
        const response = await fetch(`${API_URL}/opds`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const data = await response.json();
            const opd = data.data.map((item: any) => ({
                value: item.kode_opd,
                label: item.nama_opd,
            }));
            setOpdOption(opd);
        } catch (err) {
            console.log('gagal mendapatkan data opd');
        } finally {
            setIsLoading(false);
        }
    };

    const hapusPegawai = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/pegawais/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            setPegawai(Pegawai.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data pegawai Berhasil Dihapus", "success", 1000);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if (Loading || LoadingOpd) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if (!Opd) {
        return (
            <>
                <div className="flex flex-wrap gap-2 items-center uppercase px-3 py-2">
                    <Select
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '8px',
                                minWidth: '320px',
                                maxWidth: '700px',
                                minHeight: '30px'
                            })
                        }}
                        onChange={(option) => setOpd(option)}
                        options={OpdOption}
                        placeholder="Filter by OPD"
                        isClearable
                        value={Opd}
                        isLoading={IsLoading}
                        isSearchable
                        onMenuOpen={() => {
                            if (OpdOption.length == 0) {
                                fetchOpd();
                            }
                        }}
                    />
                </div>
                <div className="border p-1 mx-3 mb-2 rounded-xl">
                    <h1 className="mx-5 py-5">Pilih Filter OPD</h1>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-col items-end">
                        <h1 className="uppercase font-bold">Daftar Pegawai</h1>
                    </div>
                    <div className="flex flex-col">
                        <ButtonSky
                            className="flex items-center justify-center"
                            onClick={() => handleModal("tambah", null, Opd?.label ?? "", Opd?.value ?? "")}
                        >
                            <TbCirclePlus className="mr-1" />
                            Tambah Pegawai
                        </ButtonSky>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center uppercase px-3 py-2">
                    <Select
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '8px',
                                minWidth: '320px',
                                maxWidth: '700px',
                                minHeight: '30px'
                            })
                        }}
                        onChange={(option) => setOpd(option)}
                        options={OpdOption}
                        placeholder="Filter by OPD"
                        isClearable
                        value={Opd}
                        isLoading={IsLoading}
                        isSearchable
                        onMenuOpen={() => {
                            if (OpdOption.length == 0) {
                                fetchOpd();
                            }
                        }}
                    />
                    <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm font-semibold">
                        <button
                            type="button"
                            className={`px-3 py-1 rounded-md transition ${searchMode === 'nama' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500'}`}
                            onClick={() => setSearchMode('nama')}
                        >
                            Nama
                        </button>
                        <button
                            type="button"
                            className={`px-3 py-1 rounded-md transition ${searchMode === 'nip' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500'}`}
                            onClick={() => setSearchMode('nip')}
                        >
                            NIP
                        </button>
                    </div>
                    <div className="relative flex-1 min-w-[220px]">
                        <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cari nama pegawai / NIP"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearchSubmit();
                                }
                            }}
                            className="w-full border rounded-lg border-gray-300 py-2 pl-10 pr-2"
                        />
                    </div>
                    <ButtonGreen
                        className="px-4 py-2"
                        disabled={isSearching}
                        onClick={handleSearchSubmit}
                    >
                        Cari
                    </ButtonGreen>
                    <ButtonBlack
                        className="px-4 py-2"
                        disabled={isSearching}
                        onClick={handleSearchReset}
                    >
                        Reset
                    </ButtonBlack>
                    {isSearching && <span className="text-sm text-slate-500">Mencari...</span>}
                </div>
                <div className="overflow-auto mx-3 my-2 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#99CEF5] text-white">
                                <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">NIP</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Jabatan</th>
                                <th className="border-r border-b px-6 py-3 min-w-[100px]">Kode OPD</th>
                                <th className="border-r border-b px-6 py-3 min-w-[300px]">Perangkat Daerah</th>
                                <th className="border-l border-b px-6 py-3 min-w-[100px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(DataNull || Pegawai.length === 0) ?
                                <tr>
                                    <td className="px-6 py-3 uppercase" colSpan={13}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                                :
                                Pegawai.map((data, index) => (
                                    <tr key={data?.id}>
                                        <td className="border-r border-b px-6 py-4">{index + 1}</td>
                                         <td className="border-r border-b px-6 py-4">{data?.nama ? data.nama : data?.nama_pegawai ? data.nama_pegawai : "-"}</td>
                                         <td className="border-r border-b px-6 py-4 text-center">{data?.nip ? data.nip : "-"}</td>
                                         <td className="border-r border-b px-6 py-4 text-center">{data?.nama_jabatan ? data.nama_jabatan : "-"}</td>
                                        <td className="border-r border-b px-6 py-4">{data?.kode_opd ? data.kode_opd : "-"}</td>
                                        <td className="border-r border-b px-6 py-4">{data?.nama_opd ? data.nama_opd : "-"}</td>
                                        <td className="border-r border-b px-6 py-4">
                                            <div className="flex flex-col jutify-center items-center gap-2">
                                                <ButtonGreen
                                                    className="w-full"
                                                    onClick={() => handleModal("edit", data, data?.nama_opd, data?.kode_opd)}
                                                >
                                                    Edit
                                                </ButtonGreen>
                                                <ButtonBlack
                                                    className="w-full"
                                                    onClick={() => {
                                                        if (data?.jabatan_id) {
                                                            handleModalJabatan(data, "edit", data.jabatan_id);
                                                        } else {
                                                            handleModalJabatan(data, "tambah");
                                                        }
                                                    }}
                                                >
                                                    Jabatan
                                                </ButtonBlack>
                                                <ButtonRed
                                                    className="w-full"
                                                    onClick={() => {
                                                        AlertQuestion("Hapus?", "Hapus Pegawai yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                            if (result.isConfirmed) {
                                                                hapusPegawai(data.id);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    Hapus
                                                </ButtonRed>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            {ModalOpen &&
                <ModalMasterPegawai
                    isOpen={ModalOpen}
                    onClose={() => handleModal("tambah", null, "", "")}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    Data={DataModal}
                    jenis={JenisModal}
                    kode_opd={KodeOpd}
                    nama_opd={NamaOpd}
                />
            }
            {ModalJabatanOpen &&
                <ModalJabatanPegawai
                    onClose={() => handleModalJabatan(null)}
                    isOpen={ModalJabatanOpen}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    Data={DataModal}
                    kode_opd={Opd?.value ?? ""}
                    nama_opd={Opd?.label ?? ""}
                    jenis={JenisJabatan}
                    jabatanId={JabatanId}
                />
            }
        </>
    )
}

export default Table;
