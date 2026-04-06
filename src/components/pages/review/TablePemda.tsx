'use client'

import { ButtonRed, ButtonGreen, ButtonSky } from "@/components/global/Button";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getOpdTahun } from "@/components/lib/Cookie";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken, getUser } from "@/components/lib/Cookie";
import { TbArrowBadgeDownFilled } from "react-icons/tb";

interface data {
    id_tematik: number;
    nama_pohon: string;
    level_pohon: string;
    review: review[];
}

interface review {
    id_pohon: number;
    parent: number;
    nama_pohon: string;
    level_pohon: number;
    jenis_pohon: string;
    review: string;
    keterangan: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}

interface table {
    tahun: string;
}

const TablePemda: React.FC<table> = ({ tahun }) => {

    const [Data, setData] = useState<data[]>([]);

    const token = getToken();

    const [IsError, setIsError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean>(false);

    const [Show, setShow] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchSasaran = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/review_pokin/tematik/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                // console.log(data);
                if (data == null) {
                    setDataNull(true);
                    setData([]);
                } else {
                    setDataNull(false);
                    setData(data);
                }
            } catch (err) {
                console.error(err);
                setIsError(true);
            } finally {
                setLoading(false);
            }
        }
        if (tahun != undefined) {
            fetchSasaran();
        }
    }, [token, tahun]);

    const handleShow = (id: number) => {
        setShow((prev) => ({
            [id]: !prev[id],
        }));
    }

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (IsError) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if (tahun == undefined) {
        return <TahunNull />
    }

    return (
        <>
            {DataNull ?
                <div className="px-6 py-3 border w-full rounded-xl">
                    Data Kosong / Belum Ditambahkan
                </div>
                :
                Data.map((data: data) => {
                    const isShown = Show[data.id_tematik] || false;

                    return (
                        <div className="flex flex-col m-2" key={data.id_tematik}>
                            <div
                                className={`flex justify-between border items-center p-5 rounded-xl text-emerald-500 cursor-pointer border-emerald-500 hover:bg-emerald-500 hover:text-white ${isShown ? "bg-emerald-500 text-white" : ""}`}
                                onClick={() => handleShow(data.id_tematik)}
                            >
                                <h1 className="font-semibold">Tematik - {data.nama_pohon}</h1>
                                <div className="flex items-center">
                                    <TbArrowBadgeDownFilled className={`transition-all duration-200 ease-in-out text-3xl ${isShown ? "" : "-rotate-90"}`} />
                                </div>
                            </div>
                            <div className={`transition-all duration-300 ease-in-out border-x border-b border-emerald-500 ${isShown ? "opacity-100 mx-4 p-5" : "max-h-0 opacity-0 pointer-events-none"}`}>
                                <div className="overflow-auto rounded-t-xl border">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-xm bg-emerald-500 text-white">
                                                <td className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Nama Pohon</td>
                                                <td className="border-r border-b px-6 py-3 min-w-[400px] text-center">Review</td>
                                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Keterangan</td>
                                                <td className="border-r border-b px-6 py-3 min-w-[200px]">User Pembuat</td>
                                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Waktu Review</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.review == null ?
                                                <tr>
                                                    <td className="px-6 py-3" colSpan={30}>
                                                        Tidak Ada review
                                                    </td>
                                                </tr>
                                                :
                                                data.review.map((item: review, index: number) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            {/* NO & POHON */}
                                                            <tr>
                                                                <td className="border border-emerald-500 px-4 py-4 text-center">
                                                                    {index + 1}
                                                                </td>
                                                                <td className="border border-emerald-500 px-6 py-4">
                                                                    <p>{item.nama_pohon || "-"}</p>
                                                                    <p className="uppercase text-emerald-500 text-xs">{item.jenis_pohon}</p>
                                                                </td>
                                                                <td className="border border-emerald-500 px-6 py-4">
                                                                    <p>{item.review}</p>
                                                                </td>
                                                                <td className="border border-emerald-500 px-6 py-4">
                                                                    <p>{item.keterangan}</p>
                                                                </td>
                                                                <td className="border border-emerald-500 px-6 py-4">
                                                                    <p>{item.created_by}</p>
                                                                </td>
                                                                <td className="border border-emerald-500 px-6 py-4">
                                                                    {item.created_at === item.updated_at ?
                                                                        <>
                                                                            <p className="font-semibold">dibuat pada :</p>
                                                                            <p>
                                                                                {new Date(item.created_at).toLocaleDateString("id-ID", {
                                                                                    year: "numeric",
                                                                                    month: "long",
                                                                                    day: "numeric",
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit"
                                                                                })}
                                                                            </p>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <p className="font-semibold">diedit pada :</p>
                                                                            <p>
                                                                                {new Date(item.updated_at).toLocaleDateString("id-ID", {
                                                                                    year: "numeric",
                                                                                    month: "long",
                                                                                    day: "numeric",
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit"
                                                                                })}
                                                                            </p>
                                                                        </>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </>
    )
}

export default TablePemda;
