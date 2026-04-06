'use client'

import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip, LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { useBrandingContext } from "@/context/BrandingContext";

interface FormValue {
    kode_subkegiatan: string;
    kode_opd: string;
    tahun: string;
    pagu_indikatif: number;
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    pagu: number;
    kode: string;
    tahun: string;
    kode_opd?: string;
}

export const ModalAnggaranMatrixRenja: React.FC<modal> = ({ isOpen, onClose, kode, kode_opd, pagu, tahun, onSuccess }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, reset } = useForm<FormValue>({
        defaultValues: {
            kode_subkegiatan: kode,
            kode_opd: kode_opd,
            tahun: tahun,
            pagu_indikatif: pagu ?? 0,
        }
    });

    const token = getToken();
    const [Pagu, setPagu] = useState<number | null>(null);

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const payload = {
            kode_subkegiatan: kode,
            kode_opd: kode_opd,
            tahun: tahun,
            pagu_indikatif: data.pagu_indikatif,
        }
        // console.log(payload);
        try {
            let url = "matrix_renja/anggaran_penetapan/upsert";
            setProses(true);
            const response = await fetch(`${branding?.api_perencanaan}/${url}`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (result.code === 201 || result.code === 200) {
                AlertNotification("Berhasil", `Mengubah Pagu Anggaran`, "success", 1000);
                onClose();
                onSuccess();
                reset();
            } else if (result.code === 500) {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server dengan response !ok", "error", 2000);
                console.error(result);
            }
        } catch (err) {
            AlertNotification("Gagal", `${err}`, "error", 2000);
        } finally {
            setProses(false);
        }
    };

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

    const handleClose = () => {
        onClose();
        reset();
    }

    if (!isOpen) {
        return null;
    } else {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    {IsLoading ?
                        <LoadingClip />
                        :
                        <>
                            <div className="w-max-[500px] py-2 border-b">
                                <h1 className="text-xl uppercase text-center">Pagu Renja</h1>
                            </div>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex flex-col mx-5 py-5"
                            >
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="pagu_indikatif"
                                    >
                                        Pagu Anggaran (Rp.)
                                    </label>
                                    <Controller
                                        name="pagu_indikatif"
                                        control={control}
                                        render={({ field }) => {
                                            const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                                const inputValue = e.target.value;
                                                const numericValue = unformatNumber(inputValue);

                                                // Update nilai di React Hook Form
                                                field.onChange(numericValue);

                                                // Jika Anda tetap butuh state Pagu di luar untuk keperluan lain:
                                                setPagu(numericValue);
                                            };

                                            // GUNAKAN field.value agar defaultValue dari useForm otomatis muncul
                                            const displayValue = formatNumberWithDots(field.value);

                                            return (
                                                <input
                                                    {...field}
                                                    value={displayValue} // Sinkron dengan RHF
                                                    onChange={handleInputChange}
                                                    className="border px-4 py-2 rounded-lg"
                                                    id="pagu_indikatif"
                                                    placeholder="masukkan Pagu Anggaran"
                                                    type="text"
                                                    inputMode="numeric"
                                                />
                                            );
                                        }}
                                    />
                                </div>
                                <ButtonSky className="w-full mt-3" type="submit" disabled={Proses}>
                                    {Proses ?
                                        <span className="flex">
                                            <LoadingButtonClip />
                                            Menyimpan...
                                        </span>
                                        :
                                        "Simpan"
                                    }
                                </ButtonSky>
                                <ButtonRed type="button" className="w-full my-2" onClick={handleClose}>
                                    Batal
                                </ButtonRed>
                            </form>
                        </>
                    }
                </div>
            </div>
        )
    }
}