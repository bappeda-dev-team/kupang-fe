'use client'

import { useEffect, useState } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from "@/components/global/Button";
import { AlertNotification } from "@/components/global/Alert";
import { LoadingButtonClip } from "@/components/global/Loading";
import { GetResponseFindallJabatan, FormValue } from "../type";
import { OptionTypeString } from "@/types";
import { useBrandingContext } from "@/context/BrandingContext";
import { getToken } from "@/components/lib/Cookie";

interface modal {
    jenis: "tambah" | "edit";
    nama_opd: string;
    kode_opd: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: GetResponseFindallJabatan | null
}

export const ModalMasterJabatan: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data, nama_opd, kode_opd }) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            id: Data?.id,
            nama_jabatan: Data?.nama_jabatan,
            kode_jabatan: Data?.kode_jabatan,
            kode_opd: Data?.operasional_daerah ? {
                value: Data?.operasional_daerah.kode_opd,
                label: Data?.operasional_daerah.kode_opd,
            }
                : null,
        }
    });

    const [Proses, setProses] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);

    const [OptionOpd, setOptionOpd] = useState<OptionTypeString[]>([]);

    const { branding } = useBrandingContext();
    const token = getToken();

    const handleClose = () => {
        onClose();
        reset();
    }

    useEffect(() => {
        const fetchOpd = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${branding?.api_perencanaan}/opd/findall`, {
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
                setOptionOpd(opd);
            } catch (err) {
                console.log('gagal mendapatkan data opd');
            } finally {
                setLoading(false);
            }
        };
        fetchOpd();
    }, [branding])

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            nama_jabatan: data.nama_jabatan,
            kode_jabatan: data.kode_jabatan,
            kode_opd: kode_opd,
        };
        // console.log(formData);
        let url = ''
        if (jenis === "tambah") {
            url = `${branding?.api_perencanaan}/jabatan/create`
        } else {
            url = `${branding?.api_perencanaan}/jabatan/update/${Data?.id}`
        }
        try {
            setProses(true);
            const response = await fetch(url, {
                method: jenis === "tambah" ? "POST" : "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil edit data jabatan", "success", 1000);
                onClose();
                reset();
                onSuccess();
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 max-h-[80%] text-start overflow-auto`}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="border-b">
                            <h1 className="text-xl font-semibold uppercase text-center">{jenis} Jabatan</h1>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_opd"
                            >
                                Perangkat Daerah
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{nama_opd || ""}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Nama Jabatan : {errors.nama_jabatan && "wajib diisi"}
                            </label>
                            <Controller
                                name="nama_jabatan"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="nama_jabatan"
                                        type="text"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan Nama Jabatan"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Kode Jabatan : {errors.kode_jabatan && "wajib diisi"}
                            </label>
                            <Controller
                                name="kode_jabatan"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="kode_jabatan"
                                        type="text"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan Kode Jabatan"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-1 mt-3">
                            <ButtonSky type="submit" className="w-full" disabled={Proses}>
                                {Proses ?
                                    <>
                                        <LoadingButtonClip />
                                        <span>menyimpan..</span>
                                    </>
                                    :
                                    <>
                                        <TbDeviceFloppy />
                                        <span>Simpan</span>
                                    </>
                                }
                            </ButtonSky>
                            <ButtonRed className="flex items-center gap-1 w-full" onClick={handleClose} disabled={Proses}>
                                <TbX />
                                Batal
                            </ButtonRed>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}