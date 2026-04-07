'use client'

import { useState, useEffect } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from "@/components/global/Button";
import { AlertNotification } from "@/components/global/Alert";
import { LoadingButtonClip } from "@/components/global/Loading";
import { OptionTypeString } from "@/types";
import { useBrandingContext } from "@/context/BrandingContext";
import Select from 'react-select';
import { getToken } from "@/components/lib/Cookie";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: Pegawai | User | null;
    kode_opd: string;
    nama_opd: string;
    jenis: "tambah" | "edit";
    jabatanId?: number;
}
interface User {
    id: string;
    nip: string;
    email: string;
    nama_pegawai: string;
    id_jabatan: string;
    nama_jabatan: string;
    pegawai_id?: string;
    is_active: boolean;
    role: roles[];
}
interface roles {
    id: string;
    role: string;
}
interface Pegawai {
    id: number;
    nama_pegawai: string;
    nip: string;
    kode_opd: string;
    nama_opd: string;
    id_jabatan?: string,
    nama_jabatan?: string,
}

export interface FormValue {
    nama_jabatan: OptionTypeString | null;
    jabatan_id: number;
    pegawai_id: number;
    tahun: string;
}

export const ModalJabatanPegawai: React.FC<modal> = ({ isOpen, onClose, onSuccess, Data, kode_opd, nama_opd, jenis, jabatanId }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            nama_jabatan: null,
            jabatan_id: 0,
            pegawai_id: Data?.id as number || 0,
            tahun: branding?.tahun?.value?.toString() || '',
        }
    });

    const [OptionJabatan, setOptionJabatan] = useState<OptionTypeString[]>([]);
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        if (jenis === "edit" && Data) {
            reset({
                nama_jabatan: Data.nama_jabatan ? { value: Data.nama_jabatan, label: Data.nama_jabatan } : null,
                jabatan_id: jabatanId || 0,
                pegawai_id: Data.id as number,
                tahun: branding?.tahun?.value?.toString() || '',
            });
        } else {
            reset({
                nama_jabatan: null,
                jabatan_id: 0,
                pegawai_id: Data?.id as number || 0,
                tahun: branding?.tahun?.value?.toString() || '',
            });
        }
    }, [jenis, Data, jabatanId, branding, reset]);

    const handleClose = () => {
        onClose();
        reset();
    }

    const fetchJabatan = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setLoadingOption(true);
        try {
            const response = await fetch(`${API_URL}/pegawais/jabatan`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data jabatan');
            }
            const result = await response.json();
            const data = result.data || result;
            const jabatan = Array.isArray(data) ? data.map((item: any) => ({
                value: item.nama_jabatan || item.id || item,
                label: item.nama_jabatan || item.nama || item,
            })) : [];
            setOptionJabatan(jabatan);
        } catch (err) {
            console.log('gagal mendapatkan data jabatan', err);
        } finally {
            setLoadingOption(false);
        }
    };
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        
        const payload = {
            jabatan_id: data.jabatan_id || 0,
            nama_jabatan: data.nama_jabatan?.value,
            Pegawai_id: Data?.id,
            tahun: branding?.tahun?.value?.toString()
        };

        const isEdit = jenis === "edit" && jabatanId;
        const url = isEdit 
            ? `${API_URL}/pegawais/jabatan/${jabatanId}`
            : `${API_URL}/pegawais/jabatan`;
        const method = isEdit ? "PUT" : "POST";

        try {
            setProses(true);
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", isEdit ? "Berhasil mengubah data Jabatan" : "Berhasil menambahkan data Jabatan", "success", 1000);
                onSuccess();
                handleClose();
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 20000);
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
                            {jenis === "edit" ? "Edit" : "Tambah"} Jabatan
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
                            name="jabatan_id"
                            control={control}
                            render={({ field }) => (
                                <input type="hidden" {...field} value={jabatanId || 0} />
                            )}
                        />
                        <Controller
                            name="nama_jabatan"
                            control={control}
                            rules={{ required: "Jabatan Harus Terisi" }}
                            render={({ field }) => (
                                <>
                                    <label className="uppercase text-xs font-bold text-gray-700 my-2" htmlFor="nama_jabatan">
                                        Jabatan:
                                    </label>
                                    <Select
                                        {...field}
                                        placeholder="Pilih Jabatan"
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
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tahun"
                            >
                                Tahun
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{branding?.tahun?.value}</div>
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
                                    <span>{jenis === "edit" ? "Update" : "Simpan"}</span>
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
