'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import Select from 'react-select';
import { LoadingSync } from "@/components/global/Loading";

interface OptionTypeString {
    value: string;
    label: string;
}
interface OptionType {
    value: number;
    label: string;
}
interface Visi {
    value: number,
    label: string;
    visi: string;
    awal: string;
    akhir: string;
    jenis: string;
}

interface FormValue {
    id?: number;
    id_visi: Visi;
    misi: string;
    visi: Visi;
    tahun_awal: OptionTypeString;
    tahun_akhir: OptionTypeString;
    jenis: OptionTypeString;
    urutan: OptionType;
    keterangan: string;
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    metode: 'lama' | 'baru';
    tahun: number;
    jenis_periode: string;
    id?: number; // id tujuan pemda
    onSuccess: () => void;
}


export const ModalMisi: React.FC<modal> = ({ isOpen, onClose, id, metode, tahun, jenis_periode, onSuccess }) => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();

    const token = getToken();

    const [Misi, setMisi] = useState<string>('');
    const [Visi, setVisi] = useState<Visi | null>(null);
    const [VisiOption, setVisiOption] = useState<Visi[]>([]);
    const [Urutan, setUrutan] = useState<OptionType | null>(null);
    const [Keterangan, setKeterangan] = useState<string>('');

    const [Proses, setProses] = useState<boolean>(false);
    const [LoadingDetail, setLoadingDetail] = useState<boolean>(false);
    const [LoadingVisi, setLoadingVisi] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const fetchDetailMisi = async () => {
            try {
                setLoadingDetail(true);
                const response = await fetch(`${API_URL}/misi_pemda/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.data;
                if (hasil.misi) {
                    setMisi(hasil.misi);
                }
                if (hasil.keterangan) {
                    setKeterangan(hasil.keterangan);
                }
                if (hasil.urutan) {
                    const urutan = {
                        value: hasil.urutan,
                        label: hasil.urutan
                    }
                    setUrutan(urutan);
                }
                if (hasil.tahun_awal_periode && hasil.tahun_akhir_periode) {
                    const visi = {
                        value: hasil.id_visi,
                        label: `${hasil.visi} (${hasil.tahun_awal_periode} - ${hasil.tahun_akhir_periode} ${hasil.jenis_periode})`,
                        visi: hasil.visi,
                        awal: hasil.tahun_awal_periode,
                        akhir: hasil.tahun_akhir_periode,
                        jenis: hasil.jenis_periode,
                    }
                    setVisi(visi);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoadingDetail(false);
            }
        };
        if (metode === 'lama' && isOpen) {
            fetchDetailMisi();
        }
    }, [id, token, isOpen, metode, reset, tahun]);

    const fetchVisiOption = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setLoadingVisi(true);
            const response = await fetch(`${API_URL}/visi_pemda/findall/tahun/${tahun}/jenisperiode/${jenis_periode}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const hasil = result.data;
            // console.log(hasil);
            const data = hasil.map((item: any) => ({
                label: `${item.visi} (${item.tahun_awal_periode} - ${item.tahun_akhir_periode} ${item.jenis_periode})`,
                value: item.id,
                visi: item.visi,
                awal: item.tahun_awal_periode,
                akhir: item.tahun_akhir_periode,
                jenis: item.jenis_periode,
            }));
            setVisiOption(data);
        } catch (err) {
            console.error("error fetch periode", err);
        } finally {
            setLoadingVisi(false);
        }
    };

    const urutanOption = [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5", value: 5 },
        { label: "6", value: 6 },
        { label: "7", value: 7 },
        { label: "8", value: 8 },
        { label: "9", value: 9 },
        { label: "10", value: 10 },
        { label: "11", value: 11 },
        { label: "13", value: 13 },
        { label: "14", value: 14 },
        { label: "15", value: 15 },
        { label: "16", value: 16 },
        { label: "17", value: 17 },
        { label: "18", value: 18 },
        { label: "19", value: 19 },
        { label: "20", value: 20 },
    ];

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataNew = {
            //key : value
            id_visi: Visi?.value,
            misi: Misi,
            tahun_awal_periode: Visi?.awal,
            tahun_akhir_periode: Visi?.akhir,
            jenis_periode: Visi?.jenis,
            urutan: Urutan?.value,
            keterangan: Keterangan,
        };
        const formDataEdit = {
            //key : value
            id: id,
            id_visi: Visi?.value,
            misi: Misi,
            tahun_awal_periode: Visi?.awal,
            tahun_akhir_periode: Visi?.akhir,
            jenis_periode: Visi?.jenis,
            urutan: Urutan?.value,
            keterangan: Keterangan,
        };
        const getBody = () => {
            if (metode === "lama") return formDataEdit;
            if (metode === "baru") return formDataNew;
            return {}; // Default jika metode tidak sesuai
        };
        // metode === 'baru' && console.log("baru :", formDataNew);
        // metode === 'lama' && console.log("lama :", formDataEdit);
        try {
            let url = "";
            if (metode === "lama") {
                url = `misi_pemda/update/${id}`;
            } else if (metode === "baru") {
                url = `misi_pemda/create`;
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
            const hasil = await response.json();
            if (hasil.code === 200 || hasil.code === 201) {
                AlertNotification("Berhasil", `Berhasil ${metode === 'baru' ? "Menambahkan" : "Mengubah"} Misi`, "success", 1000);
                onClose();
                onSuccess();
                reset();
            } else if (hasil.code === 400) {
                AlertNotification("Gagal", `${hasil.data}`, "error", 2000);
                console.log(hasil);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server dengan response !ok", "error", 2000);
                console.log(hasil);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    const handleClose = () => {
        onClose();
        setMisi('');
        setVisi(null);
    }

    if (!isOpen) {
        return null;
    } else {
        if (LoadingDetail) {
            return (
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
                        <h1 className="text-xl uppercase text-center">{metode === 'baru' ? "Tambah" : "Edit"} Misi</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="misi"
                            >
                                Misi:
                            </label>
                            <Controller
                                name="misi"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="misi"
                                        placeholder="Masukkan Misi"
                                        value={Misi}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setMisi(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="visi"
                            >
                                Visi :
                            </label>
                            <Controller
                                name="visi"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Visi"
                                            options={VisiOption}
                                            isLoading={LoadingVisi}
                                            isSearchable
                                            isClearable
                                            value={Visi}
                                            onMenuOpen={() => {
                                                fetchVisiOption();
                                            }}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setVisi(option);
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
                            <div className="border px-4 py-2 rounded-lg">{Visi ? (Visi.jenis ? Visi?.jenis : '-') : <p className="text-gray-500">-</p>}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tahun_awal"
                            >
                                Tahun Awal
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{Visi ? Visi?.awal : <p className="text-gray-500">-</p>}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tahun_akhir"
                            >
                                Tahun Akhir
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{Visi ? Visi?.akhir : <p className="text-gray-500">-</p>}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="urutan"
                            >
                                Urutan:
                            </label>
                            <Controller
                                name="urutan"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Urutan"
                                            options={urutanOption}
                                            isSearchable
                                            isClearable
                                            value={Urutan}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setUrutan(option);
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