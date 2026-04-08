'use client'

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Select from 'react-select';
import { ButtonGreen, ButtonRed } from "@/components/global/Button";
import { LoadingClip, LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useRouter, useParams } from "next/navigation";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { getToken } from "@/components/lib/Cookie";

interface OptionType {
    value: number | null;
    label: string;
}
interface OptionTypeString {
    value: string;
    label: string;
}
interface OpdOptionType extends OptionTypeString {
    opdId?: number;
    namaOpd?: string;
}
interface PegawaiOptionType extends OptionTypeString {
    pegawaiId?: number;
    opdId?: number;
    nama?: string;
    namaPegawai?: string;
}
interface UserDetail {
    id?: number;
    kode_opd?: string;
    nama_opd?: string;
    nama?: string;
    nama_pegawai?: string;
    nip?: string;
    opd_id?: number;
    pegawai_id?: number;
    status?: string;
    role?: string;
    role_id?: number;
    is_active?: boolean;
}
interface OptionTypeBoolean {
    value: boolean;
    label: string;
}
interface FormValue {
    nip: PegawaiOptionType;
    email: string;
    password: string;
    is_active?: OptionTypeBoolean | null;
    role?: OptionType | null;
}

export const FormUser = () => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const [Nip, setNip] = useState<PegawaiOptionType | null>(null);
    const [Email, setEmail] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const [Aktif, setAktif] = useState<OptionTypeBoolean | null>(null);
    const [Roles, setRoles] = useState<OptionType | null>(null);
    const [Opd, setOpd] = useState<OpdOptionType | null>(null);
    const [PegawaiOption, setPegawaiOption] = useState<PegawaiOptionType[]>([]);
    const [OpdOption, setOpdOption] = useState<OpdOptionType[]>([]);
    const [RolesOption, setRolesOption] = useState<OptionType[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const router = useRouter();
    const token = getToken();
    const [showPassword, setShowPassword] = useState(false);

    const fetchRoles = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
        const response = await fetch(`${API_URL}/roles`, {
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
        const payload = Array.isArray(data) ? data : data?.data ?? [];
        const role = payload.map((item: any) => ({
            value: item.id,
            label: item.role,
        }));
        setRolesOption(role);
        } catch (err) {
            console.log('gagal mendapatkan data roles');
        } finally {
            setIsLoading(false);
        }
    };
    const fetchOpd = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/opds`, {
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
                label: item.nama_opd ?? item.nama,
                opdId: item.id ?? item.opd_id,
                namaOpd: item.nama_opd ?? item.nama,
            }));
            setOpdOption(opd);
        } catch (err) {
            console.log('gagal mendapatkan data opd');
        } finally {
            setIsLoading(false);
        }
    };
    const fetchPegawai = async (kode_opd: string) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/pegawais/opd/${kode_opd}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const result = await response.json();
            const payload = Array.isArray(result) ? result : result?.data ?? [];
            const pegawai = payload.map((item: any) => ({
                value: item.nip,
                label: item.nama ?? item.nama_pegawai ?? '-',
                pegawaiId: item.id ?? item.pegawai_id,
                opdId: item.opd_id ?? item.opdId,
                nama: item.nama ?? item.nama_pegawai ?? '-',
                namaPegawai: item.nama_pegawai ?? item.nama ?? '-',
            }));
            setPegawaiOption(pegawai);
        } catch (err) {
            console.log('gagal mendapatkan data pegawai');
        } finally {
            setIsLoading(false);
        }
    };

    const activeOptions = [
        { label: "Aktif", value: true },
        { label: "Tidak Aktif", value: false },
    ];

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            email: data.email,
            kode_opd: Opd?.value,
            nama_opd: Opd?.label,
            nama: Nip?.nama || Nip?.label || '',
            nama_pegawai: Nip?.namaPegawai || Nip?.label || '',
            nip: Nip?.value,
            opd_id: Opd?.opdId ?? null,
            pegawai_id: Nip?.pegawaiId ?? null,
            password: data.password,
            role: Roles?.label || '',
            role_id: Roles?.value ?? null,
            status: Aktif?.label || '',
            is_active: data.is_active?.value ?? Aktif?.value,
        };
        // console.log(formData);
        try{
            setProses(true);
            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(data.code == 201 || data.code === 200){
                AlertNotification("Berhasil", "Berhasil menambahkan data user", "success", 1000);
                router.push("/DataMaster/masteruser");
            } else if(data.code == 400){
                AlertNotification("Gagal", `${data.data}`, "error", 3000, true);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
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
                <h1 className="uppercase font-bold">Form Tambah User :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                        >
                            Perangkat Daerah
                        </label>
                        <Select
                            placeholder="Pilih OPD"
                            value={Opd}
                            options={OpdOption}
                            isLoading={IsLoading}
                            isSearchable
                            isClearable
                            onMenuOpen={() => {
                                if (OpdOption.length === 0) {
                                    fetchOpd();
                                }
                            }}
                            onMenuClose={() => setOpdOption([])}
                            onChange={(option) => {
                                setOpd(option);
                            }}
                            styles={{
                                control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    textAlign: 'start',
                                })
                            }}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nip"
                        >
                            Pegawai
                        </label>
                        <Controller
                            name="nip"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder={!Opd ? 'Pilih OPD terlebih dahulu' : 'Pilih Pegawai'}
                                        value={Nip}
                                        options={PegawaiOption}
                                        isLoading={IsLoading}
                                        isSearchable
                                        isClearable
                                        isDisabled={!Opd}
                                        onMenuOpen={() => {
                                            if (Opd?.value) {
                                                fetchPegawai(Opd?.value);
                                            }
                                        }}
                                        onMenuClose={() => {
                                            setPegawaiOption([]);
                                        }}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            setNip(option);
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
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="email"
                        >
                            Email :
                        </label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: "Email harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="tahun"
                                        type="text"
                                        placeholder="masukkan Email"
                                        value={field.value || Email}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setEmail(e.target.value);
                                        }}
                                    />
                                    {errors.email ?
                                        <h1 className="text-red-500">
                                            {errors.email.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Email Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="password"
                        >
                            Password:
                        </label>
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: "Password harus terisi" }}
                            render={({ field }) => {
                                return (
                                    <>
                                        <div className="flex items-center">
                                            <input
                                                {...field}
                                                className="border px-4 py-2 rounded-lg flex-1"
                                                // minLength={8}
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Masukkan Password"
                                                value={field.value || Password}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setPassword(e.target.value);
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-20 text-sm"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <TbEye /> : <TbEyeClosed />}
                                            </button>
                                        </div>
                                        {errors.password ? (
                                            <h1 className="text-red-500">{errors.password.message}</h1>
                                        ) : (
                                            <h1 className="text-slate-300 text-xs">*Password Harus Terisi</h1>
                                        )}
                                    </>
                                );
                            }}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="is_active"
                        >
                            Status
                        </label>
                        <Controller
                            name="is_active"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Pilih Status"
                                        value={Aktif}
                                        options={activeOptions}
                                        isLoading={IsLoading}
                                        isSearchable
                                        isClearable
                                        onMenuOpen={() => {
                                            if (RolesOption.length === 0) {
                                                fetchRoles();
                                            }
                                        }}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            setAktif(option);
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
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="role"
                        >
                            Roles
                        </label>
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Pilih Roles"
                                        value={Roles}
                                        options={RolesOption}
                                        isLoading={IsLoading}
                                        isSearchable
                                        isClearable
                                        onMenuOpen={() => {
                                            if (RolesOption.length === 0) {
                                                fetchRoles();
                                            }
                                        }}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            setRoles(option);
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
                    <ButtonRed type="button" halaman_url="/DataMaster/masteruser">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
    )
}
export const FormEditUser = () => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();
    const [Nip, setNip] = useState<OptionTypeString | null>(null);
    const [Email, setEmail] = useState<string>('');
    const [Aktif, setAktif] = useState<OptionTypeBoolean | null>(null);
    const [Roles, setRoles] = useState<OptionType | null>(null);
    const [RolesOption, setRolesOption] = useState<OptionType[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const [UserDetail, setUserDetail] = useState<UserDetail | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [idNull, setIdNull] = useState<boolean | null>(null);
    const { id } = useParams();
    const router = useRouter();
    const token = getToken();

    const fetchRoles = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
        const response = await fetch(`${API_URL}/roles`, {
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
        const payload = Array.isArray(data) ? data : data?.data ?? [];
        const role = payload.map((item: any) => ({
            value: item.id,
            label: item.role,
        }));
        setRolesOption(role);
        } catch (err) {
            console.log('gagal mendapatkan data roles');
        } finally {
            setIsLoading(false);
        }
    };

    const activeOptions = [
        { label: "Aktif", value: true },
        { label: "Tidak Aktif", value: false },
    ];

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/users/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const userData = result?.data ?? result;
                if (result?.code === 400 || !userData) {
                    setIdNull(true);
                    setUserDetail(null);
                } else {
                    const activeValue =
                        typeof userData.is_active === "boolean"
                            ? userData.is_active
                            : (userData.status?.toLowerCase() === "aktif");
                    const activeOption =
                        activeOptions.find((option) => option.value === activeValue) || null;
                    reset({
                        nip: userData.nip || '',
                        email: userData.email || '',
                        is_active: activeOption,
                    });
                    if (userData.nip) {
                        setNip({
                            value: userData.nip,
                            label: userData.nip,
                        });
                    }
                    const roleOption: OptionType = {
                        value: userData.role_id ?? userData.role?.id ?? null,
                        label:
                            typeof userData.role === 'string'
                                ? userData.role
                                : userData.role?.role ?? '',
                    };
                    setRoles(roleOption);
                    setAktif(activeOption);
                    setUserDetail({
                        id: userData.id ?? Number(id),
                        kode_opd: userData.kode_opd,
                        nama_opd: userData.nama_opd,
                        nama: userData.nama,
                        nama_pegawai: userData.nama_pegawai,
                        nip: userData.nip,
                        opd_id: userData.opd_id,
                        pegawai_id: userData.pegawai_id,
                        status: userData.status,
                        role:
                            typeof userData.role === 'string'
                                ? userData.role
                                : userData.role?.role,
                        role_id: userData.role_id ?? userData.role?.id,
                        is_active: userData.is_active,
                    });
                    setIdNull(false);
                }
            } catch (err) {
                setError('gagal mengambil data sesuai id');
                console.error(err, 'gagal mengambil data sesuai id')
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [id, reset, token]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const detail = UserDetail;
        const formData = {
            id: detail?.id ?? Number(id),
            email: data.email,
            kode_opd: detail?.kode_opd,
            nama: detail?.nama,
            nama_opd: detail?.nama_opd,
            nama_pegawai: detail?.nama_pegawai,
            nip:
                data.nip?.value ||
                Nip?.value ||
                detail?.nip ||
                '',
            opd_id: detail?.opd_id ?? null,
            pegawai_id: detail?.pegawai_id ?? null,
            role: Roles?.label || detail?.role || '',
            role_id: Roles?.value ?? detail?.role_id ?? null,
            status: Aktif?.label || detail?.status || '',
            is_active: Aktif?.value ?? detail?.is_active ?? null,
        };
        try{
            setProses(true);
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: "PUT",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if(result.code === 200 || result.code === 201){
                AlertNotification("Berhasil", "Berhasil mengubah data user", "success", 1000);
                router.push("/DataMaster/masteruser");
            } else if(result.code === 400) {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    if (loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit User :</h1>
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit User :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } else if (idNull) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit User :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tidak ditemukan</h1>
            </div>
        )
    }

    return (
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit User :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <h1 className="border border-slate-200 bg-slate-200 rounded-lg p-3">NIP User ini : {Nip?.value}</h1>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="email"
                        >
                            Email :
                        </label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: "Email harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="tahun"
                                        type="text"
                                        placeholder="masukkan Email"
                                        value={field.value || Email}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setEmail(e.target.value);
                                        }}
                                    />
                                    {errors.email ?
                                        <h1 className="text-red-500">
                                            {errors.email.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Email Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="is_active"
                        >
                            Status
                        </label>
                        <Controller
                            name="is_active"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Pilih Status"
                                        value={Aktif}
                                        options={activeOptions}
                                        isLoading={IsLoading}
                                        isSearchable
                                        isClearable
                                        onMenuOpen={() => {
                                            if (RolesOption.length === 0) {
                                                fetchRoles();
                                            }
                                        }}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            setAktif(option);
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
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="role"
                        >
                            Roles
                        </label>
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Pilih Roles"
                                        value={Roles}
                                        options={RolesOption}
                                        isLoading={IsLoading}
                                        isSearchable
                                        isClearable
                                        onMenuOpen={() => {
                                            if (RolesOption.length === 0) {
                                                fetchRoles();
                                            }
                                        }}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            setRoles(option);
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
                    <ButtonRed type="button" halaman_url="/DataMaster/masteruser">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
    )
}
