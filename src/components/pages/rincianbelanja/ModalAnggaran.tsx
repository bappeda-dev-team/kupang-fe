'use client'

import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";

interface FormValue {
    anggaran: number;
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    id?: string;
    nama_renaksi: string;
    anggaran: number | null;
    onSuccess: () => void;
}


export const ModalAnggaran: React.FC<modal> = ({ isOpen, onClose, nama_renaksi, anggaran, id, onSuccess }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const token = getToken();

    const [Anggaran, setAnggaran] = useState<number | null>(null);
    const [Proses, setProses] = useState<boolean>(false);

    useEffect(() => {
        if (anggaran === 0) {
            setAnggaran(null);
        } else {
            setAnggaran(anggaran);
        }
    }, [anggaran]);

    const onSubmit: SubmitHandler<FormValue> = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const payload = {
            //key : value
            renaksi_id: id,
            anggaran: Anggaran,
        };
        // const getBody = () => {
        //     if (metode === "lama") return formDataEdit;
        //     if (metode === "baru") return formDataNew;
        //     return {}; // Default jika metode tidak sesuai
        // };
        if (Anggaran === null) {
            AlertNotification("Anggaran tidak boleh kosong", "", "warning", 3000);
        } else {
            // metode === 'baru' && console.log("baru :", formDataNew);
            // metode === 'lama' && console.log("lama :", formDataEdit);
            try {
                let url = "";
                url = `rincian_belanja/upsert`;
                setProses(true);
                const response = await fetch(`${API_URL}/${url}`, {
                    method: "POST",
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (result.code === 200 || result.code === 201) {
                    AlertNotification("Berhasil", `Berhasil menyimpan Anggaran Renaksi`, "success", 1000);
                    onClose();
                    onSuccess();
                } else {
                    AlertNotification("Gagal", `${result.data}`, "error", 2000);
                }
            } catch (err) {
                AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            } finally {
                setProses(false);
            }
        }
    };

    const handleClose = () => {
        onClose();
        setAnggaran(null);
    }
    const formatNumberWithDots = (value: number | string | null) => {
        if (value === null || value === undefined || value === '') return '';
        // Hapus karakter non-digit yang mungkin sudah ada (termasuk titik atau spasi)
        const numberString = String(value).replace(/\D/g, '');
        if (numberString === '') return '';
        // Format dengan TITIK sebagai pemisah ribuan
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Ganti ' ' menjadi '.'
    };
    const unformatNumber = (value: number | string) => {
        if (value === null || value === undefined || value === '') return null;
        // Hapus spasi, titik, dan karakter non-digit lainnya
        const numberString = String(value).replace(/\D/g, '');
        // Kembalikan null jika string kosong, atau angka jika valid
        return numberString === '' ? null : Number(numberString);
    };

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">Edit Anggaran Renaksi</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                            >
                                Nama Tahapan Rencana Aksi :
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{nama_renaksi || "-"}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="anggaran"
                            >
                                Anggaran (Rp.):
                            </label>
                            <Controller
                                name="anggaran"
                                control={control}
                                render={({ field }) => {
                                    const handleInputChange = (e: any) => {
                                        const inputValue = e.target.value;
                                        const numericValue = unformatNumber(inputValue);
                                        field.onChange(numericValue);
                                        setAnggaran(unformatNumber(inputValue));
                                    };
                                    const displayValue = formatNumberWithDots(Anggaran);
                                    return (
                                        <input
                                            ref={field.ref}
                                            onBlur={field.onBlur}
                                            className="border px-4 py-2 rounded-lg"
                                            id="anggaran"
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="masukkan anggaran tahapan renaksi"
                                            value={displayValue === null ? "" : displayValue}
                                            onChange={handleInputChange}
                                        />
                                    )
                                }}
                            />
                        </div>
                        <ButtonSky className="w-full mt-3 mb-2" type="submit" disabled={Proses}>
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full mb-3" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}