'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken, getUser, getOpdTahun } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import Select from "react-select";

interface OptionType {
    value: number;
    label: string;
}
interface OptionMusrenbang {
    value: number;
    label: string;
    alamat: string;
    uraian: string;
    tahun: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    rekin_id?: string;
    onSuccess: () => void;
}

interface FormValue {
    // musrenbang & pokir
    jenis_usulan?: string;
    usulan_id?: OptionType | null | string;
    rekin_id?: string;
    tahun: string;
    kode_opd: string;
    keterangan?: string;
    // mandatori & inisiatif
    usulan?: string;
    manfaat?: string;
    uraian?: string;
    rencana_kinerja_id?: string;
    pegawai_id?: string;
    peraturan_terkait?: string;
}


export const ModalAddUsulan: React.FC<modal> = ({ isOpen, onClose, rekin_id, onSuccess }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);

    const [JenisUsulan, setJenisUsulan] = useState<string>('');
    // musrenbang
    const [UsulanMusrenbang, setUsulanMusrenbang] = useState<OptionMusrenbang | null>(null);
    const [OptionMusrenbang, setOptionMusrenbang] = useState<OptionMusrenbang[]>([]);
    // pokir
    const [UsulanPokir, setUsulanPokir] = useState<OptionMusrenbang | null>(null);
    const [OptionPokir, setOptionPokir] = useState<OptionMusrenbang[]>([]);
    // mandatori
    const [UsulanMandatori, setUsulanMandatori] = useState<string>('');
    const [PeraturanTerkait, setPeraturanTerkait] = useState<string>('');
    // inisiatif
    const [UsulanInisiatif, setUsulanInisiatif] = useState<string>('');
    
    const [Uraian, setUraian] = useState<string>('');
    const [Manfaat, setManfaat] = useState<string>('');
    
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
    }, []);

    const fetchMusrenbang = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setLoadingOption(true);
            const response = await fetch(`${API_URL}/usulan_musrebang/findall?status=belum_diambil`, {
                headers: {
                    Authorization: `${token}`,
                }
            });
            if (!response.ok) {
                throw new Error("terdapat kesalahan server ketika fetch data dropdown musrenbang");
            }
            const hasil = await response.json();
            const data = hasil.usulan_musrebang;
            if (data != null) {
                const option = data.map((item: any) => ({
                    value: item.id,
                    label: item.usulan,
                    alamat: item.alamat,
                    uraian: item.uraian,
                    tahun: item.tahun,
                }))
                setOptionMusrenbang(option);
            } else {
                console.log('dropdown musrenbang kosong');
            }
        } catch (err) {
            console.log(err, 'gagal mendapatkan data dropdown musrenbang, cek endpoint backend atau database server');
        } finally {
            setLoadingOption(false);
        }
    }
    const fetchPokir = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setLoadingOption(true);
            const response = await fetch(`${API_URL}/usulan_pokok_pikiran/findall?status=belum_diambil`, {
                headers: {
                    Authorization: `${token}`,
                }
            });
            if (!response.ok) {
                throw new Error("terdapat kesalahan server ketika fetch data dropdown musrenbang");
            }
            const hasil = await response.json();
            const data = hasil.usulan_pokok_pikiran;
            if (data.length != 0) {
                const option = data.map((item: any) => ({
                    value: item.id,
                    label: item.usulan,
                    alamat: item.alamat,
                    uraian: item.uraian,
                    tahun: item.tahun,
                }))
                setOptionPokir(option);
            } else {
                console.log('dropdown Pokok pikiran kosong');
            }
        } catch (err) {
            console.log(err, 'gagal mendapatkan data dropdown musrenbang, cek endpoint backend atau database server');
        } finally {
            setLoadingOption(false);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataMusrenbang = {
            //key : value
            id_usulan: UsulanMusrenbang?.value,
        };
        const formDataPokir = {
            //key : value
            id_usulan: UsulanPokir?.value,
        };
        const formDataInisiatif = {
            //key : value
            usulan: UsulanInisiatif,
            manfaat: Manfaat,
            uraian: "",
            tahun: String(Tahun?.value),
            rencana_kinerja_id: rekin_id,
            pegawai_id: User?.nip,
            kode_opd: User?.kode_opd,
        };
        const formDataMandatori = {
            //key : value
            usulan: UsulanMandatori,
            uraian: Uraian,
            tahun: String(Tahun?.value),
            peraturan_terkait: PeraturanTerkait,
            rencana_kinerja_id: rekin_id,
            pegawai_id: User?.nip,
            kode_opd: User?.kode_opd,
        };
        const getBody = () => {
            if (JenisUsulan === "musrenbang") return formDataMusrenbang;
            if (JenisUsulan === "pokir") return formDataPokir;
            if (JenisUsulan === "mandatori") return formDataMandatori;
            if (JenisUsulan === "inisiatif") return formDataInisiatif;
            return {}; // Default jika JenisUsulan tidak sesuai
        };
        // JenisUsulan === "musrenbang" && console.log("musrenbang :", formDataMusrenbang);
        // JenisUsulan === "pokir" && console.log("Pokir :", formDataPokir);
        // JenisUsulan === "mandatori" && console.log("mandatori :", formDataMandatori);
        // JenisUsulan === "inisiatif" && console.log("inisiatif :", formDataInisiatif);
        try{
            let url = "";
            if (JenisUsulan === "musrenbang") {
                url = `usulan_musrebang/create_rekin/${rekin_id}`;
            } else if (JenisUsulan === "pokir") {
                url = `usulan_pokok_pikiran/create_rekin/${rekin_id}`;
            } else if (JenisUsulan === "inisiatif") {
                url = "usulan_inisiatif/create";
            } else if (JenisUsulan === "mandatori") {
                url = "usulan_mandatori/create";
            } else {
                url = '';
            }
            setProses(true);
            const response = await fetch(`${API_URL}/${url}`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(getBody()),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil menambahkan Usulan", "success", 1000);
                onClose();
                onSuccess();
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            console.error(err);
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    const handleClose = () => {
        onClose();
        setJenisUsulan('');
        setUsulanMusrenbang(null);
        setUsulanPokir(null);
    }
    const handleJenisUsulan = (usulan: string) => {
        setJenisUsulan(usulan);
        setOptionMusrenbang([]);
        setOptionPokir([]);
        setUsulanMusrenbang(null);
        setUsulanPokir(null);
        setUsulanInisiatif('');
        setUsulanMandatori('');
        setPeraturanTerkait('');
        setUraian('');
        setManfaat('');
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5`}>
                    <div className="flex justify-center w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase">Tambah Usulan</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <label className="uppercase text-xs font-bold text-gray-700 my-2">pilih jenis usulan yang ingin ditambahkan</label>
                        {/* BUTTON JENIS USULAN */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() =>{
                                    handleJenisUsulan('musrenbang');
                                }}
                                className={`px-2 py-1 rounded-xl border ${JenisUsulan === 'musrenbang' ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"}`}
                            >
                                Musrenbang
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleJenisUsulan('pokir');
                                }}
                                className={`px-2 py-1 rounded-xl border ${JenisUsulan === 'pokir' ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"}`}
                            >
                                Pokok Pikiran
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleJenisUsulan('inisiatif');
                                }}
                                className={`px-2 py-1 rounded-xl border ${JenisUsulan === 'inisiatif' ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"}`}
                            >
                                Inisiatif
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                   handleJenisUsulan('mandatori');
                                }}
                                className={`px-2 py-1 rounded-xl border ${JenisUsulan === 'mandatori' ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500"}`}
                            >
                                Mandatori
                            </button>
                        </div>
                        {/* MUSRENBANG */}
                        {(JenisUsulan === 'musrenbang') &&
                            <>
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="usulan_id"
                                    >
                                        Usulan Musrenbang :
                                    </label>
                                    <Controller
                                        name="usulan_id"
                                        control={control}
                                        rules={{ required: "Wajib Terisi" }}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    {...field}
                                                    placeholder="Pilih usulan musrenbang"
                                                    value={UsulanMusrenbang}
                                                    options={OptionMusrenbang}
                                                    isLoading={LoadingOption}
                                                    isSearchable
                                                    isClearable
                                                    onMenuOpen={() => {
                                                        fetchMusrenbang();
                                                    }}
                                                    onChange={(option) => {
                                                        field.onChange(option);
                                                        setUsulanMusrenbang(option);
                                                    }}
                                                    styles={{
                                                        control: (baseStyles) => ({
                                                            ...baseStyles,
                                                            borderRadius: '8px',
                                                        }),
                                                        menuPortal: (base) => ({ 
                                                            ...base, zIndex: 9999 
                                                        })
                                                    }}
                                                />
                                                {(errors.usulan_id && JenisUsulan === 'musrenbang') &&
                                                    <h1 className="text-red-500">
                                                        {errors.usulan_id.message}
                                                    </h1>
                                                }
                                            </>
                                        )}
                                    />
                                </div>
                                {/* PREVIEW */}
                                <div className={`transition-all duration-300 ease-in-out ${UsulanMusrenbang ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                    preview usulan :
                                    <div className="flex flex-col rounded-lg border border-black p-2 mt-2">
                                        <table>
                                            <tbody>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Usulan</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanMusrenbang?.label}</h1></td>
                                                </tr>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Alamat</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanMusrenbang?.alamat}</h1></td>
                                                </tr>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Uraian</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanMusrenbang?.uraian}</h1></td>
                                                </tr>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Tahun</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanMusrenbang?.tahun}</h1></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div> 
                                </div>
                            </>
                        }
                        {/* POKIR */}
                        {(JenisUsulan === 'pokir') &&
                            <>
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="usulan_id"
                                    >
                                        Usulan Pokok Pikiran :
                                    </label>
                                    <Controller
                                        name="usulan_id"
                                        control={control}
                                        rules={{ required: "Wajib Terisi" }}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    {...field}
                                                    placeholder="Pilih usulan Pokok Pikiran"
                                                    value={UsulanPokir}
                                                    options={OptionPokir}
                                                    isLoading={LoadingOption}
                                                    isSearchable
                                                    isClearable
                                                    onMenuOpen={() => {
                                                        fetchPokir();
                                                    }}
                                                    onChange={(option) => {
                                                        field.onChange(option);
                                                        setUsulanPokir(option);
                                                    }}
                                                    styles={{
                                                        control: (baseStyles) => ({
                                                            ...baseStyles,
                                                            borderRadius: '8px',
                                                        }),
                                                        menuPortal: (base) => ({ 
                                                            ...base, zIndex: 9999 
                                                        })
                                                    }}
                                                />
                                                {(errors.usulan_id && JenisUsulan === "pokir") &&
                                                    <h1 className="text-red-500">
                                                        {errors.usulan_id.message}
                                                    </h1>
                                                }
                                            </>
                                        )}
                                    />
                                </div>
                                {/* PREVIEW */}
                                <div className={`transition-all duration-300 ease-in-out ${UsulanPokir ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                    preview usulan :
                                    <div className="flex flex-col rounded-lg border border-black p-2 mt-2">
                                        <table>
                                            <tbody>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Usulan</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanPokir?.label}</h1></td>
                                                </tr>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Alamat</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanPokir?.alamat}</h1></td>
                                                </tr>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Uraian</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanPokir?.uraian}</h1></td>
                                                </tr>
                                                <tr className="border border-black">
                                                    <td className="p-2 font-medium">Tahun</td>
                                                    <td className="p-2">:</td>
                                                    <td className="p-2"><h1>{UsulanPokir?.tahun}</h1></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div> 
                                </div>
                            </>
                        }
                        {(JenisUsulan === 'inisiatif') &&
                            <>
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="usulan"
                                    >
                                        Usulan Inisiatif Kepala Daerah :
                                    </label>
                                    <Controller
                                        name="usulan"
                                        control={control}
                                        rules={{ required: "Wajib Terisi" }}
                                        render={({ field }) => (
                                            <>
                                                <input
                                                    className="border px-4 py-2 rounded-lg"
                                                    type="text"
                                                    value={UsulanInisiatif}
                                                    placeholder="Masukkan Usulan Inisiatif"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        setUsulanInisiatif(e.target.value);
                                                    }}
                                                />
                                                {(errors.usulan && JenisUsulan === "inisiatif") &&
                                                    <h1 className="text-red-500">
                                                        {errors.usulan.message}
                                                    </h1>
                                                }
                                            </>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="manfaat"
                                    >
                                        Manfaat :
                                    </label>
                                    <Controller
                                        name="manfaat"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <input
                                                    className="border px-4 py-2 rounded-lg"
                                                    type="text"
                                                    value={Manfaat}
                                                    placeholder="Masukkan Manfaat"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        setManfaat(e.target.value);
                                                    }}
                                                />
                                            </>
                                        )}
                                    />
                                </div>
                                {/* <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="uraian"
                                    >
                                        Uraian :
                                    </label>
                                    <Controller
                                        name="uraian"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <input
                                                    className="border px-4 py-2 rounded-lg"
                                                    type="text"
                                                    value={Uraian}
                                                    placeholder="Masukkan Uraian"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        setUraian(e.target.value);
                                                    }}
                                                />
                                            </>
                                        )}
                                    />
                                </div> */}
                            </>
                        }
                        {(JenisUsulan === 'mandatori') &&
                            <>
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="usulan"
                                    >
                                        Usulan Mandatori :
                                    </label>
                                    <Controller
                                        name="usulan"
                                        control={control}
                                        rules={{ required: "Wajib Terisi" }}
                                        render={({ field }) => (
                                            <>
                                                <input
                                                    className="border px-4 py-2 rounded-lg"
                                                    type="text"
                                                    value={UsulanMandatori}
                                                    placeholder="Masukkan Usulan Mandatori"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        setUsulanMandatori(e.target.value);
                                                    }}
                                                />
                                                {(errors.usulan && JenisUsulan === "mandatori") &&
                                                    <h1 className="text-red-500">
                                                        {errors.usulan.message}
                                                    </h1>
                                                }
                                            </>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="peraturan_terkait"
                                    >
                                        Peraturan Terkait :
                                    </label>
                                    <Controller
                                        name="peraturan_terkait"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <input
                                                    className="border px-4 py-2 rounded-lg"
                                                    type="text"
                                                    value={PeraturanTerkait}
                                                    placeholder="Masukkan Peraturan Terkait"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        setPeraturanTerkait(e.target.value);
                                                    }}
                                                />
                                            </>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="uraian"
                                    >
                                        Uraian :
                                    </label>
                                    <Controller
                                        name="uraian"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <input
                                                    className="border px-4 py-2 rounded-lg"
                                                    type="text"
                                                    value={Uraian}
                                                    placeholder="Masukkan Uraian"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        setUraian(e.target.value);
                                                    }}
                                                />
                                            </>
                                        )}
                                    />
                                </div>
                            </>
                        }
                        <ButtonSky className="w-full my-3" type="submit">
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full mb-3" type="button" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}
