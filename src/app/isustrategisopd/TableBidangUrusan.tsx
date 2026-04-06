'use client'

import { useEffect, useState } from "react";
import { ButtonBlackBorder } from "@/components/global/Button";
import { TbCirclePlus } from "react-icons/tb";
import { useBrandingContext } from "@/context/BrandingContext";
import { getToken } from "@/components/lib/Cookie";
import { LoadingBeat } from "@/components/global/Loading";

interface BD {
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
    tahun: string;
}

const TableBidangUrusan = () => {

    const { branding } = useBrandingContext();
    const [BD, setBD] = useState<BD[]>([]);

    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const API_URL = branding?.api_perencanaan;
        const fetchBidangUrusan = async () => {
            setLoading(true);
            setError(false);
            try {
                const response = await fetch(`${API_URL}/bidang_urusan/findall/${branding?.opd?.value}`, {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `${token}`
                    }
                });
                const result = await response.json();
                if (result.code === 200) {
                    setBD(result.data);
                    setError(false);
                    // console.log(result.data);
                } else {
                    setBD([]);
                    setError(true);
                    console.log(result.data);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchBidangUrusan();
    }, [branding, token]);

    if (Error) {
        return (
            <div className="text-red-500">
                Error, Periksa koneksi internet, jika error berlajut silakan hubungi tim developer
            </div>
        )
    } else if (Loading) {
        return (
            <div className="border rounded-lg m-2">
                <LoadingBeat />
            </div>
        )
    }

    return (
        <div className="overflow-auto m-2 rounded-t-xl border border-gray-300">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="border-r border-b border-gray-300 px-6 py-3 text-center w-[50px]">No</th>
                        <th className="border-r border-b border-gray-300 px-6 py-3">Bidang Urusan</th>
                        <th className="border-b border-gray-300 px-6 py-3 w-[300px]">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {BD.length === 0 ?
                        <tr>
                            <td colSpan={3} className="border-x border-b py-4 px-3 text-center">
                                Data Kosong / Tambahkan melalui data master bidang urusan (super admin)
                            </td>
                        </tr>
                        :
                        BD.map((b: BD, index: number) => (
                            <tr key={index}>
                                <td className="border-r border-b border-gray-300 py-4 px-3 text-center">{index + 1}</td>
                                <td className="border-r border-b border-gray-300 px-6 py-4">({b.kode_bidang_urusan || "no code"}) {b.nama_bidang_urusan || "-"}</td>
                                <td className="border-b border-gray-300 px-6 py-4">
                                    <div className="flex flex-col jutify-center items-center gap-2">
                                        <ButtonBlackBorder
                                            className="flex items-center gap-1 w-full"
                                        >
                                            <TbCirclePlus />
                                            Tambah Isu Strategis
                                        </ButtonBlackBorder>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TableBidangUrusan;