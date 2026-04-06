'use client'

import { ButtonGreen, ButtonRed, ButtonBlack, ButtonGreenBorder, ButtonBlackBorder } from "@/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { LoadingClip } from "@/components/global/Loading";
import { useState, useEffect } from "react";
import { getToken, getUser, getOpdTahun } from "@/components/lib/Cookie";
import { TbSearch } from "react-icons/tb";
import { ModalJabatanPegawai } from "../datamaster/masterpegawai/ModalJabatanPegawai";
import { useBrandingContext } from "@/context/BrandingContext";

interface User {
    id: string;
    nip: string;
    email: string;
    nama_pegawai: string;
    id_jabatan: string;
    nama_jabatan: string;
    pegawai_id: string;
    is_active: boolean;
    role: roles[];
}
interface roles {
    id: string;
    role: string;
}

const Table = () => {

    const [user, setuser] = useState<any>(null);
    const [User, setUser] = useState<User[]>([]);
    const [LevelUser, setLevelUser] = useState<string>('');
    const [error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [ModalJabatanOpen, setModalJabatanOpen] = useState<boolean>(false);
    const [DataModal, setDataModal] = useState<User | null>(null);

    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const token = getToken();
    const {branding} = useBrandingContext();
    const kode_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;
    const nama_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.label : branding?.user?.nama_opd;
    
    const [SearchParams, setSearchParams] = useState<string>("");

    const handleModalJabatan = (Data: User | null) => {
        if (ModalJabatanOpen) {
            setModalJabatanOpen(false);
            setDataModal(Data);
        } else {
            setModalJabatanOpen(true);
            setDataModal(Data);
        }
    }

    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if (fetchUser) {
            setuser(fetchUser.user);
        }
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, [])

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchUser = async (url: string) => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/${url}`, {
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
        if (user?.roles != undefined || null) {
            if (user?.roles == 'super_admin') {
                fetchUser(`user/findall?kode_opd=${SelectedOpd?.value}`);
            } else {
                fetchUser(`user/findall?kode_opd=${user?.kode_opd}`);
            }
        }
    }, [token, user, SelectedOpd, FetchTrigger]);

    const FilteredData = User?.filter((item: User) => {
        const params = SearchParams.toLowerCase();
        return (
            item.nama_pegawai.toLowerCase().includes(params) ||
            item.nip.toLowerCase().includes(params)
        )
    });

    const hapusUser = async (id: any) => {
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
    } else if (user?.roles == 'super_admin') {
        if (SelectedOpd == undefined || null) {
            return (
                <div className="border p-5 rounded-xl shadow-xl">
                    <h1 className="mx-5 py-5">Super Admin Wajib Pilih OPD di header terlebih dahulu</h1>
                </div>
            )
        }
    }
    return (
        <>
            <div className="flex pt-2 px-2 items-center">
                <TbSearch className="absolute ml-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Cari nama pegawai / NIP"
                    value={SearchParams}
                    onChange={(e) => setSearchParams(e.target.value)}
                    className="py-2 pl-10 pr-2 border rounded-lg border-gray-300"
                />
            </div>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Nama</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">NIP</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Jabatan</th>
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
                                    <td className="border-r border-b px-6 py-4 text-center">{data.nama_jabatan? data.nama_jabatan: "-"}</td>
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
                                            <ButtonGreen className="w-full" halaman_url={`/useropd/${data.id}`}>Edit</ButtonGreen>
                                            <ButtonBlack
                                                className="w-full"
                                                onClick={() => handleModalJabatan(data)}
                                            >
                                                Jabatan
                                            </ButtonBlack>
                                            <ButtonRed
                                                className="w-full"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus urusan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                        if (result.isConfirmed) {
                                                            hapusUser(data.id);
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
            {ModalJabatanOpen &&
                <ModalJabatanPegawai
                    onClose={() => handleModalJabatan(null)}
                    isOpen={ModalJabatanOpen}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    Data={DataModal}
                    kode_opd={kode_opd}
                    nama_opd={nama_opd}
                />
            }
        </>
    )
}

export default Table;