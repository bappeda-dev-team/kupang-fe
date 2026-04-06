'use client'

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ButtonGreen, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useRouter, useParams } from "next/navigation";
import Select from 'react-select';
import { getToken } from "@/components/lib/Cookie";

interface OptionTypeString {
    value: string;
    label: string;
}
interface FormValue {
    id: string;
    nama_kegiatan: string;
    kode_kegiatan: string;
    kode_opd: OptionTypeString;
}

export const FormKegiatan = () => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [NamaKegiatan, setNamaKegiatan] = useState<string>('');
    const [KodeKegiatan, setKodeKegiatan] = useState<string>('');
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const token = getToken();

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            nama_kegiatan : data.nama_kegiatan,
            kode_kegiatan : data.kode_kegiatan,
            kode_opd : data.kode_opd?.value,
        };
        // console.log(formData);
        try{
            const response = await fetch(`${API_URL}/kegiatan/create`, {
                method: "POST",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil menambahkan data kegiatan", "success", 1000);
                router.push("/DataMaster/masterprogramkegiatan/kegiatan");
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        }
      };

    const fetchOpd = async() => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      setIsLoading(true);
      try{ 
        const response = await fetch(`${API_URL}/opd/findall`,{
          method: 'GET',
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        });
        if(!response.ok){
          throw new Error('cant fetch data opd');
        }
        const data = await response.json();
        const opd = data.data.map((item: any) => ({
          value : item.kode_opd,
          label : item.nama_opd,
        }));
        setOpdOption(opd);
      } catch (err){
        console.log('gagal mendapatkan data opd');
      } finally {
        setIsLoading(false);
      }
    };

    return(
    <>
        <div className="border p-5 rounded-xl shadow-xl">
            <h1 className="uppercase font-bold">Form Tambah Kegiatan :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nama_kegiatan"
                    >
                        Nama Kegiatan :
                    </label>
                    <Controller
                        name="nama_kegiatan"
                        control={control}
                        rules={{ required: "Nama Kegiatan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nama_kegiatan"
                                    type="text"
                                    placeholder="masukkan Nama Kegiatan"
                                    value={field.value || NamaKegiatan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setNamaKegiatan(e.target.value);
                                    }}
                                />
                                {errors.nama_kegiatan ?
                                    <h1 className="text-red-500">
                                    {errors.nama_kegiatan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Nama Kegiatan Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="kode_kegiatan"
                    >
                        Kode Kegiatan :
                    </label>
                    <Controller
                        name="kode_kegiatan"
                        control={control}
                        rules={{ required: "Kode Kegiatan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="tahun"
                                    type="text"
                                    placeholder="masukkan Kode Kegiatan"
                                    value={field.value || KodeKegiatan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setKodeKegiatan(e.target.value);
                                    }}
                                />
                                {errors.kode_kegiatan ?
                                    <h1 className="text-red-500">
                                    {errors.kode_kegiatan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Kode Kegiatan Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="kode_opd"
                    >
                        Perangkat Daerah:
                    </label>
                    <Controller
                        name="kode_opd"
                        control={control}
                        rules={{required : "Perangkat Daerah Harus Terisi"}}
                        render={({ field }) => (
                        <>
                            <Select
                                {...field}
                                placeholder="Masukkan Perangkat Daerah"
                                value={KodeOpd}
                                options={OpdOption}
                                isLoading={IsLoading}
                                isSearchable
                                isClearable
                                onMenuOpen={() => {
                                    if (OpdOption.length === 0) {
                                    fetchOpd();
                                    }
                                }}
                                onMenuClose={() => {
                                    setOpdOption([]);
                                }}
                                onChange={(option) => {
                                    field.onChange(option);
                                    setKodeOpd(option);
                                }}
                                styles={{
                                    control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    })
                                }}
                            />
                            {errors.kode_opd ?
                                <h1 className="text-red-500">
                                    {errors.kode_opd.message}
                                </h1>
                            :
                                <h1 className="text-slate-300 text-xs">*Perangkat Daerah Harus Terisi</h1>
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
                <ButtonRed type="button" halaman_url="/DataMaster/masterprogramkegiatan/kegiatan">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}
export const FormEditKegiatan = () => {

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FormValue>();
    const [NamaKegiatan, setNamaKegiatan] = useState<string>('');
    const [KodeKegiatan, setKodeKegiatan] = useState<string>('');
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [idNull, setIdNull] = useState<boolean | null>(null);
    const router = useRouter();
    const {id} = useParams();
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fecthIdKegiatan = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/kegiatan/detail/${id}`, {
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
                    if(data.nama_kegiatan){
                        setNamaKegiatan(data.nama_kegiatan);
                        reset((prev) => ({ ...prev, nama_kegiatan: data.nama_kegiatan }))
                    }
                    if(data.kode_kegiatan){
                        setKodeKegiatan(data.kode_kegiatan);
                        reset((prev) => ({ ...prev, kode_kegiatan: data.kode_kegiatan }))
                    }
                    if(data.kode_opd){
                        const opd = {
                            value: data.kode_opd.kode_opd,
                            label: data.kode_opd.nama_opd,
                        }
                        reset((prev) => ({ ...prev, kode_opd: opd }))
                        setKodeOpd(opd);
                    }
                }
            } catch(err) {
                setError('gagal mendapatkan data, periksa koneksi internet atau database server')
            } finally {
                setLoading(false);
            }
        }
        fecthIdKegiatan();
    },[id, reset, token]);

    const fetchOpd = async() => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      setIsLoading(true);
      try{ 
        const response = await fetch(`${API_URL}/opd/findall`,{
          method: 'GET',
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        });
        if(!response.ok){
          throw new Error('cant fetch data opd');
        }
        const data = await response.json();
        const opd = data.data.map((item: any) => ({
          value : item.kode_opd,
          label : item.nama_opd,
        }));
        setOpdOption(opd);
      } catch (err){
        console.log('gagal mendapatkan data opd');
      } finally {
        setIsLoading(false);
      }
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const formData = {
          //key : value
          nama_kegiatan : data.nama_kegiatan,
          kode_kegiatan : data.kode_kegiatan,
          kode_opd : data.kode_opd?.value,
      };
        //   console.log(formData);
        try{
            const response = await fetch(`${API_URL}/kegiatan/update/${id}`, {
                method: "PUT",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil edit data master Kegiatan", "success", 1000);
                router.push("/DataMaster/masterprogramkegiatan/kegiatan");
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
                <h1 className="uppercase font-bold">Form Edit Kegiatan :</h1>
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Kegiatan :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } else if(idNull){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Kegiatan :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tidak ditemukan</h1>
            </div>
        )
    }

    return(
    <>
        <div className="border p-5 rounded-xl shadow-xl">
            <h1 className="uppercase font-bold">Form Edit Kegiatan :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nama_kegiatan"
                    >
                        Nama Kegiatan :
                    </label>
                    <Controller
                        name="nama_kegiatan"
                        control={control}
                        rules={{ required: "Nama Kegiatan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nama_kegiatan"
                                    type="text"
                                    placeholder="masukkan Nama Kegiatan"
                                    value={field.value || NamaKegiatan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setNamaKegiatan(e.target.value);
                                    }}
                                />
                                {errors.nama_kegiatan ?
                                    <h1 className="text-red-500">
                                    {errors.nama_kegiatan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Nama Kegiatan Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="kode_kegiatan"
                    >
                        Kode Kegiatan :
                    </label>
                    <Controller
                        name="kode_kegiatan"
                        control={control}
                        rules={{ required: "Kode Kegiatan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="tahun"
                                    type="text"
                                    placeholder="masukkan Kode Kegiatan"
                                    value={field.value || KodeKegiatan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setKodeKegiatan(e.target.value);
                                    }}
                                />
                                {errors.kode_kegiatan ?
                                    <h1 className="text-red-500">
                                    {errors.kode_kegiatan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Kode Kegiatan Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="kode_opd"
                    >
                        Perangkat Daerah:
                    </label>
                    <Controller
                        name="kode_opd"
                        control={control}
                        rules={{required : "Perangkat Daerah Harus Terisi"}}
                        render={({ field }) => (
                        <>
                            <Select
                                {...field}
                                placeholder="Masukkan Perangkat Daerah"
                                value={KodeOpd}
                                options={OpdOption}
                                isLoading={IsLoading}
                                isSearchable
                                isClearable
                                onMenuOpen={() => {
                                    if (OpdOption.length === 0) {
                                    fetchOpd();
                                    }
                                }}
                                onMenuClose={() => {
                                    setOpdOption([]);
                                }}
                                onChange={(option) => {
                                    field.onChange(option);
                                    setKodeOpd(option);
                                }}
                                styles={{
                                    control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    })
                                }}
                            />
                            {errors.kode_opd ?
                                <h1 className="text-red-500">
                                    {errors.kode_opd.message}
                                </h1>
                            :
                                <h1 className="text-slate-300 text-xs">*Perangkat Daerah Harus Terisi</h1>
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
                <ButtonRed type="button" halaman_url="/DataMaster/masterprogramkegiatan/kegiatan">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}