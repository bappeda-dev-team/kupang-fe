'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification, AlertQuestion2 } from "@/components/global/Alert";
import { getOpdTahun, getToken } from "@/components/lib/Cookie";
import Select from 'react-select';
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { LoadingButtonClip } from "@/components/global/Loading";

interface OptionTypeString {
    value: string;
    label: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}
interface FormValue {
    tahun: string;
    kelompok: OptionTypeString;
}

export const ModalKelompokAnggaran: React.FC<modal> = ({ isOpen, onClose, onSuccess }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();

    const [Kelompok, setKelompok] = useState<OptionTypeString | null>(null);
    const [Tahun, setTahun] = useState<number | null>(null);

    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    const KelompokOption = [
        { label: "Murni", value: "murni" },
        { label: "Perubahan", value: "perubahan" }
    ];

    const handleClose = () => {
        setTahun(null);
        setKelompok(null);
        onClose();
    }

    const onSubmit: SubmitHandler<FormValue> = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            tahun: String(Tahun),
            kelompok: Kelompok?.value
        };
        // console.log(formData);
        if(Kelompok?.value === undefined){
            AlertNotification("Jenis Tahun Anggaran", `Jenis Tahun Anggaran wajib dipilih`, "warning", 2000);
        } else if(Tahun === null){
            AlertNotification("Tahun", `Tahun wajib terisi`, "warning", 2000);
        } else {
            try {
                setProses(true);
                const response = await fetch(`${API_URL}/kelompok_anggaran/create`, {
                    method: "POST",
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                const result = await response.json();
                if (result.code === 201 || result.code === 200) {
                    AlertNotification("Berhasil", `Berhasil menambahkan kelompok tahun anggaran`, "success", 1000);
                    onClose();
                    onSuccess();
                } else if (result.code === 400) {
                    AlertNotification("Gagal", `${result.data}`, "error", 2000);
                    console.log(result);
                }
            } catch (err) {
                AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            } finally {
                setProses(false);
            }
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
                    >
                        <div className="w-max-[500px] py-2 mb-2 border-b-2 border-gray-300 text-center uppercase font-bold">
                            Tambah Tahun Kelompok Anggaran
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
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="tahun"
                                        placeholder="masukkan tahun"
                                        value={Tahun == null ? "" : Tahun}
                                        inputMode="numeric"
                                        type="number"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setTahun(Number(e.target.value));
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col justify-center pr-2 pb-5">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kelompok"
                            >
                                Jenis Tahun Anggaran
                            </label>
                            <Controller
                                name="kelompok"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Jenis Kelompok Tahun Anggaran"
                                            value={Kelompok}
                                            options={KelompokOption}
                                            isSearchable
                                            isClearable
                                            menuPortalTarget={document.body} // Render menu ke document.body
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setKelompok(option);
                                            }}
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
                        <ButtonSky type="submit" className="flex items-center gap-1 w-full my-3" disabled={Proses}>
                            {Proses ? 
                                <>
                                    <LoadingButtonClip />
                                    <span>Menyimpan</span>
                                </>
                            :
                                <>
                                    <TbDeviceFloppy />
                                    <span>Simpan</span>
                                </>
                            }
                        </ButtonSky>
                        <ButtonRed className="flex items-center gap-1 w-full my-3" onClick={handleClose} disabled={Proses}>
                            <TbX />
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}