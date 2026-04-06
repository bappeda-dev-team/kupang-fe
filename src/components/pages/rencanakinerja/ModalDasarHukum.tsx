'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification } from "@/components/global/Alert";
import { LoadingButtonClip } from "@/components/global/Loading";

interface FormValue {
    rencana_kinerja_id: string;
    pegawai_id: string;
    kode_opd: string;
    peraturan_terkait: string;
    uraian: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    id_rekin: string;
    id?: string;
}

export const ModalDasarHukumAdd: React.FC<modal> = ({isOpen, onClose, id_rekin}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [PeraturanTerkait, setPeraturanTerkait] = useState<string>('');
    const [Uraian, setUraian] = useState<string>('');
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
          rencana_kinerja_id: id_rekin,
          pegawai_id: user?.pegawai_id,
          kode_opd: user?.kode_opd,
          peraturan_terkait : data.peraturan_terkait,
          uraian : data.uraian,
      };
    //   console.log(formData);
      try{
        setProses(true);
          const response = await fetch(`${API_URL}/dasar_hukum/create/${id_rekin}`, {
              method: "POST",
              headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });
          if(response.ok){
              AlertNotification("Berhasil", "Berhasil menambahkan dasar hukum", "success", 1000);
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
                    <h1 className="text-xl uppercase">Tambah Dasar Hukum</h1>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="peraturan_terkait"
                        >
                            Peraturan Terkait:
                        </label>
                        <Controller
                            name="peraturan_terkait"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="peraturan_terkait"
                                    type="text"
                                    placeholder="masukkan Peraturan Terkait"
                                    value={field.value || PeraturanTerkait}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setPeraturanTerkait(e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="uraian"
                        >
                            Uraian:
                        </label>
                        <Controller
                            name="uraian"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="uraian"
                                    placeholder="masukkan uraian"
                                    value={field.value || Uraian}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setUraian(e.target.value);
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
export const ModalDasarHukumEdit: React.FC<modal> = ({isOpen, onClose, id_rekin, id}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [PeraturanTerkait, setPeraturanTerkait] = useState<string>('');
    const [Uraian, setUraian] = useState<string>('');
    const [Urutan, setUrutan] = useState<number | null>(null);
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
                const response = await fetch(`${API_URL}/dasar_hukum/detail/${id}`, {
                    headers: {
                      'Authorization': `${token}`,
                    },
                });
                const result = await response.json();
                const data = result.dasar_hukum;
                if(data.peraturan_terkait){
                    setPeraturanTerkait(data.peraturan_terkait)
                }
                if(data.uraian){
                    setUraian(data.uraian)
                }
                if(data.urutan){
                    setUrutan(data.urutan)
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
          rencana_kinerja_id: id_rekin,
          pegawai_id: user?.pegawai_id,
          kode_opd: user?.kode_opd,
          urutan: Urutan,
          peraturan_terkait : PeraturanTerkait,
          uraian : Uraian,
      };
    //   console.log(formData);
      try{
        setProses(true);
          const response = await fetch(`${API_URL}/dasar_hukum/update/${id}`, {
              method: "PUT",
              headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });
          if(response.ok){
              AlertNotification("Berhasil", "Berhasil edit dasar hukum", "success", 1000);
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
                    <h1 className="text-xl uppercase">Edit Dasar Hukum {id}</h1>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="peraturan_terkait"
                        >
                            Peraturan Terkait:
                        </label>
                        <Controller
                            name="peraturan_terkait"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="peraturan_terkait"
                                    type="text"
                                    placeholder="masukkan Peraturan Terkait"
                                    value={PeraturanTerkait}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setPeraturanTerkait(e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="uraian"
                        >
                            Uraian:
                        </label>
                        <Controller
                            name="uraian"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="uraian"
                                    placeholder="masukkan uraian"
                                    value={Uraian}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setUraian(e.target.value);
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