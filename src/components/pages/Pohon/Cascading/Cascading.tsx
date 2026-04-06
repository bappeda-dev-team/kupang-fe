'use client'

import '@/components/pages/Pohon/treeflex.css'
import React, { useState, useEffect, useRef } from 'react';
import { TbEye, TbHandStop, TbPointer, TbPrinter } from 'react-icons/tb';
import { LoadingBeat, LoadingButtonClip } from '@/components/global/Loading';
import { OpdTahunNull, TahunNull } from '@/components/global/OpdTahunNull';
import { getToken } from '@/components/lib/Cookie';
import { PohonCascading } from '@/components/lib/Pohon/Cascading/PohonCascading';
import { PohonLaporan } from '@/components/lib/Pohon/Cascading/PohonLaporan';
import { ButtonBlackBorder, ButtonSky } from '@/components/global/Button';
import html2canvas from 'html2canvas';
import { AlertQuestion2 } from '@/components/global/Alert';

interface cascading {
    jenis: 'laporan' | 'non-laporan';
    tahun: string;
    nama_opd?: string;
    kode_opd: string;
    user: string;
}
interface opd {
    kode_opd: string;
    nama_opd: string;
}
interface pokin {
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    tujuan_opd: tujuanopd[];
    childs: childs[]
}
interface tujuanopd {
    id: number;
    kode_opd: string;
    tujuan: string;
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
    indikator: Indikator[];
}
interface Indikator {
    indikator: string;
}
interface childs {
    id: number;
    parent: number;
    strategi: string;
    taget: string;
    satuan: string;
    keterangan: string;
    indikators: string;
    childs: childs[];
}

