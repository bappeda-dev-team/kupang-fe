'use client'

import React, { useState } from "react";
import { TbDeviceFloppy, TbX, TbLayersSelected } from "react-icons/tb";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import Select from 'react-select';
import { OptionTypeString } from "@/types";
import { useBrandingContext } from "@/context/BrandingContext";

interface modal {
    isOpen: boolean;
    Data: Rekin | null;
    onClose: () => void;
}

interface Rekin {
    id_rencana_kinerja: string;
    id_pohon: number;
    nama_pohon: string;
    nama_rencana_kinerja: string;
    tahun: string;
    status_rencana_kinerja: string;
    catatan: string;
    operasional_daerah: opd;
    pegawai_id: string;
    nama_pegawai: string;
    indikator: indikator[];
}
interface indikator {
    id_indikator: string,
    rencana_kinerja_id: string,
    nama_indikator: string,
    targets: target[]
}
interface target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}
interface opd {
    kode_opd: string;
    nama_opd: string;
}

interface FormValue {
    id_rencana_kinerja: string;
    nip: string;
    tahun_asli: string;
    tahun_clone: OptionTypeString | null;
}

export const ModalCloneRekin: React.FC<modal> = ({ isOpen, onClose, Data }) => {

    const [Proses, setProses] = useState<boolean>(false);
    const { branding } = useBrandingContext();
    const token = getToken();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            id_rencana_kinerja: Data?.id_rencana_kinerja || "",
            nip: branding?.user?.nip || "",
            tahun_asli: Data?.tahun || String(branding?.tahun?.value),
            tahun_clone: null,
        }
    });

    const handleClose = () => {
        onClose();
        reset();
    }

    const tahunOption = [
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

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        // const payload = {
        //     //key : value
        //     id_rencana_kinerja: Data?.id_rencana_kinerja,
        //     nip: Data?.pegawai_id ?? branding?.user.nip,
        //     tahun_asli: Data?.tahun,
        //     tahun_clone: data.tahun_clone
        // };
        if (Data?.tahun === data.tahun_clone?.value) {
            AlertNotification("Tahun Sama", "Tahun asli dengan tahun tujuan clone tidak boleh sama", "warning", 2000);
        } else {
            // AlertNotification("Dalam Pengembangan", "", "info", 2000);
            try {
                setProses(true);
                const response = await fetch(`${branding?.api_perencanaan}/rencana_kinerja/clone/${Data?.id_rencana_kinerja}/${data.tahun_clone?.value}`, {
                    method: "POST",
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                    // body: JSON.stringify(payload),
                });
                const result = await response.json();
                if(result.code === 200){
                    AlertNotification("Berhasil", `Berhasil clone rencana kinerja dari tahun ${Data?.tahun || branding?.tahun?.value} ke tahun ${data?.tahun_clone?.value}`, "success", 3000);
                    handleClose();
                } else {
                    AlertNotification("Gagal", `${result.data || "terdapat kesalahan pada backend / database server, cek koneksi internet atau hubungi tim developer"}`, "error", 2000);
                    console.log(result);
                }
            } catch (err) {
                AlertNotification("Error", "terdapat kesalahan pada backend / database server, cek koneksi internet atau hubungi tim developer", "error", 2000);
                console.error(err);
            } finally {
                setProses(false);
            }
        }
    }

    if (!isOpen) {
        return null;
    } else {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 max-h-[80%] text-start overflow-auto`}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-max-[500px] flex items-center gap-1 justify-center py-2 mb-2 border-b-2 border-gray-300 text-center uppercase font-bold">
                            <TbLayersSelected />
                            Clone Rencana Kinerja
                        </div>
                        <div className="flex flex-col justify-center pr-2 pb-5">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2 flex items-center gap-1">
                                Tahun Tujuan Clone {errors.tahun_clone && <p className="text-red-500">{errors.tahun_clone.message}</p>}
                            </label>
                            <Controller
                                name="tahun_clone"
                                control={control}
                                rules={{ required: "wajib terisi" }}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Tahun Tujuan Clone"
                                            options={tahunOption}
                                            isSearchable
                                            isClearable
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                    textAlign: 'start',
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base, zIndex: 9999
                                                })
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold text-blue-500">Detail Rencana Kinerja yang akan di clone :</h1>
                            <TableRekin Data={Data} />
                        </div>
                        <div className="mt-3">
                            <h1 className="italic font-light text-sm">*rencana kinerja yang sudah berhasil di clone dapat disambungkan dengan pohon yang berbeda dengan tahun {Number(Data?.tahun) || branding?.tahun?.value}</h1>
                            </div>
                        <div className="flex flex-col gap-1 mt-3">
                            <ButtonSky type="submit" className="w-full" disabled={Proses}>
                                {Proses ?
                                    <div className="flex items-center gap-1">
                                        <LoadingButtonClip />
                                        <span>Cloning</span>
                                    </div>
                                    :
                                    <div className="flex items-center gap-1">
                                        <TbDeviceFloppy />
                                        <span>Clone</span>
                                    </div>
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

interface TableRekin {
    Data: Rekin | null;
}
export const TableRekin: React.FC<TableRekin> = ({ Data }) => {
    return (
        <table className="w-full">
            <tbody>
                {Data === null ?
                    <tr>
                        <td className="px-6 py-3" colSpan={5}>
                            Data Rekin Kosong
                        </td>
                    </tr>
                    :
                    <>
                        <tr>
                            <td className="px-2 py-2 border border-blue-500 bg-blue-100">Rencana Kinerja </td>
                            <td className="px-2 py-2 border border-blue-500 bg-blue-100">{Data?.nama_rencana_kinerja || "-"}</td>
                        </tr>
                        <tr>
                            <td className="px-2 py-2 border border-blue-500">OPD </td>
                            <td className="px-2 py-2 border border-blue-500">{Data?.operasional_daerah.nama_opd || "-"}</td>
                        </tr>
                        <tr>
                            <td className="px-2 py-2 border border-blue-500">ASN </td>
                            <td className="px-2 py-2 border border-blue-500">{Data?.nama_pegawai || "-"}</td>
                        </tr>
                        <tr>
                            <td className="px-2 py-2 border border-blue-500">NIP </td>
                            <td className="px-2 py-2 border border-blue-500">{Data?.pegawai_id || "-"}</td>
                        </tr>
                        <tr>
                            <td className="px-2 py-2 border border-blue-500">Tahun </td>
                            <td className="px-2 py-2 border border-blue-500">{Data?.tahun || "-"}</td>
                        </tr>
                        {Data?.indikator ?
                            Data?.indikator.map((i: indikator, index: number) => (
                                <React.Fragment key={i.id_indikator}>
                                    <tr>
                                        <td className="px-2 py-2 border border-blue-500 bg-blue-100">Indikator {index + 1}</td>
                                        <td className="px-2 py-2 border border-blue-500 bg-blue-100">{i.nama_indikator || "-"}</td>
                                    </tr>
                                    {i.targets.map((t: target) => (
                                        <tr key={t.id_target}>
                                            <td className="px-2 py-2 border border-blue-500">Target/Satuan</td>
                                            <td className="px-2 py-2 border border-blue-500">{t.target || "-"} / {t.satuan || "-"}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                            :
                            <>
                                <tr>
                                    <td className="px-2 py-2 border border-blue-500">Indikator </td>
                                    <td className="px-2 py-2 border border-blue-500 italic">kosong</td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-2 border border-blue-500">Target/Satuan </td>
                                    <td className="px-2 py-2 border border-blue-500 italic">kosong</td>
                                </tr>
                            </>
                        }
                        <tr>
                            <td className="px-2 py-2 border border-blue-500">Catatan </td>
                            <td className="px-2 py-2 border border-blue-500">{Data?.catatan || "-"}</td>
                        </tr>
                    </>
                }
            </tbody>
        </table>
    )
}