import React from "react";
import { useState, useEffect } from "react";
import { AlertNotification, AlertQuestion2 } from "@/components/global/Alert";
import Select from 'react-select'
import { TbCircleCheckFilled, TbCircleLetterXFilled, TbFileCheck, TbFilePlus, TbEye, TbEyeClosed } from 'react-icons/tb';
import { ButtonRedBorder, ButtonSkyBorder, ButtonRed, ButtonBlackBorder } from "@/components/global/Button";
import { LoadingBeat, LoadingButtonClip } from "@/components/global/Loading";
import { getToken, getUser, getOpdTahun } from "@/components/lib/Cookie";
import { TablePohon } from "../ModalPindahPohonOpd";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    nama_pohon?: string;
    isLevel?: number;
}
interface OptionType {
    value: number;
    label: string;
}
interface OptionTypeString {
    value: string;
    label: string;
}
interface TypePohonPemda {
    value: number;
    label?: string;
    id: number;
    parent: OptionType;
    nama_pohon: string;
    jenis_pohon: string;
    level_pohon: number;
    keterangan?: string;
    tahun: OptionTypeString;
    status: string;
    kode_opd: string;
    nama_opd: string;
    pelaksana?: OptionTypeString[];
    indikator: indikator[];
    tagging: Tagging[];
}
interface Tagging {
    nama_tagging: string;
    keterangan_tagging: string;
}
interface TypePohonCross {
    value: number;
    label?: string;
    opd_pengirim?: string;
    id: number;
    parent: OptionType;
    nama_pohon: string;
    jenis_pohon: string;
    level_pohon: number;
    keterangan?: string;
    tahun: OptionTypeString;
    status: string;
    kode_opd: string;
    nama_opd: string;
    pelaksana?: OptionTypeString[];
    indikator: indikator[];
}
interface pokin {
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    childs: childs[]
}
interface childs {
    id: number;
    parent: number;
    strategi: string;
    target: string;
    satuan: string;
    keterangan: string;
    indikators: string;
    childs: childs[];
}
interface indikator {
    nama_indikator: string;
    targets: target[];
}
type target = {
    target: string;
    satuan: string;
};

