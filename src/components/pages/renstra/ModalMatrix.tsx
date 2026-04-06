'use client'

import React, { useState, useEffect } from "react";
import { TbTrash } from "react-icons/tb";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip, LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";

interface FormValue {
    indikator: IndikatorForm[];
}

interface IndikatorForm {
    kode: string;
    kode_opd: string;
    indikator: string;
    tahun: string;
    target: string;
    satuan: string;
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    metode: 'lama' | 'baru';
    nama: string;
    jenis: string;
    Data: IndikatorForm[];
    id?: string;
    kode: string;
    tahun?: string;
    kode_opd?: string;
    onSuccess: () => void;
}

export const ModalMatrix: React.FC<modal> = ({ isOpen, onClose, id, kode, nama, jenis, kode_opd, Data, metode, tahun, onSuccess }) => {

    const { control, handleSubmit, reset } = useForm<FormValue>({
        defaultValues: {
            indikator: (Data.length > 0)
                ? Data.map((i: IndikatorForm) => ({
                    kode: kode ?? "",
                    kode_opd: kode_opd ?? "",
                    indikator: i.indikator ?? "",
                    tahun: i.tahun ?? "",
                    target: i.target ?? "",
                    satuan: i.satuan ?? "",
                }))
                :
                [
                    {
                        kode: kode,
                        kode_opd: kode_opd,
                        indikator: "",
                        tahun: "",
                        target: "",
                        satuan: "",
                    }
                ]
        }
    });

    const token = getToken();

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);


    const { fields, append, remove } = useFieldArray({
        control,
        name: "indikator",
    });

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const payload = data.indikator.map((item) => ({
            kode: kode,
            kode_opd: kode_opd,
            tahun: tahun,
            indikator: item.indikator,
            target: item.target,
            satuan: item.satuan,
        }));
        // console.log(payload);
        try {
            let url = "";
            if (metode === "lama") {
                url = `matrix_renstra/indikator/update_indikator/${id}`;
            } else if (metode === "baru") {
                url = `matrix_renstra/indikator/create_indikator`;
            } else {
                url = '';
            }
            setProses(true);
            const response = await fetch(`${API_URL}/${url}`, {
                method: metode === 'lama' ? "PUT" : "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (result.code === 201 || result.code === 200) {
                AlertNotification("Berhasil", `Berhasil ${metode === 'baru' ? "Menambahkan" : "Mengubah"} Indikator`, "success", 1000);
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
                                <h1 className="text-xl uppercase text-center">{metode === 'baru' ? "Tambah" : "Edit"} Indikator tahun {tahun}</h1>
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
                                {fields?.map((field, index: number) => (
                                    <div key={index} className="flex flex-col my-2 py-2 px-5 border border-sky-700 rounded-lg">
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
                                        <div className="flex flex-col py-3">
                                            <label
                                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                                htmlFor="target"
                                            >
                                                Target:
                                            </label>
                                            <Controller
                                                name={`indikator.${index}.target`}
                                                control={control}
                                                render={({ field }) => (
                                                    <textarea
                                                        {...field}
                                                        className="border px-4 py-2 rounded-lg"
                                                        id="target"
                                                        placeholder="masukkan Target"
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="flex flex-col py-3">
                                            <label
                                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                                htmlFor="satuan"
                                            >
                                                Satuan:
                                            </label>
                                            <Controller
                                                name={`indikator.${index}.satuan`}
                                                control={control}
                                                render={({ field }) => (
                                                    <textarea
                                                        {...field}
                                                        className="border px-4 py-2 rounded-lg"
                                                        id="satuan"
                                                        placeholder="masukkan Satuan"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => append({ kode: kode, kode_opd: kode_opd ?? "", indikator: "", tahun: "", target: "", satuan: "" })}
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
}

interface modalEdit {
    isOpen: boolean;
    onClose: () => void;
    nama: string;
    jenis: string;
    indikator: string;
    target: string;
    satuan: string;
    id?: string;
    kode: string;
    tahun?: string;
    kode_opd?: string;
    onSuccess: () => void;
}

export const ModalEditMatrix: React.FC<modalEdit> = ({ isOpen, onClose, id, kode, nama, jenis, kode_opd, indikator, target, satuan, tahun, onSuccess }) => {

    const { control, handleSubmit, reset } = useForm<IndikatorForm>({
        defaultValues: {
            kode: kode ?? "",
            kode_opd: kode_opd ?? "",
            indikator: indikator ?? "",
            tahun: tahun ?? "",
            target: target ?? "",
            satuan: satuan ?? "",
        }
    });

    const token = getToken();

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);

    const onSubmit: SubmitHandler<IndikatorForm> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const payload = {
            kode: kode,
            kode_opd: kode_opd,
            tahun: tahun,
            indikator: data.indikator,
            target: data.target,
            satuan: data.satuan,
        }
        // console.log(payload);
        try {
            let url = `matrix_renstra/indikator/update_indikator/${id}`;
            setProses(true);
            const response = await fetch(`${API_URL}/${url}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (result.code === 201 || result.code === 200) {
                AlertNotification("Berhasil", `Berhasil Mengubah Indikator`, "success", 1000);
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
                                <h1 className="text-xl uppercase text-center">Edit Indikator tahun {tahun}</h1>
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
                                <div className="flex flex-col my-2 py-2 px-5 border border-sky-700 rounded-lg">
                                    <div className="flex flex-col py-3">
                                        <label
                                            className="uppercase text-xs font-bold text-gray-700 my-2"
                                            htmlFor="indikator"
                                        >
                                            Indikator:
                                        </label>
                                        <Controller
                                            name={`indikator`}
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
                                    <div className="flex flex-col py-3">
                                        <label
                                            className="uppercase text-xs font-bold text-gray-700 my-2"
                                            htmlFor="target"
                                        >
                                            Target:
                                        </label>
                                        <Controller
                                            name={`target`}
                                            control={control}
                                            render={({ field }) => (
                                                <textarea
                                                    {...field}
                                                    className="border px-4 py-2 rounded-lg"
                                                    id="target"
                                                    placeholder="masukkan Target"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-col py-3">
                                        <label
                                            className="uppercase text-xs font-bold text-gray-700 my-2"
                                            htmlFor="satuan"
                                        >
                                            Satuan:
                                        </label>
                                        <Controller
                                            name={`satuan`}
                                            control={control}
                                            render={({ field }) => (
                                                <textarea
                                                    {...field}
                                                    className="border px-4 py-2 rounded-lg"
                                                    id="satuan"
                                                    placeholder="masukkan Satuan"
                                                />
                                            )}
                                        />
                                    </div>
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