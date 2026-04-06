'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonRedBorder } from '@/components/global/Button';
import { LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { TbTrash, TbCopyCheckFilled, TbXboxX, TbAlertTriangle } from "react-icons/tb";

interface FormValue {
    id?: string;
    rencana_aksi_id?: string;
    bobot: number;
    bulan: number;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    renaksi_id?: string;
    id?: string;
    bulan: number | null;
    nama_renaksi: string;
    total_bobot?: number;
    metode: 'lama' | 'baru';
    onSuccess: () => void;
}


export const ModalTahapan: React.FC<modal> = ({ isOpen, onClose, renaksi_id, id, total_bobot, nama_renaksi, bulan, metode, onSuccess }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const token = getToken();

    const [IdPelaksanaan, setIdPelaksanaan] = useState<string>('');
    const [Bobot, setBobot] = useState<number>(0);
    const [BobotSementara, setBobotSementara] = useState<number>(0);
    const [BobotTersedia, setBobotTersedia] = useState<number | null>(null);

    const [Proses, setProses] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchRenaksi = async () => {
            try {
                const response = await fetch(`${API_URL}/pelaksanaan_rencana_aksi/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.pelaksanaan_renaksi;
                if (hasil.id) {
                    setIdPelaksanaan(hasil.id);
                }
                if (hasil.bobot) {
                    setBobot(hasil.bobot);
                    setBobotSementara(hasil.bobot);
                }
                if (hasil.bobot_tersedia) {
                    setBobotTersedia(hasil.bobot_tersedia);
                }
            } catch (err) {
                console.log('error saat fetch detail bobot pelaksanaan', err);
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
            rencana_aksi_id: renaksi_id,
            bobot: Bobot,
            bulan: bulan,
        };
        const formDataEdit = {
            //key : value
            id: id,
            bobot: Bobot,
            bulan: bulan,
        };
        const getBody = () => {
            if (metode === "lama") return formDataEdit;
            if (metode === "baru") return formDataNew;
            return {}; // Default jika metode tidak sesuai
        };
        // metode === 'baru' && console.log("baru :", formDataNew);
        // metode === 'lama' && console.log("lama :", formDataEdit);
        if(Bobot > bobot_tersedia_baru && metode == 'baru'){
            AlertNotification("bobot melebihi yang tersedia", "", "error", 1000);
        } else if(Bobot > bobot_tersedia_lama && metode == 'lama'){
        } else {
            try {
                let url = "";
                if (metode === "lama") {
                    url = `pelaksanaan_rencana_aksi/update/${renaksi_id}`;
                } else if (metode === "baru") {
                    url = `pelaksanaan_rencana_aksi/create/${renaksi_id}`;
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
                    AlertNotification("Berhasil", `Berhasil ${metode === 'baru' ? "Menambahkan" : "Mengubah"} Bobot Tahapan`, "success", 1000);
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

    const handleClose = () => {
        onClose();
        setBobot(0);
    }
    const bobot_tersedia_baru = 100 - (total_bobot ?? 0);
    const bobot_tersedia_lama = BobotSementara + (BobotTersedia ?? 0);

    const hapusBobot = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/pelaksanaan_rencana_aksi/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Bobot Tahapan Berhasil Dihapus", "success", 1000);
            onClose();
            onSuccess();
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-3/5`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">Target Bulanan</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <table>
                            <tbody>
                                <tr className="rounded-lg border my-1">
                                    <td className="py-2 px-2 max-w-[50px]">Nama Tahapan</td>
                                    <td className="py-2 px-2 max-w-[10px]">:</td>
                                    <td className="py-2 px-2 max-w-[200px]">{nama_renaksi}</td>
                                </tr>
                                <tr className="rounded-lg border my-1">
                                    <td className="py-2 px-2 max-w-[50px]">Bulan</td>
                                    <td className="py-2 px-2 max-w-[10px]">:</td>
                                    <td className="py-2 px-2 max-w-[200px]">Ke - {bulan}</td>
                                </tr>
                                <tr className="rounded-lg border my-1">
                                    <td className="py-2 px-2 max-w-[50px]">Bobot Yang Masih Bisa ditambahkan</td>
                                    <td className="py-2 px-2 max-w-[10px]">:</td>
                                    <td className="py-2 px-2 flex gap-2 items-center">
                                        {metode == 'baru' && bobot_tersedia_baru}
                                        {metode == 'lama' && bobot_tersedia_lama}
                                        {(metode == 'baru' && Bobot > bobot_tersedia_baru) &&
                                            <p className="text-white p-1 uppercase rounded-xl bg-red-500 flex items-center gap-1">
                                                <TbAlertTriangle />
                                                bobot melebihi yang tersedia
                                            </p>
                                        }
                                        {(metode == 'lama' && Bobot > bobot_tersedia_lama) &&
                                            <p className="text-white p-1 uppercase rounded-xl bg-red-500 flex items-center gap-1">
                                                <TbAlertTriangle />
                                                bobot melebihi yang tersedia
                                            </p>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="flex flex-col justify-center py-3">
                            <label
                                className="flex justify-between items-center uppercase text-xs font-bold text-gray-700 mt-2"
                                htmlFor="bobot"
                            >
                                Target:
                                {metode === 'lama' &&
                                    <ButtonRedBorder
                                        type="button"
                                        className="flex gap-1"
                                        onClick={() => hapusBobot(IdPelaksanaan)}
                                    >
                                        <TbTrash />
                                        Kosongkan Isian
                                    </ButtonRedBorder>
                                }
                            </label>
                            <input
                                type="number"
                                className="border-2 text-center rounded-2xl px-5 py-2 my-3 font-bold hover:border-sky-500 focus:outline-none focus:border-blue-500"
                                value={Bobot}
                                onChange={(e) => {
                                    setBobot(Number(e.target.value));
                                }}
                            />
                            <Controller
                                name="bobot"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            type="range"
                                            id="bobot"
                                            min="0"
                                            max="100"
                                            value={Bobot}
                                            onChange={(e) => {
                                                setBobot(Number(e.target.value));
                                            }}
                                            step="1"
                                            className="w-full bg-blue-100 text-black rounded-lg appearance-none cursor-pointer"
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <ButtonSky type="submit" className="w-full mt-3 flex gap-1" disabled={Proses}>
                            <TbCopyCheckFilled />
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full my-3 flex gap-1" onClick={handleClose} disabled={Proses}>
                            <TbXboxX />
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}