export const ModalPohonPemda: React.FC<modal> = ({ isOpen, onClose, onSuccess, isLevel }) => {

    const [PohonPemda, setPohonPemda] = useState<TypePohonPemda | null>(null);
    const [ButtonDetailPohonPemda, setButtonDetailPohonPemda] = useState<boolean>(false);
    const [DetailPohonPemda, setDetailPohonPemda] = useState<pokin | null>(null);
    const [PohonParent, setPohonParent] = useState<TypePohonPemda | null>(null);
    const [OptionPohonParent, setOptionPohonParent] = useState<TypePohonPemda[]>([]);
    const [OptionPohonPemda, setOptionPohonPemda] = useState<TypePohonPemda[]>([]);

    const [Proses, setProses] = useState<boolean>(false);
    const [IsLoading, setIsLoading] = useState<boolean>(false);

    const token = getToken();
    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

    useEffect(() => {
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
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

    const fetchPohonParent = async (level: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        let url = ''; // Deklarasikan di luar blok
        setIsLoading(true);
        try {
            if (User?.roles == 'super_admin') {
                url = `pohon_kinerja/pilih_parent/${SelectedOpd?.value}/${Tahun?.value}/${level}`;
            } else {
                url = `pohon_kinerja/pilih_parent/${User?.kode_opd}/${Tahun?.value}/${level}`;
            }

            if (!url) {
                throw new Error('URL tidak valid.');
            }

            const response = await fetch(`${API_URL}/${url}`, {
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
            if (data.data == null) {
                console.log("pohon opd kosong, tambahkan di pohon kinerja OPD untuk membuat pohon parent")
            } else {
                const parent = data.data.map((item: any) => ({
                    value: item.id,
                    label: `${item.jenis_pohon} - ${item.nama_pohon}`,
                    nama_pohon: item.nama_pohon,
                    jenis_pohon: item.jenis_pohon,
                    level_pohon: item.level_pohon,
                    nama_opd: item.nama_opd,
                    kode_opd: item.kode_opd,
                    indikator: item.indikator,
                    tahun: item.tahun
                }));
                setOptionPohonParent(parent);
            }
        } catch (err) {
            console.log('gagal mendapatkan data pohon dari opd', err);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchPohonPemda = async (level: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const url = User?.roles == 'super_admin' ? `pohon_kinerja/pemda/${SelectedOpd?.value}/${Tahun?.value}` : `pohon_kinerja/pemda/${User?.kode_opd}/${Tahun?.value}`;
            const response = await fetch(`${API_URL}/${url}`, {
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
            if (data.data == null) {
                console.log("pohon dari pemda kosong/belum ditambahkan")
            } else {
                const filteredData = data.data.filter((item: any) => item.level_pohon === level);
                const pokinPemda = filteredData.map((item: any) => ({
                    value: item.id,
                    label: `${item.jenis_pohon} - ${item.nama_pohon}`,
                    nama_pohon: item.nama_pohon,
                    jenis_pohon: item.jenis_pohon,
                    level_pohon: item.level_pohon,
                    nama_opd: item.nama_opd,
                    kode_opd: item.kode_opd,
                    tahun: item.tahun,
                    status: item.status,
                    indikator: item.indikator,
                }));
                setOptionPohonPemda(pokinPemda);
            }
        } catch (err) {
            console.log('gagal mendapatkan data pohon dari opd', err);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchDetailPohonPemda = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/pohon_kinerja_opd/pokinpemda_review/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const result = await response.json();
            const data = result.data.tematiks;
            setDetailPohonPemda(data);
            // console.log(data);
        } catch (err) {
            console.log('gagal mendapatkan data pohon dari opd', err);
        } finally {
            setIsLoading(false);
        }
    };
    const terimaPohonPemda = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            id: id,
            parent: PohonParent ? PohonParent?.value : 0,
            jenis_pohon: PohonPemda?.jenis_pohon,
        }
        if ((PohonPemda?.jenis_pohon === "Tactical Pemda" || PohonPemda?.jenis_pohon === "Operational Pemda") && (PohonParent?.value === undefined || PohonParent?.value === null)) {
            AlertNotification("Pohon Parent", "Tactical dan Operational wajib memilih parent", "warning", 2000);
        } else {
            // console.log(formData);
            try {
                setProses(true);
                const response = await fetch(`${API_URL}/pohon_kinerja_admin/clone_pokin_pemda/create`, {
                    method: "POST",
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })
                if (!response.ok) {
                    alert("cant fetch data")
                }
                AlertNotification("Berhasil", "Pohon dari pemda di terima", "success", 1000);
                onClose();
                onSuccess();
            } catch (err) {
                AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
                console.error(err);
            } finally {
                setProses(false);
            }
        }
    }
    const tolakPohonPemda = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            id: id,
        }
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/tolak_pokin/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Data pohon berhasil di tolak", "success", 1000);
            onClose();
            onSuccess();
            // setTimeout(() => {
            //     window.location.reload();
            // }, 1000);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    }

    const handleClose = () => {
        setPohonParent(null);
        setPohonPemda(null);
        setButtonDetailPohonPemda(false);
        onClose();
    };

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                {/* KONDISI ON CLOSE */}
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>

                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 max-h-[80%] text-start overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b text-center font-bold">
                        Pohon Dari Pemda
                    </div>
                    <div className="py-5 my-5">
                        <div className="mb-1">
                            <label htmlFor="" className='uppercase text-xs font-bold text-gray-700 my-2 ml-1'>
                                {isLevel === 4 ? 'Strategic Pemda' :
                                    isLevel === 5 ? 'Tactical Pemda' :
                                        isLevel === 6 ? 'Operational Pemda' :
                                            'Pohon Pemda'
                                }
                            </label>
                            <Select
                                placeholder="Pilih Pohon Pemda"
                                value={PohonPemda}
                                options={OptionPohonPemda}
                                isSearchable
                                isClearable
                                isLoading={IsLoading}
                                menuPortalTarget={document.body}
                                onMenuOpen={() => {
                                    if (isLevel) {
                                        fetchPohonPemda(isLevel)
                                    }
                                }}
                                onChange={(option) => {
                                    setPohonPemda(option);
                                    setButtonDetailPohonPemda(false);
                                }}
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderRadius: '8px',
                                        textAlign: 'start',
                                    }),
                                    menuPortal: (base) => ({
                                        ...base, zIndex: 9999
                                    })
                                }}
                            />
                        </div>
                        {(PohonPemda?.jenis_pohon == 'Tactical Pemda' || PohonPemda?.jenis_pohon == 'Operational Pemda') &&
                            <div className="mb-3">
                                <label htmlFor="" className='uppercase text-xs font-medium text-gray-700 my-2 ml-1'>
                                    {PohonPemda?.jenis_pohon == 'Tactical Pemda' ? 'Strategic' : 'Tactical'}
                                </label>
                                <Select
                                    placeholder="parent untuk pohon yang diterima"
                                    value={PohonParent}
                                    options={OptionPohonParent}
                                    isSearchable
                                    isClearable
                                    isLoading={IsLoading}
                                    onMenuOpen={() => {
                                        if (PohonPemda?.jenis_pohon == 'Tactical Pemda') {
                                            fetchPohonParent(4);
                                        } else {
                                            fetchPohonParent(5);
                                        }
                                    }}
                                    onChange={(option) => {
                                        setPohonParent(option);
                                    }}
                                    onMenuClose={() => setOptionPohonParent([])}
                                    styles={{
                                        control: (baseStyles) => ({
                                            ...baseStyles,
                                            borderRadius: '8px',
                                            textAlign: 'start',
                                        })
                                    }}
                                />
                            </div>
                        }
                        {/* BUTTON DETAIL PARENT POHON PEMDA */}
                        {PohonPemda &&
                            <div className="flex">
                                <ButtonBlackBorder
                                    onClick={() => {
                                        setButtonDetailPohonPemda((prev) => !prev);
                                        if (PohonPemda) {
                                            fetchDetailPohonPemda(Number(PohonPemda?.value));
                                        }
                                    }}
                                >
                                    {ButtonDetailPohonPemda ?
                                        <div className="flex items-center justify-center gap-1">
                                            <TbEye />
                                            Sembunyikan Asal Relasi Pohon
                                        </div>
                                        :
                                        <div className="flex items-center justify-center gap-1">
                                            <TbEyeClosed />
                                            Tampilkan Asal Relasi Pohon
                                        </div>
                                    }
                                </ButtonBlackBorder>
                            </div>
                        }
                        {/* DETAIL RELASI DENGAN PARENT POHON PEMDA */}
                        {ButtonDetailPohonPemda && (
                            IsLoading ?
                                <LoadingBeat />
                                :
                                <div className="flex flex-col justify-center text-center mt-2">
                                    <h1 className="font-bold uppercase">Detail relasi parent pohon Pemda</h1>
                                    <div className="tf-tree text-center mt-3">
                                        <ul>
                                            <TableDetailPohonPemda item={DetailPohonPemda} />
                                        </ul>
                                    </div>
                                </div>
                        )}
                        {/* PREVIEW KEDUA POHON */}
                        <div className="flex justify-between">
                            {PohonPemda &&
                                <p className="uppercase text-xs font-medium text-gray-700 mt-2 ml-1">Preview Pohon pemda</p>
                            }
                            {PohonParent &&
                                <p className="uppercase text-xs font-medium text-gray-700 mt-2 ml-1">Preview Pohon parent</p>
                            }
                        </div>
                        {(PohonPemda?.value != undefined || null) &&
                            <>
                                <div className="flex justify-between items-start py-2 gap-2 h-full overflow-auto">
                                    {/* POHON PEMDA */}
                                    <div
                                        className={`flex flex-col rounded-lg shadow-lg px-2
                                    ${PohonPemda?.jenis_pohon === "Strategic Pemda" && 'border'}
                                    ${PohonPemda?.jenis_pohon === "Tactical Pemda" && 'border'}
                                    ${PohonPemda?.jenis_pohon === "OperationalPemda" && 'border'}
                                    ${PohonPemda?.jenis_pohon === "Strategic" && 'bg-red-700'}
                                    ${PohonPemda?.jenis_pohon === "Tactical" && 'bg-blue-500'}
                                    ${PohonPemda?.jenis_pohon === "Operational" && 'bg-green-500'}
                                    ${PohonPemda?.jenis_pohon === "Operational N" && 'bg-white'}
                                    ${(PohonPemda?.jenis_pohon === "Strategic Crosscutting" || PohonPemda?.jenis_pohon === "Tactical Crosscutting" || PohonPemda?.jenis_pohon === "Operational Crosscutting" || PohonPemda?.jenis_pohon === "Operational N Crosscutting") && 'bg-yellow-700'}
                                `}
                                    >
                                        <div
                                            className={`flex py-3 justify-center font-bold text-sm uppercase border my-3 rounded-lg bg-white
                                        ${PohonPemda?.jenis_pohon === "Strategic Pemda" && 'border-red-500 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                                        ${PohonPemda?.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                                        ${PohonPemda?.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                                        ${(PohonPemda?.jenis_pohon === "Strategic" || PohonPemda?.jenis_pohon === 'Strategic Crosscutting') && 'border-red-500 text-red-500'}
                                        ${(PohonPemda?.jenis_pohon === "Tactical" || PohonPemda?.jenis_pohon === 'Tactical Crosscutting') && 'border-blue-500 text-blue-500'}
                                        ${(PohonPemda?.jenis_pohon === "Operational" || PohonPemda?.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                                        ${(PohonPemda?.jenis_pohon === "Operational Crosscutting" || PohonPemda?.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                                    `}
                                        >
                                            {PohonPemda?.jenis_pohon}
                                        </div>
                                        <div className="mb-3">
                                            {PohonPemda &&
                                                <TablePohon item={PohonPemda} />
                                            }
                                        </div>
                                    </div>
                                    {/* POHON PARENT */}
                                    <div
                                        className={`flex flex-col rounded-lg shadow-lg px-2
                                    ${PohonParent?.jenis_pohon === "Strategic Pemda" && 'border'}
                                    ${PohonParent?.jenis_pohon === "Tactical Pemda" && 'border'}
                                    ${PohonParent?.jenis_pohon === "OperationalPemda" && 'border'}
                                    ${PohonParent?.jenis_pohon === "Strategic" && 'bg-red-700'}
                                    ${PohonParent?.jenis_pohon === "Tactical" && 'bg-blue-500'}
                                    ${PohonParent?.jenis_pohon === "Operational" && 'bg-green-500'}
                                    ${PohonParent?.jenis_pohon === "Operational N" && 'bg-white'}
                                    ${(PohonParent?.jenis_pohon === "Strategic Crosscutting" || PohonParent?.jenis_pohon === "Tactical Crosscutting" || PohonParent?.jenis_pohon === "Operational Crosscutting" || PohonParent?.jenis_pohon === "Operational N Crosscutting") && 'bg-yellow-700'}
                                `}
                                    >
                                        <div
                                            className={`flex py-3 justify-center font-bold text-sm uppercase border my-3 rounded-lg bg-white
                                        ${PohonParent?.jenis_pohon === "Strategic Pemda" && 'border-red-500 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                                        ${PohonParent?.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                                        ${PohonParent?.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                                        ${(PohonParent?.jenis_pohon === "Strategic" || PohonParent?.jenis_pohon === 'Strategic Crosscutting') && 'border-red-500 text-red-500'}
                                        ${(PohonParent?.jenis_pohon === "Tactical" || PohonParent?.jenis_pohon === 'Tactical Crosscutting') && 'border-blue-500 text-blue-500'}
                                        ${(PohonParent?.jenis_pohon === "Operational" || PohonParent?.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                                        ${(PohonParent?.jenis_pohon === "Operational Crosscutting" || PohonParent?.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                                    `}
                                        >
                                            {PohonParent?.jenis_pohon}
                                        </div>
                                        <div className="mb-3">
                                            {PohonParent &&
                                                <TablePohon item={PohonParent} />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    {/* TOMBOL TOLAK & TERIMA */}
                    {PohonPemda &&
                        <div className="flex gap-1 justify-between my-2">
                            <ButtonRedBorder
                                className='w-full'
                                disabled={Proses}
                                onClick={() => {
                                    if (PohonPemda?.value == null || undefined) {
                                        AlertNotification("Pilih", "Pilih Pohon dari pemda terlebih dahulu", "warning", 1000);
                                    } else {
                                        AlertQuestion2("Tolak?", "'koordinasikan ulang dengan BAPERIDA sebelum tolak, apakah anda yakin akan menghapus?", "warning", "Ya", "Tidak").then((result) => {
                                            if (result.isConfirmed) {
                                                tolakPohonPemda(PohonPemda?.value);
                                            }
                                        })
                                    }
                                }}
                            >
                                {Proses ?
                                    <span className="flex">
                                        <LoadingButtonClip />
                                        Menolak...
                                    </span>
                                    :
                                    <span className="flex items-center">
                                        <TbCircleLetterXFilled className='mr-1' />
                                        Tolak
                                    </span>
                                }
                            </ButtonRedBorder>
                            <ButtonSkyBorder
                                onClick={() => {
                                    if (PohonPemda?.value == null || undefined) {
                                        AlertNotification("Pilih", "Pilih Pohon dari pemda terlebih dahulu", "warning", 1000);
                                    } else {
                                        terimaPohonPemda(PohonPemda?.value);
                                    }
                                }}
                                className='w-full'
                                disabled={Proses}
                            >
                                {Proses ?
                                    <span className="flex">
                                        <LoadingButtonClip />
                                        Menerima...
                                    </span>
                                    :
                                    <span className="flex items-center">
                                        <TbCircleCheckFilled className='mr-1' />
                                        Terima
                                    </span>
                                }
                            </ButtonSkyBorder>
                        </div>
                    }
                    <ButtonRed className="w-full" onClick={handleClose}>
                        Batal
                    </ButtonRed>
                </div>
            </div>
        )
    }
}

