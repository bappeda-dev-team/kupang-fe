'use client'
import React, { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { ButtonRedBorder, ButtonGreenBorder } from "@/components/global/Button"
import { TbCircleX, TbDeviceFloppy } from "react-icons/tb"
import { useBrandingContext } from "@/context/BrandingContext"
import { AlertNotification } from "@/components/global/Alert"
import { Childs } from "./TablePermasalahan"

interface FormPermasalahan {
    data?: Childs;
    rowSpan: number;
    jenis: "edit" | "baru" | "";
    editing: () => void;
}
interface Childs {
    id: number;
    id_permasalahan: number;
    nama_pohon: string;
    level_pohon: number;
    perangkat_daerah: {
        kode_opd: string;
        nama_opd: string;
    }
    is_permasalahan: boolean;
    jenis_masalah: string;
}
interface FormValue {
    pokin_id: number;
    permasalahan: string;
    level_pohon: number;
    jenis_masalah: string;
    kode_opd: string;
    nama_opd: string;
    tahun: string;
}

export const FormPermasalahan: React.FC<FormPermasalahan> = ({ data, jenis, rowSpan, editing }) => {

    const { branding } = useBrandingContext();
    const branding_tahun = branding?.tahun ? branding?.tahun?.value : 0;
    const [Proses, setProses] = useState<boolean>(false);
    const [Success, setSuccess] = useState<boolean>(false);
    const [DataResult, setDataResult] = useState<any>(null);

    const { control, reset, handleSubmit } = useForm<FormValue>({
        defaultValues: {
            pokin_id: data?.id || 0,
            permasalahan: data?.nama_pohon || "-",
            level_pohon: data?.level_pohon || 0,
            jenis_masalah: data?.jenis_masalah || "-",
            kode_opd: branding?.opd?.value,
            tahun: String(branding?.tahun?.value)
        }
    })

    const onSubmit: SubmitHandler<FormValue> = async (dataForm) => {
        const formData = {
            ...(jenis === "baru" && {
                pokin_id: data?.id,
            }),
            ...(jenis === "edit" && {
                id: data?.id_permasalahan,
            }),
            permasalahan: dataForm.permasalahan,
            level_pohon: data?.level_pohon,
            jenis_masalah: data?.level_pohon === 4 ? "MASALAH_POKOK" :
                data?.level_pohon === 5 ? "MASALAH" :
                    data?.level_pohon === 6 ? "AKAR_MASALAH" : "",
            kode_opd: branding?.opd?.value,
            tahun: String(branding?.tahun?.value),
        }
        // console.log(formData);
        try {
            setProses(true);
            let url = '';
            if (jenis === 'baru') {
                url = `permasalahan`
            } else if (jenis === 'edit') {
                url = `permasalahan/${data?.id_permasalahan}`
            }
            const response = await fetch(`${branding?.api_permasalahan}/${url}`, {
                method: jenis === "baru" ? "POST" : "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200) {
                setSuccess(true);
                setDataResult(result.data);
                AlertNotification("Berhasil", `data permasalahan berhasil di simpan`, "success", 1000);
            } else {
                setSuccess(false);
                setDataResult(null);
                AlertNotification("Gagal", `${result.data}`, "error", 5000, true);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setProses(false);
        }
    }

    const handleClose = () => {
        reset();
        editing();
    }

    return (
        <React.Fragment>
            {Success && DataResult ?
                <Childs
                    data={DataResult}
                    rowSpan={rowSpan}
                    tahun={branding_tahun}
                />
                :
                <td rowSpan={rowSpan} colSpan={2} className="border-r border-b border-black px-6 py-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="permasalahan"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    id="permasalahan"
                                    className="w-full p-3 rounded-lg mb-3 border border-black"
                                />
                            )}
                        />
                        <div className="flex justify-center items-center gap-2">
                            <ButtonGreenBorder
                                className="w-full"
                                type="submit"
                            >
                                <TbDeviceFloppy className="mr-1" />
                                {jenis === "baru" ?
                                    "Simpan"
                                    :
                                    "Edit"
                                }
                            </ButtonGreenBorder>
                            <ButtonRedBorder 
                                className="w-full"
                                type="button"
                                onClick={handleClose}
                            >
                                <TbCircleX className="mr-1" />
                                Batal
                            </ButtonRedBorder>
                        </div>
                    </form>
                </td>
            }
        </React.Fragment>
    )
}