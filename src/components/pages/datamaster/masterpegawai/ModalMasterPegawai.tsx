'use client'

import { useEffect, useState } from "react";
import { TbDeviceFloppy, TbX, TbCheck } from "react-icons/tb";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from "@/components/global/Button";
import { AlertNotification } from "@/components/global/Alert";
import { LoadingButtonClip } from "@/components/global/Loading";
import { OptionTypeString } from "@/types";
import { getToken } from "@/components/lib/Cookie";
import Select from "react-select";

interface modal {
    jenis: "tambah" | "edit";
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: pegawai | null;
    kode_opd: string;
    nama_opd: string;
}
interface pegawai {
    id: number;
    nama: string;
    nama_pegawai?: string;
    nip: string;
    kode_opd: string;
    nama_opd: string;
    jenis_pegawai?: string;
}
export interface FormValue {
    nama_pegawai: string;
    kode_opd: OptionTypeString;
    nip: string;
}

export const ModalMasterPegawai: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data, kode_opd, nama_opd }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            nama_pegawai: Data?.nama ?? Data?.nama_pegawai,
            nip: Data?.nip,
            kode_opd: {
                value: kode_opd,
                label: nama_opd,
            }
        }
    });

    const [Nip, setNip] = useState<string>('');

    const [Plt, setPlt] = useState<boolean>(false);
    const [Pbt, setPbt] = useState<boolean>(false);

    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    const handleClose = () => {
        onClose();
        reset();
        setPlt(false);
        setPbt(false);
    }

    // Prefill form & toggle when editing
    useEffect(() => {
        reset({
            nama_pegawai: Data?.nama ?? Data?.nama_pegawai,
            nip: Data?.nip,
            kode_opd: {
                value: kode_opd,
                label: nama_opd,
            }
        });

        if (Data?.jenis_pegawai === "PLT") {
            setPlt(true);
            setPbt(false);
        } else if (Data?.jenis_pegawai === "PBT") {
            setPlt(false);
            setPbt(true);
        } else {
            setPlt(false);
            setPbt(false);
        }

        if (Data?.nip) {
            setNip(Data.nip);
        }
    }, [Data, kode_opd, nama_opd, reset]);

    const fetchOpd = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/opds`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const data = await response.json();
            const opd = data.data.map((item: any) => ({
                value: item.kode_opd,
                label: item.nama_opd,
            }));
            setOpdOption(opd);
        } catch (err) {
            console.log('gagal mendapatkan data opd');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const jenisPegawai = Plt ? "PLT" : Pbt ? "PBT" : "";
        const bodyTambah = {
            jenis_pegawai: jenisPegawai,
            kode_opd: data.kode_opd?.value,
            nama: data.nama_pegawai,
            nama_opd: data.kode_opd?.label,
            nip: data.nip,
        };
        const bodyEdit = {
            id: Data?.id,
            jenis_pegawai: jenisPegawai,
            kode_opd: data.kode_opd?.value,
            nama: data.nama_pegawai,
            nama_opd: data.kode_opd?.label,
            nip: data.nip,
        };
        const getBody = () => {
            if (jenis === "tambah") return bodyTambah;
            if (jenis === "edit") return bodyEdit;
            return {};
        };
        const url = jenis === "tambah"
            ? `${API_URL}/pegawais`
            : `${API_URL}/pegawais/${Data?.id}`;
        try {
            setProses(true);
            const response = await fetch(url, {
                method: jenis === "tambah" ? "POST" : "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(getBody()),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "Berhasil menambahkan data master pegawai", "success", 1000);
                onSuccess();
                handleClose();
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 max-h-[80%] text-start overflow-auto`}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="w-max-[500px] py-2 mb-2 border-b-2 border-gray-300 text-center uppercase font-bold">
                            {jenis === "tambah" ? "Tambah" : "Edit"} Pegawai
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="_pegawai"
                            >
                                Nama :
                            </label>
                            <Controller
                                name="nama_pegawai"
                                control={control}
                                rules={{ required: "Nama Pegawai harus terisi" }}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="nama_pegawai"
                                            type="text"
                                            placeholder="masukkan Nama Pegawai"
                                            value={field.value}
                                        />
                                        {errors.nama_pegawai ?
                                            <h1 className="text-red-500">
                                                {errors.nama_pegawai.message}
                                            </h1>
                                            :
                                            <h1 className="text-slate-300 text-xs">*Nama Pegawai Harus Terisi</h1>
                                        }
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="flex flex-col flex-wrap gap-2 uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nip"
                            >
                                NIP :
                                <div className="flex items-center gap-2">
                                    {Plt ?
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPlt(false)
                                                setPbt(false)
                                            }}
                                            className="w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                        >
                                            <TbCheck />
                                        </button>
                                        :
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPlt(true)
                                                setPbt(false)
                                            }}
                                            className="w-[20px] h-[20px] border border-black rounded-full"
                                        ></button>
                                    }
                                    <p className="text-lg">PLT</p>
                                    {Pbt ?
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPbt(false)
                                                setPlt(false)
                                            }}
                                            className="w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                        >
                                            <TbCheck />
                                        </button>
                                        :
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPbt(true)
                                                setPlt(false)
                                            }}
                                            className="w-[20px] h-[20px] border border-black rounded-full"
                                        ></button>
                                    }
                                    <p className="text-lg">PBT</p>
                                </div>
                            </label>
                            <Controller
                                name="nip"
                                control={control}
                                rules={{ required: "NIP harus terisi" }}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="nip"
                                            type="text"
                                            maxLength={18}
                                            placeholder="masukkan NIP"
                                            value={field.value || Nip}
                                            onChange={(e) => {
                                                const newValue = e.target.value.replace(/\s/g, ''); // Hilangkan semua spasi
                                                field.onChange(newValue);
                                                setNip(newValue);
                                            }}
                                        />
                                        {errors.nip ?
                                            <h1 className="text-red-500">
                                                {errors.nip.message}
                                            </h1>
                                            :
                                            <h1 className="text-slate-300 text-xs">*NIP Harus Terisi, Max 18 Digit, centang lingkaran PLT jika pegawai PLT</h1>
                                        }
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_opd"
                            >
                                Perangkat Daerah
                            </label>
                            <Controller
                                name="kode_opd"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Perangkat Daerah"
                                            options={OpdOption}
                                            isLoading={IsLoading}
                                            isSearchable
                                            isClearable
                                            onMenuOpen={() => {
                                                if (OpdOption.length === 0) {
                                                    fetchOpd();
                                                }
                                            }}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                    textAlign: 'start',
                                                })
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <ButtonSky type="submit" className="w-full my-3 gap-1" disabled={Proses}>
                            {Proses ?
                                <>
                                    <LoadingButtonClip />
                                    <span>menyimpan</span>
                                </>
                                :
                                <>
                                    <TbDeviceFloppy />
                                    <span>Simpan</span>
                                </>
                            }
                        </ButtonSky>
                        <ButtonRed className="flex items-center gap-1 w-full my-3" onClick={handleClose} disabled={Proses}>
                            <TbX />
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}