export const ModalPohonCrosscutting: React.FC<modal> = ({ isOpen, onClose, onSuccess }) => {

    const [PohonCross, setPohonCross] = useState<TypePohonCross | null>(null);
    const [PohonParent, setPohonParent] = useState<OptionType | null>(null);
    const [LevelPohon, setLevelPohon] = useState<OptionType | null>(null);
    const [Baru, setBaru] = useState<boolean>(false);
    const [Pilih, setPilih] = useState<boolean>(false);

    const [OptionPohonParent, setOptionPohonParent] = useState<OptionType[]>([]);
    const [OptionPohonCross, setOptionPohonCross] = useState<TypePohonCross[]>([]);

    const [Proses, setProses] = useState<boolean>(false);
    const [IsLoading, setIsLoading] = useState<boolean>(false);

    const token = getToken();
    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

    useEffect(() => {
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
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

    const fetchPohonParent = async (level: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        let url = ''; // Deklarasikan di luar blok
        setIsLoading(true);
        try {
            if (User?.roles == 'super_admin') {
                url = `pohon_kinerja/pilih_parent/${SelectedOpd?.value}/${Tahun?.value}/${level}`;
            } else {
                url = `pohon_kinerja/pilih_parent/${User?.kode_opd}/${Tahun?.value}/${level}`;
            }

            if (!url) {
                throw new Error('URL tidak valid.');
            }

            const response = await fetch(`${API_URL}/${url}`, {
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
            if (data.data == null) {
                console.log("pohon opd kosong, tambahkan di pohon kinerja OPD untuk membuat pohon parent")
            } else {
                const parent = data.data.map((item: any) => ({
                    value: item.id,
                    label: `${item.jenis_pohon} - ${item.nama_pohon}`,
                    jenis: item.jenis_pohon,
                }));
                setOptionPohonParent(parent);
            }
        } catch (err) {
            console.log('gagal mendapatkan data pohon dari opd', err);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchPohonCross = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const url = User?.roles == 'super_admin' ? `/crosscutting_menunggu/${SelectedOpd?.value}/${Tahun?.value}` : `/crosscutting_menunggu/${User?.kode_opd}/${Tahun?.value}`;
            const response = await fetch(`${API_URL}/${url}`, {
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
            if (data.data == null) {
                console.log("pohon crosscutting kosong/belum ditambahkan")
            } else {
                const pokinCross = data.data.map((item: any) => ({
                    value: item.id,
                    label: `${item.status === "crosscutting_ditolak" ? "Ditolak" : item.status === "crosscutting_menunggu" ? "Pending" : "Unknown"} - ${item.keterangan} - ${item.opd_pengirim}`,
                    keterangan: item.keterangan,
                    opd_pengirim: item.opd_pengirim,
                }));
                setOptionPohonCross(pokinCross);
            }
        } catch (err) {
            console.log('gagal mendapatkan data pohon dari opd', err);
        } finally {
            setIsLoading(false);
        }
    };

    const terimaPohonCrossBaru = async (id: number, parent?: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            approve: true,
            create_new: true,
            use_existing: false,
            parent_id: parent,
            nip_pegawai: User?.nip,
            level_pohon: LevelPohon?.value,
            jenis_pohon: LevelPohon ? (
                LevelPohon?.value === 4 ? "Strategic Crosscutting" :
                    LevelPohon?.value === 5 ? "Tactical Crosscutting" :
                        LevelPohon?.value === 6 ? "Operational Crosscutting" :
                            LevelPohon?.value >= 7 ? "Operational N Crosscutting" : "Pohon Crosscutting"
            )
                :
                "",
        }
        // console.log(formData);
        // console.log("Baru", id);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/crosscutting/${id}/permission`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (!response.ok) {
                alert("cant fetch data")
            }
            if (result.code === 201 || result.code === 200) {
                AlertNotification("Berhasil", "Pohon dari pemda di terima", "success", 1000);
                setPohonCross(null);
                setPohonParent(null);
                setLevelPohon(null);
                onClose();
                onSuccess();
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    }
    const terimaPohonCrossPilih = async (id: number, parent?: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            approve: true,
            create_new: false,
            use_existing: true,
            nip_pegawai: User?.nip,
            existing_id: parent,
        }
        // console.log(formData);
        // console.log("Pilih", id);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/crosscutting/${id}/permission`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (!response.ok) {
                alert("cant fetch data")
            }
            if (result.code === 201 || result.code === 200) {
                AlertNotification("Berhasil", "Pohon dari pemda di terima", "success", 1000);
                setPohonCross(null);
                setPohonParent(null);
                setLevelPohon(null);
                onClose();
                onSuccess();
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    }
    const tolakPohonCross = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            approve: false,
            nip_pegawai: User?.nip,
        }
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/crosscutting/${id}/permission`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            if (!response.ok) {
                alert("cant fetch data");
                console.error
            }
            AlertNotification("Berhasil", "Data pohon berhasil di tolak", "success", 1000);
            setPohonCross(null);
            setPohonParent(null);
            onClose();
            onSuccess();
            // setTimeout(() => {
            //     window.location.reload();
            // }, 1000);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    }

    const OptionLevel = [
        { label: "Strategic", value: 4 },
        { label: "Tactical", value: 5 },
        { label: "Operational", value: 6 },
        { label: "Operational 1", value: 7 },
        { label: "Operational 2", value: 8 },
        { label: "Operational 3", value: 9 },
        { label: "Operational 4", value: 10 },
    ];

    const handleClose = () => {
        setPohonParent(null);
        setPohonCross(null);
        onClose();
    };
    const handleBaru = () => {
        setBaru(Baru ? false : true);
        setPilih(Baru === true ? false : false);
        setPohonParent(null);
    }
    const handlePilih = () => {
        setPilih(Pilih ? false : true);
        setBaru(Pilih === true ? false : false);
        setPohonParent(null);
        setLevelPohon(null);
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                {/* KONDISI ON CLOSE */}
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>

                <div className={`bg-white rounded-lg p-8 z-10 w-[50%] text-start ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                    <div className="w-max-[500px] py-2 border-b text-center font-bold">
                        Pohon OPD Crosscutting
                    </div>
                    <div className="py-5 my-5">
                        <div className="mb-1">
                            <label htmlFor="" className='uppercase text-xs font-medium text-gray-700 my-2 ml-1'>
                                Pohon Crosscutting OPD
                            </label>
                            <Select
                                placeholder="Pilih Pohon dari OPD lain"
                                value={PohonCross}
                                options={OptionPohonCross}
                                isSearchable
                                isClearable
                                isLoading={IsLoading}
                                menuPortalTarget={document.body} // Render menu ke document.body
                                onMenuOpen={() => {
                                    if (OptionPohonCross.length === 0) {
                                        fetchPohonCross();
                                    }
                                }}
                                onChange={(option) => {
                                    setPohonCross(option);
                                }}
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderRadius: '8px',
                                        textAlign: 'start',
                                    }),
                                    menuPortal: (base) => ({
                                        ...base, zIndex: 9999
                                    })
                                }}
                            />
                        </div>
                        {PohonCross &&
                            <table className="my-2 w-full">
                                <tbody>
                                    <tr>
                                        <td className="border p-2 min-w-[120px]">Keterangan</td>
                                        <td className="border p-2">:</td>
                                        <td className="border p-2 pl-2">{PohonCross?.keterangan}</td>
                                    </tr>
                                    <tr>
                                        <td className="border p-2 min-w-[120px]">OPD Asal</td>
                                        <td className="border p-2">:</td>
                                        <td className="border p-2 pl-2">{PohonCross?.opd_pengirim}</td>
                                    </tr>
                                </tbody>
                            </table>
                        }
                        <div className="mb-3">
                            <label htmlFor="" className='uppercase text-xs font-medium text-gray-700 my-2 ml-1'>
                                Status Terima Pohon
                            </label>
                            <div className="flex gap-1 mt-1">
                                <button
                                    className={`flex flex-wrap gap-1 items-center py-1 px-3 border rounded-xl transition-all duration-200 ${Baru ? 'bg-blue-500 text-white' : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'}`}
                                    onClick={handleBaru}
                                >
                                    <TbFilePlus />
                                    Baru
                                </button>
                                <button
                                    className={`flex flex-wrap gap-1 items-center py-1 px-3 border rounded-xl transition-all duration-200 ${Pilih ? 'bg-green-500 text-white' : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'}`}
                                    onClick={handlePilih}
                                >
                                    <TbFileCheck />
                                    Pilih
                                </button>
                            </div>
                        </div>
                        {/* BARU */}
                        {Baru &&
                            <>
                                <div className={`mb-1 transition-all duration-200`}>
                                    <label className={`uppercase text-xs font-medium text-gray-700 my-2 ml-1 transition-all duration-200`}>
                                        Level Pohon
                                    </label>
                                    <Select
                                        placeholder="Pilih Level Pohon"
                                        value={LevelPohon}
                                        options={OptionLevel}
                                        isSearchable
                                        isClearable
                                        isLoading={IsLoading}
                                        onChange={(option) => {
                                            setLevelPohon(option);
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                textAlign: 'start',
                                            })
                                        }}
                                    />
                                </div>
                                {LevelPohon?.value !== 4 &&
                                    <div className="mb-1">
                                        <label htmlFor="" className='uppercase text-xs font-medium text-gray-700 my-2 ml-1 transition-all duration-200'>
                                            {LevelPohon?.value === 5 ? 'Strategic' :
                                                LevelPohon?.value === 6 ? 'Tactical' :
                                                    LevelPohon?.value === 7 ? 'Operational' :
                                                        LevelPohon?.value === 8 ? 'Operational N' :
                                                            LevelPohon?.value === 9 ? 'Operational N' :
                                                                LevelPohon?.value === 10 ? 'Operational N' :
                                                                    "Pohon Parent"
                                            }
                                        </label>
                                        <Select
                                            placeholder="pilih parent"
                                            value={PohonParent}
                                            options={OptionPohonParent}
                                            isSearchable
                                            isClearable
                                            isLoading={IsLoading}
                                            onMenuOpen={() => {
                                                if (LevelPohon?.value === 5) {
                                                    fetchPohonParent(4);
                                                } else if (LevelPohon?.value === 6) {
                                                    fetchPohonParent(5);
                                                } else if (LevelPohon?.value === 7) {
                                                    fetchPohonParent(6);
                                                } else if (LevelPohon?.value === 8) {
                                                    fetchPohonParent(7);
                                                } else if (LevelPohon?.value === 9) {
                                                    fetchPohonParent(8);
                                                } else if (LevelPohon?.value === 10) {
                                                    fetchPohonParent(9);
                                                }
                                            }}
                                            onChange={(option) => {
                                                setPohonParent(option);
                                            }}
                                            onMenuClose={() => setOptionPohonParent([])}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                    textAlign: 'start',
                                                })
                                            }}
                                        />
                                    </div>
                                }
                            </>
                        }
                        {/* PILIH */}
                        {Pilih &&
                            <div className="mb-1">
                                <label htmlFor="" className='uppercase text-xs font-medium text-gray-700 my-2 ml-1 transition-all duration-200'>
                                    Pohon untuk dipilih
                                </label>
                                <Select
                                    placeholder="Pilih pohon untuk dijadikan pilihan crosscutting"
                                    value={PohonParent}
                                    options={OptionPohonParent}
                                    isSearchable
                                    isClearable
                                    isLoading={IsLoading}
                                    onMenuOpen={() => {
                                        fetchPohonParent(0);
                                    }}
                                    onChange={(option) => {
                                        setPohonParent(option);
                                    }}
                                    onMenuClose={() => setOptionPohonParent([])}
                                    styles={{
                                        control: (baseStyles) => ({
                                            ...baseStyles,
                                            borderRadius: '8px',
                                            textAlign: 'start',
                                        })
                                    }}
                                />
                            </div>
                        }
                    </div>
                    <div className="flex gap-1 justify-between my-2">
                        <ButtonRedBorder
                            className='w-full transition-all duration-200'
                            disabled={Proses}
                            onClick={() => {
                                if (PohonCross?.value == null || undefined) {
                                    AlertNotification("Pilih", "Pilih Pohon dari pemda terlebih dahulu", "warning", 1000);
                                } else {
                                    tolakPohonCross(PohonCross?.value);
                                }
                            }}
                        >
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menolak...
                                </span>
                                :
                                <span className="flex items-center">
                                    <TbCircleLetterXFilled className='mr-1' />
                                    Tolak
                                </span>
                            }
                        </ButtonRedBorder>
                        <ButtonSkyBorder
                            onClick={() => {
                                if (PohonCross?.value == null || undefined) {
                                    AlertNotification("Pilih", "Pilih Pohon dari pemda terlebih dahulu", "warning", 2000);
                                } else {
                                    if (Baru) {
                                        if (LevelPohon?.value == null || undefined) {
                                            AlertNotification("Level Pohon", "Pilih Level Pohon", "warning", 2000);
                                        } else if (LevelPohon?.value === 4) {
                                            terimaPohonCrossBaru(PohonCross?.value, 0);
                                        } else if (LevelPohon?.value >= 4) {
                                            if (PohonParent?.value == null || undefined) {
                                                AlertNotification("Pohon Parent", "Pilih Pohon Parent", "warning", 2000);
                                            } else {
                                                terimaPohonCrossBaru(PohonCross?.value, PohonParent?.value);
                                            }
                                        } else {
                                            console.log("level tidak terdeskripsikan di form");
                                        }
                                    } else if (Pilih) {
                                        if (PohonParent?.value === null || PohonParent?.value === undefined) {
                                            AlertNotification("Pohon Pilihan", "Pilih Pohon yang sudah ada untuk dijadikan target crosscutting", "warning", 2000);
                                        } else {
                                            terimaPohonCrossPilih(PohonCross?.value, PohonParent?.value);
                                        }
                                    } else {
                                        AlertNotification("Status", "Pilih Status Pohon Baru atau Pilih Pohon yang sudah ada", "warning", 2000);
                                    }
                                }
                            }}
                            className='w-full transition-all duration-200'
                            disabled={Proses}
                        >
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menerima...
                                </span>
                                :
                                <span className="flex items-center">
                                    <TbCircleCheckFilled className='mr-1' />
                                    {Baru && 'Terima (Baru)'}
                                    {Pilih && 'Terima (Pilih)'}
                                    {(!Baru && !Pilih) && 'Terima'}
                                </span>
                            }
                        </ButtonSkyBorder>
                    </div>
                    <ButtonRed className="w-full" onClick={handleClose}>
                        Batal
                    </ButtonRed>
                </div>
            </div>
        )
    }
}

