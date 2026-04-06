'use client'

import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import Select from 'react-select'
import { AlertNotification } from "@/components/global/Alert";
import { getOpdTahun, getToken, getUser } from "@/components/lib/Cookie";
import { ButtonGreen, ButtonGreenBorder, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { useParams, useRouter } from "next/navigation";
import { TablePohon } from "../Pohon/ModalPindahPohonOpd";
import { TbEyeClosed, TbEye } from "react-icons/tb";
import { LoadingClip, LoadingButtonClip } from "@/components/global/Loading";

interface OptionTypeString {
    value: string;
    label: string;
}
interface OptionType {
    value: number;
    label: string;
}
interface pohon {
    value: number;
    label?: string;
    id: number;
    parent: OptionType;
    nama_pohon: string;
    jenis_pohon: string;
    level_pohon: number;
    keterangan?: string;
    tahun: OptionTypeString;
    status: string;
    kode_opd: string;
    nama_opd: string;
    pelaksana: OptionTypeString[];
    indikator: indikator[];
    tagging: Tagging[];
}
interface Tagging {
    nama_tagging: string;
    keterangan_tagging: string;
}
interface FormValue {
    id_pohon: OptionType;
    nama_rencana_kinerja: string;
    tahun: string;
    status_rencana_kinerja: OptionTypeString;
    catatan: string;
    kode_opd: string;
    pegawai_id: string;
    indikator: indikator[];
}
interface indikator {
    id_indikator?: string;
    nama_indikator: string;
    targets: target[];
}
type target = {
    target: string;
    satuan: string;
};

export const FormRencanaKinerja = () => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const [Tahun, setTahun] = useState<any>(null);
    const [User, setUser] = useState<any>(null);
    const [namaRenja, setNamaRenja] = useState<string>('');
    const [PreviewPohon, setPreviewPohon] = useState<boolean>(false);
    const [Pokin, setPokin] = useState<pohon | null>(null);
    const [catatan, setCatatan] = useState<string>('');
    const [statusRekin, setStatusRekin] = useState<OptionTypeString | null>(null);
    const [PokinOption, setPokinOption] = useState<pohon[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const [isClient, setIsClient] = useState<boolean>(false);
    const token = getToken();
    const router = useRouter();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "indikator",
    });

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (data) {
            if (data.tahun) {
                const value_tahun = {
                    value: data.tahun.value,
                    label: data.tahun.label,
                }
                setTahun(value_tahun);
            }
        }
        setIsClient(true);
    }, []);

    const fetchPokinByPelaksana = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/rencana_kinerja_pokin/pokin_by_pelaksana/${User?.nip}/${Tahun?.value}`, {
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
            const pokin = data.data.map((item: any) => ({
                value: item.id,
                label: `${item.nama_pohon} - ${item.jenis_pohon}`,
                nama_pohon: item.nama_pohon,
                jenis_pohon: item.jenis_pohon,
                level_pohon: item.level_pohon,
                keterangan: item.keterangan,
                indikator: item.indikator,
                nama_opd: item.nama_opd,
                tahun: item.tahun,
            }));
            setPokinOption(pokin);
        } catch (err) {
            console.log('gagal mendapatkan data dropdown pokin by pelaksana');
        } finally {
            setIsLoading(false);
        }
    };

    const statusOption: OptionTypeString[] = [
        { label: "aktif", value: "aktif" },
        { label: "tidak aktif", value: "tidak aktif" },
    ];

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            id_pohon: data.id_pohon?.value,
            nama_rencana_kinerja: data.nama_rencana_kinerja,
            status_rencana_kinerja: data.status_rencana_kinerja?.value,
            catatan: data.catatan,
            tahun: String(Tahun?.value),
            kode_opd: User?.kode_opd,
            pegawai_id: User?.nip,
            indikator: data.indikator.map((ind) => ({
                nama_indikator: ind.nama_indikator,
                target: ind.targets.map((t) => ({
                    target: t.target,
                    satuan: t.satuan,
                })),
            })),
        };
        //   console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/rencana_kinerja/create`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil menambahkan data master perangkat daerah", "success", 1000);
                router.push("/rencanakinerja");
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
            {isClient &&
                <div className="border p-5 rounded-xl shadow-xl">
                    <h1 className="uppercase font-bold">Form Tambah Rencana Kinerja :</h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="id_pohon"
                            >
                                Pohon :
                            </label>
                            <Controller
                                name="id_pohon"
                                control={control}
                                rules={{ required: "Pohon Harus Dipilih" }}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Masukkan Pohon"
                                            value={Pokin}
                                            options={PokinOption}
                                            isLoading={IsLoading}
                                            isSearchable
                                            isClearable
                                            onMenuOpen={() => {
                                                if (User?.nip != undefined) {
                                                    fetchPokinByPelaksana();
                                                    console.log("nip: ", User?.nip)
                                                }
                                            }}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setPokin(option);
                                            }}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                })
                                            }}
                                        />
                                        {errors.id_pohon ?
                                            <h1 className="text-red-500">
                                                {errors.id_pohon.message}
                                            </h1>
                                            :
                                            <h1 className="text-slate-300 text-xs">*Pohon Harus Dipilih</h1>
                                        }
                                    </>
                                )}
                            />
                        </div>
                        {Pokin?.value != null &&
                            <>
                                <div className="flex">
                                    <ButtonGreenBorder className="mb-2" type="button" onClick={() => setPreviewPohon((prev) => !prev)}>{PreviewPohon ?
                                        <>
                                            <TbEye className="mr-2" />
                                            <p>Sembunyikan Detail Pohon</p>
                                        </>
                                        :
                                        <>
                                            <TbEyeClosed className="mr-2" />
                                            <p>Tampilkan Detail Pohon</p>
                                        </>
                                    }</ButtonGreenBorder>
                                </div>
                                {PreviewPohon === true &&
                                    <div className="flex flex-col w-full justify-center items-center">
                                        <div
                                            className={`flex flex-col rounded-lg shadow-lg px-2
                                        ${Pokin?.jenis_pohon === "Strategic Pemda" && 'border'}
                                        ${Pokin?.jenis_pohon === "Tactical Pemda" && 'border'}
                                        ${Pokin?.jenis_pohon === "OperationalPemda" && 'border'}
                                        ${Pokin?.jenis_pohon === "Strategic" && 'bg-red-700'}
                                        ${Pokin?.jenis_pohon === "Tactical" && 'bg-blue-500'}
                                        ${Pokin?.jenis_pohon === "Operational" && 'bg-green-500'}
                                        ${Pokin?.jenis_pohon === "Operational N" && 'bg-white'}
                                        ${(Pokin?.jenis_pohon === "Strategic Crosscutting" || Pokin?.jenis_pohon === "Tactical Crosscutting" || Pokin?.jenis_pohon === "Operational Crosscutting" || Pokin?.jenis_pohon === "Operational N Crosscutting") && 'bg-yellow-700'}
                                    `}
                                        >
                                            <div
                                                className={`flex py-3 justify-center font-bold text-sm uppercase border my-3 rounded-lg bg-white
                                            ${Pokin?.jenis_pohon === "Strategic Pemda" && 'border-red-500 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                                            ${Pokin?.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                                            ${Pokin?.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                                            ${(Pokin?.jenis_pohon === "Strategic" || Pokin?.jenis_pohon === 'Strategic Crosscutting') && 'border-red-500 text-red-500'}
                                            ${(Pokin?.jenis_pohon === "Tactical" || Pokin?.jenis_pohon === 'Tactical Crosscutting') && 'border-blue-500 text-blue-500'}
                                            ${(Pokin?.jenis_pohon === "Operational" || Pokin?.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                                            ${(Pokin?.jenis_pohon === "Operational Crosscutting" || Pokin?.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                                        `}
                                            >
                                                {Pokin?.jenis_pohon}
                                            </div>
                                            <div className="mb-3">
                                                {Pokin &&
                                                    <TablePohon item={Pokin} />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                            </>
                        }
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_rencana_kinerja"
                            >
                                Rencana Kinerja :
                            </label>
                            <Controller
                                name="nama_rencana_kinerja"
                                control={control}
                                rules={{ required: "Nama Rencana Kinerja harus terisi" }}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="nama_rencana_kinerja"
                                            type="text"
                                            placeholder="masukkan nama rencana kinerja"
                                            value={field.value || namaRenja}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setNamaRenja(e.target.value);
                                            }}
                                        />
                                        {errors.nama_rencana_kinerja ?
                                            <h1 className="text-red-500">
                                                {errors.nama_rencana_kinerja.message}
                                            </h1>
                                            :
                                            <h1 className="text-slate-300 text-xs">*Nama Rencana Kinerja Harus Terisi</h1>
                                        }
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="catatan"
                            >
                                Catatan :
                            </label>
                            <Controller
                                name="catatan"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="catatan"
                                        placeholder="masukkan catatan jika ada"
                                        value={field.value || catatan}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setCatatan(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="status_rencana_kinerja"
                            >
                                Status Rencana Kinerja:
                            </label>
                            <Controller
                                name="status_rencana_kinerja"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            id="Status Rencana Kinerja"
                                            placeholder="pilih Status Rencana"
                                            value={statusRekin}
                                            options={statusOption}
                                            onChange={(option) => {
                                                setStatusRekin(option);
                                                field.onChange(option);
                                            }}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                })
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>

                        <label className="uppercase text-base font-bold text-gray-700 my-2">
                            indikator rencana kinerja :
                        </label>
                        {fields.map((field, index) => (
                            <div key={index} className="flex flex-col bg-gray-100 my-2 py-2 px-2 rounded-lg">
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
                                        className="w-[200px] mt-3"
                                    >
                                        Hapus
                                    </ButtonRedBorder>
                                )}
                            </div>
                        ))}
                        <ButtonSkyBorder
                            className="mb-3"
                            type="button"
                            disabled={Proses}
                            onClick={() => append({ nama_indikator: "", targets: [{ target: "", satuan: "" }] })}
                        >
                            Tambah Indikator
                        </ButtonSkyBorder>
                        <ButtonGreen type="submit" className="my-4" disabled={Proses}>
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonGreen>
                        <ButtonRed type="button" halaman_url="/rencanakinerja" disabled={Proses}>
                            Kembali
                        </ButtonRed>
                    </form>
                </div>
            }
        </>
    )
}

