'use client'

import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import { useBrandingContext } from "@/context/BrandingContext";

interface ProgramUnggulan {
    id: number;
    kode_program_unggulan: string;
    nama_program_unggulan: string;
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
    dataEdit?: ProgramUnggulan;
    tahun_awal: string;
    tahun_akhir: string;
}

interface FormValue {
    nama_program_unggulan: string,
    rencana_implementasi: string,
    keterangan: string,
    tahun_awal: string,
    tahun_akhir: string,
}

export const ModalProgramUnggulan: React.FC<ModalProps> = ({ isOpen, onClose, dataEdit, jenis, onSuccess, tahun_awal, tahun_akhir }) => {
    const { control, handleSubmit, reset, formState:{ errors }} = useForm<FormValue>({
        defaultValues: {
            nama_program_unggulan: dataEdit?.nama_program_unggulan,
            rencana_implementasi: dataEdit?.rencana_implementasi,
            keterangan: dataEdit?.keterangan,
            tahun_awal: tahun_awal,
            tahun_akhir: tahun_akhir,
        },
    });

    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();
    const {branding} = useBrandingContext();

    const handleClose = () => {
        reset({
            nama_program_unggulan: "",
            rencana_implementasi: "",
            keterangan: "",
            tahun_awal: "",
            tahun_akhir: "",
        });
        onClose();
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        let endpoint = "";
        if (jenis === "edit") {
            endpoint = `program_unggulan/update/${dataEdit?.id}`;
        } else if (jenis === "baru") {
            endpoint = `program_unggulan/create`;
        } else {
            endpoint = '';
        }
        const formData = {
            //key : value
            nama_program_unggulan: data.nama_program_unggulan,
            rencana_implementasi: data.rencana_implementasi,
            keterangan: data.keterangan,
            tahun_awal: tahun_awal,
            tahun_akhir: tahun_akhir,
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
                AlertNotification("Berhasil", jenis === 'baru' ? "Berhasil menambahkan Program Unggulan" : "Berhasil Mengubah Program Unggulan", "success", 1000);
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
                        {jenis === 'baru' ? "Tambah" : "Edit"} Progam Unggulan
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_program_unggulan"
                        >
                            {branding?.client === "KABUPATEN-MAHAKAM-ULU" ? 
                                "Program Prioritas"
                            :
                                "Program Hebat / Unggulan"
                            }
                        </label>
                        <Controller
                            name="nama_program_unggulan"
                            control={control}
                            rules={{ required: "program harus terisi" }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nama_program_unggulan"
                                    type="text"
                                    placeholder="masukkan program"
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                />
                            )}
                        />
                        {errors.nama_program_unggulan &&
                            <p className="text-red-500 italic">{errors.nama_program_unggulan?.message}</p>
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
