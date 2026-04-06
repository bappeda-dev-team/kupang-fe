'use client'

import React, { useState, useEffect } from "react";
import { TbTrash } from "react-icons/tb";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip, LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";

interface FormValue {
    kode_subkegiatan: string;
    kode_opd: string;
    tahun: string;
    pagu_indikatif: number;
    jenis: "renstra"
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    nama: string;
    jenis: string;
    pagu: number;
    kode: string;
    tahun?: string;
    kode_opd?: string;
    onSuccess: () => void;
}

export const ModalPaguAnggaran: React.FC<modal> = ({ isOpen, onClose, kode, nama, jenis, kode_opd, pagu, tahun, onSuccess }) => {

    const { control, handleSubmit, reset } = useForm<FormValue>({
        defaultValues: {
            kode_subkegiatan: kode,
            kode_opd: kode_opd,
            tahun: tahun,
            pagu_indikatif: pagu,
        }
    });

    const token = getToken();
    const [Pagu, setPagu] = useState<number | null>(null);

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const payload = {
            kode_subkegiatan: kode,
            kode_opd: kode_opd,
            tahun: tahun,
            jenis: "renstra",
            pagu_indikatif: Pagu,
        }
        // console.log(payload);
        try {
            let url = "matrix_renstra/upsert_anggaran";
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
                                <h1 className="text-xl uppercase text-center">Pagu</h1>
                            </div>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex flex-col mx-5 py-5"
                            >
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                    >
                                        {jenis}:
                                    </label>
                                    <div className="border px-4 py-2 rounded-lg">{nama}</div>
                                </div>
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
                                            const handleInputChange = (e: any) => {
                                                const inputValue = e.target.value;
                                                const numericValue = unformatNumber(inputValue);
                                                field.onChange(numericValue);
                                                setPagu(unformatNumber(inputValue));
                                            };
                                            const displayValue = formatNumberWithDots(Pagu);
                                            return (
                                                <input
                                                    {...field}
                                                    className="border px-4 py-2 rounded-lg"
                                                    id="pagu_indikatif"
                                                    placeholder="masukkan Pagu Anggaran"
                                                    value={displayValue === null ? "" : displayValue}
                                                    type="text"
                                                    inputMode="numeric"
                                                    onChange={handleInputChange}
                                                />
                                            )
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