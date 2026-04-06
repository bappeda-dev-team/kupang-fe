'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { LoadingSync } from "@/components/global/Loading";
import Select from 'react-select';

interface pilihanPeriode {
    label: string;
    awal: string;
    akhir: string;
    jenis: string;
}

interface FormValue {
    id?: number;
    visi: string;
    periode: pilihanPeriode;
    keterangan: string;
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    metode: 'lama' | 'baru';
    id?: number; // id tujuan pemda
    onSuccess: () => void;
}


export const ModalVisi: React.FC<modal> = ({ isOpen, onClose, id, metode, onSuccess }) => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();

    const token = getToken();

    const [Visi, setVisi] = useState<string>('');
    const [Periode, setPeriode] = useState<pilihanPeriode | null>(null);
    const [PeriodeOption, setPeriodeOption] = useState<pilihanPeriode[]>([]);
    const [Keterangan, setKeterangan] = useState<string>('');

    const [Proses, setProses] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchDetailVisi = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/visi_pemda/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.data;
                if (hasil.visi) {
                    setVisi(hasil.visi);
                }
                if(hasil.keterangan){
                    setKeterangan(hasil.keterangan);
                }
                if(hasil.tahun_awal_periode && hasil.tahun_akhir_periode){
                    const periode = {
                        label: `${hasil.tahun_awal_periode} - ${hasil.tahun_akhir_periode} (${hasil.jenis_periode})`,
                        value: `${hasil.tahun_awal_periode} - ${hasil.tahun_akhir_periode} (${hasil.jenis_periode})`,
                        awal: hasil.tahun_awal_periode,
                        akhir: hasil.tahun_akhir_periode,
                        jenis: hasil.jenis_periode
                    }
                    setPeriode(periode);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        if (metode === 'lama' && isOpen) {
            fetchDetailVisi();
        }
    }, [id, token, isOpen, metode, reset]);

    const fetchPeriodeOption = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/periode/findall`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const hasil = result.data;
            // console.log(hasil);
            const data = hasil.map((item: any) => ({
                label: `${item.tahun_awal} - ${item.tahun_akhir} (${item.jenis_periode})`,
                value: `${item.tahun_awal} - ${item.tahun_akhir} (${item.jenis_periode})`,
                awal: item.tahun_awal,
                akhir: item.tahun_akhir,
                jenis: item.jenis_periode,
            }));
            setPeriodeOption(data);
        } catch (err) {
            console.error("error fetch periode", err);
        }
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataNew = {
            //key : value
            visi: Visi,
            tahun_awal_periode: Periode?.awal,
            tahun_akhir_periode: Periode?.akhir,
            jenis_periode: Periode?.jenis,
            keterangan: Keterangan,
        };
        const formDataEdit = {
            //key : value
            id: id,
            visi: Visi,
            tahun_awal_periode: Periode?.awal,
            tahun_akhir_periode: Periode?.akhir,
            jenis_periode: Periode?.jenis,
            keterangan: Keterangan,
        };
        const getBody = () => {
            if (metode === "lama") return formDataEdit;
            if (metode === "baru") return formDataNew;
            return {}; // Default jika metode tidak sesuai
        };
        // metode === 'baru' && console.log("baru :", formDataNew);
        // metode === 'lama' && console.log("lama :", formDataEdit);
        if(Periode == null){
            AlertNotification("Periode", "Periode wajib diisi", "warning", 1000);
        } else if(Visi == ''){
            AlertNotification("Visi", "Visi wajib diisi", "warning", 1000);
        } else {
            try {
                let url = "";
                if (metode === "lama") {
                    url = `visi_pemda/update/${id}`;
                } else if (metode === "baru") {
                    url = `visi_pemda/create`;
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
                    body: JSON.stringify(getBody()),
                });
                if (response.ok) {
                    AlertNotification("Berhasil", `Berhasil ${metode === 'baru' ? "Menambahkan" : "Mengubah"} Visi Pemda`, "success", 1000);
                    onClose();
                    onSuccess();
                    reset();
                } else {
                    AlertNotification("Gagal", "terdapat kesalahan pada backend / database server dengan response !ok", "error", 2000);
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
        setVisi('');
        setKeterangan('');
        setPeriode(null);
    }

    if (!isOpen) {
        return null;
    } else {
        if(Loading){
            return(
                <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{metode === 'baru' ? "Tambah" : "Edit"} Visi</h1>
                    </div>
                    <div className="my-5">
                        <LoadingSync />
                    </div>
                </div>
                </div>
            )
        }
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{metode === 'baru' ? "Tambah" : "Edit"} Visi</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="visi"
                            >
                                Visi:
                            </label>
                            <Controller
                                name="visi"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="visi"
                                        placeholder="Masukkan Visi"
                                        value={Visi}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setVisi(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="periode"
                            >
                                Periode :
                            </label>
                            <Controller
                                name="periode"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Periode"
                                            options={PeriodeOption}
                                            isSearchable
                                            isClearable
                                            value={Periode}
                                            onMenuOpen={() => {
                                                fetchPeriodeOption();
                                            }}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setPeriode(option);
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
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="jenis"
                            >
                                Jenis
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{Periode ? (Periode.jenis ? Periode?.jenis : '-') : <p className="text-gray-500">-</p>}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tahun_awal"
                            >
                                Tahun Awal
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{Periode ? Periode?.awal : <p className="text-gray-500">-</p>}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tahun_akhir"
                            >
                                Tahun Akhir
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{Periode ? Periode?.akhir : <p className="text-gray-500">-</p>}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="keterangan"
                            >
                                Keterangan:
                            </label>
                            <Controller
                                name="keterangan"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="keterangan"
                                        placeholder="Masukkan keterangan"
                                        value={Keterangan}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setKeterangan(e.target.value);
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