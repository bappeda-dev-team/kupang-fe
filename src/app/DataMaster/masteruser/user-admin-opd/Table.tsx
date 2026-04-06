'use client'

import { LoadingClip } from "@/components/global/Loading";
import React, { useState, useEffect } from "react";
import { getToken } from "@/components/lib/Cookie";

interface OptionTypeString {
    value: string;
    label: string;
}
interface User {
    kode_opd: string;
    nama_opd: string;
    admin_users: Admin[];
}
interface Admin {
    user_id: number;
    nip: string;
    nama_pegawai: string;
    email: string;
    is_active: boolean;
}

const Table = () => {

    const [User, setUser] = useState<User[]>([]);
    const [error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchUrusan = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/user/cek_admin_opd`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data.code == 500) {
                    setError(true);
                    setUser([]);
                } else if (result.code === 401) {
                    setError(true);
                } else {
                    setError(false);
                    setUser(data);
                }
                setUser(data);
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        fetchUrusan();
    }, [token]);

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else {
        return (
            <>
                <div className="overflow-auto m-2 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-emerald-500 text-white">
                                <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                                <th className="border-r border-b px-6 py-3 min-w-[300px]">Perangkat Daerah</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">User</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Email</th>
                                <th className="border-r border-b px-6 py-3 min-w-[100px]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!User || User.length === null ?
                                <tr>
                                    <td className="px-6 py-3 uppercase" colSpan={13}>
                                        Tidak ada User / Belum Ditambahkan
                                    </td>
                                </tr>
                                :
                                User.map((data: User, index: number) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td rowSpan={data.admin_users.length === 0 ? 2 : data.admin_users.length + 1} className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                            <td rowSpan={data.admin_users.length === 0 ? 2 : data.admin_users.length + 1} className="border-r border-b px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <p>{data.nama_opd || "-"}</p>
                                                    <p>{data.kode_opd || "-"}</p>
                                                </div>
                                            </td>
                                        </tr>
                                        {data.admin_users.length > 0 ?
                                            data.admin_users.map((item: Admin, sub_index: number) => (
                                                <tr key={sub_index}>
                                                    <td className="border-r border-b px-6 py-4 text-center">
                                                        <div className="flex flex-col gap-1">
                                                            <p>{item.nama_pegawai || "-"}</p>
                                                            <p>{item.nip || "-"}</p>
                                                        </div>
                                                    </td>
                                                    <td className="border-r border-b px-6 py-4 text-center">{item.email || "-"}</td>
                                                    <td className="border-r border-b px-6 py-4 text-center">{item.is_active === true ? 'Aktif' : 'tidak aktif'}</td>
                                                </tr>
                                            ))
                                            :
                                            <tr>
                                                <td colSpan={3} className="border-r border-b px-6 py-4 text-center bg-red-400 text-white">User Admin OPD Belum Ditambahkan</td>
                                            </tr>
                                        }
                                    </React.Fragment>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}

export default Table;