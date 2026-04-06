'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken, getUser, getOpdTahun } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";

interface OptionType {
    value: number;
    label: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    id?: string;
    jenis: "musrenbang" | "pokir";
    metode: "baru" | "lama";
    onSuccess: () => void;
}

interface FormValue {
    usulan: string;
    alamat: string;
    uraian: string;
    tahun: string;
    pagawai_id: string;
    kode_opd: string;
    status: string;
}


export const ModalAddUsulan: React.FC<modal> = ({ isOpen, onClose, jenis, metode, id, onSuccess }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();

    const [user, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    
    const [Usulan, setUsulan] = useState<string>("");
    const [Alamat, setAlamat] = useState<string>('');
    const [Uraian, setUraian] = useState<string>('');
    const [Status, setStatus] = useState<string>('');

    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
        const data = getOpdTahun();
        if(data.tahun){
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if(data.opd){
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    },[]);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchMusrenbang = async() => {
            try{
                const response = await fetch(`${API_URL}/usulan_musrebang/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                      },
                });
                const result = await response.json();
                const data = result.usulan_musrebang;
                if(data.usulan){
                    setUsulan(data.usulan);
                }
                if(data.alamat){
                    setAlamat(data.alamat);
                }
                if(data.uraian){
                    setUraian(data.uraian);
                }
                if(data.status){
                    setStatus(data.status);
                }
            } catch(err){
                console.error(err)
            } 
        }
        const fetchPokir = async() => {
            try{
                const response = await fetch(`${API_URL}/usulan_pokok_pikiran/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                      },
                });
                const result = await response.json();
                const data = result.usulan_pokok_pikiran;
                if(data.usulan){
                    setUsulan(data.usulan);
                }
                if(data.alamat){
                    setAlamat(data.alamat);
                }
                if(data.uraian){
                    setUraian(data.uraian);
                }
            } catch(err){
                console.error(err)
            } 
        }
        if(jenis === 'musrenbang' && metode === 'lama' && isOpen){
            fetchMusrenbang();
        } else if(jenis === 'pokir' && metode === 'lama' && isOpen){
            fetchPokir();
        }
    }, [token, jenis, metode, id, isOpen])

    const onSubmit: SubmitHandler<FormValue> = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            usulan: Usulan,
            alamat: Alamat,
            uraian: Uraian,
            tahun: String(Tahun?.value),
            kode_opd: SelectedOpd?.value,
            pegawai_id: user?.pegawai_id,
            status: Status,
        };
        // console.log(formData);
        try{
            setProses(true);
            let url = '';
            if (jenis === "musrenbang") {
                url = metode === "baru" ? "usulan_musrebang/create" : `usulan_musrebang/update/${id}`;
            } else if (jenis === "pokir") {
                url = metode === "baru" ? "usulan_pokok_pikiran/create" : `usulan_pokok_pikiran/update/${id}`;
            }
            const response = await fetch(`${API_URL}/${url}`, {
                method: metode === "baru" ? "POST" : "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil menambahkan usulan", "success", 1000);
                onClose();
                onSuccess();
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    const handleClose = () => {
        onClose();
        setUsulan('');
        setAlamat('');
        setUraian('');
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5`}>
                    <div className="flex justify-center w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase">{metode === 'baru' ? "Tambah" : "Edit"} Usulan {id}</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="usulan"
                            >
                                Usulan {jenis} :
                            </label>
                            <Controller
                                name="usulan"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <input
                                            className="border px-4 py-2 rounded-lg"
                                            type="text"
                                            value={Usulan}
                                            placeholder="Masukkan usulan"
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setUsulan(e.target.value);
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="alamat"
                            >
                                Alamat :
                            </label>
                            <Controller
                                name="alamat"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <input
                                            className="border px-4 py-2 rounded-lg"
                                            type="text"
                                            value={Alamat}
                                            placeholder="Masukkan alamat"
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setAlamat(e.target.value);
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="uraian"
                            >
                                Uraian :
                            </label>
                            <Controller
                                name="uraian"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <input
                                            className="border px-4 py-2 rounded-lg"
                                            type="text"
                                            value={Uraian}
                                            placeholder="Masukkan uraian"
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setUraian(e.target.value);
                                            }}
                                        />
                                    </>
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
                        <ButtonRed className="w-full mb-3" type="button" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}
