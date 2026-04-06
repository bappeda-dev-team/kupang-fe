'use client'

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ButtonGreen, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { LoadingClip, LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useRouter, useParams } from "next/navigation";
import { TbCheck } from "react-icons/tb";
import Select from 'react-select'
import { getToken } from "@/components/lib/Cookie";

interface OptionTypeString {
    value: string;
    label: string;
}
interface FormValue {
    nama_pegawai: string;
    kode_opd: OptionTypeString;
    nip: string;
    role: string;
}

export const FormMasterPegawai = () => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const router = useRouter();
    const [NamaPegawai, setNamaPegawai] = useState<string>('');
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [Plt, setPlt] = useState<boolean>(false);
    const [Pbt, setPbt] = useState<boolean>(false);
    const [Nip, setNip] = useState<string>('');
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    const fetchOpd = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/opd/findall`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const data = await response.json();
            const opd = data.data.map((item: any) => ({
                value: item.kode_opd,
                label: item.nama_opd,
            }));
            setOpdOption(opd);
        } catch (err) {
            console.log('gagal mendapatkan data opd');
        } finally {
            setIsLoading(false);
        }
    };
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            nama_pegawai: `${data.nama_pegawai} ${Plt ? '(PLT)' : ''} ${Pbt ? "(PBT)" : ""}`,
            nip: `${Plt ? `${data.nip}_plt` : Pbt ? `${data.nip}_pbt` : data.nip}`,
            kode_opd: data.kode_opd?.value,
        };
        // console.log(formData);
          try{
              setProses(true);
              const response = await fetch(`${API_URL}/pegawai/create`, {
                  method: "POST",
                  headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
              });
              const result = await response.json();
              if(result.code === 200 || result.code === 201){
                  AlertNotification("Berhasil", "Berhasil menambahkan data master pegawai", "success", 1000);
                  router.push("/DataMaster/masterpegawai");
              } else {
                  AlertNotification("Gagal", `${result.data}`, "error", 2000);
              }
          } catch(err){
              AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
          } finally {
            setProses(false);
          }
    };


    return (
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Tambah Pegawai :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="_pegawai"
                        >
                            Nama :
                        </label>
                        <Controller
                            name="nama_pegawai"
                            control={control}
                            rules={{ required: "Nama Pegawai harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_pegawai"
                                        type="text"
                                        placeholder="masukkan Nama Pegawai"
                                        value={field.value || NamaPegawai}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setNamaPegawai(e.target.value);
                                        }}
                                    />
                                    {errors.nama_pegawai ?
                                        <h1 className="text-red-500">
                                            {errors.nama_pegawai.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Nama Pegawai Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="flex flex-col flex-wrap gap-2 uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nip"
                        >
                            NIP :
                            <div className="flex items-center gap-2">
                                {Plt ?
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPlt(false)
                                            setPbt(false)
                                        }}
                                        className="w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                    >
                                        <TbCheck />
                                    </button>
                                    :
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPlt(true)
                                            setPbt(false)
                                        }}
                                        className="w-[20px] h-[20px] border border-black rounded-full"
                                    ></button>
                                }
                                <p className="text-lg">PLT</p>
                                {Pbt ?
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPbt(false)
                                            setPlt(false)
                                        }}
                                        className="w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                    >
                                        <TbCheck />
                                    </button>
                                    :
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPbt(true)
                                            setPlt(false)
                                        }}
                                        className="w-[20px] h-[20px] border border-black rounded-full"
                                    ></button>
                                }
                                <p className="text-lg">PBT</p>
                            </div>
                        </label>
                        <Controller
                            name="nip"
                            control={control}
                            rules={{ required: "NIP harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nip"
                                        type="text"
                                        maxLength={18}
                                        placeholder="masukkan NIP"
                                        value={field.value || Nip}
                                        onChange={(e) => {
                                            const newValue = e.target.value.replace(/\s/g, ''); // Hilangkan semua spasi
                                            field.onChange(newValue);
                                            setNip(newValue);
                                        }}
                                    />
                                    {errors.nip ?
                                        <h1 className="text-red-500">
                                            {errors.nip.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*NIP Harus Terisi, Max 18 Digit, centang lingkaran PLT jika pegawai PLT</h1>
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
                            Perangkat Daerah
                        </label>
                        <Controller
                            name="kode_opd"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Pilih Perangkat Daerah"
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
                                        onChange={(option) => {
                                            field.onChange(option);
                                            setKodeOpd(option);
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                textAlign: 'start',
                                            })
                                        }}
                                    />
                                </>
                            )}
                        />
                    </div>
                    <ButtonGreen
                        type="submit"
                        className="my-4"
                    >
                        {Proses ?
                            <span className="flex">
                                <LoadingButtonClip />
                                Menyimpan...
                            </span>
                            :
                            "Simpan"
                        }
                    </ButtonGreen>
                    <ButtonRed type="button" halaman_url="/DataMaster/masterpegawai">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
    )
}
export const FormEditMasterPegawai = () => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();
    const [Nama, setNama] = useState<string>('');
    const [Nip, setNip] = useState<string>('');
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const { id } = useParams();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [idNull, setIdNull] = useState<boolean | null>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchIdOpd = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/pegawai/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                if (result.code == 404) {
                    setIdNull(true);
                } else {
                    const data = result.data;
                    if (data.nama_pegawai) {
                        setNama(data.nama_pegawai);
                        reset((prev) => ({ ...prev, nama_pegawai: data.nama_pegawai }))
                    }
                    if (data.nip) {
                        setNip(data.nip);
                        reset((prev) => ({ ...prev, nip: data.nip }))
                    }
                    if (data.kode_opd) {
                        const opd = {
                            value: data.kode_opd,
                            label: data.nama_opd,
                        }
                        setKodeOpd(opd);
                        reset((prev) => ({ ...prev, kode_opd: opd }))
                    }
                }
            } catch (err) {
                setError('gagal mendapatkan data, periksa koneksi internet atau database server')
            } finally {
                setLoading(false);
            }
        }
        fetchIdOpd();
    }, [id, reset, token]);

    const fetchOpd = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/opd/findall`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const data = await response.json();
            const opd = data.data.map((item: any) => ({
                value: item.kode_opd,
                label: item.nama_opd,
            }));
            setOpdOption(opd);
        } catch (err) {
            console.log('gagal mendapatkan data opd');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            nama_pegawai: data.nama_pegawai,
            nip: data.nip,
            kode_opd: data.kode_opd?.value,
            //   role : data.role, 
        };
        //   console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/pegawai/update/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil edit data master pegawai", "success", 1000);
                router.push("/DataMaster/masterpegawai");
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    if (loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Pegawai :</h1>
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Pegawai :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } else if (idNull) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Pegawai :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tidak ditemukan</h1>
            </div>
        )
    }

    return (
        <div className="border p-5 rounded-xl shadow-xl">
            <h1 className="uppercase font-bold">Form Edit Pegawai :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nama_pegawai"
                    >
                        Nama Pegawai :
                    </label>
                    <Controller
                        name="nama_pegawai"
                        control={control}
                        rules={{ required: "Nama pegawai harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nama"
                                    type="text"
                                    placeholder="masukkan Nama Pegawai"
                                    value={field.value || Nama}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setNama(e.target.value);
                                    }}
                                />
                                {errors.nama_pegawai ?
                                    <h1 className="text-red-500">
                                        {errors.nama_pegawai.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Nama Pegawai Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nip"
                    >
                        NIP :
                    </label>
                    <Controller
                        name="nip"
                        control={control}
                        rules={{ required: "NIP harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nip"
                                    type="text"
                                    placeholder="masukkan NIP"
                                    value={field.value || Nip}
                                    onChange={(e) => {
                                        const newValue = e.target.value.replace(/\s/g, ''); // Hilangkan semua spasi
                                        field.onChange(newValue);
                                        setNip(newValue);
                                    }}
                                />
                                {errors.nip ?
                                    <h1 className="text-red-500">
                                        {errors.nip.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*NIP Harus Terisi</h1>
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
                        Perangkat Daerah
                    </label>
                    <Controller
                        name="kode_opd"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Select
                                    {...field}
                                    placeholder="Pilih Perangkat Daerah"
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
                                    onChange={(option) => {
                                        field.onChange(option);
                                        setKodeOpd(option);
                                    }}
                                    styles={{
                                        control: (baseStyles) => ({
                                            ...baseStyles,
                                            borderRadius: '8px',
                                            textAlign: 'start',
                                        })
                                    }}
                                />
                            </>
                        )}
                    />
                </div>
                <ButtonGreen
                    type="submit"
                    className="my-4"
                >
                    {Proses ?
                        <span className="flex">
                            <LoadingButtonClip />
                            Menyimpan...
                        </span>
                        :
                        "Simpan"
                    }
                </ButtonGreen>
                <ButtonRed type="button" halaman_url="/DataMaster/masterpegawai">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    )
}