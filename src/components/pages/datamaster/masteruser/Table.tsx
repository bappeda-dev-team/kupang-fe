'use client'

import { ButtonGreen, ButtonRed, ButtonBlack, ButtonGreenBorder, ButtonBlackBorder } from "@/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { LoadingClip } from "@/components/global/Loading";
import { useState, useEffect } from "react";
import { getToken } from "@/components/lib/Cookie";
import Select from 'react-select';
import { TbUsers, TbSearch } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useBrandingContext } from "@/context/BrandingContext";

interface OptionTypeString {
    value: string;
    label: string;
}
interface User {
    id: string;
    nip: string;
    email: string;
    nama_pegawai: string;
    is_active: boolean;
    role: roles[];
}
interface roles {
    id: string;
    role: string;
}

const Table = () => {

    const { branding } = useBrandingContext();
    const [User, setUser] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [Opd, setOpd] = useState<OptionTypeString | null>(null);
    const [LevelUser, setLevelUser] = useState<string>('');
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [LoadingOpd, setLoadingOpd] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const token = getToken();
    const router = useRouter();

    useEffect(() => {
        if (branding?.opd?.value != undefined) {
            try {
                setLoadingOpd(true);
                const opd = {
                    value: branding?.opd?.value,
                    label: branding?.opd?.label,
                }
                setOpd(opd);
            } catch (err) {
                console.log("error parsing opd branding ke opd halaman");
            } finally {
                setLoadingOpd(false);
            }
        }
    }, [branding])

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchUrusan = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/user/findall?kode_opd=${Opd?.value}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data == null) {
                    setDataNull(true);
                    setUser([]);
                } else if (data.code == 500) {
                    setError(true);
                    setUser([]);
                } else if (result.code === 401) {
                    setError(true);
                } else {
                    setError(false);
                    setDataNull(false);
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
    }, [token, Opd]);

    const FilteredData = User?.filter((item: User) => {
        const params = searchQuery.toLowerCase();
        return (
            item.nama_pegawai.toLowerCase().includes(params) ||
            item.nip.toLowerCase().includes(params)
        )
    });

    const fetchOpd = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/opd/findall`, {
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
            const opd = data.data.map((item: any) => ({
                value: item.kode_opd,
                label: item.nama_opd,
            }));
            setOpdOption(opd);
        } catch (err) {
            console.log('gagal mendapatkan data opd');
        } finally {
            setIsLoading(false);
        }
    };

    const hapusUrusan = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/user/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            setUser(User.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data User Berhasil Dihapus", "success", 1000);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if (Loading || LoadingOpd) {
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
    } else if (!Opd) {
        return (
            <>
                <div className="flex flex-wrap gap-2 items-center justify-between px-3 py-2">
                    <div className="uppercase">
                        <Select
                            styles={{
                                control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    minWidth: '320px',
                                    maxWidth: '700px',
                                    minHeight: '30px'
                                })
                            }}
                            onChange={(option) => setOpd(option)}
                            options={OpdOption}
                            placeholder="Filter by OPD"
                            isClearable
                            value={Opd}
                            isLoading={IsLoading}
                            isSearchable
                            onMenuOpen={() => {
                                if (OpdOption.length == 0) {
                                    fetchOpd();
                                }
                            }}
                        />
                    </div>
                    <ButtonBlack
                        className="flex items-center gap-1"
                        onClick={() => router.push("/DataMaster/masteruser/user-admin-opd")}
                    >
                        <TbUsers />
                        Daftar Admin OPD
                    </ButtonBlack>
                </div>
                <div className="border p-1 rounded-xl mx-3 mb-2">
                    <h1 className="mx-5 py-5">Pilih Filter OPD</h1>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="flex flex-wrap gap-2 items-center px-3 py-2">
                <Select
                    styles={{
                        control: (baseStyles) => ({
                            ...baseStyles,
                            borderRadius: '8px',
                            minWidth: '320px',
                            maxWidth: '700px',
                            minHeight: '30px'
                        })
                    }}
                    onChange={(option) => setOpd(option)}
                    options={OpdOption}
                    placeholder="Filter by OPD"
                    isClearable
                    value={Opd}
                    isLoading={IsLoading}
                    isSearchable
                    onMenuOpen={() => {
                        if (OpdOption.length == 0) {
                            fetchOpd();
                        }
                    }}
                />
                <div className="flex px-2 items-center">
                    <TbSearch className="absolute ml-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Cari nama pegawai / NIP"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="py-2 pl-10 pr-2 border rounded-lg border-gray-300"
                    />
                </div>
            </div>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Nama</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">NIP</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Email</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Status</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Roles</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull || FilteredData.length === 0 ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={13}>
                                    Tidak ada User / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            FilteredData.map((data, index) => (
                                <tr key={data.id}>
                                    <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nama_pegawai ? data.nama_pegawai : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.nip ? data.nip : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.email ? data.email : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.is_active === true ? 'Aktif' : 'tidak aktif'}</td>
                                    {data.role ?
                                        <td className="border-r border-b px-6 py-4 text-center">
                                            {data.role ? data.role.map((r: any) => r.role).join(", ") : "-"}
                                        </td>
                                        :
                                        <td className="border-r border-b px-6 py-4 text-center">-</td>
                                    }
                                    <td className="border-r border-b px-6 py-4">
                                        <div className="flex flex-col jutify-center items-center gap-2">
                                            <ButtonGreen className="w-full" halaman_url={`/DataMaster/masteruser/${data.id}`}>Edit</ButtonGreen>
                                            <ButtonRed
                                                className="w-full"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus urusan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                        if (result.isConfirmed) {
                                                            hapusUrusan(data.id);
                                                        }
                                                    });
                                                }}
                                            >
                                                Hapus
                                            </ButtonRed>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;