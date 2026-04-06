'use client'

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ButtonGreen, ButtonRed } from "@/components/global/Button";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useRouter, useParams } from "next/navigation";
import { getToken } from "@/components/lib/Cookie";

interface FormValue {
    id: string;
    nama_lembaga: string;
    kode_lembaga: string;
    jabatan_kepala_lembaga?: string;
    nama_kepala_lembaga?: string;
    nip_kepala_lembaga?: string;
    id_lembaga?: number;
}

export const FormMasterLembaga = () => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const [NamaLembaga, setNamaLembaga] = useState<string>('');
    const [KodeLembaga, setKodeLembaga] = useState<string>('');
    const [JabatanKepalaLembaga, setJabatanKepalaLembaga] = useState<string>('');
    const [NamaKepalaLembaga, setNamaKepalaLembaga] = useState<string>('');
    const [NIPKepalaLembaga, setNIPKepalaLembaga] = useState<string>('');
    const router = useRouter();
    const token = getToken();

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            nama_lembaga: data.nama_lembaga,
            kode_lembaga: data.kode_lembaga,
            jabatan_kepala_lembaga: data.jabatan_kepala_lembaga,
            nama_kepala_lembaga: data.nama_kepala_lembaga,
            nip_kepala_lembaga: data.nip_kepala_lembaga,
        };
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `${token}`;
        try {
            const response = await fetch(`${API_URL}/lembagas`, {
                method: "POST",
                headers,
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil menambahkan data master lembaga", "success", 1000);
                router.push("/DataMaster/masterlembaga");
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        }
    };

    return (
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Tambah Lembaga :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_lembaga"
                        >
                            Nama Lembaga :
                        </label>
                        <Controller
                            name="nama_lembaga"
                            control={control}
                            rules={{ required: "Nama Lembaga harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_lembaga"
                                        type="text"
                                        placeholder="masukkan Nama Lembaga"
                                        value={field.value || NamaLembaga}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setNamaLembaga(e.target.value);
                                        }}
                                    />
                                    {errors.nama_lembaga ?
                                        <h1 className="text-red-500">
                                            {errors.nama_lembaga.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Nama Lembaga Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="kode_lembaga"
                        >
                            Kode Lembaga :
                        </label>
                        <Controller
                            name="kode_lembaga"
                            control={control}
                            rules={{ required: "Kode Lembaga harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="kode_lembaga"
                                        type="text"
                                        placeholder="masukkan kode lembaga"
                                        value={field.value || KodeLembaga}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setKodeLembaga(e.target.value);
                                        }}
                                    />
                                    {errors.kode_lembaga ?
                                        <h1 className="text-red-500">
                                            {errors.kode_lembaga.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*kode lembaga Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="jabatan_kepala_lembaga"
                        >
                            Jabatan Kepala Lembaga :
                        </label>
                        <Controller
                            name="jabatan_kepala_lembaga"
                            control={control}
                            rules={{ required: "Jabatan Kepala Lembaga harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="jabatan_kepala_lembaga"
                                        type="text"
                                        placeholder="masukkan jabatan kepala lembaga"
                                        value={field.value || JabatanKepalaLembaga}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setKodeLembaga(e.target.value);
                                        }}
                                    />
                                    {errors.jabatan_kepala_lembaga ?
                                        <h1 className="text-red-500">
                                            {errors.jabatan_kepala_lembaga.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Jabatan Kepala Lembaga Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_kepala_lembaga"
                        >
                            Nama Kepala Lembaga :
                        </label>
                        <Controller
                            name="nama_kepala_lembaga"
                            control={control}
                            rules={{ required: "Nama Kepala Lembaga harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_kepala_lembaga"
                                        type="text"
                                        placeholder="masukkan nama kepala lembaga"
                                        value={field.value || NamaKepalaLembaga}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setKodeLembaga(e.target.value);
                                        }}
                                    />
                                    {errors.nama_kepala_lembaga ?
                                        <h1 className="text-red-500">
                                            {errors.nama_kepala_lembaga.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Nama Kepala Lembaga Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nip_kepala_lembaga"
                        >
                            NIP Kepala Lembaga :
                        </label>
                        <Controller
                            name="nip_kepala_lembaga"
                            control={control}
                            rules={{ required: "NIP Kepala Lembaga harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nip_kepala_lembaga"
                                        type="text"
                                        placeholder="masukkan nip kepala lembaga"
                                        value={field.value || NIPKepalaLembaga}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setKodeLembaga(e.target.value);
                                        }}
                                    />
                                    {errors.nip_kepala_lembaga ?
                                        <h1 className="text-red-500">
                                            {errors.nip_kepala_lembaga.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*NIP Kepala Lembaga Harus Terisi</h1>
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
                    <ButtonRed type="button" halaman_url="/DataMaster/masterlembaga">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
    )
}
export const FormEditMasterLembaga = () => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();
    const [NamaLembaga, setNamaLembaga] = useState<string>('');
    const [KodeLembaga, setKodeLembaga] = useState<string>('');
    const [JabatanKepalaLembaga, setJabatanKepalaLembaga] = useState<string>('');
    const [NamaKepalaLembaga, setNamaKepalaLembaga] = useState<string>('');
    const [NipKepalaLembaga, setNipKepalaLembaga] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [idNull, setIdNull] = useState<boolean | null>(null);
    const { id } = useParams();
    const router = useRouter();
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchLembagaId = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/lembagas/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = Array.isArray(result) ? result[0] : (result?.data ?? result);
                if (!data || result.code === 404) {
                    setIdNull(true);
                } else {
                    if (data.nama_lembaga) {
                        setNamaLembaga(data.nama_lembaga);
                        reset((prev) => ({ ...prev, nama_lembaga: data.nama_lembaga }))
                    }
                    if (data.kode_lembaga) {
                        setKodeLembaga(data.kode_lembaga);
                        reset((prev) => ({ ...prev, kode_lembaga: data.kode_lembaga }))
                    }
                    if (data.jabatan_kepala_lembaga) {
                        setJabatanKepalaLembaga(data.jabatan_kepala_lembaga);
                        reset((prev) => ({ ...prev, jabatan_kepala_lembaga: data.jabatan_kepala_lembaga }))
                    }
                    if (data.nama_kepala_lembaga) {
                        setNamaKepalaLembaga(data.nama_kepala_lembaga);
                        reset((prev) => ({ ...prev, nama_kepala_lembaga: data.nama_kepala_lembaga }))
                    }
                    if (data.nip_kepala_lembaga) {
                        setNipKepalaLembaga(data.nip_kepala_lembaga);
                        reset((prev) => ({ ...prev, nip_kepala_lembaga: data.nip_kepala_lembaga }))
                    }
                }
            } catch (err) {
                setError('gagal mendapatkan data, periksa koneksi internet atau database server')
            } finally {
                setLoading(false);
            }
        }
        fetchLembagaId();
    }, [id, reset, token]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            id: Number(id),
            nama_lembaga: data.nama_lembaga,
            kode_lembaga: data.kode_lembaga,
            jabatan_kepala_lembaga: data.jabatan_kepala_lembaga,
            nama_kepala_lembaga: data.nama_kepala_lembaga,
            nip_kepala_lembaga: data.nip_kepala_lembaga,
        };
        try {
            const response = await fetch(`${API_URL}/lembagas/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil edit data master lembaga", "success", 1000);
                router.push("/DataMaster/masterlembaga");
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        }
    };

    if (loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Lembaga :</h1>
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Lembaga :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } else if (idNull) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Lembaga :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tidak ditemukan</h1>
            </div>
        )
    } else {
        return (
            <>
                <div className="border p-5 rounded-xl shadow-xl">
                    <h1 className="uppercase font-bold">Form Edit Lembaga :</h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_lembaga"
                            >
                                Nama Lembaga :
                            </label>
                            <Controller
                                name="nama_lembaga"
                                control={control}
                                rules={{ required: "Nama Lembaga harus terisi" }}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="nama_lembaga"
                                            type="text"
                                            placeholder="masukkan Nama Lembaga"
                                            value={field.value || NamaLembaga}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setNamaLembaga(e.target.value);
                                            }}
                                        />
                                        {errors.nama_lembaga ?
                                            <h1 className="text-red-500">
                                                {errors.nama_lembaga.message}
                                            </h1>
                                            :
                                            <h1 className="text-slate-300 text-xs">*Nama Lembaga Harus Terisi</h1>
                                        }
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_lembaga"
                            >
                                Kode Lembaga :
                            </label>
                            <Controller
                                name="kode_lembaga"
                                control={control}
                                rules={{ required: "Kode Lembaga harus terisi" }}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="kode_lembaga"
                                            type="text"
                                            placeholder="masukkan kode lembaga"
                                            value={field.value || KodeLembaga}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setKodeLembaga(e.target.value);
                                            }}
                                        />
                                        {errors.kode_lembaga ?
                                            <h1 className="text-red-500">
                                                {errors.kode_lembaga.message}
                                            </h1>
                                            :
                                            <h1 className="text-slate-300 text-xs">*kode lembaga Harus Terisi</h1>
                                        }
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="jabatan_kepala_lembaga"
                        >
                            Jabatan Kepala Pemda :
                        </label>
                        <Controller
                            name="jabatan_kepala_lembaga"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="jabatan_kepala_lembaga"
                                        type="text"
                                        placeholder="masukkan jabatan kepala pemda"
                                        value={field.value || JabatanKepalaLembaga}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setJabatanKepalaLembaga(e.target.value);
                                        }}
                                    />
                                        {errors.jabatan_kepala_lembaga &&
                                            <h1 className="text-red-500">
                                                {errors.jabatan_kepala_lembaga.message}
                                            </h1>
                                        }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="jabatan_kepala_lembaga"
                        >
                            Jabatan Kepala Pemda :
                        </label>
                        <Controller
                            name="jabatan_kepala_lembaga"
                            control={control}
                            rules={{ required: "Jabatan Kepala Lembaga harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                    className="border px-4 py-2 rounded-lg"
                                        id="jabatan_kepala_lembaga"
                                        type="text"
                                        placeholder="masukkan jabatan kepala pemda"
                                    />
                                    {errors.jabatan_kepala_lembaga &&
                                        <h1 className="text-red-500">
                                            {errors.jabatan_kepala_lembaga.message}
                                        </h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_kepala_lembaga"
                        >
                            Nama Kepala Pemda :
                        </label>
                        <Controller
                            name="nama_kepala_lembaga"
                            control={control}
                            rules={{ required: "Nama Kepala Lembaga harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_kepala_lembaga"
                                        type="text"
                                        placeholder="masukkan nama kepala pemda"
                                    />
                                    {errors.nama_kepala_lembaga &&
                                        <h1 className="text-red-500">
                                            {errors.nama_kepala_lembaga.message}
                                        </h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nip_kepala_lembaga"
                        >
                            NIP Kepala Pemda :
                        </label>
                        <Controller
                            name="nip_kepala_lembaga"
                            control={control}
                            rules={{ required: "NIP Kepala Lembaga harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nip_kepala_lembaga"
                                        type="text"
                                        placeholder="masukkan nip kepala pemda"
                                    />
                                    {errors.nip_kepala_lembaga &&
                                        <h1 className="text-red-500">
                                            {errors.nip_kepala_lembaga.message}
                                        </h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_kepala_lembaga"
                        >
                            Nama Kepala Pemda :
                        </label>
                        <Controller
                            name="nama_kepala_lembaga"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_kepala_lembaga"
                                        type="text"
                                        placeholder="masukkan nama kepala pemda"
                                        value={field.value || NamaKepalaLembaga}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setNamaKepalaLembaga(e.target.value);
                                        }}
                                    />
                                        {errors.nama_kepala_lembaga &&
                                            <h1 className="text-red-500">
                                                {errors.nama_kepala_lembaga.message}
                                            </h1>
                                        }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nip_kepala_lembaga"
                        >
                            NIP Kepala Pemda :
                        </label>
                        <Controller
                            name="nip_kepala_lembaga"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nip_kepala_lembaga"
                                        type="text"
                                        placeholder="masukkan nip kepala pemda"
                                        value={field.value || NipKepalaLembaga}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setNipKepalaLembaga(e.target.value);
                                        }}
                                    />
                                        {errors.nip_kepala_lembaga &&
                                            <h1 className="text-red-500">
                                                {errors.nip_kepala_lembaga.message}
                                            </h1>
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
                        <ButtonRed type="button" halaman_url="/DataMaster/masterlembaga">
                            Kembali
                        </ButtonRed>
                    </form>
                </div>
            </>
        )
    }
}
