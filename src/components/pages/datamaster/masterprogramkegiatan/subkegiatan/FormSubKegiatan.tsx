'use client'

import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { ButtonGreen, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useParams, useRouter } from "next/navigation";
import Select from 'react-select';
import { getToken } from "@/components/lib/Cookie";

interface OptionTypeString {
    value: string;
    label: string;
}
interface FormValue {
    id: string;
    nama_subkegiatan: string;
    tahun: OptionTypeString;
    kode_opd: OptionTypeString;
    indikator: indikator[];
}
interface indikator {
    nama_indikator?: string;
    indikator: string;
    targets: target[];
}
type target = {
    target: string;
    satuan: string;
};

export const FormSubKegiatan = () => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const [NamaSubKegiatan, setNamaSubKegiatan] = useState<string>('');
    const [Tahun, setTahun] = useState<OptionTypeString | null>(null);
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const token = getToken();

    const TahunOption = [
        { label: "Tahun 2019", value: "2019" },
        { label: "Tahun 2020", value: "2020" },
        { label: "Tahun 2021", value: "2021" },
        { label: "Tahun 2022", value: "2022" },
        { label: "Tahun 2023", value: "2023" },
        { label: "Tahun 2024", value: "2024" },
        { label: "Tahun 2025", value: "2025" },
        { label: "Tahun 2026", value: "2026" },
        { label: "Tahun 2027", value: "2027" },
        { label: "Tahun 2028", value: "2028" },
        { label: "Tahun 2029", value: "2029" },
        { label: "Tahun 2030", value: "2030" },
    ];

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

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
            nama_subkegiatan: data.nama_subkegiatan,
            tahun: data.tahun?.value,
            kode_opd: data.kode_opd?.value,
            ...(data.indikator && {
                indikator: data.indikator.map((ind) => ({
                    indikator: ind.indikator,
                    targets: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })),
            }),
        };
        // console.log(formData);
        try {
            const response = await fetch(`${API_URL}/sub_kegiatan/create`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "Berhasil menambahkan data master sub kegiatan", "success", 1000);
                router.push("/DataMaster/masterprogramkegiatan/subkegiatan");
            } else {
                AlertNotification("Gagal", `${result.sub_kegiatan}`, "error", 3000);
                console.log(result);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        }
    };

    return (
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Tambah Sub Kegiatan :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_subkegiatan"
                        >
                            Nama Sub Kegiatan :
                        </label>
                        <Controller
                            name="nama_subkegiatan"
                            control={control}
                            rules={{ required: "Nama Sub Kegiatan harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_subkegiatan"
                                        type="text"
                                        placeholder="masukkan Nama Sub Kegiatan"
                                        value={field.value || NamaSubKegiatan}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setNamaSubKegiatan(e.target.value);
                                        }}
                                    />
                                    {errors.nama_subkegiatan ?
                                        <h1 className="text-red-500">
                                            {errors.nama_subkegiatan.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Nama Sub Kegiatan Harus Terisi</h1>
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
                            rules={{ required: "Perangkat Daerah Harus Terisi" }}
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
                            rules={{ required: "Tahun Harus Terisi" }}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Masukkan Tahun"
                                        value={Tahun}
                                        options={TahunOption}
                                        isLoading={IsLoading}
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
                                        <h1 className="text-slate-300 text-xs">*Tahun Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <label className="uppercase text-base font-bold text-gray-700 my-2">
                        Indikator Sub Kegiatan
                    </label>
                    {fields.map((field, index) => (
                        <div key={index} className="flex flex-col my-2 py-2 px-5 border rounded-lg">
                            <Controller
                                name={`indikator.${index}.indikator`}
                                control={control}
                                defaultValue={field.indikator}
                                render={({ field }) => (
                                    <div className="flex flex-col py-3">
                                        <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                            Nama Indikator {index + 1} :
                                        </label>
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            placeholder={`Masukkan nama indikator ${index + 1}`}
                                        />
                                    </div>
                                )}
                            />
                            {field.targets.map((_, subindex) => (
                                <>
                                    <Controller
                                        name={`indikator.${index}.targets.${subindex}.target`}
                                        control={control}
                                        defaultValue={_.target}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Target :
                                                </label>
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder="Masukkan target"
                                                />
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        name={`indikator.${index}.targets.${subindex}.satuan`}
                                        control={control}
                                        defaultValue={_.satuan}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Satuan :
                                                </label>
                                                <input
                                                    {...field}
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder="Masukkan satuan"
                                                />
                                            </div>
                                        )}
                                    />
                                </>
                            ))}
                            {index >= 0 && (
                                <ButtonRedBorder
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="w-[200px] my-3"
                                >
                                    Hapus
                                </ButtonRedBorder>
                            )}
                        </div>
                    ))}
                    <ButtonSkyBorder
                        className="mb-3 mt-2 w-full"
                        type="button"
                        onClick={() => append({ indikator: "", targets: [{ target: "", satuan: "" }] })}
                    >
                        Tambah Indikator
                    </ButtonSkyBorder>
                    <ButtonGreen
                        type="submit"
                        className="my-4"
                    >
                        Simpan
                    </ButtonGreen>
                    <ButtonRed type="button" halaman_url="/DataMaster/masterprogramkegiatan/subkegiatan">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
    )
}
export const FormEditSubKegiatan = () => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();
    const [NamaSubKegiatan, setNamaSubKegiatan] = useState<string>('');
    const [Tahun, setTahun] = useState<OptionTypeString | null>(null);
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [idNull, setIdNull] = useState<boolean | null>(null);
    const router = useRouter();
    const { id } = useParams();
    const token = getToken();

    const TahunOption = [
        { label: "Tahun 2019", value: "2019" },
        { label: "Tahun 2020", value: "2020" },
        { label: "Tahun 2021", value: "2021" },
        { label: "Tahun 2022", value: "2022" },
        { label: "Tahun 2023", value: "2023" },
        { label: "Tahun 2024", value: "2024" },
        { label: "Tahun 2025", value: "2025" },
        { label: "Tahun 2026", value: "2026" },
        { label: "Tahun 2027", value: "2027" },
        { label: "Tahun 2028", value: "2028" },
        { label: "Tahun 2029", value: "2029" },
        { label: "Tahun 2030", value: "2030" },
    ];

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchIdSubKegiatan = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/sub_kegiatan/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                if (result.code == 500) {
                    setIdNull(true);
                } else {
                    const data = result.sub_kegiatan;
                    if (data.nama_sub_kegiatan) {
                        setNamaSubKegiatan(data.nama_sub_kegiatan);
                        reset((prev) => ({ ...prev, nama_subkegiatan: data.nama_sub_kegiatan }))
                    }
                    if (data.kode_opd && data.nama_opd) {
                        const opd = {
                            value: data.kode_opd,
                            label: data.nama_opd,
                        }
                        setKodeOpd(opd);
                        reset((prev) => ({ ...prev, kode_opd: opd }))
                    }
                    if (data.tahun) {
                        const tahun = {
                            value: data.tahun,
                            label: data.tahun,
                        }
                        setTahun(tahun);
                        reset((prev) => ({ ...prev, tahun: tahun }))
                    }
                    // Pengecekan apakah indikator ada sebelum di-map
                    if (data?.indikator && data.indikator.length > 0) {
                        reset({
                            nama_subkegiatan: data.nama_sub_kegiatan,
                            kode_opd: {
                                value: data.kode_opd,
                                label: data.nama_opd
                            },
                            tahun: {
                                value: data.tahun,
                                label: data.tahun
                            },
                            indikator: data.indikator.map((item: indikator) => ({
                                indikator: item.nama_indikator,
                                targets: item.targets.map((t: target) => ({
                                    target: t.target,
                                    satuan: t.satuan,
                                })),
                            })),
                        });
                        replace(data.indikator.map((item: indikator) => ({
                            indikator: item.indikator,
                            targets: item.targets,
                        })));
                    } else {
                        reset((prev) => ({ ...prev, indikator: [] }));
                        replace([]);
                    }
                }
            } catch (err) {
                setError(`gagal mendapatkan data ${id}, periksa koneksi internet atau database server`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchIdSubKegiatan();
    }, [id, token, reset, replace]);

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
            nama_subkegiatan: data.nama_subkegiatan,
            tahun: data.tahun?.value,
            kode_opd: data.kode_opd?.value,
            ...(data.indikator && {
                indikator: data.indikator.map((ind) => ({
                    nama_indikator: ind.indikator,
                    targets: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })),
            }),
        };
        // console.log(formData);
        try {
            const response = await fetch(`${API_URL}/sub_kegiatan/update/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "Berhasil edit data master sub kegiatan", "success", 1000);
                router.push("/DataMaster/masterprogramkegiatan/subkegiatan");
            } else {
                AlertNotification("Gagal", `${result.sub_kegiatan}`, "error", 3000);
                console.log(result);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        }
    };

    if (loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Sub Kegiatan :</h1>
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Sub Kegiatan :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } else if (idNull) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Sub Kegiatan :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tidak ditemukan</h1>
            </div>
        )
    }

    return (
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Sub Kegiatan :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_subkegiatan"
                        >
                            Nama Sub Kegiatan :
                        </label>
                        <Controller
                            name="nama_subkegiatan"
                            control={control}
                            rules={{ required: "Nama Sub Kegiatan harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_subkegiatan"
                                        type="text"
                                        placeholder="masukkan Nama Sub Kegiatan"
                                        value={field.value || NamaSubKegiatan}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setNamaSubKegiatan(e.target.value);
                                        }}
                                    />
                                    {errors.nama_subkegiatan ?
                                        <h1 className="text-red-500">
                                            {errors.nama_subkegiatan.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Nama Sub Kegiatan Harus Terisi</h1>
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
                            rules={{ required: "Perangkat Daerah Harus Terisi" }}
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
                            rules={{ required: "Tahun Harus Terisi" }}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Masukkan Tahun"
                                        value={Tahun}
                                        options={TahunOption}
                                        isLoading={IsLoading}
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
                                        <h1 className="text-slate-300 text-xs">*Tahun Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <label className="uppercase text-base font-bold text-gray-700 my-2">
                        Indikator Sub Kegiatan
                    </label>
                    {fields.map((field, index) => (
                        <div key={index} className="flex flex-col my-2 py-2 px-5 border rounded-lg">
                            <Controller
                                name={`indikator.${index}.indikator`}
                                control={control}
                                defaultValue={field.indikator}
                                render={({ field }) => (
                                    <div className="flex flex-col py-3">
                                        <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                            Nama Indikator {index + 1} :
                                        </label>
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            placeholder={`Masukkan nama indikator ${index + 1}`}
                                        />
                                    </div>
                                )}
                            />
                            {field.targets.map((_, subindex) => (
                                <>
                                    <Controller
                                        name={`indikator.${index}.targets.${subindex}.target`}
                                        control={control}
                                        defaultValue={_.target}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Target :
                                                </label>
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder="Masukkan target"
                                                />
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        name={`indikator.${index}.targets.${subindex}.satuan`}
                                        control={control}
                                        defaultValue={_.satuan}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Satuan :
                                                </label>
                                                <input
                                                    {...field}
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder="Masukkan satuan"
                                                />
                                            </div>
                                        )}
                                    />
                                </>
                            ))}
                            {index >= 0 && (
                                <ButtonRedBorder
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="w-[200px] my-3"
                                >
                                    Hapus
                                </ButtonRedBorder>
                            )}
                        </div>
                    ))}
                    <ButtonSkyBorder
                        className="mb-3 mt-2 w-full"
                        type="button"
                        onClick={() => append({ indikator: "", targets: [{ target: "", satuan: "" }] })}
                    >
                        Tambah Indikator
                    </ButtonSkyBorder>
                    <ButtonGreen
                        type="submit"
                        className="my-4"
                    >
                        Simpan
                    </ButtonGreen>
                    <ButtonRed type="button" halaman_url="/DataMaster/masterprogramkegiatan/subkegiatan">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
    )
}