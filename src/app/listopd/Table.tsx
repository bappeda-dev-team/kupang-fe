'use client'

import React, { useState, useEffect } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { TbArrowBadgeDownFilled } from "react-icons/tb";

interface Tematik {
    tematik: string;
    level_pohon: number;
    tahun: string;
    is_active: boolean;
    list_opd: OPD[];
}
interface OPD {
    kode_opd: string;
    perangkat_daerah: string;
}

interface Table {
    tahun: number;
}

const Table: React.FC<Table> = ({ tahun }) => {

    const [Opd, setOpd] = useState<Tematik[]>([]);

    const [IsError, setIsError] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [Show, setShow] = useState<{ [key: number]: boolean }>({});
    const [DataNull, setDataNull] = useState<boolean>(false);

    const token = getToken();

    useEffect(() => {
        const fetchOpd = async () => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/pokin_tematik/list_opd/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data == null) {
                    setDataNull(true);
                    setOpd([]);
                } else if (result.code === 401) {
                    setIsError(true);
                } else {
                    setDataNull(false);
                    setOpd(data);
                    setIsError(false);
                }
                setOpd(data);
            } catch (err) {
                setIsError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        fetchOpd();
    }, [tahun, token]);

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
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    }

    return (
        <>
            {DataNull ?
                <div className="px-6 py-3 border w-full rounded-xl">
                    Data Kosong / Belum Ditambahkan
                </div>
                :
                Opd.map((data: Tematik, index: number) => {

                    const isShown = Show[index] || false;

                    return (
                        <div className="flex flex-col m-2 w-full" key={index}>
                            <div
                                className={`flex justify-between border items-center p-5 rounded-xl text-emerald-500 cursor-pointer border-emerald-500 hover:bg-emerald-500 hover:text-white ${isShown ? "bg-emerald-500 text-white" : ""}`}
                                onClick={() => {
                                    if (data.is_active === true) {
                                        handleShow(index);
                                    }
                                }}
                            >

                                {data.is_active === true ?
                                    <h1 className="font-semibold">Tematik - {data.tematik}</h1>
                                    :
                                    <h1 className="font-semibold text-red-500">Tematik - {data.tematik} (non-aktif)</h1>
                                }
                                <div className="flex items-center">
                                    <TbArrowBadgeDownFilled className={`transition-all duration-200 ease-in-out text-3xl ${isShown ? "" : "-rotate-90"}`} />
                                </div>
                            </div>
                            <div className={`transition-all duration-300 ease-in-out border-x border-b border-emerald-500 ${isShown ? "opacity-100 mx-4 p-5" : "max-h-0 opacity-0 pointer-events-none"}`}>
                                <div className="overflow-auto rounded-t-xl border">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-emerald-500 text-white">
                                                <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Kode Perangkat Daerah</th>
                                                <th className="border-r border-b px-6 py-3 min-w-[300px]">Nama Perangkat Daerah</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                data.list_opd ?
                                                    data.list_opd.map((data, index) => (
                                                        <tr key={index}>
                                                            <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                                            <td className="border-r border-b px-6 py-4">{data.kode_opd ? data.kode_opd : "-"}</td>
                                                            <td className="border-r border-b px-6 py-4">{data.perangkat_daerah ? data.perangkat_daerah : "-"}</td>
                                                        </tr>
                                                    ))
                                                    :
                                                    <tr>
                                                        <td className="px-6 py-3 uppercase" colSpan={13}>
                                                            Tidak Ada OPD terkait di tematik ini
                                                        </td>
                                                    </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}

export default Table;