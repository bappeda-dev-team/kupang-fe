'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken, getUser } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";

interface FormValue {
    rekin_id: string;
    pegawai_id: string;
    kode_opd: string;
    gambaran_umum: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    className?: string; 
    id_rekin: string;
    id?: string;
}


export const ModalAddGambaranUmum: React.FC<modal> = ({isOpen, onClose, id_rekin}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [GambaranUmum, setGambaranUmum] = useState<string>('');
    const [user, setUser] = useState<any>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
    },[]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            rekin_id: id_rekin,
            pegawai_id: user?.pegawai_id,
            kode_opd: user?.kode_opd,
            gambaran_umum : data.gambaran_umum,
        };
        // console.log(formData);
        try{
            setProses(true);
            const response = await fetch(`${API_URL}/gambaran_umum/create/${id_rekin}`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil menambahkan gambaran umum", "success", 1000);
                onClose();
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    if(!isOpen){
        return null;
    } else {

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
            <div className={`bg-white rounded-lg p-8 z-10 w-4/5`}>
                <div className="w-max-[500px] py-2 border-b">
                    <h1 className="text-xl uppercase">Tambah Gambaran Umum</h1>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="gambaran_umum"
                        >
                            Gambaran Umum:
                        </label>
                        <Controller
                            name="gambaran_umum"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="gambaran_umum"
                                    placeholder="masukkan gambaran umum"
                                    value={field.value || GambaranUmum}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setGambaranUmum(e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <ButtonSky className="w-full my-3" type="submit">
                        {Proses ? 
                            <span className="flex">
                                <LoadingButtonClip />
                                Menyimpan...
                            </span> 
                        :
                            "Simpan"
                        }
                    </ButtonSky>
                    <ButtonRed className="w-full my-3" type="button" onClick={onClose}>
                        Batal
                    </ButtonRed>
                </form>
            </div>
        </div>
    )
    }
}
export const ModalEditGambaranUmum: React.FC<modal> = ({isOpen, onClose, id_rekin, id}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [GambaranUmum, setGambaranUmum] = useState<string>('');
    const [user, setUser] = useState<any>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const [IdNull, setIdNull] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
    },[]);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchId = async() => {
            try{
                const response = await fetch(`${API_URL}/gambaran_umum/detail/${id}`, {
                    headers: {
                      'Authorization': `${token}`,
                    },
                });
                const result = await response.json();
                const data = result.gambaran_umum;
                if(data.gambaran_umum){
                    setGambaranUmum(data.gambaran_umum)
                }
            } catch(err){
                console.error(err);
            }
        };
        if(isOpen){
            fetchId();
        }
    },[id, token, isOpen]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            rekin_id: id_rekin,
            pegawai_id: user?.pegawai_id,
            kode_opd: user?.kode_opd,
            gambaran_umum : data.gambaran_umum,
        };
        // console.log(formData);
        try{
            setProses(true);
            const response = await fetch(`${API_URL}/gambaran_umum/update/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil mengubah gambaran umum", "success", 1000);
                onClose();
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    if(!isOpen){
        return null;
    } else {

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
            <div className={`bg-white rounded-lg p-8 z-10 w-4/5`}>
                <div className="w-max-[500px] py-2 border-b">
                    <h1 className="text-xl uppercase">Edit Gambaran Umum</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mx-5 py-5">
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="gambaran_umum"
                        >
                            Gambaran Umum:
                        </label>
                        <Controller
                            name="gambaran_umum"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="gambaran_umum"
                                    placeholder="masukkan gambaran umum"
                                    value={field.value || GambaranUmum}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setGambaranUmum(e.target.value);
                                    }}
                                />
                            )}
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
                    <ButtonRed className="w-full my-3" type="button" onClick={onClose}>
                        Batal
                    </ButtonRed>
                </form>
            </div>
        </div>
    )
    }
}