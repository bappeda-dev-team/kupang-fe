'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import Select from 'react-select';
import { LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";

interface OptionTypeString {
    value: string;
    label: string;
}

interface FormValue {
    id: number;
    kode_opd: string;
    kode_bidang_urusan: string;
    tujuan: string;
    periode_id: Periode;
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
};

interface Periode {
    value: number;
    label: string;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    tahun_list: string[];
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    metode: 'lama' | 'baru';
    id?: number; // id tujuan opd
    periode?: number; // id periode
    tahun?: number; // tahun value header
    tahun_list?: string[];
    kode_opd?: string;
    special?: boolean;
    onSuccess: () => void;
}

export const ModalTujuanOpd: React.FC<modal> = ({ isOpen, onClose, id, kode_opd, periode, metode, tahun, tahun_list, special, onSuccess }) => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();

    const token = getToken();

    const [TujuanOpd, setTujuanOpd] = useState<string>('');
    const [Periode, setPeriode] = useState<Periode | null>(null);
    const [PeriodeOption, setPeriodeOption] = useState<Periode[]>([]);
    const [BidangUrusan, setBidangUrusan] = useState<OptionTypeString | null>(null);
    const [OptionBidangUrusan, setOptionBidangUrusan] = useState<OptionTypeString[]>([]);

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    const handleTambahIndikator = () => {
        const defaultTarget = Array(special === true ? Periode?.tahun_list.length : (tahun_list && tahun_list.length)).fill({ target: '', satuan: '' }); // Buat array (jumlahnya sesuai dengan tahun_list length) dengan target kosong
        append({ indikator: '', definisi_operasional: "", rumus_perhitungan: '', sumber_data: '', target: defaultTarget });
    };

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchDetailTujuan = async () => {
            try {
                const response = await fetch(`${API_URL}/tujuan_opd/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.data;

                if (hasil.tujuan) {
                    setTujuanOpd(hasil.tujuan);
                }
                if (hasil.kode_bidang_urusan) {
                    const bd = {
                        value: hasil.kode_bidang_urusan,
                        label: hasil.nama_bidang_urusan || "-",
                    }
                    setBidangUrusan(bd);
                }

                // Mapping data ke form dengan struktur yang sesuai
                const indikatorData = hasil.indikator?.map((item: any) => ({
                    id: item.id, // Sesuai dengan struktur API
                    indikator: item.indikator,
                    rumus_perhitungan: item.rumus_perhitungan,
                    definisi_operasional: item.definisi_operasional,
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
        }
    }, [id, token, isOpen, metode, reset, replace, tahun, tahun_list, special]);

    const fetchOptionBidangUrusan = async() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            setIsLoading(true);
            const response = await fetch(`${API_URL}/bidang_urusan/findall/${kode_opd}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const data = result.data;
            const hasil = data.map((item: any) => ({
                value: item.kode_bidang_urusan,
                label: `${item.kode_bidang_urusan} - ${item.nama_bidang_urusan}`,
            }));
            setOptionBidangUrusan(hasil);
        } catch (err) {
            console.error(err, "gagal fetch option bidang urusan");
        } finally {
            setIsLoading(false);
        }
    }
    const fetchOptionPeriode = async() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            setIsLoading(true);
            const response = await fetch(`${API_URL}/periode/findall`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const data = result.data;
            const hasil = data.map((item: any) => ({
                value: item.id,
                label: `${item.tahun_awal} - ${item.tahun_akhir} (${item.jenis_periode})`,
                tahun_awal: item.tahun_awal,
                tahun_akhir: item.tahun_akhir,
                jenis_periode: item.jenis_periode,
                tahun_list: item.tahun_list,
            }));
            setPeriodeOption(hasil);
        } catch (err) {
            console.error(err, "gagal fetch option bidang urusan");
        } finally {
            setIsLoading(false);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataNew = {
            //key : value
            kode_bidang_urusan: BidangUrusan?.value,
            periode_id: special === true ? Periode?.value : periode,
            kode_opd: kode_opd,
            tujuan: TujuanOpd,
            indikator: data.indikator.map((ind) => ({
                indikator: ind.indikator,
                definisi_operasional: ind.definisi_operasional,
                rumus_perhitungan: ind.rumus_perhitungan,
                sumber_data: ind.sumber_data,
                target: ind.target.map((t, index) => ({
                    target: t.target,
                    satuan: t.satuan,
                    tahun: special === true ? Periode?.tahun_list[index] : (tahun_list && tahun_list[index]),
                })),
            })),
        };
        const formDataEdit = {
            //key : value
            id: id,
            kode_opd: kode_opd,
            kode_bidang_urusan: BidangUrusan?.value,
            tujuan: TujuanOpd,
            periode_id: periode,
            indikator: data.indikator.map((ind) => ({
                indikator: ind.indikator,
                definisi_operasional: ind.definisi_operasional,
                rumus_perhitungan: ind.rumus_perhitungan,
                sumber_data: ind.sumber_data,
                target: ind.target.map((t, index) => ({
                    target: t.target,
                    satuan: t.satuan,
                    tahun: tahun_list && tahun_list[index],
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
                url = `tujuan_opd/update/${id}`;
            } else if (metode === "baru") {
                url = `tujuan_opd/create`;
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
            const result = await response.json();
            if (result.code === 201 || result.code === 200) {
                AlertNotification("Berhasil", `Berhasil ${metode === 'baru' ? "Menambahkan" : "Mengubah"} Tujuan OPD`, "success", 1000);
                onClose();
                onSuccess();
                reset();
            } else if(result.code === 500) {
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

    const handleClose = () => {
        onClose();
        setTujuanOpd('');
        setBidangUrusan(null);
        setPeriode(null);
        reset();
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{metode === 'baru' ? "Tambah" : "Edit"} Tujuan OPD</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tujuan"
                            >
                                Tujuan OPD:
                            </label>
                            <Controller
                                name="tujuan"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="tujuan"
                                        placeholder="masukkan Tujuan OPD"
                                        value={TujuanOpd}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setTujuanOpd(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_bidang_urusan"
                            >
                                Bidang Urusan:
                            </label>
                            <Controller
                                name="kode_bidang_urusan"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="kode_bidang_urusan"
                                        placeholder="Pilih Bidang Urusan"
                                        value={BidangUrusan}
                                        options={OptionBidangUrusan}
                                        isLoading={IsLoading}
                                        onMenuOpen={() => {
                                            fetchOptionBidangUrusan();
                                        }}
                                        onMenuClose={() => setOptionBidangUrusan([])}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            setBidangUrusan(option);
                                        }}
                                        styles={{
                                            control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                borderColor: 'black', // Warna default border menjadi merah
                                                '&:hover': {
                                                borderColor: '#3673CA', // Warna border tetap merah saat hover
                                                },
                                            }),
                                        }}
                                    />
                                )}
                            />
                        </div>
                        {special === true &&
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="periode_id"
                                >
                                    Periode:
                                </label>
                                <Controller
                                    name="periode_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            id="periode_id"
                                            placeholder="Pilih Periode"
                                            value={Periode}
                                            options={PeriodeOption}
                                            isLoading={IsLoading}
                                            isClearable
                                            onMenuOpen={() => {
                                                fetchOptionPeriode();
                                            }}
                                            onMenuClose={() => setPeriodeOption([])}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setPeriode(option);
                                            }}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                    borderColor: 'black', // Warna default border menjadi merah
                                                    '&:hover': {
                                                    borderColor: '#3673CA', // Warna border tetap merah saat hover
                                                    },
                                                }),
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        }
                        <label className="uppercase text-base font-bold text-gray-700 my-2">
                            indikator Tujuan OPD :
                        </label>
                        {fields.map((field, index) => (
                            <React.Fragment key={field.id}>
                                <div className="flex flex-col my-2 py-2 rounded-lg">
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
                                <div key={index} className="flex flex-col border border-gray-200 my-2 py-2 px-2 rounded-lg">
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
                                                    {...field}
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder={`Masukkan Definisi Operasional`}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div key={index} className="flex flex-col border border-gray-200 my-2 py-2 px-2 rounded-lg">
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
                                <div key={index} className="flex flex-col border border-gray-200 my-2 py-2 px-2 rounded-lg">
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
                                <div className="flex flex-wrap justify-between gap-1 target&satuan">
                                    {field.target.map((_, subindex) => (
                                        <div key={`${index}-${subindex}`} className="flex flex-col py-1 px-3 border border-gray-200 rounded-lg">
                                            <label className="text-base text-center text-gray-700">
                                                <p>{special === true ? Periode?.tahun_list[subindex] : (tahun_list && tahun_list[subindex])}</p>
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
                                        Hapus Indikator
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