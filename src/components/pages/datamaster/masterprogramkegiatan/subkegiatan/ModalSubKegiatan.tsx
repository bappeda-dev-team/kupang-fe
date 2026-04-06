'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import Select from 'react-select';
import { LoadingClip, LoadingButtonClip } from "@/components/global/Loading";
import { TbCirclePlus, TbCircleX } from "react-icons/tb";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    id?: string;
    metode: "baru" | "lama",
    onSuccess: () => void;
}

interface FormValue {
    kode_subkegiatan: string;
    nama_subkegiatan: string;
}

export const ModalSubKegiatan: React.FC<ModalProps> = ({ isOpen, onClose, id, metode, onSuccess }) => {

    const { control, handleSubmit, reset } = useForm<FormValue>();

    const [SubKegiatan, setSubKegiatan] = useState<string>('');
    const [Kode, setKode] = useState<string>('');

    const [Loading, setLoading] = useState<boolean>(false);
    const [IdNull, setIdNull] = useState<boolean>(false);

    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    const handleClose = () => {
        setSubKegiatan('');
        setKode('');
        onClose();
    };

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchIdSubKegiatan = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/sub_kegiatan/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                if (result.code == 500) {
                    setIdNull(true);
                } else {
                    const data = result.sub_kegiatan;
                    if (data.kode_subkegiatan) {
                        setKode(data.kode_subkegiatan);
                        reset((prev) => ({ ...prev, kode_subkegiatan: data.kode_subkegiatan }));
                    }
                    if (data.nama_sub_kegiatan) {
                        setSubKegiatan(data.nama_sub_kegiatan);
                        reset((prev) => ({ ...prev, nama_subkegiatan: data.nama_sub_kegiatan }));
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (metode === 'lama' && isOpen) {
            fetchIdSubKegiatan();
        }
    }, [id, token, reset, metode, isOpen]);

    const onSubmit: SubmitHandler<FormValue> = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataNew = {
            //key : value
            nama_subkegiatan: SubKegiatan,
            kode_subkegiatan: Kode,
        };
        const formDataEdit = {
            //key : value
            id: id,
            nama_subkegiatan: SubKegiatan,
            kode_subkegiatan: Kode,
        };
        // console.log(formData);
        // console.log("endpoint", endpoint);
        try {
            let url = "";
            if (metode === "lama") {
                url = `sub_kegiatan/update/${id}`;
            } else if (metode === "baru") {
                url = `sub_kegiatan/create`;
            } else {
                url = '';
            }
            setProses(true);
            const response = await fetch(`${API_URL}/${url}`, {
                method: metode === 'lama' ? "PUT" : "POST",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(metode === 'baru' ? formDataNew : formDataEdit),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "Berhasil menambahkan Master Sub Kegiatan", "success", 1000);
                onClose();
                onSuccess();
            } else {
                console.log(result);
                AlertNotification("Gagal", `${result.sub_kegiatan}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "Cek koneksi internet / terdapat kesalahan pada server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
            <div className="bg-white rounded-lg p-8 z-10 w-3/5 text-start">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-max-[500px] py-2 border-b font-bold text-center">
                        {metode === 'baru' ? "Tambah" : "Edit"} Sub Kegiatan
                    </div>
                    {Loading ? 
                        <LoadingClip />
                    :
                    <>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_subkegiatan"
                            >
                                Kode Sub Kegiatan:
                            </label>
                            <Controller
                                name="kode_subkegiatan"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="kode_subkegiatan"
                                        placeholder="masukkan Kode"
                                        value={Kode}
                                        type="text"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setKode(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_subkegiatan"
                            >
                                Nama Sub Kegiatan:
                            </label>
                            <Controller
                                name="nama_subkegiatan"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_subkegiatan"
                                        placeholder="masukkan nama sub kegiatan"
                                        value={SubKegiatan}
                                        type="text"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setSubKegiatan(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </>
                    }
                    <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                        {Proses ?
                            <span className="flex items-center gap-1">
                                <LoadingButtonClip />
                                Menyimpan
                            </span>
                            :
                            <span className="flex items-center gap-1">
                                <TbCirclePlus />
                                Simpan
                            </span>
                        }
                    </ButtonSky>
                    <ButtonRed type="button" className="w-full my-3 flex items-center gap-1" onClick={handleClose} disabled={Proses}>
                        <TbCircleX />
                        Batal
                    </ButtonRed>
                </form>
            </div>
        </div>
    );
};
