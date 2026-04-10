'use client'

import { useState, useEffect, useMemo } from "react";
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
    isMasterData?: boolean;
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


export const ModalAddUsulan: React.FC<modal> = ({ isOpen, onClose, jenis, metode, id, onSuccess, isMasterData }) => {

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
    const headers = useMemo(() => {
        const value: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (token) {
            value.Authorization = `${token}`;
        }
        return value;
    }, [token]);

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
        const fetchMasterMusrenbang = async() => {
            if(!id) return;
            try{
                const response = await fetch(`${API_URL}/musrenbangs/${id}`, {
                    headers,
                });
                const data = await response.json();
                const record =
                    data?.data ??
                    data?.musrenbang ??
                    data?.musrenbangs ??
                    data;
                setUsulan(record?.usulan ?? "");
                setAlamat(record?.alamat ?? "");
                setUraian(record?.uraian ?? "");
                setStatus(record?.status ?? "");
                if (record?.tahun) {
                    setTahun({ value: record.tahun, label: record.tahun });
                }
                if (record?.kode_opd) {
                    setSelectedOpd({ value: record.kode_opd, label: record.nama_opd ?? record.kode_opd });
                }
            } catch(err){
                console.error(err)
            } 
        }
        const fetchMusrenbang = async() => {
            try{
                const response = await fetch(`${API_URL}/usulan_musrebang/detail/${id}`, {
                    headers,
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
                    headers,
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
        const fetchMasterPokir = async () => {
            if(!id) return;
            try{
                const response = await fetch(`${API_URL}/pokok-pikirans/${id}`, {
                    headers,
                });
                if (!response.ok) {
                    throw new Error("Gagal memuat data pokok pikiran");
                }
                const payload = await response.json();
                const data =
                    payload?.data ??
                    payload?.pokok_pikirans ??
                    payload?.usulan_pokok_pikiran ??
                    payload;
                setUsulan(data?.usulan ?? "");
                setAlamat(data?.alamat ?? "");
                setUraian(data?.uraian ?? "");
                setStatus(data?.status ?? "");
                if (data?.tahun) {
                    setTahun({ value: data.tahun, label: data.tahun });
                }
                if (data?.kode_opd) {
                    setSelectedOpd({ value: data.kode_opd, label: data.nama_opd ?? data.kode_opd });
                }
            } catch(err){
                console.error(err)
            } 
        }
        if(isMasterData && jenis === 'musrenbang' && metode === 'lama' && isOpen){
            fetchMasterMusrenbang();
        } else if(jenis === 'musrenbang' && metode === 'lama' && isOpen){
            fetchMusrenbang();
        } else if(jenis === 'pokir' && metode === 'lama' && isOpen){
            if(isMasterData){
                fetchMasterPokir();
            } else {
                fetchPokir();
            }
        }
    }, [headers, jenis, metode, id, isOpen, isMasterData])

    const onSubmit: SubmitHandler<FormValue> = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            setProses(true);
            const isMasterCreation = isMasterData && jenis === "musrenbang" && metode === "baru";
            const isMasterPokirCreation = isMasterData && jenis === "pokir" && metode === "baru";
            const tahunValue = Tahun?.value ?? null;
            const statusValue = Status || null;
            const payload = {
                alamat: Alamat,
                kode_opd: SelectedOpd?.value,
                nama_opd: SelectedOpd?.label ?? SelectedOpd?.value,
                status: statusValue,
                tahun: tahunValue,
                uraian: Uraian,
                usulan: Usulan,
            };
            let url = "";
            let method: "POST" | "PUT" = "POST";
            const isMasterUpdate = isMasterData && jenis === "musrenbang" && metode === "lama";
            const isMasterPokirUpdate = isMasterData && jenis === "pokir" && metode === "lama";
            if (isMasterCreation) {
                url = "musrenbangs";
            } else if (isMasterUpdate && id) {
                url = `musrenbangs/${id}`;
                method = "PUT";
            } else if (jenis === "musrenbang") {
                url = metode === "baru" ? "usulan_musrebang/create" : `usulan_musrebang/update/${id}`;
                method = metode === "baru" ? "POST" : "PUT";
            } else if (isMasterPokirCreation) {
                url = "pokok-pikirans";
                method = "POST";
            } else if (isMasterPokirUpdate && id) {
                url = `pokok-pikirans/${id}`;
                method = "PUT";
            } else if (jenis === "pokir") {
                url = metode === "baru" ? "usulan_pokok_pikiran/create" : `usulan_pokok_pikiran/update/${id}`;
                method = metode === "baru" ? "POST" : "PUT";
            }
                const response = await fetch(`${API_URL}/${url}`, {
                    method,
                    headers,
                body: JSON.stringify(payload),
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
