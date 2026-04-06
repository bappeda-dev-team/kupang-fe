'use client'

import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { ButtonGreen, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { LoadingClip, LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useParams, useRouter } from "next/navigation";
import Select from 'react-select';
import { getToken } from "@/components/lib/Cookie";

interface OptionTypeString {
    value: string;
    label: string;
}
interface FormValue {
    id: number;
    nama_pohon: string;
    jenis_pohon: string;
    keterangan: string;
    tahun: OptionTypeString;
    indikator: indikator[];
}
interface indikator {
    nama_indikator: string;
    targets: target[];
}
type target = {
    target: string;
    satuan: string;
}

export const FormTematikKab = () => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [Tahun, setTahun] = useState<OptionTypeString | null>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
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

    const { fields, append, remove } = useFieldArray({
        control,
        name: "indikator",
    });

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            nama_pohon: data.nama_pohon,
            Keterangan: data.keterangan,
            jenis_pohon: "Tematik",
            level_pohon: 0,
            tahun: data.tahun?.value,
            ...(data.indikator && {
                indikator: data.indikator.map((ind) => ({
                    indikator: ind.nama_indikator,
                    target: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })),
            }),
        };
        //   console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/create`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil menambahkan data tematik pemda", "success", 1000);
                router.push("/tematikpemda");
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    return (
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Tambah Tematik Pemda :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_pohon"
                        >
                            Nama Tema :
                        </label>
                        <Controller
                            name="nama_pohon"
                            control={control}
                            rules={{ required: "Nama Tema harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_pohon"
                                        type="text"
                                        placeholder="masukkan Nama Tema"
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
                                        <h1 className="text-slate-300 text-xs">*Nama Tema Harus Terisi</h1>
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
                            tahun:
                        </label>
                        <Controller
                            name="tahun"
                            control={control}
                            rules={{ required: "tahun Harus Terisi" }}
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
                    <label className="uppercase text-base font-bold text-gray-700 my-2">
                        indikator tematik :
                    </label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex flex-col my-2 py-2 px-5 border rounded-lg">
                            <Controller
                                name={`indikator.${index}.nama_indikator`}
                                control={control}
                                defaultValue={field.nama_indikator}
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
                        onClick={() => append({ nama_indikator: "", targets: [{ target: "", satuan: "" }] })}
                    >
                        Tambah Indikator
                    </ButtonSkyBorder>
                    <ButtonGreen
                        type="submit"
                        className="my-4"
                        disabled={Proses}
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
                    <ButtonRed type="button" halaman_url="/tematikpemda">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
    )
}
export const FormEditTematikKab = () => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [Tahun, setTahun] = useState<OptionTypeString | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [idNull, setIdNull] = useState<boolean | null>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const router = useRouter();
    const { id } = useParams();
    const token = getToken();

    const TahunOption = [
        { label: "2019", value: "2019" },
        { label: "2020", value: "2020" },
        { label: "2021", value: "2021" },
        { label: "2022", value: "2022" },
        { label: "2023", value: "2023" },
        { label: "2024", value: "2024" },
        { label: "2025", value: "2025" },
        { label: "2026", value: "2026" },
        { label: "2027", value: "2027" },
        { label: "2028", value: "2028" },
        { label: "2029", value: "2029" },
        { label: "2030", value: "2030" },
    ];

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchTematikKab = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/pohon_kinerja_admin/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                if (result.code == 500 || result.code == 400) {
                    setIdNull(true);
                } else {
                    const data = result.data;
                    if (data.nama_pohon) {
                        setNamaPohon(data.nama_pohon);
                        reset((prev) => ({ ...prev, nama_pohon: data.nama_pohon }))
                    }
                    if (data.keterangan) {
                        setKeterangan(data.keterangan);
                        reset((prev) => ({ ...prev, keterangan: data.keterangan }))
                    }
                    if (data.tahun) {
                        const tahun = {
                            value: data.tahun,
                            label: data.tahun,
                        }
                        setTahun(tahun);
                        reset((prev) => ({ ...prev, tahun: tahun }))
                    }
                    if (data.indikator) {
                        reset({
                            nama_pohon: data.nama_pohon || '',
                            keterangan: data.keterangan || '',
                            tahun: {
                                value: data.tahun,
                                label: data.tahun,
                            },
                            indikator: data.indikator?.map((item: indikator) => ({
                                nama_indikator: item.nama_indikator,
                                targets: item.targets.map((t: target) => ({
                                    target: t.target,
                                    satuan: t.satuan,
                                })),
                            })),
                        });
                        replace(data.indikator.map((item: indikator) => ({
                            indikator: item.nama_indikator,
                            targets: item.targets,
                        })));
                    }
                }
            } catch (err) {
                setError('gagal mendapatkan data, periksa koneksi internet atau database server')
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchTematikKab();
    }, [id, reset, token, replace]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            nama_pohon: data.nama_pohon,
            jenis_pohon: "Tematik",
            level_pohon: 0,
            keterangan: data.keterangan,
            tahun: data.tahun?.value,
            ...(data.indikator && {
                indikator: data.indikator.map((ind) => ({
                    indikator: ind.nama_indikator,
                    target: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })),
            }),
        };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/update/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil edit data tematik kabupaten", "success", 1000);
                router.push("/tematikpemda");
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
                <h1 className="uppercase font-bold">Form Edit Tematik Pemda :</h1>
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Tematik Pemda :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } else if (idNull) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Tematik Pemda :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tematik tidak ditemukan</h1>
            </div>
        )
    } else {
        return (
            <>
                <div className="border p-5 rounded-xl shadow-xl">
                    <h1 className="uppercase font-bold">Form Edit Tematik Pemda :</h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_pohon"
                            >
                                Nama Tematik :
                            </label>
                            <Controller
                                name="nama_pohon"
                                control={control}
                                rules={{ required: "Nama Tematik harus terisi" }}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="nama_pohon"
                                            type="text"
                                            placeholder="masukkan Nama Tematik"
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
                                            <h1 className="text-slate-300 text-xs">*Nama Tematik Harus Terisi</h1>
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
                                tahun:
                            </label>
                            <Controller
                                name="tahun"
                                control={control}
                                rules={{ required: "tahun Harus Terisi" }}
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
                        <label className="uppercase text-base font-bold text-gray-700 my-2">
                            indikator tematik :
                        </label>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex flex-col my-2 py-2 px-5 border rounded-lg">
                                <Controller
                                    name={`indikator.${index}.nama_indikator`}
                                    control={control}
                                    defaultValue={field.nama_indikator}
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
                                    <React.Fragment key={subindex}>
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
                                    </React.Fragment>
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
                            onClick={() => append({ nama_indikator: "", targets: [{ target: "", satuan: "" }] })}
                        >
                            Tambah Indikator
                        </ButtonSkyBorder>
                        <ButtonGreen
                            type="submit"
                            className="my-4"
                            disabled={Proses}
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
                        <ButtonRed type="button" halaman_url="/tematikpemda">
                            Kembali
                        </ButtonRed>
                    </form>
                </div>
            </>
        )
    }
}