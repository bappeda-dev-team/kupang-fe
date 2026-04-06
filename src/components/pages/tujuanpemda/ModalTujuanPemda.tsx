'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import Select from 'react-select';

interface OptionType {
    value: number;
    label: string;
}

interface FormValue {
    id: number;
    tujuan_pemda: string;
    visi: OptionType;
    misi: OptionType;
    tema_id: number;
    periode_id: number;
    indikator: indikator[];
}
interface indikator {
    id_indikator?: string;
    indikator: string;
    definisi_operasional: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: target[];
}
type target = {
    target: string;
    satuan: string;
    tahun?: string;
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    metode: 'lama' | 'baru';
    id?: number; // id tujuan pemda
    tema_id?: number; //id tematik
    periode: number; // id periode
    tahun: number;
    jenis_periode: string;
    tahun_list: string[]; // tahun value header
    onSuccess: () => void;
}

interface Periode {
    id: number;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    tahun_list: string[];
}


export const ModalTujuanPemda: React.FC<modal> = ({ isOpen, onClose, id, tema_id, periode, jenis_periode, metode, tahun, tahun_list, onSuccess }) => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();

    const token = getToken();

    const [TujuanPemda, setTujuanPemda] = useState<string>('');
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Visi, setVisi] = useState<OptionType | null>(null);
    const [Misi, setMisi] = useState<OptionType | null>(null);
    
    const [VisiOption, setVisiOption] = useState<OptionType[]>([]);
    const [MisiOption, setMisiOption] = useState<OptionType[]>([]);

    const [Proses, setProses] = useState<boolean>(false);
    const [IsLoading, setIsLoading] = useState<boolean>(false);

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    const handleTambahIndikator = () => {
        const defaultTarget = Array(5).fill({ target: '', satuan: '' }); // Buat array 5 target kosong
        append({ indikator: '', definisi_operasional: "", rumus_perhitungan: '', sumber_data: '', target: defaultTarget });
    };

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const fetchDetailTujuan = async () => {
            try {
                const response = await fetch(`${API_URL}/tujuan_pemda/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.data;

                if (hasil.tujuan_pemda) {
                    setTujuanPemda(hasil.tujuan_pemda);
                }
                if (hasil.nama_tematik) {
                    setNamaPohon(hasil.nama_tematik);
                }
                if(hasil.id_visi){
                    const visi = {
                        label: hasil.visi,
                        value: hasil.id_visi,
                    }
                    setVisi(visi);
                }
                if(hasil.id_misi){
                    const misi = {
                        value: hasil.id_misi,
                        label: hasil.misi,
                    }
                    setMisi(misi);
                }

                // Mapping data ke form dengan struktur yang sesuai
                const indikatorData = hasil.indikator?.map((item: any) => ({
                    id: item.id, // Sesuai dengan struktur API
                    indikator: item.indikator,
                    definisi_operasional: item.definisi_operasional,
                    rumus_perhitungan: item.rumus_perhitungan,
                    sumber_data: item.sumber_data,
                    target: item.target.map((t: any) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })) || [];

                reset({ indikator: indikatorData });

                // Mengisi array field di react-hook-form
                replace(indikatorData);
            } catch (err) {
                console.log(err);
            }
        };
        const fetchPokinBaru = async () => {
            try {
                const response = await fetch(`${API_URL}/pohon_kinerja/pokin_with_periode/${tema_id}/${jenis_periode}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.data;
                if (hasil.nama_pohon) {
                    setNamaPohon(hasil.nama_pohon);
                }

                // Mapping data ke form dengan struktur yang sesuai
                const indikatorData = hasil.indikator?.map((item: any) => ({
                    id: item.id, // Sesuai dengan struktur API
                    indikator: item.indikator,
                    definisi_operasional: item.definisi_operasional,
                    rumus_perhitungan: item.rumus_perhitungan,
                    sumber_data: item.sumber_data,
                    target: item.target.map((t: any) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })) || [];

                reset({ indikator: indikatorData });

                // Mengisi array field di react-hook-form
                replace(indikatorData);
            } catch (err) {
                console.log(err);
            }
        };
        if (metode === 'lama' && isOpen) {
            fetchDetailTujuan();
        } else if (metode === "baru" && isOpen) {
            fetchPokinBaru();
        }
    }, [id, token, isOpen, metode, reset, replace, tahun, tema_id, jenis_periode]);

    const fetchVisiOption = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/visi_pemda/findall/tahun/${tahun}/jenisperiode/${jenis_periode}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const hasil = result.data;
            // console.log(hasil);
            const data = hasil.map((item: any) => ({
                value: item.id,
                label: item.visi,
            }));
            setVisiOption(data);
        } catch (err) {
            console.error("error fetch option visi", err);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchMisiOption = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/misi_pemda/findbyvisi/${id}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const hasil = result.data.misi_pemda;
            // console.log(hasil);
            const data = hasil.map((item: any) => ({
                label: item.misi,
                value: item.id,
                visi: "",
                awal: "",
                akhir: "",
                jenis: "",
            }));
            setMisiOption(data);
        } catch (err) {
            console.error("error fetch option misi", err);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataNew = {
            //key : value
            tema_id: tema_id,
            periode_id: periode,
            tujuan_pemda: TujuanPemda,
            id_visi: Visi?.value,
            id_misi: Misi?.value,
            indikator: data.indikator.map((ind) => ({
                indikator: ind.indikator,
                definisi_operasional: ind.definisi_operasional,
                rumus_perhitungan: ind.rumus_perhitungan,
                sumber_data: ind.sumber_data,
                target: ind.target.map((t, index) => ({
                    target: t.target,
                    satuan: t.satuan,
                    tahun: tahun_list[index],
                })),
            })),
        };
        const formDataEdit = {
            //key : value
            id: id,
            periode_id: periode,
            tujuan_pemda: TujuanPemda,
            id_visi: Visi?.value,
            id_misi: Misi?.value,
            indikator: data.indikator.map((ind) => ({
                indikator: ind.indikator,
                rumus_perhitungan: ind.rumus_perhitungan,
                sumber_data: ind.sumber_data,
                target: ind.target.map((t, index) => ({
                    target: t.target,
                    satuan: t.satuan,
                    tahun: tahun_list[index],
                })),
            })),
        };
        const getBody = () => {
            if (metode === "lama") return formDataEdit;
            if (metode === "baru") return formDataNew;
            return {}; // Default jika metode tidak sesuai
        };
        // metode === 'baru' && console.log("baru :", formDataNew);
        // metode === 'lama' && console.log("lama :", formDataEdit);
        try {
            let url = "";
            if (metode === "lama") {
                url = `tujuan_pemda/update/${id}`;
            } else if (metode === "baru") {
                url = `tujuan_pemda/create`;
            } else {
                url = '';
            }
            setProses(true);
            const response = await fetch(`${API_URL}/${url}`, {
                method: metode === 'lama' ? "PUT" : "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(getBody()),
            });
            if (response.ok) {
                AlertNotification("Berhasil", `Berhasil ${metode === 'baru' ? "Menambahkan" : "Mengubah"} Tujuan Pemda`, "success", 1000);
                onClose();
                onSuccess();
                reset();
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server dengan response !ok", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    const handleClose = () => {
        onClose();
        setTujuanPemda('');
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{metode === 'baru' ? "Tambah" : "Edit"} Tujuan Pemda</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tujuan_pemda"
                            >
                                Tema:
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{NamaPohon}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tujuan_pemda"
                            >
                                Tujuan Pemda:
                            </label>
                            <Controller
                                name="tujuan_pemda"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="tujuan_pemda"
                                        placeholder="masukkan Tujuan Pemda"
                                        value={TujuanPemda}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setTujuanPemda(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="visi"
                            >
                                Visi :
                            </label>
                            <Controller
                                name="visi"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Visi"
                                            isLoading={IsLoading}
                                            options={VisiOption}
                                            isSearchable
                                            value={Visi}
                                            isClearable
                                            onMenuOpen={() => {
                                                fetchVisiOption();
                                            }}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setVisi(option);
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
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="misi"
                            >
                                Misi :
                            </label>
                            <Controller
                                name="misi"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Misi"
                                            isLoading={IsLoading}
                                            options={MisiOption}
                                            isSearchable
                                            value={Misi}
                                            isDisabled={!Visi}
                                            isClearable
                                            onMenuOpen={() => {
                                                if(Visi){
                                                    fetchMisiOption(Visi?.value);
                                                }
                                            }}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setMisi(option);
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
                            indikator Tujuan Pemda :
                        </label>
                        {fields.map((field, index) => (
                            <React.Fragment key={field.id}>
                                <div className="flex flex-col bg-gray-300 my-2 py-2 px-2 rounded-lg">
                                    <Controller
                                        name={`indikator.${index}.indikator`}
                                        control={control}
                                        defaultValue={field.indikator}
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
                                </div>
                                <div className="flex flex-col border border-gray-200 my-2 py-2 px-2 rounded-lg">
                                    <Controller
                                        name={`indikator.${index}.definisi_operasional`}
                                        control={control}
                                        defaultValue={field.definisi_operasional}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Definisi Operasional :
                                                </label>
                                                <input
                                                    type="textbox"
                                                    {...field}
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder={`Masukkan Definisi Operasional`}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col border border-gray-200 my-2 py-2 px-2 rounded-lg">
                                    <Controller
                                        name={`indikator.${index}.rumus_perhitungan`}
                                        control={control}
                                        defaultValue={field.rumus_perhitungan}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Rumus Perhitungan :
                                                </label>
                                                <input
                                                    {...field}
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder={`Masukkan Rumus Perhitungan`}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col border border-gray-200 my-2 py-2 px-2 rounded-lg">
                                    <Controller
                                        name={`indikator.${index}.sumber_data`}
                                        control={control}
                                        defaultValue={field.sumber_data}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Sumber Data :
                                                </label>
                                                <input
                                                    {...field}
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder={`Masukkan Sumber Data`}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-wrap justify-between gap-1">
                                    {field.target.map((_, subindex) => (
                                        <div key={`${index}-${subindex}`} className="flex flex-col py-1 px-3 border border-gray-200 rounded-lg">
                                            <label className="text-base text-center text-gray-700">
                                                <p>{tahun_list[subindex]}</p>
                                            </label>
                                            <Controller
                                                name={`indikator.${index}.target.${subindex}.target`}
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
                                                name={`indikator.${index}.target.${subindex}.satuan`}
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
                                        </div>
                                    ))}
                                </div>
                                {index >= 0 && (
                                    <ButtonRedBorder
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="w-[200px] mt-3"
                                    >
                                        Hapus
                                    </ButtonRedBorder>
                                )}
                            </React.Fragment>
                        ))}
                        <ButtonSkyBorder
                            className="mb-3 mt-3"
                            type="button"
                            onClick={handleTambahIndikator}
                        >
                            Tambah Indikator
                        </ButtonSkyBorder>
                        <ButtonSky className="w-full mt-3" type="submit">
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full my-2" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}