export const FormEditRencanaKinerja = () => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();
    const [namaRenja, setNamaRenja] = useState<string>('');
    const [statusRekin, setStatusRekin] = useState<OptionTypeString | null>(null);
    const [catatan, setCatatan] = useState<string>('');
    const [PreviewPohon, setPreviewPohon] = useState<boolean>(false);
    const [Pokin, setPokin] = useState<OptionType | null>(null);
    const [DetailPokin, setDetailPokin] = useState<pohon | null>(null);

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [DetailLoading, setDetailLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);

    const [isClient, setIsClient] = useState<boolean>(false);
    const params = useParams();
    const id = params.id as string;
    const [Tahun, setTahun] = useState<any>(null);
    const [User, setUser] = useState<any>(null);
    const [PokinOption, setPokinOption] = useState<OptionType[]>([]);
    const token = getToken();
    const router = useRouter();

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (data) {
            if (data.tahun) {
                const value_tahun = {
                    value: data.tahun.value,
                    label: data.tahun.label,
                }
                setTahun(value_tahun);
            }
        }
        setIsClient(true);
    }, []);

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    const fetchPokinByPelaksana = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/rencana_kinerja_pokin/pokin_by_pelaksana/${User?.nip}/${Tahun?.value}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Cannot fetch data');
            }
            const data = await response.json();
            const pokin = data.data.map((item: any) => ({
                value: item.id,
                label: item.nama_pohon,
            }));
            setPokinOption(pokin);
        } catch (err) {
            console.error("Failed to fetch Pokin options");
        } finally {
            setIsLoading(false);
        }
    };

    const statusOption: OptionTypeString[] = [
        { label: "aktif", value: "aktif" },
        { label: "tidak aktif", value: "tidak aktif" },
    ];

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchId = async () => {
            try {
                const response = await fetch(`${API_URL}/detail-rencana_kinerja/${id}`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                const result = await response.json();
                const data = result.rencana_kinerja;
                if (data) {
                    if (data.nama_rencana_kinerja) {
                        setNamaRenja(data.nama_rencana_kinerja);
                    }
                    if (data.catatan) {
                        setCatatan(data.catatan);
                    }
                    if (data.status_rencana_kinerja) {
                        const status = {
                            value: data.status_rencana_kinerja,
                            label: data.status_rencana_kinerja,
                        }
                        setStatusRekin(status);
                    }
                    if (data.id_pohon) {
                        const detail = {
                            value: data.id_pohon,
                            label: data.nama_pohon,
                        }
                        setPokin(detail);
                    }
                    
                    reset({
                        id_pohon: {
                            value: data.id_pohon,
                            label: data.nama_pohon,
                        },
                        nama_rencana_kinerja: data.nama_rencana_kinerja,
                        catatan: data.catatan,
                        status_rencana_kinerja: {
                            value: data.status_rencana_kinerja,
                            label: data.status_rencana_kinerja,
                        },
                        indikator: data.indikator?.map((item: indikator) => ({
                            id_indikator: item.id_indikator,
                            nama_indikator: item.nama_indikator,
                            targets: item.targets.map((t: target) => ({
                                target: t.target,
                                satuan: t.satuan,
                            })),
                        })),
                    });
                    if(data.indikator){
                        // Replace the fields to avoid duplication
                        replace(data.indikator.map((item: indikator) => ({
                            id_indikator: item.id_indikator,
                            nama_indikator: item.nama_indikator,
                            targets: item.targets,
                        })));
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchId();
    }, [id, replace, reset, token]);

    const fetchDetailPohon = async (id: number) => {
        setDetailLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${API_URL}/pohon_kinerja_opd/detail/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('gagal mendapatkan detail pohon dengan error !reponse.ok');
            }
            const result = await response.json();
            const data = result.data;
            if (data) {
                setDetailPokin(data);
            } else {
                setDetailPokin(null);
            }
        } catch (err) {
            console.log('gagal mendapatkan detail pohon, terdapat kesalahan backend server / koneksi internet');
        } finally {
            setDetailLoading(false);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            id_pohon: data.id_pohon?.value,
            nama_rencana_kinerja: data.nama_rencana_kinerja,
            status_rencana_kinerja: data.status_rencana_kinerja?.value,
            catatan: data.catatan,
            tahun: String(Tahun?.value),
            kode_opd: User?.kode_opd,
            pegawai_id: User?.nip,
            indikator: data.indikator ? 
                data.indikator.map((ind) => ({
                    id_indikator: ind.id_indikator,
                    nama_indikator: ind.nama_indikator,
                    target: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })) 
                : 
                []
        };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/rencana_kinerja/update/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const hasil = await response.json();
            if (hasil.code === 200) {
                AlertNotification("Berhasil", "Data rencana kinerja berhasil diperbarui", "success", 1000);
                router.push("/rencanakinerja");
            } else {
                AlertNotification("Gagal", "Terjadi kesalahan pada server", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "Cek koneksi internet / server bermasalah", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    return (
        <>
            {isClient &&
                <div className="border p-5 rounded-xl shadow-xl">
                    <h1 className="uppercase font-bold">Form Edit Rencana Kinerja :</h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="id_pohon"
                            >
                                Pohon :
                            </label>
                            <Controller
                                name="id_pohon"
                                control={control}
                                rules={{ required: "Pohon Harus Dipilih" }}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Masukkan Pohon"
                                            options={PokinOption}
                                            isLoading={IsLoading}
                                            isSearchable
                                            isClearable
                                            onMenuOpen={() => {
                                                if (User?.pegawai_id != undefined) {
                                                    fetchPokinByPelaksana();
                                                }
                                            }}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setPokin(option);
                                                setPreviewPohon(false);
                                            }}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                })
                                            }}
                                        />
                                        {errors.id_pohon ?
                                            <h1 className="text-red-500">
                                                {errors.id_pohon.message}
                                            </h1>
                                            :
                                            <h1 className="text-slate-300 text-xs">*Pohon Harus Dipilih</h1>
                                        }
                                    </>
                                )}
                            />
                        </div>
                        {(Pokin?.value != null || Pokin?.value != undefined) &&
                            <>
                                <div className="flex">
                                    <ButtonGreenBorder className="mb-2" type="button" onClick={() => {
                                        fetchDetailPohon(Pokin?.value);
                                        setPreviewPohon((prev) => !prev);
                                        console.log(DetailPokin);
                                    }}
                                    >
                                        {PreviewPohon ?
                                            <>
                                                <TbEye className="mr-2" />
                                                <p>Sembunyikan Detail Pohon</p>
                                            </>
                                            :
                                            <>
                                                <TbEyeClosed className="mr-2" />
                                                <p>Tampilkan Detail Pohon</p>
                                            </>
                                        }
                                    </ButtonGreenBorder>
                                </div>
                                {DetailLoading ?
                                    <LoadingClip />
                                    :
                                    PreviewPohon === true &&
                                    <div className="flex flex-col w-full justify-center items-center">
                                        <div
                                            className={`flex flex-col rounded-lg shadow-lg px-2
                                            ${DetailPokin?.jenis_pohon === "Strategic Pemda" && 'border'}
                                            ${DetailPokin?.jenis_pohon === "Tactical Pemda" && 'border'}
                                            ${DetailPokin?.jenis_pohon === "OperationalPemda" && 'border'}
                                            ${DetailPokin?.jenis_pohon === "Strategic" && 'bg-red-700'}
                                            ${DetailPokin?.jenis_pohon === "Tactical" && 'bg-blue-500'}
                                            ${DetailPokin?.jenis_pohon === "Operational" && 'bg-green-500'}
                                            ${DetailPokin?.jenis_pohon === "Operational N" && 'bg-white'}
                                            ${(DetailPokin?.jenis_pohon === "Strategic Crosscutting" || DetailPokin?.jenis_pohon === "Tactical Crosscutting" || DetailPokin?.jenis_pohon === "Operational Crosscutting" || DetailPokin?.jenis_pohon === "Operational N Crosscutting") && 'bg-yellow-700'}
                                        `}
                                        >
                                            <div
                                                className={`flex py-3 justify-center font-bold text-sm uppercase border my-3 rounded-lg bg-white
                                                ${DetailPokin?.jenis_pohon === "Strategic Pemda" && 'border-red-500 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                                                ${DetailPokin?.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                                                ${DetailPokin?.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                                                ${(DetailPokin?.jenis_pohon === "Strategic" || DetailPokin?.jenis_pohon === 'Strategic Crosscutting') && 'border-red-500 text-red-500'}
                                                ${(DetailPokin?.jenis_pohon === "Tactical" || DetailPokin?.jenis_pohon === 'Tactical Crosscutting') && 'border-blue-500 text-blue-500'}
                                                ${(DetailPokin?.jenis_pohon === "Operational" || DetailPokin?.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                                                ${(DetailPokin?.jenis_pohon === "Operational Crosscutting" || DetailPokin?.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                                            `}
                                            >
                                                {DetailPokin?.jenis_pohon}
                                            </div>
                                            <div className="mb-3">
                                                {DetailPokin &&
                                                    <TablePohon item={DetailPokin} />
                                                }
                                            </div>
                                        </div>
                                    </div>

                                }
                            </>
                        }
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_rencana_kinerja"
                            >
                                Rencana Kinerja :
                            </label>
                            <Controller
                                name="nama_rencana_kinerja"
                                control={control}
                                rules={{ required: "Nama Rencana Kinerja harus terisi" }}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="nama_rencana_kinerja"
                                            type="text"
                                            placeholder="masukkan nama rencana kinerja"
                                            value={field.value}
                                            onChange={(e) => {
                                                field.onChange(e);
                                            }}
                                        />
                                        {errors.nama_rencana_kinerja ?
                                            <h1 className="text-red-500">
                                                {errors.nama_rencana_kinerja.message}
                                            </h1>
                                            :
                                            <h1 className="text-slate-300 text-xs">*Nama Rencana Kinerja Harus Terisi</h1>
                                        }
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="catatan"
                            >
                                Catatan :
                            </label>
                            <Controller
                                name="catatan"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="catatan"
                                        placeholder="masukkan catatan jika ada"
                                        value={field.value}
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="status_rencana_kinerja"
                            >
                                Status Rencana Kinerja:
                            </label>
                            <Controller
                                name="status_rencana_kinerja"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            id="Status Rencana Kinerja"
                                            placeholder="pilih Status Rencana"
                                            options={statusOption}
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                })
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>

                        <label className="uppercase text-base font-bold text-gray-700 my-2">
                            indikator rencana kinerja :
                        </label>
                        {fields.map((field, index) => (
                            <div key={index} className="flex flex-col bg-gray-100 my-2 py-2 px-2 rounded-lg">
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
                                        className="w-[200px] mt-3"
                                    >
                                        Hapus
                                    </ButtonRedBorder>
                                )}
                            </div>
                        ))}
                        <ButtonSkyBorder
                            className="mb-3"
                            type="button"
                            disabled={Proses}
                            onClick={() => append({ nama_indikator: "", targets: [{ target: "", satuan: "" }] })}
                        >
                            Tambah Indikator
                        </ButtonSkyBorder>
                        <ButtonGreen type="submit" className="my-4" disabled={Proses}>
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonGreen>
                        <ButtonRed type="button" halaman_url="/rencanakinerja" disabled={Proses}>
                            Kembali
                        </ButtonRed>
                    </form>
                </div>
            }
        </>
    )
}