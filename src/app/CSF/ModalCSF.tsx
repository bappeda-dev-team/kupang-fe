'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray, Control } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { LoadingButtonClip } from "@/components/global/Loading";
import { TbDeviceFloppy, TbPlus, TbTrash, TbX } from "react-icons/tb";
import { useBrandingContext } from "@/context/BrandingContext";

interface FormValue {
    pohon_id?: number;
    pernyataan_kondisi_strategis: string;
    alasan_kondisi: Alasan[];
}
interface Alasan {
    csf_id?: number;
    alasan_kondisi_strategis: string;
    data_terukur: DataTerukur[];
}
interface DataTerukur {
    alasan_kondisi_id?: number;
    data_terukur: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    jenis: string;
    data?: any;
}

export const ModalCSF: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, data }) => {

    const {branding} = useBrandingContext();
    const tahun = branding?.tahun ? branding?.tahun.value : 0;
    const { control, handleSubmit, reset } = useForm<FormValue>({
        defaultValues: {
            pernyataan_kondisi_strategis: data?.pernyataan_kondisi_strategis ?? "",
            alasan_kondisi: data?.alasan_kondisi?.map((a: any) => ({
                alasan_kondisi_strategis: a.alasan_kondisi_strategis,
                data_terukur: a.data_terukur?.map((dt: any) => ({
                    data_terukur: dt.data_terukur,
                })) || [],
            })) || [],
        }
    });

    const [Proses, setProses] = useState<boolean>(false);

    // console.log(data);

    const onSubmit: SubmitHandler<FormValue> = async (dataValue) => {
        const API_URL_CSF = process.env.NEXT_PUBLIC_API_URL_CSF;
        const formData = {
            //key : value
            ...(jenis === "edit" && { id: data.id }),
            pohon_id: data.pohon_id,
            pernyataan_kondisi_strategis: dataValue.pernyataan_kondisi_strategis,
            alasan_kondisi: dataValue.alasan_kondisi.map((a) => ({
                alasan_kondisi_strategis: a.alasan_kondisi_strategis,
                data_terukur: a.data_terukur.map((dt) => ({
                    data_terukur: dt.data_terukur,
                }))
            })),
            tahun: String(tahun)
        };
        // console.log(formData);
        try {
            setProses(true);
            let url = '';
            if (jenis === 'baru') {
                url = `csf`
            } else if (jenis === 'edit') {
                url = `csf/${data.id}`
            }
            const response = await fetch(`${API_URL_CSF}/${url}`, {
                method: jenis === "baru" ? "POST" : "PUT",
                headers: {
                    // Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil menyimpan data", "success", 1000);
                onClose();
                onSuccess();
                reset();
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
                console.log(result);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.log(err);
        } finally {
            setProses(false);
        }
    };

    const handleClose = () => {
        onClose();
        reset();
    }

    const {
        fields: alasanFields,
        append: appendAlasan,
        remove: removeAlasan,
    } = useFieldArray({
        control,
        name: "alasan_kondisi",
    });

    interface DataTerukurListProps {
        control: Control<FormValue>; // Tipe Control dari useForm
        alasanIndex: number; // Indeks alasan di mana data_terukur ini berada
    }

    const DataTerukurList: React.FC<DataTerukurListProps> = ({ control, alasanIndex }) => {
        // useFieldArray untuk mengelola array 'data_terukur' yang bersarang
        const {
            fields: dataTerukurFields,
            append: appendDataTerukur,
            remove: removeDataTerukur,
        } = useFieldArray({
            control,
            name: `alasan_kondisi.${alasanIndex}.data_terukur`, // Kunci di sini adalah path lengkap ke array bersarang
        });

        return (
            <div className="ml-4 pl-4 border-l border-gray-300 mt-4">
                <h4 className="text-md font-semibold mb-2">Data Terukur:</h4>
                {dataTerukurFields.map((dataTerukurField, dataTerukurIndex) => (
                    <div key={dataTerukurField.id} className="flex items-center gap-2 mb-2">
                        <Controller
                            name={`alasan_kondisi.${alasanIndex}.data_terukur.${dataTerukurIndex}.data_terukur`}
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-3 py-1 rounded-lg flex-grow"
                                    type="text"
                                    placeholder={`Data Terukur Pendukung Pernyataan`}
                                />
                            )}
                        />
                        {/* Tombol Hapus Data Terukur */}
                        <button
                            type="button"
                            onClick={() => removeDataTerukur(dataTerukurIndex)}
                            className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
                            title="Hapus Data Terukur Ini"
                        >
                            <TbTrash size={14} />
                        </button>
                    </div>
                ))}
                {/* Tombol Tambah Data Terukur */}
                <button
                    type="button"
                    onClick={() => appendDataTerukur({ data_terukur: "" })}
                    className="flex items-center gap-1 text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors mt-2"
                >
                    <TbPlus size={12} /> Tambah Data Terukur
                </button>
            </div>
        );
    };

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b text-center">
                        <h1 className="text-xl uppercase">Modal CSF {jenis}</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3 cursor-not-allowed">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                            >
                                Kondisi Terukur Yang Diharapkan (TEMA) :
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{data.tema || "-"}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="pernyataan_kondisi_strategis"
                            >
                                Pernyataan Isu Strategis:
                            </label>
                            <Controller
                                name="pernyataan_kondisi_strategis"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="pernyataan_kondisi_strategis"
                                        type="text"
                                        placeholder="Masukkan pernyataan kondisi strategis (Isu Strategis/mandat)"
                                    />
                                )}
                            />
                        </div>
                        {/* --- Bagian untuk Alasan --- */}
                        <div className="my-3 p-4 border rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-3">Alasan</h3>
                            {alasanFields.map((alasanField, alasanIndex) => (
                                <div key={alasanField.id} className="mb-4 p-3 border rounded-lg bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="font-medium text-gray-800">Alasan {alasanIndex + 1}:</label>
                                        {/* Tombol Hapus Alasan */}
                                        <button
                                            type="button"
                                            onClick={() => removeAlasan(alasanIndex)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                                            title="Hapus Alasan Ini"
                                        >
                                            <TbTrash size={16} />
                                        </button>
                                    </div>
                                    <Controller
                                        name={`alasan_kondisi.${alasanIndex}.alasan_kondisi_strategis`}
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                className="border px-3 py-2 rounded-lg w-full"
                                                placeholder="Alasan sebagai kondisi strategis"
                                                rows={3}
                                            />
                                        )}
                                    />

                                    {/* Komponen untuk Data Terukur (array bersarang) */}
                                    <DataTerukurList control={control} alasanIndex={alasanIndex} />
                                </div>
                            ))}

                            {/* Tombol Tambah Alasan */}
                            <button
                                type="button"
                                onClick={() => appendAlasan({
                                    alasan_kondisi_strategis: "",
                                    data_terukur: [{ data_terukur: "" }] // Tambahkan satu data_terukur kosong saat alasan baru
                                })}
                                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors mt-4"
                            >
                                <TbPlus size={14} /> Tambah Alasan
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 my-3">
                            <ButtonSky className="w-full" type="submit" disabled={Proses}>
                                {Proses ?
                                    <span className="flex">
                                        <LoadingButtonClip />
                                        Menyimpan...
                                    </span>
                                    :
                                    <span className="flex items-center gap-1">
                                        <TbDeviceFloppy />
                                        Simpan
                                    </span>
                                }
                            </ButtonSky>
                            <ButtonRed className="w-full flex items-center gap-1" onClick={handleClose}>
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
