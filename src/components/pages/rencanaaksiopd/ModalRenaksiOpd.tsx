'use client'

import React, { useEffect, useState } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification, AlertQuestion2 } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import Select from 'react-select';

interface OptionType {
    value: number;
    label: string;
}
interface modal {
    metode: "baru" | "lama";
    isOpen: boolean;
    onClose: () => void;
    id?: number;
    id_rekin: string;
    id_sasaran?: number;
    rekin: string;
    kode_opd: string;
    indikator: indikator[];
    tahun: string;
    onSuccess: () => void;
}
interface FormValue {
    id_renaksi: OptionType;
    catatan: string;
}
interface indikator {
    id: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: {
        id: string;
        indikator_id: string;
        tahun: string;
        target: string;
        satuan: string;
    }
}
interface target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}
interface rekin {
    id_rencana_kinerja: string;
    id_pohon: number;
    nama_pohon: string;
    nama_rencana_kinerja: string;
    tahun: string;
    status_rencana_kinerja: string;
    catatan: string;
    operasional_daerah: {
        kode_opd: string;
        nama_opd: string;
    };
}

export const ModalRenaksiOpd: React.FC<modal> = ({ isOpen, onClose, onSuccess, metode, id, id_sasaran, id_rekin, rekin, kode_opd, indikator, tahun }) => {

    const {
        control,
        handleSubmit,
    } = useForm<FormValue>();

    const [Catatan, setCatatan] = useState<string>('');
    const [Renaksi, setRenaksi] = useState<OptionType | null>(null);
    const [RenaksiOption, setRenaksiOption] = useState<OptionType[]>([]);

    const [Proses, setProses] = useState<boolean>(false);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [LoadingDetail, setLoadingDetail] = useState<boolean>(false);
    const token = getToken();

    const handleClose = () => {
        onClose();
        setRenaksi(null);
        setCatatan('');
    }

    useEffect(() => {
        const fetchDetailRenaksiOpd = async () => {
            const API_URL_RENAKSI_OPD = process.env.NEXT_PUBLIC_API_URL_RENAKSI_OPD;
            try {
                setLoadingDetail(true);
                const response = await fetch(`${API_URL_RENAKSI_OPD}/renaksi-opd/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.data;
                // console.log(hasil);
                if (hasil.keterangan) {
                    setCatatan(hasil.keterangan);
                }
                if (hasil.id_renaksiopd) {
                    const rekin = {
                        value: hasil.rekin_id,
                        label: hasil.nama_rencana_kinerja,
                    }
                    setRenaksi(rekin);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoadingDetail(false);
            }
        };
        if(metode === 'lama'){
            fetchDetailRenaksiOpd();
        }
    }, [id, token, metode]);


    const fetchOptionRekin = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/rencana_kinerja_level3/${kode_opd}/${tahun}`, {
                headers: {
                    "Authorization": `${token}`
                }
            });
            const result = await response.json();
            const data = result.rencana_kinerja;
            if (result.code === 200) {
                const rekin = data.map((s: rekin) => ({
                    value: s.id_rencana_kinerja,
                    label: s.nama_rencana_kinerja,
                }));
                setRenaksiOption(rekin);
            } else {
                console.log("code: ", result.code, "data: ", result.data);
                setRenaksiOption([]);
            }
        } catch (err) {
            console.log("error saat fetch option rekin level 3", err);
        } finally {
            setIsLoading(false);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL_RENAKSI_OPD = process.env.NEXT_PUBLIC_API_URL_RENAKSI_OPD;
        const formDataNew = {
            //key : value
            sasaranopd_id: id_sasaran,
            rekin_id: Renaksi?.value,
            tahun: tahun,
            keterangan: Catatan
        };
        const formDataEdit = {
            //key : value
            id: id,
            rekin_id: Renaksi?.value,
            keterangan: Catatan
        };
        const getBody = () => {
            if (metode === "baru") return formDataNew;
            if (metode === "lama") return formDataEdit;
            return {}; // Default jika metode tidak sesuai
        };
        // metode === 'baru' && console.log("baru :", formDataNew);
        // metode === 'lama' && console.log("lama :", formDataEdit);
        try {
            let url = "";
            if (metode === "lama") {
                url = `rencana-aksi-opd/update/${id}`;
            } else if (metode === "baru") {
                url = `rencana-aksi-opd/create`;
            } else {
                url = '';
            }
            setProses(true);
            const response = await fetch(`${API_URL_RENAKSI_OPD}/${url}`, {
                method: metode === 'lama' ? "PUT" : "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(getBody()),
            });
            const result = await response.json();
            if (result.code === 201 || result.code === 200) {
                AlertNotification("Berhasil", `Berhasil ${metode === 'baru' ? "Menambahkan" : "Mengubah"} Renaksi OPD`, "success", 1000);
                onClose();
                onSuccess();
            } else if (result.code === 500) {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server dengan response !ok", "error", 2000);
                console.error(result);
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
                    >
                        <div className="w-max-[500px] py-2 mb-2 border-b-2 border-gray-300 text-center uppercase font-bold">
                            {metode === "baru" ? "Tambah" : "Edit"} Rencana Aksi OPD
                        </div>
                        <div className="flex flex-col pt-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_pohon"
                            >
                                Rencana Kinerja OPD
                            </label>
                            <div className="border px-4 py-2 rounded-lg bg-gray-200">{rekin || "-"}</div>
                        </div>
                        {indikator.length != 0 ?
                            indikator.map((i: indikator, index_indikator: number) => (
                                <React.Fragment key={index_indikator}>
                                    <div className="flex flex-col justify-center">
                                        <label
                                            className="uppercase text-xs font-bold text-gray-700 my-2"
                                            htmlFor="nama_pohon"
                                        >
                                            indikator ke {index_indikator + 1}
                                        </label>
                                        <div className="border px-4 py-2 rounded-lg bg-gray-200">{i.indikator || "-"}</div>
                                        <div className="flex flex-wrap w-full gap-2 pt-2">
                                            <div className="border px-4 py-2 rounded-lg bg-gray-200">{i.target.target || "-"}</div>
                                            <div className="border px-4 py-2 rounded-lg bg-gray-200">{i.target.satuan || "-"}</div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))
                            :
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="nama_pohon"
                                >
                                    Indikator
                                </label>
                                <div className="border px-4 py-2 rounded-lg italic">tidak ada indikator</div>
                            </div>
                        }
                        <div className="flex flex-col justify-center pr-2 pb-5">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="id_renaksi"
                            >
                                Rencana Aksi OPD
                            </label>
                            <Controller
                                name="id_renaksi"
                                control={control}
                                render={({ field }) => (
                                    <React.Fragment>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Rencana Aksi OPD"
                                            value={Renaksi}
                                            options={RenaksiOption}
                                            isLoading={IsLoading}
                                            isSearchable
                                            isClearable
                                            // menuShouldBlockScroll={true}
                                            // menuPlacement="top"
                                            menuPortalTarget={document.body} // Render menu ke document.body
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setRenaksi(option);
                                            }}
                                            onMenuOpen={() => {
                                                if (RenaksiOption.length === 0) {
                                                    fetchOptionRekin();
                                                }
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
                                    </React.Fragment>
                                )}
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="catatan"
                            >
                                Keterangan :
                            </label>
                            <Controller
                                name="catatan"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <textarea
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="catatan"
                                            placeholder="masukkan Catatan"
                                            value={Catatan}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setCatatan(e.target.value);
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <ButtonSky type="submit" className="w-full my-3 gap-1" disabled={Proses}>
                            {Proses ?
                                <>
                                    <LoadingButtonClip />
                                    <span>menyimpan</span>
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