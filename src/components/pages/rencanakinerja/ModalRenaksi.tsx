'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken, getUser } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";

interface FormValue {
    rekin_id: string;
    kode_opd: string;
    urutan: number;
    nama_rencana_aksi: string;
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    metode: 'lama' | 'baru';
    id?: string;
    rekin_id?: string;
    onSuccess: () => void;
}


export const ModalRenaksi: React.FC<modal> = ({ isOpen, onClose, id, rekin_id, metode, onSuccess }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const token = getToken();
    const [User, setUser] = useState<any>(null);

    const [namaRenaksi, setNamaRenaksi] = useState<string>('');
    const [urutan, setUrutan] = useState<number | null>(null);

    const [Proses, setProses] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
    }, []);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchRenaksi = async () => {
            try {
                const response = await fetch(`${API_URL}/detail-rencana_aksi/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.renaksi;
                if (hasil.nama_rencana_aksi) {
                    setNamaRenaksi(hasil.nama_rencana_aksi);
                }
                if (hasil.urutan) {
                    setUrutan(hasil.urutan);
                }
            } catch (err) {
                console.log(err)
            }
        };
        if (metode === 'lama' && isOpen) {
            fetchRenaksi();
        }
    }, [id, token, isOpen, metode]);

    const onSubmit: SubmitHandler<FormValue> = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataNew = {
            //key : value
            rekin_id: rekin_id,
            urutan: urutan,
            kode_opd: User?.kode_opd,
            nama_rencana_aksi: namaRenaksi,
        };
        const formDataEdit = {
            //key : value
            id: id,
            urutan: urutan,
            nama_rencana_aksi: namaRenaksi,
        };
        const getBody = () => {
            if (metode === "lama") return formDataEdit;
            if (metode === "baru") return formDataNew;
            return {}; // Default jika metode tidak sesuai
        };
        // metode === 'baru' && console.log("baru :", formDataNew);
        // metode === 'lama' && console.log("lama :", formDataEdit);
        if (urutan === 0) {
            AlertNotification("Urutan tidak boleh kosong", "", "warning", 2000);
        } else {
            try {
                let url = "";
                if (metode === "lama") {
                    url = `rencana_aksi/update/rencanaaksi/${id}`;
                } else if (metode === "baru") {
                    url = `rencana_aksi/create/rencanaaksi/${rekin_id}`;
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
                    AlertNotification("Berhasil", `Berhasil ${metode === 'baru' ? "Menambahkan" : "Mengubah"} Tahapan Rencana Aksi`, "success", 1000);
                    onClose();
                    onSuccess();
                } else {
                    AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
                }
            } catch (err) {
                AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            } finally {
                setProses(false);
            }
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
        setUrutan(0);
        setNamaRenaksi('');
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{metode === 'baru' ? "Tambah" : "Edit"} Tahapan</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_rencana_aksi"
                            >
                                Tahapan:
                            </label>
                            <Controller
                                name="nama_rencana_aksi"
                                control={control}
                                rules={{ required: "tahapan wajib terisi" }}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="nama_rencana_aksi"
                                            type="text"
                                            placeholder="masukkan Tahapan Rencana Aksi"
                                            value={namaRenaksi}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setNamaRenaksi(e.target.value);
                                            }}
                                        />
                                        {errors.nama_rencana_aksi &&
                                            <p className="text-red-400 italic">{errors.nama_rencana_aksi.message}</p>
                                        }
                                    </>
                                )}
                            />
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
                                rules={{ required: "urutan wajib terisi" }}
                                render={({ field }) => {
                                    const handleInputChange = (e: any) => {
                                        const inputValue = e.target.value;
                                        const numericValue = unformatNumber(inputValue);
                                        field.onChange(numericValue);
                                        setUrutan(unformatNumber(inputValue));
                                    };
                                    const displayValue = urutan;
                                    return (
                                        <>
                                            <input
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                id="urutan"
                                                type="text"
                                                placeholder="masukkan Urutan"
                                                value={displayValue === null ? "" : displayValue}
                                                onChange={handleInputChange}
                                            />
                                            {errors.urutan &&
                                                <p className="text-red-400 italic">{errors.urutan.message}</p>
                                            }
                                        </>
                                    )
                                }}
                            />
                        </div>
                        <ButtonSky className="w-full my-3" type="submit" disabled={Proses}>
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full my-3" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}