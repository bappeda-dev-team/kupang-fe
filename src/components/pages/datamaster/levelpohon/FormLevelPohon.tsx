'use client'

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ButtonGreen, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { LoadingClip } from "@/components/global/Loading";

interface FormValue {
    nama_pohon: string;
    level_pohon: number;
}

export const FormLevelPohon = () => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [LevelPohon, setLevelPohon] = useState<string>('');

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            nama_pohon : data.nama_pohon,
            level_pohon : data.level_pohon,
        };
        console.log(formData);
      };

    return(
    <>
        <div className="border p-5 rounded-xl shadow-xl">
            <h1 className="uppercase font-bold">Form Tambah Level Pohon :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nama_pohon"
                    >
                        Nama Pohon :
                    </label>
                    <Controller
                        name="nama_pohon"
                        control={control}
                        rules={{ required: "Nama Pohon harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nama_pohon"
                                    type="text"
                                    placeholder="masukkan Nama Pohon"
                                    value={field.value || NamaPohon}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setNamaPohon(e.target.value);
                                    }}
                                />
                                {errors.nama_pohon ?
                                    <h1 className="text-red-500">
                                    {errors.nama_pohon.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Nama Pohon Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="level_pohon"
                    >
                        Level Pohon :
                    </label>
                    <Controller
                        name="level_pohon"
                        control={control}
                        rules={{ required: "Level Pohon harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="level_pohon"
                                    type="text"
                                    placeholder="masukkan Level Pohon"
                                    value={field.value || LevelPohon}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setLevelPohon(e.target.value);
                                    }}
                                />
                                {errors.level_pohon ?
                                    <h1 className="text-red-500">
                                    {errors.level_pohon.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Level Pohon Harus Terisi</h1>
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
                <ButtonRed type="button" halaman_url="/DataMaster/masterjabatan">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}
export const FormEditLevelPohon = () => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [LevelPohon, setLevelPohon] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [idNull, setIdNull] = useState<boolean | null>(null);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchIdOpd = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/lorem`);
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                if(result.code == 500){
                    setIdNull(true);
                } else {
                    const data = result.data;
                    if(data.nama_pohon){
                        setNamaPohon(data.nama_pohon);
                    }
                    if(data.level_pohon){
                        setLevelPohon(data.level_pohon);
                    }
                }
            } catch(err) {
                setError('gagal mendapatkan data, periksa koneksi internet atau database server')
            } finally {
                setLoading(false);
            }
        }
        fetchIdOpd();
    },[]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
      const formData = {
          //key : value
          nama_pohon : data.nama_pohon,
          level_pohon : data.level_pohon,
      };
      console.log(formData);
    };

    if(loading){
        return (    
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Level Pohon :</h1>
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Level Pohon :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } else if(idNull){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Level Pohon :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tidak ditemukan</h1>
            </div>
        )
    } else {
        return(
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Level Pohon :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_pohon"
                        >
                            Nama Pohon :
                        </label>
                        <Controller
                            name="nama_pohon"
                            control={control}
                            rules={{ required: "Nama Pohon harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_pohon"
                                        type="text"
                                        placeholder="masukkan Nama Pohon"
                                        value={field.value || NamaPohon}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setNamaPohon(e.target.value);
                                        }}
                                    />
                                    {errors.nama_pohon ?
                                        <h1 className="text-red-500">
                                        {errors.nama_pohon.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Nama Pohon Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="level_pohon"
                        >
                            Level Pohon :
                        </label>
                        <Controller
                            name="level_pohon"
                            control={control}
                            rules={{ required: "Level Pohon harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="level_pohon"
                                        type="text"
                                        placeholder="masukkan Level Pohon"
                                        value={field.value || LevelPohon}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setLevelPohon(e.target.value);
                                        }}
                                    />
                                    {errors.level_pohon ?
                                        <h1 className="text-red-500">
                                        {errors.level_pohon.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Level Pohon Harus Terisi</h1>
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
                    <ButtonRed type="button" halaman_url="/DataMaster/masterjabatan">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
        )
    }
}