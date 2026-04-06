'use client'

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { ButtonRed, ButtonSky } from '@/components/global/Button';
import { TbArrowBack, TbCheck, TbDeviceFloppy } from 'react-icons/tb';
import { useParams } from 'next/navigation';
import { getToken, getOpdTahun, getUser } from '@/components/lib/Cookie';
import { AlertNotification } from '@/components/global/Alert';
import { LoadingButtonClip, LoadingSync } from '@/components/global/Loading';
import { useRouter } from 'next/navigation';

interface OptionTypeString {
    value: string;
    label: string;
}

interface FormValue {
    perspektif: OptionTypeString;
    tujuan_rekin: string;
    definisi: string;
    key_activities: string;
    formula: string;
    jenis_indikator: OptionTypeString;
    unit_penanggung_jawab: string;
    unit_penyedia_data: string;
    sumber_data: string;
    jangka_waktu_awal: OptionTypeString;
    jangka_waktu_akhir: OptionTypeString;
    periode_pelaporan: OptionTypeString;
}

const FormManualIk = () => {
    const { id } = useParams();
    const token = getToken();
    const router = useRouter();
    const [DataNew, setDataNew] = useState<boolean>(false);
    const { control, reset, handleSubmit, formState: { errors }, } = useForm<FormValue>();

    const [Loading, setLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const [Success, setSuccess] = useState<boolean>(false);
    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);

    const [Perspektif, setPerspektif] = useState<OptionTypeString | null>(null);
    const [Rekin, setRekin] = useState<string>("");
    const [NamaIndikator, setNamaIndikator] = useState<string>("");
    const [Target, setTarget] = useState<string>("");
    const [Satuan, setSatuan] = useState<string>("");
    const [TujuanRekin, setTujuanRekin] = useState<string>("");
    const [Definisi, setDefinisi] = useState<string>("");
    const [KeyActivity, setKeyActivity] = useState<string>("");
    const [Formula, setFormula] = useState<string>("");
    const [JenisIndikator, setJenisIndikator] = useState<string>("");
    const [UnitPenanggunaJawab, setUnitPenanggunaJawab] = useState<string>("");
    const [UnitPenyediaData, setUnitPenyediaData] = useState<string>("");
    const [SumberData, setSumberData] = useState<string>("");
    const [JangkaWaktuAwal, setJangkaWaktuAwal] = useState<OptionTypeString | null>(null);
    const [JangkaWaktuAkhir, setJangkaWaktuAkhir] = useState<OptionTypeString | null>(null);
    const [PeriodePelaporan, setPeriodePelaporan] = useState<OptionTypeString | null>(null);
    const [Budget, setBudget] = useState<string>("");

    // STATE OUTPUT DATA
    const [checkKinerja, setCheckKinerja] = useState<boolean>(false);
    const [checkPenduduk, setCheckPenduduk] = useState<boolean>(false);
    const [checkSpatial, setCheckSpatial] = useState<boolean>(false);

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
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

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchManual = async (url: string) => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/${url}`, {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    }
                });
                if (!response.ok) {
                    throw new Error("response tidak OK, permasalahan di URL Endpoint");
                }
                const hasil = await response.json();
                // console.log(hasil.data);
                const detail = hasil.data;
                if (detail.perspektif || detail.formula || detail.sumber_data) {
                    setDataNew(false);
                    if (detail.rencana_kinerja) {
                        setRekin(detail.rencana_kinerja.Nama_rencana_kinerja);
                        if (detail.rencana_kinerja.indikator.length > 0) {
                            const indikator = detail.rencana_kinerja.indikator[0]; // Ambil elemen pertama dari array indikator
                            const targetData = indikator.targets.length > 0 ? indikator.targets[0] : null; // Ambil elemen pertama dari array targets

                            // Set state dengan data yang diambil
                            setNamaIndikator(indikator.nama_indikator);
                            setTarget(targetData?.target || ""); // Default ke string kosong jika targetData null
                            setSatuan(targetData?.satuan || ""); // Default ke string kosong jika targetData null
                        }
                    }
                    if (detail.perspektif) {
                        const data_perspektif = {
                            value: detail.perspektif,
                            label: detail.perspektif,
                        }
                        setPerspektif(data_perspektif);
                        reset({ perspektif: data_perspektif });
                    }
                    if (detail.tujuan_rekin) {
                        setTujuanRekin(detail.tujuan_rekin);
                        reset((prev) => ({ ...prev, tujuan_rekin: detail.tujuan_rekin }));
                    }
                    if (detail.definisi) {
                        setDefinisi(detail.definisi);
                        reset({ definisi: detail.definisi });
                    }
                    if (detail.key_activities) {
                        setKeyActivity(detail.key_activities);
                        reset({ key_activities: detail.key_activities });
                    }
                    if (detail.formula) {
                        setFormula(detail.formula);
                        reset({ formula: detail.formula });
                    }
                    if (detail.jenis_indikator) {
                        setJenisIndikator(detail.jenis_indikator);
                        reset({ jenis_indikator: detail.jenis_indikator });
                    }
                    if (detail.output_data) {
                        setCheckKinerja(detail.output_data.kinerja);
                        setCheckPenduduk(detail.output_data.penduduk);
                        setCheckSpatial(detail.output_data.spatial);
                    }
                    if (detail.unit_penanggung_jawab) {
                        setUnitPenanggunaJawab(detail.unit_penanggung_jawab);
                        reset((prev) => ({ ...prev, unit_penanggung_jawab: detail.unit_penanggung_jawab }));
                    }
                    if (detail.unit_penyedia_data) {
                        setUnitPenyediaData(detail.unit_penyedia_data);
                        reset({ unit_penyedia_data: detail.unit_penyedia_data });
                    }
                    if (detail.sumber_data) {
                        setSumberData(detail.sumber_data);
                        reset({ sumber_data: detail.sumber_data });
                    }
                    // if (detail.jangka_waktu_awal) {
                    //     setJangkaWaktuAwal(detail.jangka_waktu_awal);
                    //     reset({ jangka_waktu_awal: detail.jangka_waktu_awal })
                    // }
                    // if (detail.jangka_waktu_akhir) {
                    //     setJangkaWaktuAkhir(detail.jangka_waktu_akhir);
                    //     reset({ jangka_waktu_akhir: detail.jangka_waktu_akhir })
                    // }
                    if (detail.jangka_waktu_awal) {
                        const jangkaAwal = {
                            value: detail.jangka_waktu_awal,
                            label: detail.jangka_waktu_awal
                        }
                        setJangkaWaktuAwal(jangkaAwal);
                        reset({ jangka_waktu_awal: jangkaAwal })
                    }
                    if (detail.jangka_waktu_akhir) {
                        const jangkaAkhir = {
                            value: detail.jangka_waktu_akhir,
                            label: detail.jangka_waktu_akhir
                        }
                        setJangkaWaktuAkhir(jangkaAkhir);
                        reset({ jangka_waktu_akhir: jangkaAkhir })
                    }
                    if (detail.periode_pelaporan) {
                        const periode = {
                            value: detail.periode_pelaporan,
                            label: detail.periode_pelaporan,
                        }
                        setPeriodePelaporan(periode);
                        reset({ periode_pelaporan: periode });
                    }
                } else {
                    if (User?.roles == 'level_1') {
                        setDataNew(false);
                    } else {
                        setDataNew(true);
                    }
                    if (detail.nama_parent) {
                        setTujuanRekin(detail.nama_parent);
                        reset({ tujuan_rekin: detail.nama_parent });
                    }
                    if (detail.rencana_kinerja) {
                        setRekin(detail.rencana_kinerja.Nama_rencana_kinerja);
                        if (detail.rencana_kinerja.indikator.length > 0) {
                            const indikator = detail.rencana_kinerja.indikator[0]; // Ambil elemen pertama dari array indikator
                            const targetData = indikator.targets.length > 0 ? indikator.targets[0] : null; // Ambil elemen pertama dari array targets

                            // Set state dengan data yang diambil
                            setNamaIndikator(indikator.nama_indikator);
                            setTarget(targetData?.target || ""); // Default ke string kosong jika targetData null
                            setSatuan(targetData?.satuan || ""); // Default ke string kosong jika targetData null
                        }
                    }
                    if (detail.sumber_data) {
                        setSumberData(detail.sumber_data);
                        reset({ sumber_data: detail.sumber_data });
                    }
                    if (detail.formula) {
                        setFormula(detail.formula);
                        reset({ formula: detail.formula });
                    }
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        if (User?.roles != undefined || User?.roles != null) {
            fetchManual(`manual_ik/detail/${id}`);
        }
    }, [token, id, reset, Success, Tahun, User]);

    const BulanOption = [
        { value: "Januari", label: "Januari" },
        { value: "Februari", label: "Februari" },
        { value: "Maret", label: "Maret" },
        { value: "April", label: "April" },
        { value: "Mei", label: "Mei" },
        { value: "Juni", label: "Juni" },
        { value: "Juli", label: "Juli" },
        { value: "Agustus", label: "Agustus" },
        { value: "September", label: "September" },
        { value: "Oktober", label: "Oktober" },
        { value: "November", label: "November" },
        { value: "Desember", label: "Desember" }
    ]

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            perspektif: Perspektif?.value,
            tujuan_rekin: TujuanRekin,
            definisi: Definisi,
            key_activities: KeyActivity,
            formula: Formula,
            jenis_indikator: JenisIndikator,
            output_data: {
                kinerja: checkKinerja,
                penduduk: checkPenduduk,
                spatial: checkSpatial,
            },
            unit_penanggung_jawab: UnitPenanggunaJawab,
            unit_penyedia_data: UnitPenyediaData,
            sumber_data: SumberData,
            jangka_waktu_awal: JangkaWaktuAwal?.value,
            jangka_waktu_akhir: JangkaWaktuAkhir?.value,
            periode_pelaporan: PeriodePelaporan?.value,
        }
        // console.log(formData);
        // console.log('data baru :', DataNew);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/manual_ik/${DataNew ? 'create' : 'update'}/${id}`, {
                // const response = await fetch(`${API_URL}/manual_ik/create/${id}`, {
                method: DataNew ? "POST" : "PUT",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "Manual Indikator Kinerja berhasil disimpan", "success", 2000);
                setSuccess((prev) => !prev);
                // console.log(result);
                router.push('/rencanakinerja');
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
                console.log(result);
            }
        } catch (err) {
            AlertNotification("Gagal", "periksa koneksi internet / database server", "error", 2000);
        } finally {
            setProses(false);
        }
    }

    const optionPerspektif: OptionTypeString[] = [
        { label: "Penerima Layanan", value: "Penerima Layanan" },
        { label: "Proses Bisnis", value: "Proses Bisnis" },
        { label: "Penguatan Internal", value: "Penguatan Internal" },
        { label: "Anggaran", value: "Anggaran" }
    ];
    const optionJenisIndikatorKinerja: OptionTypeString[] = [
        { label: "Output", value: "Output" },
        { label: "Outcome", value: "Outcome" }
    ];
    const optionPeriodePelaporan: OptionTypeString[] = [
        { label: "Bulanan", value: "Bulanan" },
        { label: "Triwulan", value: "Triwulan" },
        { label: "Semester", value: "Semester" },
        { label: "Tahunan", value: "Tahunan" }
    ];

    const handleCheckKinerja = () => {
        setCheckKinerja((prev) => !prev);
    }
    const handleCheckPenduduk = () => {
        setCheckPenduduk((prev) => !prev);
    }
    const handleCheckSpatial = () => {
        setCheckSpatial((prev) => !prev);
    }
    const handleJenisIndikatorKinerja = (text: string) => {
        setJenisIndikator(text);
    }

    if (Loading) {
        return (
            <div className="p-5">
                <LoadingSync />
            </div>
        )
    }
    return (
        <>
            <div className="flex w-full mb-[100px] border-2 border-black rounded-xl bg-white shadow-md">
                <form className="p-3 w-full" onSubmit={handleSubmit(onSubmit)}>
                    {/* PERSPEKTIF */}
                    <div className="flex w-full">
                        <label htmlFor="perspektif" className="px-5 py-5 border-y border-l border-black w-[200px] bg-white">Perspektif</label>
                        <div className="px-5 py-5 border border-black w-full bg-white">
                            <Controller
                                name="perspektif"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Perspektif"
                                            options={optionPerspektif}
                                            value={Perspektif || field.value}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setPerspektif(option);
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
                                    </>
                                )}
                            />
                            <div className="flex flex-col p-2 border border-gray-500 mt-2 text-gray-500 font-light text-sm">
                                <div className="flex items-start">
                                    <div className='text-center mr-2 min-w-4'>
                                        <p>1.</p>
                                    </div>
                                    <div>
                                        <p>Apabila bermanfaat secara internal, membantu tercapainya tujuan jangka panjang, dan lebih berfokus pada intangible assets maka masuk penguatan internal (learn & growth perspective).</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className='text-center mr-2 min-w-4'>
                                        <p>2.</p>
                                    </div>
                                    <p>Apabila bermanfaat secara internal, membantu tercapainya tujuan jangka panjang, dan lebih berfokus pada sdivategy maka masuk proses bisnis (internal Process Perspective).</p>
                                    <div>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className='text-center mr-2 min-w-4'>
                                        <p>3.</p>
                                    </div>
                                    <div>
                                        <p>Apabila bermanfaat secara internal dan eksternal, membantu tercapainya tujuan jangka pendek, dan lebih berfokus pada output & outcome yg dihasilkan maka masuk perspektif penerima layanan (stakeholder/customer perspective).</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className='text-center mr-2 min-w-4'>
                                        <p>4.</p>
                                    </div>
                                    <div>
                                        <p>Apabila menggambarkan kinerja dalam rangka efektifitas dan efisien penggunaan anggaran maka masuk dalam perspektif anggaran.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* RENCANA HASIL KINERJA */}
                    <div className="flex w-full">
                        <div className="px-5 py-5 border-b border-l border-black w-[200px] bg-white">Rencana Hasil Kinerja</div>
                        <div className="px-5 py-5 border-b border-x border-black w-full bg-white">
                            <div className="border px-4 py-2 rounded-lg w-full border-black">{Rekin ? Rekin : "Otomatis setelah mengisi Manual IK"}</div>
                        </div>
                    </div>
                    {/* TUJUAN RENCANA HASIL KINERJA */}
                    <div className="flex w-full">
                        <label htmlFor="tujuan_rekin" className="px-5 py-5 border-b border-l border-black w-[200px] bg-white">Tujuan Rencana Hasil Kinerja</label>
                        <div className="px-5 py-5 border-b border-x border-black w-full bg-white">
                            <Controller
                                name="tujuan_rekin"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <textarea
                                            {...field}
                                            className="border border-black px-4 py-2 rounded-lg w-full"
                                            value={TujuanRekin}
                                            onChange={(event) => {
                                                field.onChange(event);
                                                setTujuanRekin(event.target.value);
                                            }}
                                            placeholder="Menjelaskan Manfaat dari Rencana Hasil Kinerja"
                                        />
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    {/* INDIKATOR KINERJA */}
                    <div className="flex w-full">
                        <div className="px-5 py-5 border-b border-l border-black w-[200px] bg-white">Indikator Kinerja</div>
                        <div className="px-5 py-5 border-b border-x border-black flex flex-col w-full gap-2 bg-white">
                            <label htmlFor="target" className="text-gray-500 text-xs ml-1">Indikator</label>
                            <div className="border border-black px-4 py-2 rounded-lg w-full">{NamaIndikator ? NamaIndikator : "Otomatis Setelah mengisi Manual IK"}</div>
                            <label htmlFor="target" className="text-gray-500 text-xs ml-1 mt-2">Target / Satuan</label>
                            <div className="border border-black px-4 py-2 rounded-lg w-full">{Target || "-"} / {Satuan || "-"}</div>
                        </div>
                    </div>
                    {/* DESKRIPSI INDIKATOR KINERJA INDIVIDU */}
                    <div className="flex w-full">
                        <div className="px-5 py-5 border-b border-l border-black w-[200px] bg-white">Deskripsi Indikator Kinerja Individu</div>
                        <div className="px-5 py-5 border-b border-x border-black flex flex-col w-full gap-2 bg-white">
                            {/* DEFINISI */}
                            <label htmlFor="definisi" className="text-gray-500 text-xs ml-1">Definisi</label>
                            <Controller
                                name="definisi"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <textarea
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setDefinisi(e.target.value);
                                            }}
                                            value={Definisi}
                                            className="border border-black px-4 py-2 rounded-lg w-full"
                                            placeholder="Menjelaskan penjelasan dari indikator kinerja. Bisa dijelaskan dengan detail atau perintah yang ingin diturunkan kebawahan"
                                        />
                                    </>
                                )}
                            />
                            {/* KEY */}
                            <label htmlFor="key_activities" className="text-gray-500 text-xs ml-1 mt-2">Key Activities</label>
                            <Controller
                                name="key_activities"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <textarea
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setKeyActivity(e.target.value);
                                            }}
                                            value={KeyActivity}
                                            className="border border-black px-4 py-2 rounded-lg w-full"
                                            placeholder="Hal yang paling menentukan dalam pencapaian rencana hasil kerja"
                                        />
                                    </>
                                )}
                            />
                            {/* FORMULA */}
                            <label htmlFor="formula" className="text-gray-500 text-xs ml-1 mt-2">Formula</label>
                            <Controller
                                name="formula"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <textarea
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setFormula(e.target.value);
                                            }}
                                            value={Formula}
                                            className="border border-black px-4 py-2 rounded-lg w-full"
                                            placeholder="Menjelaskan bagaimana cara perhitungan target indikator"
                                        />
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    {/* METODE PENGUKURAN */}
                    <div className="flex w-full">
                        <div className="px-5 py-5 border-b border-l border-black w-[200px] bg-white">Metode Pengukuran</div>
                        <div className="px-5 py-5 border-b border-x border-black flex flex-col w-full gap-2 bg-white">
                            <div className="border border-black px-4 py-2 rounded-lg w-full">{Satuan || "-"}</div>
                        </div>
                    </div>
                    {/* JENIS INDIKATOR KINERJA */}
                    <div className="flex w-full">
                        <label htmlFor='jenis_indikator' className="px-5 py-5 border-b border-l border-black w-[200px] bg-white">Jenis Indikator Kinerja</label>
                        <div className="px-5 py-5 border-b border-x border-black flex flex-col w-full gap-2 bg-white">
                            <div className="flex gap-5 w-full">
                                <div className="flex gap-2 items-center">
                                    {JenisIndikator === "Outcome" ?
                                        <button
                                            type="button"
                                            onClick={() => handleJenisIndikatorKinerja('')}
                                            className="w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                        >
                                            <TbCheck />
                                        </button>
                                        :
                                        <button
                                            type="button"
                                            onClick={() => handleJenisIndikatorKinerja('Outcome')}
                                            className="w-[20px] h-[20px] border border-black rounded-full"
                                        ></button>
                                    }
                                    <p onClick={() => handleJenisIndikatorKinerja(JenisIndikator !== 'Outcome' ? 'Outcome' : '')} className={`cursor-pointer ${JenisIndikator === 'Outcome' && 'text-emerald-500'}`}>Outcome</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    {JenisIndikator === "Outcome Antara" ?
                                        <button
                                            type="button"
                                            onClick={() => handleJenisIndikatorKinerja('')}
                                            className="w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                        >
                                            <TbCheck />
                                        </button>
                                        :
                                        <button
                                            type="button"
                                            onClick={() => handleJenisIndikatorKinerja('Outcome Antara')}
                                            className="w-[20px] h-[20px] border border-black rounded-full"
                                        ></button>
                                    }
                                    <p onClick={() => handleJenisIndikatorKinerja(JenisIndikator !== 'Outcome Antara' ? 'Outcome Antara' : '')} className={`cursor-pointer ${JenisIndikator === 'Outcome Antara' && 'text-emerald-500'}`}>Outcome Antara</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    {JenisIndikator === "Output" ?
                                        <button
                                            type="button"
                                            onClick={() => handleJenisIndikatorKinerja('')}
                                            className="w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                        >
                                            <TbCheck />
                                        </button>
                                        :
                                        <button
                                            type="button"
                                            onClick={() => handleJenisIndikatorKinerja('Output')}
                                            className="w-[20px] h-[20px] border border-black rounded-full"
                                        ></button>
                                    }
                                    <p onClick={() => handleJenisIndikatorKinerja(JenisIndikator !== 'Output' ? 'Output' : '')} className={`cursor-pointer ${JenisIndikator === 'Output' && 'text-emerald-500'}`}>Output</p>
                                </div>
                            </div>
                            <label className="text-sm text-gray-300 italic">*Pilih salah satu</label>
                        </div>
                    </div>
                    {/* OUTPUT DATA */}
                    <div className="flex w-full">
                        <label className="px-5 py-5 border-b border-l border-black w-[200px] bg-white">Output Data</label>
                        <div className="px-5 py-5 border-b border-x border-black flex flex-col flex-wrap w-full gap-2 bg-white">
                            <div className="flex gap-5 w-full">
                                <div className="flex gap-2 items-center">
                                    {checkKinerja ?
                                        <button
                                            type="button"
                                            onClick={handleCheckKinerja}
                                            className="w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                        >
                                            <TbCheck />
                                        </button>
                                        :
                                        <button
                                            type="button"
                                            onClick={handleCheckKinerja}
                                            className="w-[20px] h-[20px] border border-black rounded-full"
                                        ></button>
                                    }
                                    <p onClick={handleCheckKinerja} className={`cursor-pointer ${checkKinerja && 'text-emerald-500'}`}>Kinerja</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    {checkPenduduk ?
                                        <button
                                            type="button"
                                            onClick={handleCheckPenduduk}
                                            className="w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                        >
                                            <TbCheck />
                                        </button>
                                        :
                                        <button
                                            type="button"
                                            onClick={handleCheckPenduduk}
                                            className="w-[20px] h-[20px] border border-black rounded-full"
                                        ></button>
                                    }
                                    <p onClick={handleCheckPenduduk} className={`cursor-pointer ${checkPenduduk && 'text-emerald-500'}`}>Penduduk</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    {checkSpatial ?
                                        <button
                                            type="button"
                                            onClick={handleCheckSpatial}
                                            className="w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                        >
                                            <TbCheck />
                                        </button>
                                        :
                                        <button
                                            type="button"
                                            onClick={handleCheckSpatial}
                                            className="w-[20px] h-[20px] border border-black rounded-full"
                                        ></button>
                                    }
                                    <p onClick={handleCheckSpatial} className={`cursor-pointer ${checkSpatial && 'text-emerald-500'}`}>Spatial</p>
                                </div>
                            </div>
                            <label className="text-sm text-gray-300 italic">*Bisa pilih lebih dari satu</label>
                        </div>
                    </div>
                    {/* UNIT PENANGGUNG JAWAB */}
                    <div className="flex w-full">
                        <label htmlFor='unit_penanggung_jawab' className="px-5 py-5 border-b border-l border-black w-[200px] bg-white">Unit Penanggung Jawab</label>
                        <div className="px-5 py-5 border-b border-x border-black flex flex-col w-full gap-2 bg-white">
                            <Controller
                                name="unit_penanggung_jawab"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            id='unit_penanggung_jawab'
                                            value={UnitPenanggunaJawab || field.value}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setUnitPenanggunaJawab(e.target.value);
                                            }}
                                            className="border border-black px-4 py-2 rounded-lg w-full"
                                            placeholder="masukkan unit penanggung jawab"
                                        />
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    {/* UNIT PENYEDIA DATA */}
                    <div className="flex w-full">
                        <label htmlFor='unit_penyedia_data' className="px-5 py-5 border-b border-l border-black w-[200px] bg-white">Unit Penyedia Data</label>
                        <div className="px-5 py-5 border-b border-x border-black flex flex-col w-full gap-2 bg-white">
                            <Controller
                                name='unit_penyedia_data'
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            value={UnitPenyediaData}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setUnitPenyediaData(e.target.value);
                                            }}
                                            className="border border-black px-4 py-2 rounded-lg w-full"
                                            placeholder="Instansi yang memproduksi datanya"
                                        />
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    {/* SUMBER DATA */}
                    <div className="flex w-full">
                        <label htmlFor='sumber_data' className="px-5 py-5 border-b border-l border-black w-[200px] bg-white">Sumber Data</label>
                        <div className="px-5 py-5 border-b border-x border-black flex flex-col w-full gap-2 bg-white">
                            <Controller
                                name='sumber_data'
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            value={SumberData}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setSumberData(e.target.value);
                                            }}
                                            className="border border-black px-4 py-2 rounded-lg w-full"
                                            placeholder="Dari dokumen apa sumber data di ambil"
                                        />
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    {/* JANGKA WAKTU */}
                    <div className="flex w-full">
                        <div className="px-5 py-5 border-b border-l border-black w-[200px] bg-white">Jangka Waktu</div>
                        <div className="px-5 py-5 border-b border-x border-black flex flex-col w-full gap-2 bg-white">
                            <Controller
                                name="jangka_waktu_awal"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            value={JangkaWaktuAwal}
                                            options={BulanOption}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setJangkaWaktuAwal(option);
                                            }}
                                            placeholder="Dari"
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
                                    </>
                                )}
                            />
                            <Controller
                                name="jangka_waktu_akhir"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            value={JangkaWaktuAkhir}
                                            options={BulanOption}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setJangkaWaktuAkhir(option);
                                            }}
                                            placeholder="Sampai"
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
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    {/* PERIODE PELAPORAN */}
                    <div className="flex w-full">
                        <label htmlFor='periode_pelaporan' className="px-5 py-5 border-b border-l border-black w-[200px] bg-white">Periode Pelaporan</label>
                        <div className="px-5 py-5 border-b border-x border-black flex flex-col w-full gap-2 bg-white">
                            <Controller
                                name='periode_pelaporan'
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Periode Pelaporan"
                                            value={PeriodePelaporan}
                                            options={optionPeriodePelaporan}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setPeriodePelaporan(option)
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
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    {/* BUDGET */}
                    <div className="flex w-full">
                        <div className="px-5 py-5 border-b border-l border-black w-[200px] bg-white">Budget</div>
                        <div className="px-5 py-5 border-b border-x border-black flex flex-col w-full gap-2 bg-white">
                            <div className="border border-black px-4 py-2 rounded-lg w-full text-gray-400 italic">Otomatis setelah menyusun Anggaran</div>
                        </div>
                    </div>

                    <ButtonSky className="flex gap-2 items-center w-full mt-3" type='submit' disabled={Proses}>
                        {Proses ?
                            <>
                                <LoadingButtonClip />
                                <p>
                                    Menyimpan
                                </p>
                            </>
                            :
                            <>
                                <TbDeviceFloppy />
                                <p>
                                    Simpan Manual Indikator Kinerja
                                </p>
                            </>
                        }
                    </ButtonSky>
                    <ButtonRed className="flex gap-2 items-center w-full mt-2 mb-4" type='button' halaman_url='/rencanakinerja' disabled={Proses}>
                        <TbArrowBack />
                        Kembali Ke Rencana Kinerja
                    </ButtonRed>
                </form>
            </div>
        </>
    )
}

export default FormManualIk;