const Cascading: React.FC<cascading> = ({ jenis, nama_opd, kode_opd, tahun, user }) => {

    const [Pokin, setPokin] = useState<pokin | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string>('');
    const token = getToken();

    const [Deleted, setDeleted] = useState<boolean>(false);
    const [LoadingCetak, setLoadingCetak] = useState<boolean>(false);

    // SHOW ALL
    const [ShowAll, setShowAll] = useState<boolean>(false);

    //Hand Tool state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });
    const [cursorMode, setCursorMode] = useState<"normal" | "hand">("normal");
    const containerRef = useRef<HTMLDivElement | null>(null);

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
                user == 'super_admin'
                    ? `cascading_${kode_opd ?? 'opd_undetected'}_${tahun ?? 'tahun_undetected'
                    }.png`
                    : `cascading_${kode_opd ?? 'opd_undetected'}_${tahun ?? 'tahun_undetected'
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

    useEffect(() => {
        const fetchPokinOpd = async (url: string) => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            setLoading(true);
            try {
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
                setError('gagal mendapatkan data, terdapat kesalahan backend/server saat mengambil data pohon kinerja cascading opd ini');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (jenis === 'non-laporan') {
            if (user == 'super_admin' || user == 'reviewer') {
                if (kode_opd != undefined && tahun != undefined) {
                    fetchPokinOpd(`pohon_kinerja_opd/findall/${kode_opd}/${tahun}`);
                }
            } else if (user !== 'super_admin') {
                if (kode_opd != undefined && tahun != undefined) {
                    fetchPokinOpd(`pohon_kinerja_opd/findall/${kode_opd}/${tahun}`);
                }
            }
        } else {
            if (user == 'super_admin' || user == 'reviewer') {
                if (kode_opd != undefined && tahun != undefined) {
                    fetchPokinOpd(`cascading_opd/findall/${kode_opd}/${tahun}`);
                }
            } else if (user !== 'super_admin') {
                if (kode_opd != undefined && tahun != undefined) {
                    fetchPokinOpd(`cascading_opd/findall/${kode_opd}/${tahun}`);
                }
            }
        }
    }, [tahun, kode_opd, user, Deleted, jenis, token]);

    if (Loading) {
        return (
            <>
                <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                    <h1>Pohon Cascading</h1>
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
                    <h1>Pohon Cascading</h1>
                </div>
                <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                    {error}
                </div>
            </>
        )
    }
    if (user == 'super_admin') {
        if (kode_opd == undefined || tahun === undefined) {
            return (
                <>
                    <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                        <h1>Pohon Cascading {nama_opd}</h1>
                    </div>
                    <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <OpdTahunNull />
                    </div>
                </>
            )
        }
    }
    if (user != 'super_admin') {
        if (tahun === undefined) {
            return (
                <>
                    <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                        <h1>Pohon Cascading</h1>
                    </div>
                    <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <TahunNull />
                    </div>
                </>
            )
        }
    }

    return (
        <div>
            <div className="flex flex-col p-5 border-2 rounded-t-xl overflow-auto mt-2">
                {user == 'super_admin' ?
                    <h1 className="font-bold">Pohon Cascading {nama_opd}</h1>
                    :
                    <h1 className="font-bold">Pohon Cascading {Pokin?.nama_opd}</h1>
                }
            </div>
            <div className="flex flex-col p-3 border-b-2 border-x-2 rounded-b-xl relative w-full h-[calc(100vh-100px)] max-h-screen overflow-auto">
                <div className={`tf-tree text-center mt-3 ${cursorMode === 'hand' ? "select-none" : ""}`}
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
                                    {(user == 'super_admin' || user == 'admin_opd') ?
                                        <h1>Pohon Cascading</h1>
                                        :
                                        <h1>Pohon Cascading</h1>
                                    }
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
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tahun</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.tahun}</td>
                                            </tr>
                                            {Pokin?.tujuan_opd ?
                                                Pokin?.tujuan_opd.map((item: any) => (
                                                    <React.Fragment key={item.id}>
                                                        {item.kode_bidang_urusan &&
                                                            <tr>
                                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start bg-gray-100">Bidang Urusan</td>
                                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start bg-gray-100">({item.kode_bidang_urusan} - {item.nama_bidang_urusan})</td>
                                                            </tr>
                                                        }
                                                        <tr>
                                                            <td className="min-w-[100px] border px-2 py-3 border-black text-start bg-gray-100">Tujuan OPD</td>
                                                            <td className="min-w-[300px] border px-2 py-3 border-black text-start bg-gray-100">{item.tujuan}</td>
                                                        </tr>
                                                        {item.indikator ?
                                                            item.indikator.map((i: any) => (
                                                                <React.Fragment key={item.id}>
                                                                    <tr>
                                                                        <td className="min-w-[100px] border px-2 py-3 border-black text-start">Indikator</td>
                                                                        <td className="min-w-[300px] border px-2 py-3 border-black text-start">{i.indikator}</td>
                                                                    </tr>
                                                                </React.Fragment>
                                                            ))
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
                                        </tbody>
                                    </table>
                                </div>
                                <ButtonSky
                                    className='w-full mb-2 hide-on-capture'
                                    disabled={LoadingCetak}
                                    onClick={() => {
                                        AlertQuestion2("Sembunyikan Sidebar untuk hasil cetak penuh", "", "warning", "Cetak", "Batal").then((result) => {
                                            if (result.isConfirmed) {
                                                handleDownloadPdf();
                                            }
                                        })
                                    }}
                                >
                                    {LoadingCetak ?
                                        <LoadingButtonClip className="mr-1" />
                                        :
                                        <TbPrinter className='mr-1' />
                                    }
                                    Cetak Penuh Pohon Cascading
                                </ButtonSky>
                                <ButtonBlackBorder
                                    className='w-full mb-2 hide-on-capture'
                                    onClick={() => setShowAll(true)}
                                >
                                    <TbEye className='mr-1' />
                                    Tampilkan Semua Pohon
                                </ButtonBlackBorder>
                            </div>
                            {jenis === 'laporan' ?
                                <React.Fragment>
                                    {Pokin?.childs ? (
                                        <ul>
                                            {Pokin.childs.map((data: any) => (
                                                <React.Fragment key={data.id}>
                                                    <PohonLaporan
                                                        tema={data}
                                                        show_all={ShowAll}
                                                        set_show_all={() => setShowAll(false)}
                                                    />
                                                </React.Fragment>
                                            ))}
                                        </ul>
                                    ) : (
                                        <ul></ul>
                                    )}
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    {Pokin?.childs &&
                                        <ul>
                                            {Pokin.childs.map((data: any) => (
                                                <React.Fragment key={data.id}>
                                                    <PohonCascading
                                                        tema={data}
                                                        deleteTrigger={() => setDeleted((prev) => !prev)}
                                                        show_all={ShowAll}
                                                        set_show_all={() => setShowAll(false)}
                                                    />
                                                </React.Fragment>
                                            ))}
                                        </ul>
                                    }
                                </React.Fragment>
                            }
                        </li>
                    </ul>
                </div>
                {/* BUTTON HAND TOOL */}
                <div className="fixed flex items-center mr-2 mb-2 bottom-0 right-0">
                    <button
                        onClick={toggleCursorMode}
                        className={`p-2 rounded ${cursorMode === "hand" ? "bg-green-500 text-white" : "bg-gray-300 text-black"}`}
                    >
                        {cursorMode === "hand" ? <TbHandStop size={30} /> : <TbPointer size={30} />}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cascading;