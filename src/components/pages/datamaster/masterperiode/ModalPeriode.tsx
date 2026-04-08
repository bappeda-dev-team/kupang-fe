'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import Select from 'react-select';
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";

interface OptionType {
    value: number;
    label: string;
}

interface FormValue {
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    metode: 'lama' | 'baru';
    id?: number;
    onSuccess: () => void;
}


export const ModalPeriode: React.FC<modal> = ({ isOpen, onClose, id, metode, onSuccess }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();

    const token = getToken();

    const [TahunAwal, setTahunAwal] = useState<string>('');
    const [TahunAkhir, setTahunAkhir] = useState<string>('');
    const [JenisPeriode, setJenisPeriode] = useState<string>('');

    const [Proses, setProses] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchPeriode = async () => {
            try {
                const response = await fetch(`${API_URL}/periodes/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result?.data ?? result;
                if (data?.tahun_awal) {
                    setTahunAwal(data.tahun_awal);
                }
                if (data?.tahun_akhir) {
                    setTahunAkhir(data.tahun_akhir);
                }
                if (data?.jenis_periode) {
                    setJenisPeriode(data.jenis_periode);
                }
            } catch (err) {
                console.log(err);
            }
        };
        if (isOpen && metode === 'lama') {
            fetchPeriode();
        }
    }, [id, token, isOpen, metode]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const payloadBase = {
            tahun_awal: TahunAwal,
            tahun_akhir: TahunAkhir,
            jenis_periode: JenisPeriode ? JenisPeriode : "RPJMD"
        };
        try {
            const isEdit = metode === "lama";
            const url = isEdit ? `periodes/${id}` : "periodes";
            const method = isEdit ? "PUT" : "POST";
            setProses(true);
            const response = await fetch(`${API_URL}/${url}`, {
                method,
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(isEdit ? { id, ...payloadBase } : payloadBase),
            });
            if (response.ok) {
                AlertNotification("Berhasil", `Berhasil ${isEdit ? "Mengubah" : "Menambahkan"} Periode`, "success", 1000);
                onClose();
                onSuccess();
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server dengan response !ok", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    const handleClose = () => {
        onClose();
        setTahunAwal('');
        setTahunAkhir('');
        setJenisPeriode('RPJMD');
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{metode === 'baru' ? "Tambah" : "Edit"} Periode</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tahun_awal"
                            >
                                Tahun Awal:
                            </label>
                            <Controller
                                name="tahun_awal"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="tahun_awal"
                                        type="text"
                                        placeholder="masukkan Tahun Awal"
                                        value={TahunAwal}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setTahunAwal(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tahun_akhir"
                            >
                                Tahun Akhir:
                            </label>
                            <Controller
                                name="tahun_akhir"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="tahun_akhir"
                                        type="text"
                                        placeholder="masukkan Tahun Akhir"
                                        value={TahunAkhir}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setTahunAkhir(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="jenis_periode"
                            >
                                Jenis Periode:
                            </label>
                            <Controller
                                name="jenis_periode"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="jenis_periode"
                                        type="text"
                                        placeholder="masukkan Jenis Periode"
                                        value={JenisPeriode || "RPJMD"}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setJenisPeriode(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <ButtonSky className="w-full mt-3" type="submit">
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full my-2" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}
