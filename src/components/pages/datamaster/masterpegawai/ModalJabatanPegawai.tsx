'use client'

import { useState } from "react";
import { TbDeviceFloppy, TbX, TbCheck } from "react-icons/tb";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from "@/components/global/Button";
import { AlertNotification } from "@/components/global/Alert";
import { LoadingButtonClip } from "@/components/global/Loading";
import { OptionTypeString, OptionType } from "@/types";
import { useBrandingContext } from "@/context/BrandingContext";
import Select from 'react-select';
import { getToken } from "@/components/lib/Cookie";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: pegawai | User | null;
    kode_opd: string;
    nama_opd: string;
}
interface User {
    id: string;
    nip: string;
    email: string;
    nama_pegawai: string;
    id_jabatan: string;
    nama_jabatan: string;
    pegawai_id: string;
    is_active: boolean;
    role: roles[];
}
interface roles {
    id: string;
    role: string;
}
interface pegawai {
    id: string;
    nama_pegawai: string;
    nip: string;
    kode_opd: string;
    nama_opd: string;
    id_jabatan: string,
    nama_jabatan: string,
}
interface Jabatan {
    id: string;
    kode_jabatan: string;
    nama_jabatan: string;
    operasional_daerah: {
        kode_opd: string;
        nama_opd: string;
    };
}
export interface FormValue {
    kode_opd: OptionTypeString;
    nip: string;
    id_jabatan: OptionTypeString | null;
    tahun: number;
    bulan: OptionType | null;
}

export const ModalJabatanPegawai: React.FC<modal> = ({ isOpen, onClose, onSuccess, Data, kode_opd, nama_opd }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            nip: Data?.nip,
            kode_opd: {
                value: kode_opd,
                label: nama_opd
            },
            id_jabatan: null,
            tahun: branding?.tahun?.value,
            bulan: null,
        }
    });

    const [OptionJabatan, setOptionJabatan] = useState<OptionTypeString[]>([]);
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    const handleClose = () => {
        onClose();
        reset();
    }

    const OptionBulan = [
        { label: "Januari", value: 1 },
        { label: "Februari", value: 2 },
        { label: "Maret", value: 3 },
        { label: "April", value: 4 },
        { label: "Mei", value: 5 },
        { label: "Juni", value: 6 },
        { label: "Juli", value: 7 },
        { label: "Agustus", value: 8 },
        { label: "September", value: 9 },
        { label: "Oktober", value: 10 },
        { label: "November", value: 11 },
        { label: "Desember", value: 12 },
    ]
    const fetchJabatan = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setLoadingOption(true);
        try {
            const response = await fetch(`${API_URL}/jabatan/findall/${kode_opd}`, {
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
                value: item.id,
                label: item.nama_jabatan,
            }));
            setOptionJabatan(opd);
        } catch (err) {
            console.log('gagal mendapatkan data opd');
        } finally {
            setLoadingOption(false);
        }
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const payload = {
            nip: data.nip,
            kode_opd: data.kode_opd?.value,
            id_jabatan: data.id_jabatan?.value,
            tahun: branding?.tahun?.value,
            bulan: data.bulan?.value
        }
        // console.log(payload);
        try {
            setProses(true);
            const response = await fetch(`${branding?.api_perencanaan}/pegawai/tambahJabatan`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "Berhasil menambahkan data Jabatan", "success", 1000);
                onSuccess();
                handleClose();
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 max-h-[80%] text-start overflow-auto`}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="w-max-[500px] py-2 mb-2 border-b-2 border-gray-300 text-center uppercase font-bold">
                            Tambah Jabatan
                        </div>
                        <table className="w-full mt-3">
                            <tbody>
                                <tr>
                                    <td className="bg-slate-300 p-2 w-[150px] rounded-tl-lg border-b border-r border-white">Nama Pegawai</td>
                                    <td className="bg-slate-300 p-2 rounded-tr-lg border-b border-white">{Data?.nama_pegawai ?? "-"}</td>
                                </tr>
                                <tr>
                                    <td className="bg-slate-300 p-2 rounded-bl-lg border-r border-white">NIP</td>
                                    <td className="bg-slate-300 p-2 rounded-br-lg">{Data?.nip ?? "-"}</td>
                                </tr>
                            </tbody>
                        </table>
                        <Controller
                            name="id_jabatan"
                            control={control}
                            rules={{ required: "Lembaga Harus Terisi" }}
                            render={({ field }) => (
                                <>
                                    <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="id_jabatan">
                                        Jabatan:
                                    </label>
                                    <Select
                                        {...field}
                                        placeholder="Masukkan Jabatan"
                                        options={OptionJabatan}
                                        isLoading={LoadingOption}
                                        isSearchable
                                        isClearable
                                        onMenuOpen={() => {
                                            if (OptionJabatan.length === 0) {
                                                fetchJabatan();
                                            }
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                            })
                                        }}
                                    />
                                </>
                            )}
                        />
                        <Controller
                            name="bulan"
                            control={control}
                            rules={{ required: "Lembaga Harus Terisi" }}
                            render={({ field }) => (
                                <>
                                    <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="bulan">
                                        Bulan:
                                    </label>
                                    <Select
                                        {...field}
                                        placeholder="Masukkan Bulan"
                                        options={OptionBulan}
                                        isSearchable
                                        isClearable
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                            })
                                        }}
                                    />
                                </>
                            )}
                        />
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_opd"
                            >
                                Perangkat Daerah
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{branding?.opd?.label}</div>
                        </div>
                        <ButtonSky type="submit" className="w-full my-3 gap-1" disabled={Proses}>
                            {Proses ?
                                <>
                                    <LoadingButtonClip />
                                    <span>menyimpan</span>
                                </>
                                :
                                <>
                                    <TbDeviceFloppy />
                                    <span>Simpan</span>
                                </>
                            }
                        </ButtonSky>
                        <ButtonRed className="flex items-center gap-1 w-full my-3" onClick={handleClose} disabled={Proses}>
                            <TbX />
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}