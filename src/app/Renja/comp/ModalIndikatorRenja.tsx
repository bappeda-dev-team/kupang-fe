'use client'

import React, { useState } from "react";
import { TbCirclePlus, TbTrash } from "react-icons/tb";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonSkyBorder } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip, LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { useBrandingContext } from "@/context/BrandingContext";

interface FormValue {
    indikator: IndikatorForm[];
}

interface IndikatorForm {
    id?: string;
    kode_indikator?: string;
    indikator: string;
    id_tujuan_opd?: number;
    definisi_operasional: string;
    jenis?: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: Target[];
}

interface Target {
    id?: string;
    indikator_id?: string;
    satuan: string;
    tahun: string;
    target: string;
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    tujuan_id: string;
    tahun: string;
    jenis: 'tujuan_opd' | 'sasaran_opd',
    menu: 'ranwal' | 'rankhir' | 'penetapan'
    onSuccess: () => void;
}

export const ModalIndikatorRenja: React.FC<modal> = ({ isOpen, onClose, tujuan_id, tahun, jenis, menu, onSuccess }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, reset } = useForm<FormValue>({
        defaultValues: {
            indikator: [{
                indikator: "",
                definisi_operasional: "",
                rumus_perhitungan: "",
                sumber_data: "",
                target: [{
                    target: "",
                    satuan: "",
                    tahun: tahun,
                }]
            }]
        }

    });

    const token = getToken();
    const [Proses, setProses] = useState<boolean>(false);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "indikator",
    });

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const payload = data.indikator.map((item) => ({
            indikator: item.indikator,
            definisi_operasional: item.definisi_operasional,
            rumus_perhitungan: item.rumus_perhitungan,
            sumber_data: item.sumber_data,
            target: item.target.map((t: Target) => ({
                target: t.target,
                satuan: t.satuan,
                tahun: t.tahun,
            }))
        }));
        // console.log(payload);
        try {
            let url = `${jenis}/renja/${menu}/indikator/create/${tujuan_id}`;
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

    if (!isOpen) {
        return null;
    } else {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">Tambah Indikator</h1>
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
                                <Controller
                                    name={`indikator.${index}.indikator`}
                                    control={control}
                                    render={({ field: controlledField }) => {
                                        return (
                                            <div className="flex flex-col py-1">
                                                <label
                                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                                    htmlFor="indikator"
                                                >
                                                    Indikator:
                                                </label>
                                                <textarea
                                                    {...controlledField}
                                                    className="border px-4 py-2 rounded-lg"
                                                    id="indikator"
                                                    placeholder="masukkan Indikator"
                                                />
                                            </div>
                                        )
                                    }}
                                />
                                <Controller
                                    name={`indikator.${index}.definisi_operasional`}
                                    control={control}
                                    render={({ field: controlledField }) => {
                                        return (
                                            <div className="flex flex-col py-1">
                                                <label
                                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                                    htmlFor="definisi operasional"
                                                >
                                                    Definisi Operasional:
                                                </label>
                                                <textarea
                                                    {...controlledField}
                                                    className="border px-4 py-2 rounded-lg"
                                                    id="definisi operasional"
                                                    placeholder="masukkan definisi operasional"
                                                />
                                            </div>
                                        )
                                    }}
                                />
                                <Controller
                                    name={`indikator.${index}.rumus_perhitungan`}
                                    control={control}
                                    render={({ field: controlledField }) => {
                                        return (
                                            <div className="flex flex-col py-1">
                                                <label
                                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                                    htmlFor="rumus_perhitungan"
                                                >
                                                    Rumus Perhitungan:
                                                </label>
                                                <textarea
                                                    {...controlledField}
                                                    className="border px-4 py-2 rounded-lg"
                                                    id="rumus_perhitungan"
                                                    placeholder="masukkan Rumus Perhitungan"
                                                />
                                            </div>
                                        )
                                    }}
                                />
                                <Controller
                                    name={`indikator.${index}.sumber_data`}
                                    control={control}
                                    render={({ field: controlledField }) => {
                                        return (
                                            <div className="flex flex-col py-1">
                                                <label
                                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                                    htmlFor="sumber_data"
                                                >
                                                    Sumber Data:
                                                </label>
                                                <input
                                                    {...controlledField}
                                                    type="text"
                                                    className="border px-4 py-2 rounded-lg"
                                                    id="sumber_data"
                                                    placeholder="masukkan Sumber Data"
                                                />
                                            </div>
                                        )
                                    }}
                                />
                                {field.target.map((_, subindex) => (
                                    <div key={`${index}-${subindex}`} className="flex gap-2 justify-between my-2 p-3 border border-gray-200 rounded-lg">
                                        <Controller
                                            name={`indikator.${index}.target.${subindex}.target`}
                                            control={control}
                                            defaultValue={_.target}
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
                                            name={`indikator.${index}.target.${subindex}.satuan`}
                                            control={control}
                                            defaultValue={_.satuan}
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
                                ))}
                            </div>
                        ))}
                        <ButtonSkyBorder
                            type="button"
                            className="flex items-center gap-1"
                            onClick={() => append({ indikator: "", definisi_operasional: "", rumus_perhitungan: "", sumber_data: "", target: [{ target: "", satuan: "", tahun: tahun }] })}
                        >
                            <TbCirclePlus />
                            Tambah Indikator
                        </ButtonSkyBorder>
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
                </div>
            </div>
        )
    }
}

