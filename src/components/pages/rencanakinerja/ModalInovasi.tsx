'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification } from "@/components/global/Alert";
import { LoadingButtonClip } from "@/components/global/Loading";

interface FormValue {
    judul_inovasi: string;
    jenis_inovasi: string;
    gambaran_nilai_kebaruan: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    id_rekin: string;
    id? : string;
}


export const ModalInovasi: React.FC<modal> = ({isOpen, onClose, id_rekin}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const token = getToken();
    const [user, setUser] = useState<any>(null);

    const [JudulInovasi, setJudulInovasi] = useState<string>('');
    const [JenisInovasi, setJenisInovasi] = useState<string>('');
    const [Gambaran, setGambaran] = useState<string>('');

    const [Proses, setProses] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
    },[]);

    const onSubmit: SubmitHandler<FormValue> = async(data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            rencana_kinerja_id: id_rekin,
            pegawai_id: user?.pegawai_id,
            judul_inovasi: data.judul_inovasi,
            jenis_inovasi: data.jenis_inovasi,
            gambaran_nilai_kebaruan: data.gambaran_nilai_kebaruan
        }
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/inovasi/create/${id_rekin}`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            if(response.ok){
                AlertNotification("Berhasil", "menambahkan inovasi sasaran pada rencana kinerja", "success", 2000);
                onClose();
            } else {
                AlertNotification("Gagal", "cek koneksi internet / database server", "error", 2000);
            }
        } catch(err){
            console.log(err);
            AlertNotification("Gagal", "cek koneksi internet / database server", "error", 2000);
        } finally {
            setProses(false);
        }
    }

    if(!isOpen){
        return null;
    } else {

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => {onClose(); setJudulInovasi(''); setJenisInovasi(''); setGambaran(''); }}></div>
            <form onSubmit={handleSubmit(onSubmit)} className={`bg-white rounded-lg p-8 z-10 w-4/5`}>
                <div className="w-max-[500px] py-2 border-b">
                    <h1 className="text-xl uppercase">Tambah Inovasi Sasaran</h1>
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="judul_inovasi`"
                    >
                        Judul Inovasi:
                    </label>
                    <Controller
                        name="judul_inovasi"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                className="border px-4 py-2 rounded-lg"
                                id="judul_inovasi`"
                                type="text"
                                placeholder="masukkan Judul Inovasi"
                                value={field.value || JudulInovasi}
                                onChange={(e) => {
                                    field.onChange(e);
                                    setJudulInovasi(e.target.value);
                                }}
                            />
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="jenis_inovasi"
                    >
                        Jenis Inovasi:
                    </label>
                    <Controller
                        name="jenis_inovasi"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                className="border px-4 py-2 rounded-lg"
                                id="jenis_inovasi"
                                type="text"
                                placeholder="masukkan jenis inovasi"
                                value={field.value || JenisInovasi}
                                onChange={(e) => {
                                    field.onChange(e);
                                    setJenisInovasi(e.target.value);
                                }}
                            />
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="gambaran_nilai_kebaruan"
                    >
                        Gambaran Nilai Kebaruan:
                    </label>
                    <Controller
                        name="gambaran_nilai_kebaruan"
                        control={control}
                        render={({ field }) => (
                            <textarea
                                {...field}
                                className="border px-4 py-2 rounded-lg"
                                id="gambaran_nilai_kebaruan"
                                placeholder="masukkan gambaran nilai"
                                value={field.value || Gambaran}
                                onChange={(e) => {
                                    field.onChange(e);
                                    setGambaran(e.target.value);
                                }}
                            />
                        )}
                    />
                </div>
                <ButtonSky className="w-full my-3" type="submit" disabled={Proses}>
                    Simpan
                </ButtonSky>
                <ButtonRed className="w-full my-3" onClick={() => {onClose(); setJudulInovasi(''); setJenisInovasi(''); setGambaran(''); }}>
                    Batal
                </ButtonRed>
            </form>
        </div>
    )
    }
}
export const ModalInovasiEdit: React.FC<modal> = ({isOpen, onClose, id_rekin, id}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [JudulInovasi, setJudulInovasi] = useState<string>('');
    const [JenisInovasi, setJenisInovasi] = useState<string>('');
    const [Gambaran, setGambaran] = useState<string>('');

    const [Proses, setProses] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
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
                const response = await fetch(`${API_URL}/inovasi/detail/${id}`, {
                    headers: {
                      'Authorization': `${token}`,
                    },
                });
                const result = await response.json();
                const data = result.inovasi;
                if(data.judul_inovasi){
                    setJudulInovasi(data.judul_inovasi);
                }
                if(data.jenis_inovasi){
                    setJenisInovasi(data.jenis_inovasi);
                }
                if(data.gambaran_nilai_kebaruan){
                    setGambaran(data.gambaran_nilai_kebaruan);
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
            rencana_kinerja_id: id_rekin,
            pegawai_id: user?.pegawai_id,
            judul_inovasi: data.judul_inovasi,
            jenis_inovasi: data.jenis_inovasi,
            gambaran_nilai_kebaruan: data.gambaran_nilai_kebaruan
      };
    //   console.log(formData);
      try{
        setProses(true);
          const response = await fetch(`${API_URL}/inovasi/update/${id}`, {
              method: "PUT",
              headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });
          if(response.ok){
              AlertNotification("Berhasil", "Berhasil edit inovasi", "success", 1000);
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
            <div className={`fixed inset-0 bg-black opacity-30`} onClick={onClose}></div>
            <div className={`bg-white rounded-lg p-8 z-10 w-4/5 text-start`}>
                <div className="w-max-[500px] py-2 border-b text-center">
                    <h1 className="text-xl uppercase">Edit Inovasi {id}</h1>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="judul_inovasi"
                        >
                            Judul Inovasi:
                        </label>
                        <Controller
                            name="judul_inovasi"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="judul_inovasi"
                                    type="text"
                                    placeholder="masukkan judul inovasi"
                                    value={JudulInovasi}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setJudulInovasi(e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="jenis_inovasi"
                        >
                            Jenis Inovasi:
                        </label>
                        <Controller
                            name="jenis_inovasi"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="text"
                                    className="border px-4 py-2 rounded-lg"
                                    id="jenis_inovasi"
                                    placeholder="masukkan jenis_inovasi"
                                    value={JenisInovasi}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setJenisInovasi(e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="gambaran_nilai_kebaruan"
                        >
                            Gambaran Nilai Kebaruan:
                        </label>
                        <Controller
                            name="gambaran_nilai_kebaruan"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="gambaran_nilai_kebaruan"
                                    placeholder="masukkan gambaran_nilai_kebaruan"
                                    value={Gambaran}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setGambaran(e.target.value);
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
                    <ButtonRed className="w-full my-3" onClick={onClose}>
                        Batal
                    </ButtonRed>
                </form>
            </div>
        </div>
    )
    }
}