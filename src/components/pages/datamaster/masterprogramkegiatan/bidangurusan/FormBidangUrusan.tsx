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
    nama_bidang_urusan: string;
    kode_bidang_urusan: string;
}

export const FormBidangUrusan = () => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [NamaBidangUrusan, setNamaBidangUrusan] = useState<string>('');
    const [KodeBidangUrusan, setKodeBidangUrusan] = useState<string>('');
    const router = useRouter();
    const token = getToken();

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            nama_bidang_urusan : data.nama_bidang_urusan,
            kode_bidang_urusan : data.kode_bidang_urusan,
        };
        // console.log(formData);
        try{
            const response = await fetch(`${API_URL}/bidang_urusan/create`, {
                method: "POST",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil menambahkan data master bidang urusan", "success", 1000);
                router.push("/DataMaster/masterprogramkegiatan/bidangurusan");
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
            <h1 className="uppercase font-bold">Form Tambah Bidang Urusan :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nama_bidang_urusan"
                    >
                        Nama bidang Urusan :
                    </label>
                    <Controller
                        name="nama_bidang_urusan"
                        control={control}
                        rules={{ required: "Nama bidang Urusan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nama_bidang_urusan"
                                    type="text"
                                    placeholder="masukkan Nama bidang Urusan"
                                    value={field.value || NamaBidangUrusan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setNamaBidangUrusan(e.target.value);
                                    }}
                                />
                                {errors.nama_bidang_urusan ?
                                    <h1 className="text-red-500">
                                    {errors.nama_bidang_urusan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Nama bidang Urusan Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="kode_bidang_urusan"
                    >
                        Kode Bidang Urusan :
                    </label>
                    <Controller
                        name="kode_bidang_urusan"
                        control={control}
                        rules={{ required: "Kode Bidang Urusan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="tahun"
                                    type="text"
                                    placeholder="masukkan Kode Bidang Urusan"
                                    value={field.value || KodeBidangUrusan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setKodeBidangUrusan(e.target.value);
                                    }}
                                />
                                {errors.kode_bidang_urusan ?
                                    <h1 className="text-red-500">
                                    {errors.kode_bidang_urusan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Kode Bidang Urusan Harus Terisi</h1>
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
                <ButtonRed type="button" halaman_url="/DataMaster/masterprogramkegiatan/bidangurusan">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}
export const FormEditBidangUrusan = () => {

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FormValue>();
    const [NamaBidangUrusan, setNamaBidangUrusan] = useState<string>('');
    const [KodeBidangUrusan, setKodeBidangUrusan] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [idNull, setIdNull] = useState<boolean | null>(null);
    const router = useRouter();
    const {id} = useParams();
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchIdOpd = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/bidang_urusan/detail/${id}`, {
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
                    if(data.nama_bidang_urusan){
                        setNamaBidangUrusan(data.nama_bidang_urusan);
                        reset((prev) => ({ ...prev, nama_bidang_urusan: data.nama_bidang_urusan }))
                    }
                    if(data.kode_bidang_urusan){
                        setKodeBidangUrusan(data.kode_bidang_urusan);
                        reset((prev) => ({ ...prev, kode_bidang_urusan: data.kode_bidang_urusan }))
                    }
                }
            } catch(err) {
                setError('gagal mendapatkan data, periksa koneksi internet atau database server')
            } finally {
                setLoading(false);
            }
        }
        fetchIdOpd();
    },[id, reset, token]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const formData = {
          //key : value
          nama_bidang_urusan : data.nama_bidang_urusan,
          kode_bidang_urusan : data.kode_bidang_urusan,
      };
    //   console.log(formData);
        try{
            const response = await fetch(`${API_URL}/bidang_urusan/update/${id}`, {
                method: "PUT",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil edit data master bidang urusan", "success", 1000);
              router.push("/DataMaster/masterprogramkegiatan/bidangurusan");
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
                <h1 className="uppercase font-bold">Form Edit Bidang Urusan :</h1>
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Bidang Urusan :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } else if(idNull){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Bidang Urusan :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tidak ditemukan</h1>
            </div>
        )
    }

    return(
    <>
        <div className="border p-5 rounded-xl shadow-xl">
            <h1 className="uppercase font-bold">Form Edit Bidang Urusan :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nama_bidang_urusan"
                    >
                        Nama bidang Urusan :
                    </label>
                    <Controller
                        name="nama_bidang_urusan"
                        control={control}
                        rules={{ required: "Nama bidang Urusan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nama_bidang_urusan"
                                    type="text"
                                    placeholder="masukkan Nama bidang Urusan"
                                    value={field.value || NamaBidangUrusan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setNamaBidangUrusan(e.target.value);
                                    }}
                                />
                                {errors.nama_bidang_urusan ?
                                    <h1 className="text-red-500">
                                    {errors.nama_bidang_urusan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Nama bidang Urusan Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="kode_bidang_urusan"
                    >
                        Kode Bidang Urusan :
                    </label>
                    <Controller
                        name="kode_bidang_urusan"
                        control={control}
                        rules={{ required: "Kode Bidang Urusan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="tahun"
                                    type="text"
                                    placeholder="masukkan Kode Bidang Urusan"
                                    value={field.value || KodeBidangUrusan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setKodeBidangUrusan(e.target.value);
                                    }}
                                />
                                {errors.kode_bidang_urusan ?
                                    <h1 className="text-red-500">
                                    {errors.kode_bidang_urusan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Kode Bidang Urusan Harus Terisi</h1>
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
                <ButtonRed type="button" halaman_url="/DataMaster/masterprogramkegiatan/bidangurusan">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}