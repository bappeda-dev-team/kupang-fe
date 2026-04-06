'use client'

import { ButtonSky, ButtonRedBorder } from "@/components/global/Button";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';
import React, { useState, useEffect } from "react";
import { LoadingSync, LoadingButtonClip } from "@/components/global/Loading";
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { TbCirclePlus, TbTrash } from "react-icons/tb";

interface table {
    id: string;
    tahun: string;
    nip: string;
    kode_opd: string;
}
interface OptionTypeSk {
    value: string;
    label: string;
    kode: string;
}
interface subkegiatan {
    subkegiatanterpilih_id: string;
    id: string;
    rekin_id: string;
    status: string;
    nama_sub_kegiatan: string;
    kode_opd: string;
    tahun: string;
    indikator: indikator[];
}
interface indikator {
    id_indikator: string;
    nama_indikator: string;
    targets: targets[];
}
interface targets {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}
interface formValue {
    sub_kegiatan: OptionTypeSk;
}

const SubKegiatan: React.FC<table> = ({ id, tahun, kode_opd, nip }) => {

    const { control, handleSubmit } = useForm<formValue>();

    const [subKegiatan, setSubKegiatan] = useState<subkegiatan[]>([]);
    const [InputSubKegiatan, setInputSubKegiatan] = useState<OptionTypeSk | null>(null);
    const [OptionSubKegiatan, setOptionSubKegiatan] = useState<OptionTypeSk[]>([]);

    const [Loading, setLoading] = useState<boolean>(false);
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    
    const [Proses, setProses] = useState<boolean>(false);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchSubKegiatan = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/rencana_kinerja/${id}/pegawai/${nip}/input_rincian_kak`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.rencana_kinerja;
                if (hasil) {
                    const data = hasil.find((item: any) => item.subkegiatan);
                    if (data == null) {
                        setDataNull(true);
                        setSubKegiatan([]);
                    } else {
                        setDataNull(false);
                        setSubKegiatan(data.subkegiatan);
                    }
                } else {
                    setDataNull(true);
                    setSubKegiatan([]);
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        if (nip != undefined) {
            fetchSubKegiatan();
        }
    }, [id, nip, token, Deleted]);

    const fetchOptionSubKegiatan = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setLoadingOption(true);
            const response = await fetch(`${API_URL}/subkegiatanopd/findall/${kode_opd}/${tahun}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error("terdapat kesalahan pada endpoint backend");
            }
            const hasil = await response.json();
            const data = hasil.data;
            if (data.length === 0) {
                console.log("data sub kegiatan kosong / belum ditambahkan di menu subkegaitan opd");
            } else {
                const hasilData = data.map((sk: any) => ({
                    value: sk.id,
                    label: `${sk.kode_subkegiatan} - ${sk.nama_subkegiatan}`,
                    kode: sk.kode_subkegiatan,
                }));
                setOptionSubKegiatan(hasilData);
            }
        } catch (err) {
            console.log("gagal mendapatkan data sub kegiatan, periksa endpoint backend atau internet server");
            console.log("tahun", tahun, "kode_opd", kode_opd);
        } finally {
            setLoadingOption(false);
        }
    }

    const onSubmit: SubmitHandler<formValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            id: data.sub_kegiatan?.value,
            kode_subkegiatan: data.sub_kegiatan?.kode,
        }
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/sub_kegiatan/create_rekin/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "menambahkan sub kegiatan ke rencana kinerja", "success", 2000);
                setInputSubKegiatan(null);
                setDeleted((prev) => !prev);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada endpoint backend / internet server", "error", 2000);
            }
        } catch (err) {
            console.log(err);
            AlertNotification("Gagal", "cek koneksi internet / database server", "success", 2000);
        } finally {
            setProses(false);
        }
    }

    const hapusSubKegiatan = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/sub_kegiatan/delete_subkegiatan_terpilih/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("response !ok ketika gagal hapus sub kegiatan");
            }
            setSubKegiatan(subKegiatan.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Sub Kegiatan Berhasil Dihapus", "success", 1000);
            setDeleted((prev) => !prev);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    if (Loading) {
        return (
            <>
                <div className="mt-3 rounded-t-xl border px-5 py-3">
                    <h1 className="font-bold">Sub Kegiatan</h1>
                </div>
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <LoadingSync />
                </div>
            </>
        );
    }

    return (
        <>
            {/* usulan subkegiatan */}
            <div className="mt-3 rounded-t-xl border px-5 py-3">
                <h1 className="font-bold">Sub Kegiatan</h1>
            </div>
            <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                {dataNull === true &&
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="my-2">
                            <Controller
                                name="sub_kegiatan"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        id="sub_kegiatan"
                                        isClearable
                                        isLoading={LoadingOption}
                                        value={InputSubKegiatan}
                                        options={OptionSubKegiatan}
                                        noOptionsMessage={() => `Kosong, Sub Kegiatan tahun ${tahun} belum ditambahkan di Perencanaan OPD`}
                                        onMenuOpen={fetchOptionSubKegiatan}
                                        onMenuClose={() => setOptionSubKegiatan([])}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            setInputSubKegiatan(option);
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                marginTop: '4px'
                                            }),
                                            menuPortal: (base) => ({ 
                                                ...base, zIndex: 9999 
                                            })
                                        }}
                                        placeholder={"Pilih sub kegiatan"}
                                    />
                                )}
                            />
                        </div>
                        <ButtonSky type="submit" className="w-full mt-2" disabled={Proses}>
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menambahkan...
                                </span>
                                :
                                <span className="flex items-center">
                                    <TbCirclePlus className='mr-1' />
                                    Tambahkan
                                </span>
                            }
                        </ButtonSky>
                    </form>
                }
                <div className="overflow-auto mt-3 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-300">
                                <td className="border-r border-b px-6 py-3 min-w-[200px] text-center">Sub Kegiatan</td>
                                <td colSpan={2} className="border-r border-b px-6 py-3 min-w-[200px] text-center">Aksi</td>
                            </tr>
                        </thead>
                        <tbody>
                            {dataNull ?
                                <tr>
                                    <td className="px-6 py-3" colSpan={10}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                                :
                                subKegiatan.map((data: any) => (
                                    <React.Fragment key={data.id}>
                                        <tr>
                                            <td className="border-r border-b px-6 py-3 min-w-[200px]">{data.kode_subkegiatan || ""} - {data.nama_sub_kegiatan || "-"}</td>
                                            <td colSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">
                                                <ButtonRedBorder
                                                    className="w-full"
                                                    disabled={Proses}
                                                    onClick={() => {
                                                        AlertQuestion("Hapus?", "Hapus Sub Kegiatan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                            if (result.isConfirmed) {
                                                                hapusSubKegiatan(data.subkegiatanterpilih_id);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    {Proses ? 
                                                        <span className="flex">
                                                            <LoadingButtonClip />
                                                            Menghapus...
                                                        </span>
                                                    :
                                                        <span className="flex items-center">
                                                            <TbTrash className="mr-2" />
                                                            Hapus
                                                        </span>
                                                    }
                                                </ButtonRedBorder>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default SubKegiatan;