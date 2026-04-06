'use client'

import React, { useState } from 'react';
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Select from 'react-select';
import { AlertNotification } from '@/components/global/Alert';
import { PohonOpd } from './PohonOpd';
import { getToken } from '../../Cookie';
import { LoadingButtonClip } from '@/components/global/Loading';
import { OptionType } from '@/types';
import { useBrandingContext } from '@/context/BrandingContext';

interface FormValue {
    id: OptionType | null;
    parent: number;
}

export const FormAmbilPohonOpd: React.FC<{
    parent: number;
    tahun: number;
    level: number;
    fetchTrigger: () => void;
    onCancel: () => void
}> = ({ parent, tahun, level, fetchTrigger, onCancel }) => {

    const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValue>();

    const [PohonOption, setPohonOption] = useState<OptionType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [IsAdded, setIsAdded] = useState<boolean>(false);
    const [DataAdd, setDataAdd] = useState<any>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const [Deleted, setDeleted] = useState<boolean>(false);

    const { branding } = useBrandingContext();
    const kode_opd = (branding?.user?.roles == "super_admin" || branding?.user?.roles == "reviewer") ? branding?.opd?.value : branding?.user?.kode_opd;
    const token = getToken();

    const fetchPohon = async () => {
        setIsLoading(true);
        try {
            const url = `pohon_kinerja_opd/pokin_clone_pokin_opd_statistik/${kode_opd}/${tahun}/${level + 1}`
            const response = await fetch(`${branding?.api_perencanaan}/${url}`, {
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
            const pohon = data.data.map((item: any) => ({
                ...item,
                value: item.id,
                label: item.nama_pohon,
            }));
            setPohonOption(pohon);
        } catch (err) {
            console.log('gagal mendapatkan data pohon');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            id: data.id?.value,
            parent: parent,
        };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${branding?.api_perencanaan}/pohon_kinerja_opd/update_parent_clone/${data.id?.value}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "Berhasil menerima pohon clone", "success", 1000);
                setIsAdded(true);
                const data = result.data;
                setDataAdd(data);
                console.log(result);
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    return (
        <React.Fragment>
            {IsAdded && DataAdd ?
                <PohonOpd
                    tema={DataAdd}
                    deleteTrigger={() => setDeleted((prev) => !prev)}
                    fetchTrigger={fetchTrigger}
                    set_show_all={() => null}
                />
                :
                <li>
                    <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500 form-ambil">
                        <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                            {level === 4 && <h1>Ambil Tactical </h1>}
                            {level === 5 && <h1>Ambil Operational </h1>}
                        </div>
                        <div className="flex justify-center my-3 w-full">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className='w-full'
                            >
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="id"
                                    >
                                        {level == 4 && <h1>Tactical</h1>}
                                        {level == 5 && <h1>Operational</h1>}
                                    </label>
                                    <Controller
                                        name="id"
                                        control={control}
                                        rules={{ required: "Pohon Harus Terisi" }}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    {...field}
                                                    placeholder="Pilih Pohon"
                                                    options={PohonOption}
                                                    isLoading={isLoading}
                                                    isSearchable
                                                    isClearable
                                                    onMenuOpen={() => {
                                                        fetchPohon();
                                                    }}
                                                    styles={{
                                                        control: (baseStyles) => ({
                                                            ...baseStyles,
                                                            borderRadius: '8px',
                                                            textAlign: 'start',
                                                        })
                                                    }}
                                                />
                                                {errors.id ?
                                                    <h1 className="text-red-500">
                                                        {errors.id.message}
                                                    </h1>
                                                    :
                                                    <h1 className="text-slate-300 text-xs">*Pohon Harus Terisi</h1>
                                                }
                                            </>
                                        )}
                                    />
                                </div>
                                <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                                    {Proses ?
                                        <span className="flex">
                                            <LoadingButtonClip />
                                            Menyimpan...
                                        </span>
                                        :
                                        "Simpan"
                                    }
                                </ButtonSky>
                                <ButtonRed className="w-full my-3" onClick={onCancel}>
                                    Batal
                                </ButtonRed>
                            </form>
                        </div>
                    </div>
                </li>
            }
        </React.Fragment>
    );
};