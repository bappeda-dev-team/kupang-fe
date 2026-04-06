'use client'

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ButtonGreen, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useParams, useRouter } from "next/navigation";
import Select from 'react-select'

interface OptionTypeString {
    value: string;
    label: string;
}
interface FormValue {
    id: number;
    parent: number;
    nama_pohon: string;
    jenis_pohon: string;
    keterangan: string;
    tahun: OptionTypeString;
}

export const FormSubTematikKab = () => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [Tahun, setTahun] = useState<OptionTypeString | null>(null);
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    
    const TahunOption = [
        {label: "Tahun 2019", value: "2019"},
        {label: "Tahun 2020", value: "2020"},
        {label: "Tahun 2021", value: "2021"},
        {label: "Tahun 2022", value: "2022"},
        {label: "Tahun 2023", value: "2023"},
        {label: "Tahun 2024", value: "2024"},
        {label: "Tahun 2025", value: "2025"},
        {label: "Tahun 2026", value: "2026"},
        {label: "Tahun 2027", value: "2027"},
        {label: "Tahun 2028", value: "2028"},
        {label: "Tahun 2029", value: "2029"},
        {label: "Tahun 2030", value: "2030"},
    ];
    
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
          //key : value
          nama_pohon : data.nama_pohon,
          Keterangan : data.keterangan,
          jenis_pohon : "SubTematik",
          level_pohon : 1,
          parent: id,
          tahun: data.tahun?.value,
      };
    //   console.log(formData);
      try{
          const response = await fetch(`${API_URL}/pohon_kinerja_admin/create`, {
              method: "POST",
              headers: {
                  "Content-Type" : "application/json",
              },
              body: JSON.stringify(formData),
          });
          if(response.ok){
              AlertNotification("Berhasil", "Berhasil menambahkan data sub tematik kabupaten", "success", 1000);
              router.push("/pohonkinerjakota");
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
            <h1 className="uppercase font-bold">Form Tambah Sub Tematik Kabupaten :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nama_pohon"
                    >
                        Nama Sub Tema :
                    </label>
                    <Controller
                        name="nama_pohon"
                        control={control}
                        rules={{ required: "Nama Sub Tema harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nama_pohon"
                                    type="text"
                                    placeholder="masukkan Nama Sub Tema"
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
                                    <h1 className="text-slate-300 text-xs">*Nama Sub Tema Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="keterangan"
                    >
                        Keterangan :
                    </label>
                    <Controller
                        name="keterangan"
                        control={control}
                        rules={{ required: "Keterangan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <textarea
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="keterangan"
                                    placeholder="masukkan Keterangan"
                                    value={field.value || Keterangan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setKeterangan(e.target.value);
                                    }}
                                />
                                {errors.keterangan ?
                                    <h1 className="text-red-500">
                                        {errors.keterangan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Keterangan Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="tahun"
                    >
                        Tahun:
                    </label>
                    <Controller
                        name="tahun"
                        control={control}
                        rules={{required : "tahun Harus Terisi"}}
                        render={({ field }) => (
                        <>
                            <Select
                                {...field}
                                placeholder="Masukkan tahun"
                                value={Tahun}
                                options={TahunOption}
                                isSearchable
                                isClearable
                                onChange={(option) => {
                                    field.onChange(option);
                                    setTahun(option);
                                }}
                                styles={{
                                    control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    })
                                }}
                            />
                            {errors.tahun ?
                                <h1 className="text-red-500">
                                    {errors.tahun.message}
                                </h1>
                            :
                                <h1 className="text-slate-300 text-xs">*tahun Harus Terisi</h1>
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
                <ButtonRed type="button" halaman_url="/subtematik">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}
export const FormEditSubTematikKab = () => {

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [Parent, setParent] = useState<Number | null>(null);
    const [Tahun, setTahun] = useState<OptionTypeString | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [idNull, setIdNull] = useState<boolean | null>(null);
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const TahunOption = [
        {label: "Tahun 2019", value: "2019"},
        {label: "Tahun 2020", value: "2020"},
        {label: "Tahun 2021", value: "2021"},
        {label: "Tahun 2022", value: "2022"},
        {label: "Tahun 2023", value: "2023"},
        {label: "Tahun 2024", value: "2024"},
        {label: "Tahun 2025", value: "2025"},
        {label: "Tahun 2026", value: "2026"},
        {label: "Tahun 2027", value: "2027"},
        {label: "Tahun 2028", value: "2028"},
        {label: "Tahun 2029", value: "2029"},
        {label: "Tahun 2030", value: "2030"},
    ];

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchTematikKab = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/pohon_kinerja_admin/detail/${id}`);
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
                        reset((prev) => ({ ...prev, nama_pohon: data.nama_pohon }))
                    }
                    if(data.keterangan){
                        setKeterangan(data.keterangan);
                        reset((prev) => ({ ...prev, keterangan: data.keterangan }))
                    }
                    if(data.parent){
                        setParent(data.parent);
                    }
                    if(data.tahun){
                        const tahun = {
                            value: data.tahun,
                            label: data.tahun,
                        }
                        setTahun(tahun);
                        reset((prev) => ({ ...prev, tahun: tahun }))
                    }
                }
            } catch(err) {
                setError('gagal mendapatkan data, periksa koneksi internet atau database server')
            } finally {
                setLoading(false);
            }
        }
        fetchTematikKab();
    },[id, reset]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const formData = {
          //key : value
          nama_pohon : data.nama_pohon,
          jenis_pohon : "Sub Tematik",
          level_pohon : 1,
          parent: Parent,
          keterangan: data.keterangan,
          tahun: data.tahun?.value,
      };
    //   console.log(formData);
        try{
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil edit data tematik kabupaten", "success", 1000);
                router.push("/pohonkinerjakota");
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
                <h1 className="uppercase font-bold">Form Edit Sub Tematik Kabupaten :</h1>
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Sub Tematik Kabupaten :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } else if(idNull){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Sub Tematik Kabupaten :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tidak ditemukan</h1>
            </div>
        )
    } else {
        return(
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Sub Tematik Kabupaten :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_pohon"
                        >
                            Nama Sub Tematik :
                        </label>
                        <Controller
                            name="nama_pohon"
                            control={control}
                            rules={{ required: "Nama Sub Tematik harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_pohon"
                                        type="text"
                                        placeholder="masukkan Nama Sub Tematik"
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
                                        <h1 className="text-slate-300 text-xs">*Nama Sub Tematik Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="keterangan"
                        >
                            Keterangan :
                        </label>
                        <Controller
                            name="keterangan"
                            control={control}
                            rules={{ required: "Keterangan harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="keterangan"
                                        placeholder="masukkan Keterangan"
                                        value={field.value || Keterangan}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setKeterangan(e.target.value);
                                        }}
                                    />
                                    {errors.keterangan ?
                                        <h1 className="text-red-500">
                                            {errors.keterangan.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Keterangan Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="tahun"
                        >
                            Tahun:
                        </label>
                        <Controller
                            name="tahun"
                            control={control}
                            rules={{required : "tahun Harus Terisi"}}
                            render={({ field }) => (
                            <>
                                <Select
                                    {...field}
                                    placeholder="Masukkan tahun"
                                    value={Tahun}
                                    options={TahunOption}
                                    isSearchable
                                    isClearable
                                    onChange={(option) => {
                                        field.onChange(option);
                                        setTahun(option);
                                    }}
                                    styles={{
                                        control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderRadius: '8px',
                                        })
                                    }}
                                />
                                {errors.tahun ?
                                    <h1 className="text-red-500">
                                        {errors.tahun.message}
                                    </h1>
                                :
                                    <h1 className="text-slate-300 text-xs">*tahun Harus Terisi</h1>
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
                    <ButtonRed type="button" halaman_url="/subtematik">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
        )
    }
}