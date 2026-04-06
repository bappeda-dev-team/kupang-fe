'use client'

import React, { useState, useEffect } from "react";
import { TbTrash } from "react-icons/tb";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip, LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { useBrandingContext } from "@/context/BrandingContext";

interface FormValue {
    kode: string;
    kode_opd: string;
    tahun: string;
    indikator: IndikatorForm[];
}

interface TargetForm {
    id: string;
    indikator_id: string;
    target: string;
    satuan: string;
}

interface IndikatorForm {
    kode_indikator?: string;
    indikator: string;
    target: string;
    satuan: string;
}

interface modal {
    isOpen: boolean;
    onClose(): void;
    menu: "ranwal" | "rankhir" | "penetapan";
    Data: IndikatorForm[];
    tahun: string;
    kode_opd: string;
    kode: string;
    onSuccess(): void;
}

export const ModalIndikatorMatrixRenja: React.FC<modal> = ({ isOpen, onClose, Data, menu, kode_opd, kode, tahun, onSuccess }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, reset } = useForm<FormValue>({
        defaultValues: {
            indikator: (Data.length > 0)
                ? Data.map((i: IndikatorForm) => ({
                    kode: kode ?? "",
                    kode_opd: kode_opd ?? "",
                    tahun: tahun ?? "",
                    kode_indikator: i.kode_indikator ?? "",
                    indikator: i.indikator ?? "",
                    target: i.target ?? "",
                    satuan: i.satuan ?? "",
                }))
                :
                [{
                    kode: kode,
                    kode_opd: kode_opd,
                    kode_indikator: "",
                    indikator: "",
                    tahun: "",
                    target: "",
                    satuan: "",
                }]
        }
    });

    const token = getToken();

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);


    const { fields, append, remove } = useFieldArray({
        control,
        name: `indikator`,
    });

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const payload = data.indikator.map((item) => ({
            kode: kode,
            kode_opd: kode_opd,
            tahun: tahun,
            kode_indikator: item.kode_indikator,
            indikator: item.indikator,
            target: item.target,
            satuan: item.satuan,
        }));

        try {
            let url = `matrix_renja/indikator/${menu}/upsert`;
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
                AlertNotification("Berhasil", `Berhasil Menambahkan Indikator`, "success", 1000);
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

    const handleClose = () => {
        onClose();
        reset();
    }

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
            <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                {IsLoading ?
                    <LoadingClip />
                    :
                    <>
                        <div className="w-max-[500px] py-2 border-b">
                            <h1 className="text-xl uppercase text-center">Tambah Indikator Matrix</h1>
                        </div>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col mx-5 py-5"
                        >
                            {fields?.map((field, index: number) => (
                                <div key={field.id} className="flex flex-col my-2 py-2 px-5 border border-sky-700 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <h1 className="uppercase font-bold text-sky-700">Indikator ke {index + 1}</h1>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
                                            title="Hapus Indikator Ini"
                                        >
                                            <TbTrash size={14} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col py-3">
                                        <label
                                            className="uppercase text-xs font-bold text-gray-700 my-2"
                                            htmlFor="indikator"
                                        >
                                            Indikator:
                                        </label>
                                        <Controller
                                            name={`indikator.${index}.indikator`}
                                            control={control}
                                            render={({ field: controlledField }) => (
                                                <textarea
                                                    {...controlledField}
                                                    className="border px-4 py-2 rounded-lg"
                                                    id="indikator"
                                                    placeholder="masukkan Indikator"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-between my-2 p-3 border border-gray-200 rounded-lg">
                                        <Controller
                                            name={`indikator.${index}.target`}
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-1 w-full">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                        Target :
                                                    </label>
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder="Masukkan target"
                                                    />
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name={`indikator.${index}.satuan`}
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-1 w-full">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                        Satuan :
                                                    </label>
                                                    <input
                                                        {...field}
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder="Masukkan satuan"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => append({
                                    kode_indikator: "",
                                    indikator: "",
                                    target: "",
                                    satuan: ""
                                })}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Tambah Indikator
                            </button>
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
