'use client'

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ButtonGreen, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useRouter, useParams } from "next/navigation";
import { getToken } from "@/components/lib/Cookie";

interface OptionTypeString {
    value: string;
    label: string;
}
interface FormValue {
    id: string;
    nama_urusan: string;
    kode_urusan: string;
}

export const FormUrusan = () => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [NamaUrusan, setNamaUrusan] = useState<string>('');
    const [KodeUrusan, setKodeUrusan] = useState<string>('');
    const router = useRouter();
    const token = getToken();

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            nama_urusan : data.nama_urusan,
            kode_urusan : data.kode_urusan,
        };
        // console.log(formData);
        try{
            const response = await fetch(`${API_URL}/urusan/create`, {
                method: "POST",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil menambahkan data master urusan", "success", 1000);
                router.push("/DataMaster/masterprogramkegiatan/urusan");
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        }
    };

    return(
    <>
        <div className="border p-5 rounded-xl shadow-xl">
            <h1 className="uppercase font-bold">Form Tambah Urusan :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nama_urusan"
                    >
                        Nama Urusan :
                    </label>
                    <Controller
                        name="nama_urusan"
                        control={control}
                        rules={{ required: "Nama Urusan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nama_urusan"
                                    type="text"
                                    placeholder="masukkan Nama Urusan"
                                    value={field.value || NamaUrusan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setNamaUrusan(e.target.value);
                                    }}
                                />
                                {errors.nama_urusan ?
                                    <h1 className="text-red-500">
                                    {errors.nama_urusan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Nama Urusan Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="kode_urusan"
                    >
                        Kode Urusan :
                    </label>
                    <Controller
                        name="kode_urusan"
                        control={control}
                        rules={{ required: "Kode Urusan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="tahun"
                                    type="text"
                                    placeholder="masukkan Kode Urusan"
                                    value={field.value || KodeUrusan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setKodeUrusan(e.target.value);
                                    }}
                                />
                                {errors.kode_urusan ?
                                    <h1 className="text-red-500">
                                    {errors.kode_urusan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Kode Urusan Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <ButtonGreen
                    type="submit"
                    className="my-4"
                >
                    Simpan
                </ButtonGreen>
                <ButtonRed type="button" halaman_url="/DataMaster/masterprogramkegiatan/urusan">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}
export const FormEditUrusan = () => {

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FormValue>();
    const [NamaUrusan, setNamaUrusan] = useState<string>('');
    const [KodeUrusan, setKodeUrusan] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [idNull, setIdNull] = useState<boolean | null>(null);
    const {id} = useParams();
    const router = useRouter();
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchIdUrusan = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/urusan/detail/${id}`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                if(result.code == 500){
                    setIdNull(true);
                } else {
                    const data = result.data;
                    if(data.nama_urusan){
                        setNamaUrusan(data.nama_urusan);
                        reset((prev) => ({ ...prev, nama_urusan: data.nama_urusan }))
                    }
                    if(data.kode_urusan){
                        setKodeUrusan(data.kode_urusan);
                        reset((prev) => ({ ...prev, kode_urusan: data.kode_urusan }))
                    }
                }
            } catch(err) {
                setError('gagal mendapatkan data, periksa koneksi internet atau database server')
            } finally {
                setLoading(false);
            }
        }
        fetchIdUrusan();
    },[id, reset, token]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const formData = {
          //key : value
          nama_urusan : data.nama_urusan,
          kode_urusan : data.kode_urusan,
      };
        //console.log(formData);
        try{
            const response = await fetch(`${API_URL}/urusan/update/${id}`, {
                method: "PUT",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil menambahkan data urusan", "success", 1000);
                router.push("/DataMaster/masterprogramkegiatan/urusan");
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        }
    };

    if(loading){
        return (    
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Urusan :</h1>
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Urusan :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } else if(idNull){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Urusan :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tidak ditemukan</h1>
            </div>
        )
    }

    return(
    <>
        <div className="border p-5 rounded-xl shadow-xl">
            <h1 className="uppercase font-bold">Form Edit Urusan :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nama_urusan"
                    >
                        Nama Urusan :
                    </label>
                    <Controller
                        name="nama_urusan"
                        control={control}
                        rules={{ required: "Nama Urusan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nama_urusan"
                                    type="text"
                                    placeholder="masukkan Nama Urusan"
                                    value={field.value || NamaUrusan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setNamaUrusan(e.target.value);
                                    }}
                                />
                                {errors.nama_urusan ?
                                    <h1 className="text-red-500">
                                    {errors.nama_urusan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Nama Urusan Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="kode_urusan"
                    >
                        Kode Urusan :
                    </label>
                    <Controller
                        name="kode_urusan"
                        control={control}
                        rules={{ required: "Kode Urusan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="tahun"
                                    type="text"
                                    placeholder="masukkan Kode Urusan"
                                    value={field.value || KodeUrusan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setKodeUrusan(e.target.value);
                                    }}
                                />
                                {errors.kode_urusan ?
                                    <h1 className="text-red-500">
                                    {errors.kode_urusan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Kode Urusan Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <ButtonGreen
                    type="submit"
                    className="my-4"
                >
                    Simpan
                </ButtonGreen>
                <ButtonRed type="button" halaman_url="/DataMaster/masterprogramkegiatan/urusan">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}