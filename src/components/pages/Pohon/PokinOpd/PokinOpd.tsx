'use client'

import '@/components/pages/Pohon/treeflex.css'
import React, { useState, useEffect, useRef } from 'react';
import { TbPencil, TbCheck, TbCircleLetterXFilled, TbCirclePlus, TbHandStop, TbPointer, TbSettings, TbHourglass, TbCopy, TbEye, TbPrinter } from 'react-icons/tb';
import { ButtonGreenBorder, ButtonSkyBorder, ButtonRedBorder, ButtonBlackBorder, ButtonBlack, ButtonSky } from '@/components/global/Button';
import { LoadingBeat, LoadingButtonClip, LoadingButtonClip2, LoadingClip, LoadingSync } from '@/components/global/Loading';
import { OpdTahunNull, TahunNull } from '@/components/global/OpdTahunNull';
import { PohonOpd } from '@/components/lib/Pohon/Opd/PohonOpd';
import { FormPohonOpd } from '@/components/lib/Pohon/Opd/FormPohonOpd';
import { getUser, getToken, getOpdTahun } from '@/components/lib/Cookie';
import { ModalPohonPemda, ModalPohonCrosscutting } from './ModalPohonPemda';
import { ModalTujuanOpd } from '../../tujuanopd/ModalTujuanOpd';
import { ModalClone } from '../ModalClone';
import html2canvas from 'html2canvas';
import { AlertNotification, AlertQuestion2 } from '@/components/global/Alert';
import { useBrandingContext } from '@/context/BrandingContext';

interface OptionType {
    value: number;
    label: string;
}
interface PokinPemda {
    value: number;
    label: string;
    jenis: string;
}
interface pokin {
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    tujuan_opd: tujuan[];
    childs: childs[]
}
interface tujuan {
    id: number;
    tujuan: string;
}
interface childs {
    id: number;
    parent: number;
    strategi: string;
    target: string;
    satuan: string;
    keterangan: string;
    indikators: string;
    childs: childs[];
}
interface TujuanOpd {
    id_tujuan_opd: number;
    tujuan: string;
}

