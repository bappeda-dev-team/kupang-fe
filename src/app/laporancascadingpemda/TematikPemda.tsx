'use client'

import { getToken } from '@/components/lib/Cookie';
import { useState, useEffect, useRef } from 'react';
import Select from 'react-select'
import { TahunNull } from '@/components/global/OpdTahunNull';
import { useRouter, useSearchParams } from 'next/navigation';
import { ButtonBlackBorder } from '@/components/global/Button';
import { TbEye } from 'react-icons/tb';
import { useBrandingContext } from '@/context/BrandingContext';
import { PohonLaporan } from '@/components/lib/Pohon/Cascading/PohonLaporan';
import PohonTematik from '@/components/pages/Pohon/TematikKab/PohonTematik';

interface OptionType {
    value: number;
    label: string;
}

const TematikPemda = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [TematikOption, setTematikOption] = useState<OptionType[]>([]);
    const [Tematik, setTematik] = useState<OptionType | null>(null);

    const token = getToken();
    const {branding} = useBrandingContext();
    const Tahun = branding?.tahun ? branding?.tahun?.value : 0;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [IsLoading, setIsLoading] = useState<boolean>(false);

    // SHOW ALL
    const [ShowAll, setShowAll] = useState<boolean>(false);

    useEffect(() => {
        // Ambil parameter dari URL saat komponen dimuat
        const temaFromUrl = searchParams.get('tema');
        const idFromUrl = searchParams.get('id');

        if (temaFromUrl && idFromUrl) {
            // Set Tematik berdasarkan parameter URL jika ada
            setTematik({ label: temaFromUrl, value: Number(idFromUrl) });
        }
    }, [searchParams]);

    const fetchTematik = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/pohon_kinerja/tematik/${Tahun}`, {
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
            const tema = data.data.map((item: any) => ({
                value: item.id,
                label: item.nama_pohon,
            }));
            setTematikOption(tema);
        } catch (err) {
            console.log('gagal mendapatkan data opd');
        } finally {
            setIsLoading(false);
        }
    };

    if (Tahun == undefined) {
        return <TahunNull />
    }

    const handleSetTematik = (tema: any) => {
        if (!tema) {
            setTematik(null); // Jika tema dihapus, reset Tematik
            router.push(`/laporancascadingpemda`);
            return;
        }
        setTematik(tema);
        router.push(`/laporancascadingpemda?tema=${tema.label}&id=${tema.value}`);
    };

    return (
        <>
            <div className="flex flex-col p-5 border-2 rounded-xl mt-3">
                <div className="flex flex-col">
                    <label
                        className="uppercase text-xs font-bold mb-2"
                        htmlFor="tematik"
                    >
                        Tema :
                    </label>
                    <Select
                        isSearchable
                        isClearable
                        options={TematikOption}
                        isLoading={IsLoading}
                        onChange={(option) => {
                            handleSetTematik(option)
                            setShowAll(false);
                        }}
                        placeholder="Masukkan Tema"
                        value={
                            searchParams.get('tema') === undefined || !Tematik ?
                                { label: "Pilih Tematik", value: "" }
                                :
                                { label: Tematik?.label, value: Tematik?.value }
                        }
                        onMenuOpen={() => {
                            if (TematikOption.length == 0) {
                                fetchTematik();
                            }
                        }}
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '8px',
                            })
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between p-5 border-2 rounded-t-xl mt-2">
                {!Tematik ?
                    <h1 className="font-semibold">Pilih Tematik terlebih dahulu</h1>
                    :
                    <>
                        <ButtonBlackBorder
                            onClick={() => {
                                if (ShowAll) {
                                    setShowAll(false);
                                } else {
                                    setShowAll(true);
                                }
                            }}
                        >
                            <TbEye className='mr-1' />
                            {ShowAll ? 
                                'Sembunyikan Semua Pohon'
                            :
                                'Tampilkan Semua Pohon'
                            }
                        </ButtonBlackBorder>
                    </>
                }
            </div>
            {Tematik &&
                <div className='flex flex-col py-3 px-3 border-b-2 border-x-2 rounded-b-xl relative w-full h-[calc(100vh-50px)] max-h-screen overflow-auto'>
                    <div className="flex flex-col p-2 rounded-b-xl">
                        <div ref={containerRef} className="tf-tree text-center mt-3">
                            <PohonTematik
                                id={Tematik?.value}
                                show_all={ShowAll}
                                jenis='laporan'
                                set_show_all={() => {
                                    setShowAll(true)
                                }}
                            />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default TematikPemda;