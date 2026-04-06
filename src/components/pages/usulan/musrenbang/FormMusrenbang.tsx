'use client'

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ButtonGreen, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useParams, useRouter } from "next/navigation";
import { getOpdTahun } from "@/components/lib/Cookie";
import Select from 'react-select';
import { getToken, getUser } from "@/components/lib/Cookie";

interface OptionTypeString {
    value: string;
    label: string;
}
interface FormValue {
    id: string;
    usulan: string;
    alamat: string;
    uraian: string;
    tahun: string;
    rencana_kinerja_id: string;
    pegawai_id: string;
    kode_opd: OptionTypeString;
    status: string;
}

export const FormMusrenbang = () => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [Usulan, setUsulan] = useState<string>('');
    const [Alamat, setAlamat] = useState<string>('');
    const [Uraian, setUraian] = useState<string>('');
    const [Status, setStatus] = useState<string>('');
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tahun, setTahun] = useState<any>(null);
    const [User, setUser] = useState<any>(null);
    const router = useRouter();
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
        if(data){
         if(data.tahun){
             const valueTahun = {
                 value: data.tahun.value,
                 label: data.tahun.label
             }
             setTahun(valueTahun);
         }
     }
     },[]);

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
          usulan : data.usulan,
          alamat : data.alamat,
          uraian: data.uraian,
          kode_opd : data.kode_opd?.value,
          rencana_kinerja_id : "REKIN-PEG-14792",
          pegawai_id : User?.pegawai_id,
          tahun: String(tahun?.value),
          status: data.status,
      };
    //   console.log(formData);
      try{
          const response = await fetch(`${API_URL}/usulan_musrebang/create`, {
              method: "POST",
              headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });
          if(response.ok){
              AlertNotification("Berhasil", "Berhasil menambahkan data musrenbang", "success", 1000);
              router.push("/musrenbang");
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
            <h1 className="uppercase font-bold">Form Tambah Musrenbang :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="usulan"
                    >
                        Usulan :
                    </label>
                    <Controller
                        name="usulan"
                        control={control}
                        rules={{ required: "usulan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="usulan"
                                    type="text"
                                    placeholder="masukkan usulan"
                                    value={field.value || Usulan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setUsulan(e.target.value);
                                    }}
                                />
                                {errors.usulan ?
                                    <h1 className="text-red-500">
                                    {errors.usulan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*usulan Harus Terisi</h1>
                                }
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
                        rules={{ required: "alamat harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="alamat"
                                    type="text"
                                    placeholder="masukkan alamat"
                                    value={field.value || Alamat}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setAlamat(e.target.value);
                                    }}
                                />
                                {errors.alamat ?
                                    <h1 className="text-red-500">
                                    {errors.alamat.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*alamat Harus Terisi</h1>
                                }
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
                        rules={{ required: "uraian harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="uraian"
                                    type="text"
                                    placeholder="masukkan uraian"
                                    value={field.value || Uraian}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setUraian(e.target.value);
                                    }}
                                />
                                {errors.uraian ?
                                    <h1 className="text-red-500">
                                    {errors.uraian.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*uraian Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="status"
                    >
                        Status :
                    </label>
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: "status harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="status"
                                    type="text"
                                    placeholder="masukkan status"
                                    value={field.value || Status}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setStatus(e.target.value);
                                    }}
                                />
                                {errors.status ?
                                    <h1 className="text-red-500">
                                    {errors.status.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*status Harus Terisi</h1>
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
                                isLoading={isLoading}
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
                <ButtonRed type="button" halaman_url="/musrenbang">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}
export const FormEditMusrenbang = () => {

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FormValue>();
    const [Usulan, setUsulan] = useState<string>('');
    const [Alamat, setAlamat] = useState<string>('');
    const [Uraian, setUraian] = useState<string>('');
    const [Status, setStatus] = useState<string>('');
    const [RekinId, setRekinId] = useState<string>('');
    const [PegawaiId, setPegawaiId] = useState<string>('');
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [IdNull, setIdNull] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [tahun, setTahun] = useState<any>(null);
    const router = useRouter();
    const {id} = useParams();
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
        if(data){
         if(data.tahun){
             const valueTahun = {
                 value: data.tahun.value,
                 label: data.tahun.label
             }
             setTahun(valueTahun);
         }
     }
     },[]);

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

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchIdMusrenbang = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/usulan_musrebang/detail/${id}`, {
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
                    const data = result.usulan_musrebang;
                    if(data.usulan){
                        setUsulan(data.usulan);
                        reset((prev) => ({ ...prev, usulan: data.usulan }))
                    }
                    if(data.alamat){
                        setAlamat(data.alamat);
                        reset((prev) => ({ ...prev, alamat: data.alamat }))
                    }
                    if(data.uraian){
                        setUraian(data.uraian);
                        reset((prev) => ({ ...prev, uraian: data.uraian }))
                    }
                    if(data.status){
                        setStatus(data.status);
                        reset((prev) => ({ ...prev, status: data.status }))
                    }
                    if(data.rencana_kinerja_id){
                        setRekinId(data.rencana_kinerja_id);
                        reset((prev) => ({ ...prev, rencana_kinerja_id: data.rencana_kinerja_id }))
                    }
                    if(data.pegawai_id){
                        setPegawaiId(data.pegawai_id);
                        reset((prev) => ({ ...prev, pegawai_id: data.pegawai_id }))
                    }
                    if(data.kode_opd){
                        const opd = {
                            value: data.kode_opd,
                            label: data.kode_opd,
                        }
                        setKodeOpd(opd);
                        reset((prev) => ({ ...prev, kode_opd: opd }))
                    }
                }
            } catch(err) {
                setError('gagal mendapatkan data, periksa koneksi internet atau database server')
            } finally {
                setLoading(false);
            }
        }
        fetchIdMusrenbang();
    },[id, reset, token]);
    
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const formData = {
          //key : value
          usulan : data.usulan,
          alamat : data.alamat,
          uraian: data.uraian,
          kode_opd : data.kode_opd?.value,
          rencana_kinerja_id : RekinId,
          pegawai_id : PegawaiId,
          tahun: String(tahun?.value),
          status: data.status,
      };
    //   console.log(formData);
      try{
          const response = await fetch(`${API_URL}/usulan_musrebang/update/${id}`, {
              method: "PUT",
              headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });
          if(response.ok){
              AlertNotification("Berhasil", "Berhasil menambahkan data musrenbang", "success", 1000);
              router.push("/musrenbang");
          } else {
              AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
          }
      } catch(err){
          AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
      }
    };

    if(Loading){
        return (    
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Musrenbang :</h1>
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Musrenbang :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error} {id}</h1>
            </div>
        )
    } else if(IdNull){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Musrenbang :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tidak ditemukan</h1>
            </div>
        )
    }

    return(
    <>
        <div className="border p-5 rounded-xl shadow-xl">
            <h1 className="uppercase font-bold">Form Edit Musrenbang :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="usulan"
                    >
                        Usulan :
                    </label>
                    <Controller
                        name="usulan"
                        control={control}
                        rules={{ required: "usulan harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="usulan"
                                    type="text"
                                    placeholder="masukkan usulan"
                                    value={field.value || Usulan}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setUsulan(e.target.value);
                                    }}
                                />
                                {errors.usulan ?
                                    <h1 className="text-red-500">
                                    {errors.usulan.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*usulan Harus Terisi</h1>
                                }
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
                        rules={{ required: "alamat harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="alamat"
                                    type="text"
                                    placeholder="masukkan alamat"
                                    value={field.value || Alamat}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setAlamat(e.target.value);
                                    }}
                                />
                                {errors.alamat ?
                                    <h1 className="text-red-500">
                                    {errors.alamat.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*alamat Harus Terisi</h1>
                                }
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
                        rules={{ required: "uraian harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="uraian"
                                    type="text"
                                    placeholder="masukkan uraian"
                                    value={field.value || Uraian}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setUraian(e.target.value);
                                    }}
                                />
                                {errors.uraian ?
                                    <h1 className="text-red-500">
                                    {errors.uraian.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*uraian Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="status"
                    >
                        Status :
                    </label>
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: "status harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="status"
                                    type="text"
                                    placeholder="masukkan status"
                                    value={field.value || Status}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setStatus(e.target.value);
                                    }}
                                />
                                {errors.status ?
                                    <h1 className="text-red-500">
                                    {errors.status.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*status Harus Terisi</h1>
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
                                isLoading={isLoading}
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
                <ButtonRed type="button" halaman_url="/musrenbang">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}