const PokinOpd = () => {
    const {branding} = useBrandingContext();
    const nama_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.label : branding?.user?.nama_opd;
    const kode_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;

    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [Pokin, setPokin] = useState<pokin | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [LoadingCetak, setLoadingCetak] = useState<boolean>(false);

    const [Kendali, setKendali] = useState<boolean>(true);
    const [OpenModalTujuanOpd, setOpenModalTujuanOpd] = useState<boolean>(false);

    //rekapitulasi jumlah pohon dari pemda
    const [LoadingTotalPending, setLoadingTotalPending] = useState<boolean>(false);
    const [JumlahPemdaStrategic, setJumlahPemdaStrategic] = useState<PokinPemda[]>([]);
    const [JumlahPemdaTactical, setJumlahPemdaTactical] = useState<PokinPemda[]>([]);
    const [JumlahPemdaOperational, setJumlahPemdaOperational] = useState<PokinPemda[]>([]);

    //pohon pemda
    const [PohonPemda, setPohonPemda] = useState<boolean>(false);
    const [TriggerAfterPokinOutside, setTriggerAfterPokinOutside] = useState<boolean>(false);
    const [LevelPemda, setLevelPemda] = useState<number>(0);

    const [LoadingTotalPemda, setLoadingTotalPemda] = useState<boolean>(false);
    const [StrategicPemdaLength, setStrategicPemdaLenght] = useState<number>(0);
    const [TacticalPemdaLength, setTacticalPemdaLenght] = useState<number>(0);
    const [OperationalPemdaLength, setOperationalPemdaLenght] = useState<number>(0);
    
    //pohon cross opd lain
    const [LoadingTotalCrosscutting, setLoadingTotalCrosscutting] = useState<boolean>(false);
    const [PohonCrosscutting, setPohonCrosscutting] = useState<boolean>(false);
    const [CrossPending, setCrossPending] = useState<number | null>(null);
    const [CrossDitolak, setCrossDitolak] = useState<number | null>(null);

    //clone
    const [Clone, setClone] = useState<boolean>(false);

    //show all
    const [ShowAll, setShowAll] = useState<boolean>(false);
    const [ShowAllDetail, setShowAllDetail] = useState<boolean>(false);

    const [error, setError] = useState<string>('');
    const token = getToken();

    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [Deleted, setDeleted] = useState<boolean>(false);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });
    const [cursorMode, setCursorMode] = useState<"normal" | "hand">("normal");
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
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
            link.download =
                User?.roles == 'super_admin'
                    ? `pohon_kinerja_opd_${SelectedOpd?.value ?? 'opd_undetected'}_${Tahun?.label ?? 'tahun_undetected'
                    }.png`
                    : `pohon_kinerja_opd_${User?.kode_opd ?? 'opd_undetected'}_${Tahun?.label ?? 'tahun_undetected'
                    }.png`;
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
    const toggleCursorMode = () => {
        setCursorMode((prevMode) => (prevMode === "normal" ? "hand" : "normal"));
    }
    const handleMouseDown = (e: React.MouseEvent) => {
        if (cursorMode === "normal") return; // Ignore if cursor is normal

        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        if (containerRef.current) {
            setScrollStart({
                x: containerRef.current.scrollLeft,
                y: containerRef.current.scrollTop,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        const dx = dragStart.x - e.clientX;
        const dy = dragStart.y - e.clientY;
        containerRef.current.scrollLeft = scrollStart.x + dx;
        containerRef.current.scrollTop = scrollStart.y + dy;
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleModalPohonPemda = (level: number) => {
        setPohonPemda((prev) => !prev);
        setLevelPemda(level);
    }
    const handleModalCrosscutting = () => {
        setPohonCrosscutting((prev) => !prev);
    }
    const handleTriggerAfterPokinOutside = () => {
        setTriggerAfterPokinOutside((prev) => !prev);
    }

    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
    };

    const handleModalNewTujuan = () => {
        if (OpenModalTujuanOpd) {
            setOpenModalTujuanOpd(false);
        } else {
            setOpenModalTujuanOpd(true);
        }
    }

    // FETCH SEMUA POHON OPD
    useEffect(() => {
        const fetchPokinOpd = async (url: string) => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            //FETCH POKIN OPD
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/${url}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data || [];
                setPokin(data);
            } catch (err) {
                setError('gagal mendapatkan data, terdapat kesalahan backend/server saat mengambil data pohon kinerja perangkat daerah');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (User?.roles == 'super_admin' || User?.roles == 'reviewer') {
            if (SelectedOpd?.value != undefined && Tahun?.value != undefined) {
                fetchPokinOpd(`pohon_kinerja_opd/findall/${SelectedOpd?.value}/${Tahun?.value}`);
            }
        } else if (User?.roles != 'super_admin') {
            if (User?.kode_opd != undefined && Tahun?.value != undefined) {
                fetchPokinOpd(`pohon_kinerja_opd/findall/${User?.kode_opd}/${Tahun?.value}`);
            }
        }
    }, [User, SelectedOpd, Tahun, token, TriggerAfterPokinOutside]);

    // FETCH STATUS POHON PEMDA & CROSSCUTTING DI CONTROL POKIN 
    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchControlPokin = async () => {
            //FETCH JUMLAH POHON PEMDA YANG DITERIMA
            try {
                setLoadingTotalPending(true);
                const url = (User?.roles == 'super_admin' || User?.roles == 'reviewer') ? `pohon_kinerja_opd/count_pokin_pemda/${SelectedOpd?.value}/${Tahun?.value}` : `pohon_kinerja_opd/count_pokin_pemda/${User?.kode_opd}/${Tahun?.value}`;
                const response = await fetch(`${API_URL}/${url}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data.detail_level || [];
                if (data.length !== 0) {
                    // console.log('strategic : ', data[0].jumlah_pemda, 'tactical : ', data[0].jumlah_pemda, 'operatiocal : ', data[0].jumlah_pemda);
                    setStrategicPemdaLenght(data[0].jumlah_pemda);
                    setTacticalPemdaLenght(data[1].jumlah_pemda);
                    setOperationalPemdaLenght(data[2].jumlah_pemda);
                } else {
                    return null;
                }
            } catch (err) {
                setError('gagal mendapatkan data pohon pemda yang diterima, terdapat kesalahan backend/server saat mengambil data pohon kinerja perangkat daerah');
                console.error(err);
            } finally {
                setLoadingTotalPending(false);
            }
            //FETCH STATUS POHON PEMDA
            try {
                setLoadingTotalPemda(true);
                const url = (User?.roles == 'super_admin' || User?.roles == 'reviewer') ? `pohon_kinerja/status/${SelectedOpd?.value}/${Tahun?.value}` : `pohon_kinerja/status/${User?.kode_opd}/${Tahun?.value}`;
                const response = await fetch(`${API_URL}/${url}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data || [];
                if (data) {
                    const Strategic = data.filter((item: any) => item.level_pohon == 4);
                    setJumlahPemdaStrategic(Strategic);
                    const Tactical = data.filter((item: any) => item.level_pohon == 5);
                    setJumlahPemdaTactical(Tactical);
                    const Operational = data.filter((item: any) => item.level_pohon == 6);
                    setJumlahPemdaOperational(Operational);
                }
            } catch (err) {
                setError('gagal mendapatkan data status pohon pemda, terdapat kesalahan backend/server saat mengambil data pohon kinerja perangkat daerah');
                console.error(err);
            } finally {
                setLoadingTotalPemda(false);
            }
            //FETCH STATUS POHON CROSSCUTTING
            try {
                setLoadingTotalCrosscutting(true);
                const url = (User?.roles == 'super_admin' || User?.roles == 'reviewer') ? `crosscutting_menunggu/${SelectedOpd?.value}/${Tahun?.value}` : `crosscutting_menunggu/${User?.kode_opd}/${Tahun?.value}`;
                const response = await fetch(`${API_URL}/${url}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data || [];
                if (data) {
                    const pending = data.filter((item: any) => item.status === "crosscutting_menunggu");
                    setCrossPending(pending.length);
                    const ditolak = data.filter((item: any) => item.status === "crosscutting_ditolak");
                    setCrossDitolak(ditolak.length);
                }
            } catch (err) {
                setError('gagal mendapatkan data status pohon crosscutting, terdapat kesalahan backend/server saat mengambil data pohon kinerja perangkat daerah');
                console.error(err);
            } finally {
                setLoadingTotalCrosscutting(false);
            }
        }
        fetchControlPokin();
    }, [User, SelectedOpd, Tahun, Deleted, token, TriggerAfterPokinOutside]);

    if (Loading) {
        return (
            <>
                <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                    <h1>Pohon Kinerja {SelectedOpd?.label}</h1>
                </div>
                <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                    <LoadingBeat />
                </div>
            </>
        )
    }
    if (error) {
        return (
            <>
                <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                    <h1>Pohon Kinerja</h1>
                </div>
                <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                    {error}
                </div>
            </>
        )
    }
    if (User?.roles == 'super_admin' || User?.roles == 'reviewer') {
        if (SelectedOpd?.value == undefined || Tahun?.value == undefined) {
            return (
                <>
                    <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                        <h1>Pohon Kinerja {SelectedOpd?.label}</h1>
                    </div>
                    <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <OpdTahunNull />
                    </div>
                </>
            )
        }
    }
    if (User?.roles != 'super_admin') {
        if (Tahun?.value == undefined) {
            return (
                <>
                    <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                        <h1>Pohon Kinerja {SelectedOpd?.label}</h1>
                    </div>
                    <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <TahunNull />
                    </div>
                </>
            )
        }
    }

    return (
        <>
            <div className="flex justify-between items-center p-5 border-2 rounded-t-xl mt-2">
                {(User?.roles == 'super_admin' || User?.roles === 'reviewer') ?
                    <h1 className="font-bold">Pohon Kinerja {SelectedOpd?.label}</h1>
                    :
                    User?.roles == 'admin_opd' ?
                        <h1 className="font-bold">Pohon Kinerja {Pokin?.nama_opd}</h1>
                        :
                        <h1 className="font-bold">Pohon Cascading {Pokin?.nama_opd}</h1>
                }
                {(User?.roles == 'admin_opd' || User?.roles == 'super_admin') &&
                    <ButtonBlackBorder onClick={() => setKendali((prev) => !prev)}>{Kendali ? <span className='flex gap-1 items-center'><TbSettings />Sembunyikan</span> : <span className='flex gap-1 items-center'><TbSettings />Tampilkan</span>}</ButtonBlackBorder>
                }
            </div>
            <div className="flex flex-col py-3 px-3 border-b-2 border-x-2 rounded-b-xl relative w-full h-[calc(100vh-50px)] max-h-screen overflow-auto">
                {(User?.roles == 'admin_opd' || User?.roles == 'super_admin') &&
                    <div className={`flex flex-wrap justify-between gap-2 transition-all duration-300 ease-in-out ${Kendali ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
                        {/* PEMDA */}
                        <div className="flex flex-col justify-between border-2 max-w-[400px] min-w-[300px] px-3 py-2 rounded-xl">
                            <h1 className="font-semibold border-b-2 py-1 text-center">
                                Pohon Pemda
                            </h1>
                            <div className="flex flex-col py-2 mt-1 justify-between">
                                <table>
                                    <tbody className='flex flex-col gap-2'>
                                        <tr className="flex items-center border border-red-500 text-red-500 cursor-pointer rounded-lg px-2 hover:bg-red-500 hover:text-white"
                                            onClick={() => handleModalPohonPemda(4)}
                                        >
                                            <td className="px-2 py-1 text-start min-w-[130px]">
                                                <button type="button" className="font-semibold">
                                                    Strategic
                                                </button>
                                            </td>
                                            <td className="py-1">
                                                <h1 className="font-semibold">
                                                    :
                                                </h1>
                                            </td>
                                            <td className='flex justify-center px-2 py-1 text-center w-full'>
                                                <h1 className="flex items-center gap-1 font-semibold">
                                                    {LoadingTotalPemda ?
                                                        <LoadingButtonClip2 />
                                                        :
                                                        JumlahPemdaStrategic?.length || 0
                                                    }
                                                    <TbHourglass />
                                                </h1>
                                            </td>
                                            <td className="py-1">
                                                <h1 className="font-semibold">
                                                    /
                                                </h1>
                                            </td>
                                            <td className='flex justify-center px-2 py-1 text-center w-full'>
                                                <h1 className="flex items-center gap-1 font-semibold">
                                                    {LoadingTotalPending ?
                                                        <LoadingButtonClip2 />
                                                        :
                                                        StrategicPemdaLength || 0
                                                    }
                                                    <TbCheck />
                                                </h1>
                                            </td>
                                        </tr>
                                        <tr className="flex items-center border border-blue-500 text-blue-500 cursor-pointer rounded-lg px-2 hover:bg-blue-500 hover:text-white"
                                            onClick={() => handleModalPohonPemda(5)}
                                        >
                                            <td className="px-2 py-1 text-start min-w-[130px]">
                                                <h1 className="font-semibold">
                                                    Tactical
                                                </h1>
                                            </td>
                                            <td className="py-1">
                                                <h1 className="font-semibold">
                                                    :
                                                </h1>
                                            </td>
                                            <td className='flex justify-center px-2 py-1 text-center w-full'>
                                                <h1 className="flex items-center gap-1 font-semibold">
                                                    {LoadingTotalPemda ?
                                                        <LoadingButtonClip2 />
                                                        :
                                                        JumlahPemdaTactical?.length || 0
                                                    }
                                                    <TbHourglass />
                                                </h1>
                                            </td>
                                            <td className="py-1">
                                                <h1 className="font-semibold">
                                                    /
                                                </h1>
                                            </td>
                                            <td className='flex justify-center px-2 py-1 text-center w-full'>
                                                <h1 className="flex items-center gap-1 font-semibold">
                                                    {LoadingTotalPending ?
                                                        <LoadingButtonClip2 />
                                                        :
                                                        TacticalPemdaLength || 0
                                                    }
                                                    <TbCheck />
                                                </h1>
                                            </td>
                                        </tr>
                                        <tr className="flex items-center border border-green-500 text-green-500 cursor-pointer rounded-lg px-2 hover:bg-green-500 hover:text-white"
                                            onClick={() => handleModalPohonPemda(6)}
                                        >
                                            <td className="px-2 py-1 text-start min-w-[130px]">
                                                <h1 className="font-semibold">
                                                    Operational
                                                </h1>
                                            </td>
                                            <td className="py-1">
                                                <h1 className="font-semibold">
                                                    :
                                                </h1>
                                            </td>
                                            <td className='flex justify-center px-2 py-1 text-center w-full'>
                                                <h1 className="flex gap-1 items-center font-semibold">
                                                    {LoadingTotalPemda ?
                                                        <LoadingButtonClip2 />
                                                        :
                                                        JumlahPemdaOperational?.length || 0
                                                    }
                                                    <TbHourglass />
                                                </h1>
                                            </td>
                                            <td className="py-1">
                                                <h1 className="font-semibold">
                                                    /
                                                </h1>
                                            </td>
                                            <td className='flex justify-center px-2 py-1 text-center w-full'>
                                                <h1 className="flex gap-1 items-center font-semibold">
                                                    {LoadingTotalPending ?
                                                        <LoadingButtonClip2 />
                                                        :
                                                        OperationalPemdaLength || 0
                                                    }
                                                    <TbCheck />
                                                </h1>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <ModalPohonPemda 
                                isOpen={PohonPemda} 
                                isLevel={LevelPemda} 
                                onClose={() => { handleModalPohonPemda(4) }} 
                                onSuccess={handleTriggerAfterPokinOutside}
                            />
                        </div>
                        {/* CROSS OPD */}
                        <div className="flex flex-col justify-between border-2 max-w-[400px] min-w-[300px] px-3 py-2 rounded-xl">
                            <h1 className="font-semibold border-b-2 py-1 text-center">
                                Crosscutting Pending
                            </h1>
                            <div className="flex flex-col py-2 mt-1">
                                <table>
                                    <tbody>
                                        <tr className="flex items-center">
                                            <td className="border-l border-t px-2 py-1 bg-white text-start rounded-tl-lg min-w-[150px]">
                                                <h1 className="font-semibold">
                                                    Ditolak
                                                </h1>
                                            </td>
                                            <td className="border-t py-1">
                                                <h1 className="font-semibold">
                                                    :
                                                </h1>
                                            </td>
                                            <td className='border-r border-t px-2 py-1 bg-white text-center rounded-tr-lg w-full'>
                                                <h1 className="font-semibold">
                                                    {LoadingTotalCrosscutting ? 
                                                        <LoadingButtonClip2 />
                                                    :
                                                        CrossDitolak ? CrossDitolak : 0
                                                    }
                                                </h1>
                                            </td>
                                        </tr>
                                        <tr className="flex items-center">
                                            <td className="border-l border-b px-2 py-1 bg-white text-start rounded-bl-lg min-w-[150px]">
                                                <h1 className="font-semibold">
                                                    Pending
                                                </h1>
                                            </td>
                                            <td className="border-b py-1">
                                                <h1 className="font-semibold">
                                                    :
                                                </h1>
                                            </td>
                                            <td className='border-r border-b px-2 py-1 bg-white text-center rounded-br-lg w-full'>
                                                <h1 className="font-semibold">
                                                    {LoadingTotalCrosscutting ? 
                                                        <LoadingButtonClip2 />
                                                    :
                                                        CrossPending ? CrossPending : 0
                                                    }
                                                </h1>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <ButtonSkyBorder className="w-full" onClick={handleModalCrosscutting}>
                                <TbSettings className='mr-1' />
                                Edit
                            </ButtonSkyBorder>
                            <ModalPohonCrosscutting 
                                isOpen={PohonCrosscutting}
                                onClose={handleModalCrosscutting} 
                                onSuccess={handleTriggerAfterPokinOutside} 
                            />
                        </div>
                    </div>
                }
                <div
                    className={`tf-tree text-center mt-3 transition-all duration-300 ease-in-out ${cursorMode === 'hand' ? "select-none" : ""}`}
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{
                        cursor: cursorMode === "hand" ? (isDragging ? "grabbing" : "grab") : "default", // Cursor style
                    }}
                >
                    <ul>
                        <li>
                            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg">
                                <div className="header flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                                    <h1>Pohon Kinerja OPD</h1>
                                </div>
                                <div className="body flex justify-center my-3">
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Perangkat Daerah</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.nama_opd}</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Kode OPD</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.kode_opd}</td>
                                            </tr>
                                            {Pokin?.tujuan_opd ?
                                                Pokin?.tujuan_opd.map((item: any) => (
                                                    <React.Fragment key={item.id}>
                                                        <tr>
                                                            <td className="min-w-[100px] border px-2 py-3 border-black text-start bg-gray-100">Tujuan OPD</td>
                                                            <td className="min-w-[300px] border px-2 py-3 border-black text-start bg-gray-100">{item.tujuan}</td>
                                                        </tr>
                                                        {item.indikator ?
                                                            <React.Fragment>
                                                                {item.indikator.map((i: any) => (
                                                                    <React.Fragment key={item.id}>
                                                                        <tr>
                                                                            <td className="min-w-[100px] border px-2 py-3 border-black text-start">Indikator</td>
                                                                            <td className="min-w-[300px] border px-2 py-3 border-black text-start">{i.indikator}</td>
                                                                        </tr>
                                                                        {i.targets ?
                                                                            i.targets.map((t: any, t_index: number) => (
                                                                                <tr key={t_index}>
                                                                                    <td className="min-w-[100px] border px-2 py-3 border-black text-start">Target/Satuan</td>
                                                                                    <td className="min-w-[300px] border px-2 py-3 border-black text-start">{t.target || "-"} / {t.satuan || "-"}</td>
                                                                                </tr>
                                                                            ))
                                                                            :
                                                                            <tr>
                                                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Target/Satuan</td>
                                                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">-</td>
                                                                            </tr>
                                                                        }
                                                                    </React.Fragment>
                                                                ))}
                                                            </React.Fragment>
                                                            :
                                                            <tr key={item.id}>
                                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Indikator</td>
                                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">-</td>
                                                            </tr>
                                                        }
                                                    </React.Fragment>
                                                ))
                                                :
                                                <tr>
                                                    <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tujuan OPD</td>
                                                    <td className="min-w-[300px] border px-2 py-3 border-black text-start">-</td>
                                                </tr>
                                            }
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tahun</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.tahun}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {(User?.roles == 'super_admin' || User?.roles == 'admin_opd') &&
                                    <div className={`flex flex-col gap-2 my-3 py-3 rounded-lg bg-white border-black hide-on-capture`}>
                                        <ButtonSkyBorder onClick={() => handleModalNewTujuan()}>
                                            <TbCirclePlus className="mr-1" />
                                            Tambah Tujuan OPD
                                        </ButtonSkyBorder>
                                        <ButtonBlack
                                            className='flex flex-wrap items-center justify-center gap-1'
                                            onClick={() => setClone(true)}
                                        >
                                            <TbCopy className='mr-1' />
                                            Clone Pohon Kinerja
                                        </ButtonBlack>
                                        <ButtonSky
                                            className='flex flex-wrap items-center justify-center gap-1'
                                            onClick={() => {
                                                AlertNotification("Dalam Perbaikan", "Cetak Per Pohon langsung di Strategic, Tactical atau Operational", "info", 2000);
                                                // setShowAllDetail(true);
                                                // AlertQuestion2("Sembunyikan Sidebar untuk hasil cetak penuh", "", "warning", "Cetak", "Batal").then((result) => {
                                                //     if (result.isConfirmed) {
                                                //         handleDownloadPdf();
                                                //         console.log(containerRef.current);
                                                //     }
                                                // })
                                            }}
                                        >
                                            <TbPrinter className='mr-1' />
                                            Cetak Penuh Pohon Kinerja
                                        </ButtonSky>
                                        {Clone &&
                                            <ModalClone
                                                isOpen={Clone}
                                                onClose={() => setClone(false)}
                                                jenis='opd'
                                                tahun={Tahun?.value}
                                                nama_opd={nama_opd}
                                                kode_opd={kode_opd}
                                                onSuccess={() => setTriggerAfterPokinOutside((prev) => !prev)}
                                            />
                                        }
                                    </div>
                                }
                                {/* BUTTON HEADER POKIN */}
                                <div className="flex items-center justify-evenly hide-on-capture">
                                    <div className="flex justify-center my-1 py-2">
                                        <ButtonBlackBorder onClick={() => setShowAll(true)}>
                                            <TbEye className="mr-1" />
                                            Tampilkan Semua
                                        </ButtonBlackBorder>
                                    </div>
                                    {(User?.roles == 'admin_opd' || User?.roles == 'super_admin' || User?.roles == 'level_1') &&
                                        <div className="flex justify-center my-1 py-2">
                                            <ButtonRedBorder onClick={newChild}>
                                                <TbCirclePlus className="mr-1" />
                                                Strategic
                                            </ButtonRedBorder>
                                        </div>
                                    }
                                </div>
                            </div>
                            {Pokin?.childs ? (
                                <ul>
                                    {Pokin.childs.map((data: any) => (
                                        <React.Fragment key={data.id}>
                                            <PohonOpd
                                                tema={data}
                                                deleteTrigger={() => setDeleted((prev) => !prev)}
                                                fetchTrigger={() => setTriggerAfterPokinOutside((prev) => !prev)}
                                                show_all={ShowAll}
                                                set_show_all={() => setShowAll(false)}
                                                show_detail={ShowAllDetail}
                                            />
                                        </React.Fragment>
                                    ))}
                                    {formList.map((formId) => (
                                        <React.Fragment key={formId}>
                                            <FormPohonOpd
                                                level={3}
                                                id={null}
                                                key={formId}
                                                formId={formId}
                                                onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                                                deleteTrigger={() => setDeleted((prev) => !prev)}
                                                fetchTrigger={() => setTriggerAfterPokinOutside((prev) => !prev)}
                                                />
                                        </React.Fragment>
                                    ))}
                                </ul>
                            ) : (
                                <ul>
                                    {formList.map((formId) => (
                                        <React.Fragment key={formId}>
                                            <FormPohonOpd
                                                level={3}
                                                id={null}
                                                key={formId}
                                                formId={formId}
                                                onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                                                deleteTrigger={() => setDeleted((prev) => !prev)}
                                                fetchTrigger={() => setTriggerAfterPokinOutside((prev) => !prev)}
                                            />
                                        </React.Fragment>
                                    ))}
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
                {/* BUTTON HAND TOOL */}
                <div className="fixed flex items-center mr-2 mb-2 bottom-0 right-0">
                    <button
                        onClick={toggleCursorMode}
                        className={`p-2 rounded ${cursorMode === "hand" ? "bg-green-500 text-white" : "bg-gray-300 text-black"
                            }`}
                    >
                        {cursorMode === "hand" ? <TbHandStop size={30} /> : <TbPointer size={30} />}
                    </button>
                </div>
                <ModalTujuanOpd
                    metode="baru"
                    kode_opd={User?.roles == 'super_admin' ? SelectedOpd?.value : User?.kode_opd}
                    tahun={Tahun?.value}
                    special={true}
                    isOpen={OpenModalTujuanOpd}
                    onClose={() => handleModalNewTujuan()}
                    onSuccess={() => setTriggerAfterPokinOutside((prev) => !prev)}
                />
            </div>
        </>
    )
}

export default PokinOpd;