'use client'

import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import { useBrandingContext } from "@/context/BrandingContext";

interface ProgramPrioritasDaerah {
    id: number;
    kode_program_prioritas_daerah: string;
    nama_program_prioritas_daerah: string;
    rencana_implementasi: string;
    keterangan: string;
    tahun_awal: string;
    tahun_akhir: string;
}
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    jenis: "baru" | "edit";
    dataEdit?: ProgramPrioritasDaerah;
    tahun_awal: string;
    tahun_akhir: string;
}

interface FormValue {
    kode_program_prioritas_daerah: string,
    nama_program_prioritas_daerah: string,
    rencana_implementasi: string,
    keterangan: string,
    tahun_awal: string,
    tahun_akhir: string,
    is_active: string,
}

export const ModalProgramPrioritasDaerah: React.FC<ModalProps> = ({ isOpen, onClose, dataEdit, jenis, onSuccess, tahun_awal, tahun_akhir }) => {
    const{ control, handleSubmit, reset, formState:{ errors }} = useForm<FormValue>({
        defaultValues: {
            kode_program_prioritas_daerah: dataEdit?.kode_program_prioritas_daerah,
            nama_program_prioritas_daerah: dataEdit?.nama_program_prioritas_daerah,
            rencana_implementasi: dataEdit?.rencana_implementasi,
            keterangan: dataEdit?.keterangan,
            tahun_awal: tahun_awal,
            tahun_akhir: tahun_akhir,
            is_active: "true",
        },
    });

    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();
    const {branding} = useBrandingContext();

    const handleClose = () => {
        reset({
            kode_program_prioritas_daerah: "",
            nama_program_prioritas_daerah: "",
            rencana_implementasi: "",
            keterangan: "",
            tahun_awal: "",
            tahun_akhir: "",
            is_active: "true",
        });
        onClose();
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        let endpoint = "";
        if (jenis === "edit") {
            endpoint = `program-prioritas-daerahs/${dataEdit?.id}`;
        } else if (jenis === "baru") {
            endpoint = `program-prioritas-daerahs`;
        } else {
            endpoint = '';
        }
        const formData = {
            //key : value
            kode_program_prioritas_daerah: data.kode_program_prioritas_daerah,
            nama_program_prioritas_daerah: data.nama_program_prioritas_daerah,
            rencana_implementasi: data.rencana_implementasi,
            keterangan: data.keterangan,
            tahun_awal: tahun_awal,
            tahun_akhir: tahun_akhir,
            is_active: data.is_active,
        };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: jenis === 'edit' ? "PUT" : "POST",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", jenis === 'baru' ? "Berhasil menambahkan Program Prioritas Daerah" : "Berhasil Mengubah Program Prioritas Daerah", "success", 1000);
                onClose();
                onSuccess();
            } else {
                console.log(result);
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "Cek koneksi internet / terdapat kesalahan pada server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>
            <div className="bg-white rounded-lg p-8 z-10 w-3/5 text-start">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-max-[500px] py-2 border-b font-bold text-center">
                        {jenis === 'baru' ? "Tambah" : "Edit"} Program Prioritas Daerah
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="kode_program_prioritas_daerah"
                        >
                            Kode Program Prioritas
                        </label>
                        <Controller
                            name="kode_program_prioritas_daerah"
                            control={control}
                            rules={{ required: "kode program harus terisi" }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="kode_program_prioritas_daerah"
                                    type="text"
                                    placeholder="masukkan kode program"
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                />
                            )}
                        />
                        {errors.kode_program_prioritas_daerah &&
                            <p className="text-red-500 italic">{errors.kode_program_prioritas_daerah?.message}</p>
                        }
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_program_prioritas_daerah"
                        >
                            {branding?.client === "KABUPATEN-MAHAKAM-ULU" ? 
                                "Program Prioritas"
                            :
                                "Program Prioritas Daerah"
                            }
                        </label>
                        <Controller
                            name="nama_program_prioritas_daerah"
                            control={control}
                            rules={{ required: "program harus terisi" }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nama_program_prioritas_daerah"
                                    type="text"
                                    placeholder="masukkan program"
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                />
                            )}
                        />
                        {errors.nama_program_prioritas_daerah &&
                            <p className="text-red-500 italic">{errors.nama_program_prioritas_daerah?.message}</p>
                        }
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="rencana_implementasi"
                        >
                            Rencana Implementasi
                        </label>
                        <Controller
                            name="rencana_implementasi"
                            control={control}
                            rules={{ required: "renana implementasi harus terisi" }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="rencana_implementasi"
                                    type="text"
                                    placeholder="masukkan rencana implementasi"
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                />
                            )}
                        />
                        {errors.rencana_implementasi &&
                            <p className="text-red-500 italic">{errors.rencana_implementasi?.message}</p>
                        }
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="keterangan"
                        >
                            keterangan
                        </label>
                        <Controller
                            name="keterangan"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="keterangan"
                                    type="text"
                                    placeholder="masukkan keterangan"
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-row items-center py-3 gap-2">
                        <Controller
                            name="is_active"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="checkbox"
                                    id="is_active"
                                    checked={field.value === "true"}
                                    onChange={(e) => field.onChange(e.target.checked ? "true" : "false")}
                                    className="w-4 h-4"
                                />
                            )}
                        />
                        <label htmlFor="is_active" className="text-sm font-bold text-gray-700">
                            Aktif
                        </label>
                    </div>
                    <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                        {Proses ?
                            <span className="flex">
                                <LoadingButtonClip />
                                {jenis === 'baru' ? "Menambahkan" : "Menyimpan"}
                            </span>
                            :
                            jenis === 'baru' ? "Tambah" : "Simpan"
                        }
                    </ButtonSky>
                    <ButtonRed type="button" className="w-full my-3" onClick={handleClose}>
                        Batal
                    </ButtonRed>
                </form>
            </div>
        </div>
    );
};