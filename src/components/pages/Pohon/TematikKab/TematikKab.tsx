'use client'

import { getOpdTahun, getToken } from '@/components/lib/Cookie';
import { useState, useEffect, useRef } from 'react';
import Select from 'react-select'
import PohonTematik from './PohonTematik';
import { TahunNull } from '@/components/global/OpdTahunNull';
import { useRouter, useSearchParams } from 'next/navigation';
import { ButtonBlackBorder, ButtonSky } from '@/components/global/Button';
import { TbEye, TbPrinter } from 'react-icons/tb';
import html2canvas from 'html2canvas';
import { AlertNotification, AlertQuestion2 } from '@/components/global/Alert';

interface OptionType {
    value: number;
    label: string;
}

const TematikKab = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [Tahun, setTahun] = useState<any>(null);
    const [TematikOption, setTematikOption] = useState<OptionType[]>([]);
    const [Tematik, setTematik] = useState<OptionType | null>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

    const token = getToken();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [LoadingCetak, setLoadingCetak] = useState<boolean>(false);

    // SHOW ALL
    const [ShowAll, setShowAll] = useState<boolean>(false);

    useEffect(() => {
        const data = getOpdTahun();
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, []);

    useEffect(() => {
        // Ambil parameter dari URL saat komponen dimuat
        const temaFromUrl = searchParams.get('tema');
        const idFromUrl = searchParams.get('id');

        if (temaFromUrl && idFromUrl) {
            // Set Tematik berdasarkan parameter URL jika ada
            setTematik({ label: temaFromUrl, value: Number(idFromUrl) });
        }
    }, [searchParams]);

    const handleDownloadPdf = async () => {
        if (!containerRef.current) return;

        const elementsToHide = document.querySelectorAll(".hide-on-capture") as NodeListOf<HTMLElement>;
        elementsToHide.forEach((el) => (el.style.display = "none"));

        try {
            setLoadingCetak(true);
            const element = containerRef.current;
            const canvas = await html2canvas(element, {
                scale: 2, // Higher scale for better quality
                width: element.scrollWidth + 50, // Use full scrollable width
                height: element.scrollHeight + 250, // Use full scrollable height
                windowWidth: element.scrollWidth + 50, // Force full width rendering
                windowHeight: element.scrollHeight + 250, // Force full height rendering
                useCORS: true, // For cross-origin images
            });

            // Create a new canvas with extra padding
            const paddingTop = 50 // Extra padding for the top of the canvas
            const newCanvas = document.createElement("canvas");
            newCanvas.width = canvas.width;
            newCanvas.height = canvas.height + paddingTop;

            const ctx = newCanvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "white"; // Optional: Background color
                ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
                ctx.drawImage(canvas, 0, paddingTop);

                //hitung posisi horizontal untuk centering
                const horizontalOffset = (newCanvas.width - canvas.width) / 2;

                // Gambar canvas di tengah horizontal
                ctx.drawImage(canvas, horizontalOffset, paddingTop);
            }

            const imgData = newCanvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = imgData;
            link.download = `pohon_kinerja_pemda_${Tahun?.label ?? 'tahun_undetected'}.png`;
            link.click();
        } catch (error) {
            alert("Error capturing the element");
            console.error("Error capturing the element:", error);
        } finally {
            // Ensure elements are restored even if an error occurs
            elementsToHide.forEach((el) => (el.style.display = ""));
            setLoadingCetak(false);
        }
    };
    const fetchTematik = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/pohon_kinerja/tematik/${Tahun?.value}`, {
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

    if (Tahun?.value == undefined) {
        return <TahunNull />
    }

    const handleSetTematik = (tema: any) => {
        if (!tema) {
            setTematik(null); // Jika tema dihapus, reset Tematik
            router.push(`/pohonkinerjapemda`);
            return;
        }
        setTematik(tema);
        // router.push(`/pohonkinerjapemda?tema=${tema.label}&id=${tema.value}`);
        router.push(`/pohonkinerjapemda`);
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
                        <ButtonSky
                            onClick={() => {
                                AlertQuestion2("Sembunyikan Sidebar untuk hasil cetak penuh", "", "warning", "Cetak", "Batal").then((result) => {
                                    if (result.isConfirmed) {
                                        handleDownloadPdf();
                                        if (!containerRef.current) {
                                            AlertNotification("REF NULL", "", "error", 1000);
                                        }
                                    }
                                });
                            }}
                        >
                            <TbPrinter className='mr-1' />
                            Cetak Pohon Kinerja
                        </ButtonSky>
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
                                jenis='pemda'
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

export default TematikKab;