export const TableDetailPohonPemda = (props: any) => {

    const tema = props?.item?.[0]?.tema;
    const jenis = props?.item?.[0]?.jenis_pohon;
    const childs = props?.item?.[0]?.childs;
    const tagging = props?.item?.[0]?.tagging;

    return (
        <>
            <li className="list-none">
                <div
                    className={`tf-nc tf flex flex-col rounded-lg shadow-lg border list-none
                        ${jenis === "Strategic Pemda" && 'shadow-slate-500'}
                        ${jenis === "Tactical Pemda" && 'shadow-slate-500'}
                        ${jenis === "OperationalPemda" && 'shadow-slate-500'}
                        ${jenis === "Strategic" && 'shadow-red-500 bg-red-700'}
                        ${jenis === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                        ${jenis === "Operational" && 'shadow-green-500 bg-green-500'}
                        ${jenis === "Operational N" && 'shadow-slate-500 bg-white'}
                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && 'shadow-yellow-700 bg-yellow-700'}
                    `}
                >
                    {/* HEADER */}
                    <div
                        className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 mx-3 py-3 rounded-lg bg-white
                            ${jenis === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                            ${jenis === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                            ${jenis === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                            ${(jenis === "Strategic" || jenis === 'Strategic Crosscutting') && 'border-red-500 text-red-700'}
                            ${(jenis === "Tactical" || jenis === 'Tactical Crosscutting') && 'border-blue-500 text-blue-500'}
                            ${(jenis === "Operational" || jenis === "Operational N") && 'border-green-500 text-green-500'}
                            ${(jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                            ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === 'Sub Sub Tematik' || jenis === 'Super Sub Tematik') && 'border-black text-black'}
                        `}
                    >
                        {jenis === 'Operational N' ?
                            <h1>Operational {jenis - 6}  </h1>
                            :
                            <h1>{jenis} </h1>
                        }
                    </div>
                    {/* BODY */}
                    <div className="flex flex-col w-full justify-center m-3">
                        {/* TAGGING */}
                        {tagging &&
                            tagging.map((tg: Tagging, tag_index: number) => (
                                <div key={tag_index} className="flex flex-col gap-1 w-full px-3 py-1 border border-yellow-400 rounded-lg bg-white mb-2">
                                    <div className='flex items-center gap-1'>
                                        <h1 className='text-emerald-500'><TbCircleCheckFilled /></h1>
                                        <h1 className='font-semibold'>{tg.nama_tagging || "-"}</h1>
                                    </div>
                                    <h1 className="p-1 text-slate-600 text-start">{tg.keterangan_tagging || ""}</h1>
                                </div>
                            ))
                        }
                        <table className='w-full'>
                            <tbody>
                                <tr>
                                    <td
                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tl-lg
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === 'Super Sub Tematik') && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                        `}
                                    >
                                        {(jenis === 'Tematik' || jenis === 'Sub Tematik' || jenis === 'Sub Sub Tematik' || jenis === 'Super Sub Tematik') && 'Tema'}
                                        {(jenis === 'Strategic' || jenis === 'Strategic Pemda' || jenis === 'Strategic Crosscutting') && 'Strategic'}
                                        {(jenis === 'Tactical' || jenis === 'Tactical Pemda' || jenis === 'Tactical Crosscutting') && 'Tactical'}
                                        {(jenis === 'Operational' || jenis === 'Operational Pemda' || jenis === 'Operational Crosscutting') && 'Operational'}
                                        {(jenis === 'Operational N' || jenis === 'Operational N Crosscutting') && 'Operational N'}
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                            ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                            ${(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === 'Super Sub Tematik') && "border-black"}
                                            ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                        `}
                                    >
                                        {tema ? tema : "-"}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <ul className="list-none">
                    {childs &&
                        <TableDetailPohonPemda item={childs} />
                    }
                </ul>
            </li>
        </>
    )
}