interface modalEdit {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: IndikatorForm | null;
    jenis: 'tujuan_opd' | 'sasaran_opd'
    menu: 'ranwal' | 'rankhir' | 'penetapan'
}

export const ModalEditIndikatorRenja: React.FC<modalEdit> = ({ isOpen, onClose, Data, jenis, menu, onSuccess }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, reset } = useForm<IndikatorForm>({
        defaultValues: {
            indikator: Data?.indikator || "",
            definisi_operasional: Data?.definisi_operasional || "",
            rumus_perhitungan: Data?.rumus_perhitungan || "",
            sumber_data: Data?.sumber_data || "",
            target: Data?.target.map((t: Target) => ({
                id: t.id,
                indikator_id: t.indikator_id,
                target: t.target,
                satuan: t.satuan,
                tahun: t.tahun,
            }))
        }
    });

    const token = getToken();

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);

    const onSubmit: SubmitHandler<IndikatorForm> = async (data) => {
        const payload = {
            id: Data?.id,
            id_tujuan_opd: String(Data?.id_tujuan_opd),
            indikator: data.indikator,
            definisi_operasional: data.definisi_operasional,
            rumus_perhitungan: data.rumus_perhitungan,
            sumber_data: data.sumber_data,
            target: data.target.map((t: Target) => ({
                id: t.id,
                indikator_id: t.indikator_id,
                target: t.target,
                satuan: t.satuan,
                tahun: t.tahun,
            }))
        }
        // console.log(payload);
        try {
        let url = `${jenis}/renja/${menu}/indikator/update/${Data?.kode_indikator}`;
            setProses(true);
            const response = await fetch(`${branding?.api_perencanaan}/${url}`, {
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
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">Edit Indikator</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col my-2 py-2 px-5 border border-sky-700 rounded-lg"
                    >
                        <Controller
                            name={`indikator`}
                            control={control}
                            render={({ field }) => {
                                return (
                                    <div className="flex flex-col py-1">
                                        <label
                                            className="uppercase text-xs font-bold text-gray-700 my-2"
                                            htmlFor="indikator"
                                        >
                                            Indikator:
                                        </label>
                                        <textarea
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="indikator"
                                            placeholder="masukkan Indikator"
                                        />
                                    </div>
                                )
                            }}
                        />
                        <Controller
                            name={`definisi_operasional`}
                            control={control}
                            render={({ field }) => {
                                return (
                                    <div className="flex flex-col py-1">
                                        <label
                                            className="uppercase text-xs font-bold text-gray-700 my-2"
                                            htmlFor="definisi operasional"
                                        >
                                            Definisi Operasional:
                                        </label>
                                        <textarea
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="definisi operasional"
                                            placeholder="masukkan definisi operasional"
                                        />
                                    </div>
                                )
                            }}
                        />
                        <Controller
                            name={`rumus_perhitungan`}
                            control={control}
                            render={({ field }) => {
                                return (
                                    <div className="flex flex-col py-1">
                                        <label
                                            className="uppercase text-xs font-bold text-gray-700 my-2"
                                            htmlFor="rumus_perhitungan"
                                        >
                                            Rumus Perhitungan:
                                        </label>
                                        <textarea
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="rumus_perhitungan"
                                            placeholder="masukkan Rumus Perhitungan"
                                        />
                                    </div>
                                )
                            }}
                        />
                        <Controller
                            name={`sumber_data`}
                            control={control}
                            render={({ field }) => {
                                return (
                                    <div className="flex flex-col py-1">
                                        <label
                                            className="uppercase text-xs font-bold text-gray-700 my-2"
                                            htmlFor="sumber_data"
                                        >
                                            Sumber Data:
                                        </label>
                                        <input
                                            {...field}
                                            type="text"
                                            className="border px-4 py-2 rounded-lg"
                                            id="sumber_data"
                                            placeholder="masukkan Sumber Data"
                                        />
                                    </div>
                                )
                            }}
                        />
                        {Data?.target.map((field, subindex) => (
                            <div key={`${field.id}-${subindex}`} className="flex gap-2 justify-between my-2 p-3 border border-gray-200 rounded-lg">
                                <Controller
                                    name={`target.${subindex}.target`}
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
                                    name={`target.${subindex}.satuan`}
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
                        ))}
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
                </div>
            </div>
        )
    }
}