'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification } from "@/components/global/Alert";
import { LoadingButtonClip } from "@/components/global/Loading";

interface FormValue {
    rekin_id: string;
    permasalahan: string;
    penyebab_internal: string;
    penyebab_eksternal: string;
    jenis_permasalahan: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    id_rekin: string;
    id?: number;
}

export const ModalPermasalahanAdd: React.FC<modal> = ({isOpen, onClose, id_rekin}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [Permasalahan, setPermasalahan] = useState<string>('');
    const [PenyebabInternal, setPenyebabInternal] = useState<string>('');
    const [PenyebabEksternal, setPenyebabEksternal] = useState<string>('');
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
          permasalahan: data.permasalahan,
          penyebab_internal: data.penyebab_internal,
          penyebab_eksternal : data.penyebab_eksternal,
          jenis_permasalahan : "umum",
      };
    //   console.log(formData);
      try{
        setProses(true);
          const response = await fetch(`${API_URL}/permasalahan_rekin/create`, {
              method: "POST",
              headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });
          if(response.ok){
              AlertNotification("Berhasil", "Berhasil menambahkan Permasalahan", "success", 1000);
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
                    <h1 className="text-xl uppercase">Tambah Permasalahan</h1>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="permasalahan"
                        >
                            Permasalahan:
                        </label>
                        <Controller
                            name="permasalahan"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="permasalahan"
                                    type="text"
                                    placeholder="masukkan Permasalahan"
                                    value={field.value || Permasalahan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setPermasalahan(e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="penyebab_internal"
                        >
                            Penyebab Internal:
                        </label>
                        <Controller
                            name="penyebab_internal"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="penyebab_internal"
                                    placeholder="masukkan penyebab_internal"
                                    value={field.value || PenyebabInternal}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setPenyebabInternal(e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="penyebab_eksternal"
                        >
                            Penyebab Eksternal:
                        </label>
                        <Controller
                            name="penyebab_eksternal"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="penyebab_eksternal"
                                    placeholder="masukkan penyebab eksternal"
                                    value={field.value || PenyebabEksternal}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setPenyebabEksternal(e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="jenis_permasalahan"
                        >
                            Jenis Permasalahan:
                        </label>
                        <Controller
                            name="jenis_permasalahan"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="text"
                                    className="border px-4 py-2 rounded-lg"
                                    id="jenis_permasalahan"
                                    disabled
                                    placeholder="masukkan jenis permasalahan"
                                    value='umum'
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
export const ModalPermasalahanEdit: React.FC<modal> = ({isOpen, onClose, id_rekin, id}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [Permasalahan, setPermasalahan] = useState<string>('');
    const [PenyebabInternal, setPenyebabInternal] = useState<string>('');
    const [PenyebabEksternal, setPenyebabEksternal] = useState<string>('');
    const [user, setUser] = useState<any>(null);
    const [Proses, setProses] = useState<boolean>(false);
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
                const response = await fetch(`${API_URL}/permasalahan_rekin/detail/${id}`, {
                    headers: {
                      'Authorization': `${token}`,
                    },
                });
                const result = await response.json();
                const data = result.data;
                if(data.Permasalahan){
                    setPermasalahan(data.Permasalahan)
                }
                if(data.PenyebabInternal){
                    setPenyebabInternal(data.PenyebabInternal)
                }
                if(data.PenyebabEksternal){
                    setPenyebabEksternal(data.PenyebabEksternal)
                }
            } catch(err){
                console.error(err);
            }
        };
        if(isOpen){
            fetchId();
        }
    },[id, token, isOpen]);

    const onSubmit: SubmitHandler<FormValue> = async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const formData = {
          //key : value
          id: id,
          permasalahan: Permasalahan,
          penyebab_internal: PenyebabInternal,
          penyebab_eksternal : PenyebabEksternal,
          jenis_permasalahan: "umum",
      };
    //   console.log(formData);
      try{
        setProses(true);
          const response = await fetch(`${API_URL}/permasalahan_rekin/update/${id}`, {
              method: "PUT",
              headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });
          if(response.ok){
              AlertNotification("Berhasil", "Berhasil edit permasalaahn", "success", 1000);
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
                    <h1 className="text-xl uppercase">Edit permasalahan</h1>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="permasalahan"
                        >
                            Permasalahn:
                        </label>
                        <Controller
                            name="permasalahan"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="permasalahan"
                                    type="text"
                                    placeholder="masukkan Permasalahn"
                                    value={Permasalahan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setPermasalahan(e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="penyebab_internal"
                        >
                            Penyebab Internal:
                        </label>
                        <Controller
                            name="penyebab_internal"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="penyebab_internal"
                                    placeholder="masukkan penyebab_internal"
                                    value={PenyebabInternal}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setPenyebabInternal(e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="penyebab_eksternal"
                        >
                            Penyebab Eksternal:
                        </label>
                        <Controller
                            name="penyebab_eksternal"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="penyebab_eksternal"
                                    placeholder="masukkan penyebab_eksternal"
                                    value={PenyebabEksternal}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setPenyebabEksternal(e.target.value);
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