'use client'

import { ButtonSkyBorder, ButtonSky, ButtonRedBorder } from "@/components/global/Button";
import { ModalInovasi, ModalInovasiEdit } from "../ModalInovasi";
import { useState, useEffect } from "react";
import { LoadingSync } from "@/components/global/Loading";
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertQuestion, AlertNotification } from "@/components/global/Alert";

interface id {
    id: string;
}
interface type_inovasi {
    id : string;
    judul_inovasi : string;
    jenis_inovasi : string;
    gambaran_nilia_kebaruan : string;
}

const Inovasi: React.FC<id> = ({id}) => {

    const [isOpenNewInovasi, setIsOpenNewInovasi] = useState<boolean>(false);
    const [IsOpenEditInovasi, setIsOpenEditInovasi] = useState<boolean>(false);
    const [inovasi, setInovasi] = useState<type_inovasi[]>([]);
    const [IdEdit, setIdEdit] = useState<string>('');
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [dataNull, setDataNull] = useState<boolean | null>(null);
    const [user, setUser] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        if(fetchUser){
            setUser(fetchUser.user);
        }
    },[]);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchInovasi = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/inovasi/findall/${id}`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.inovasi;
                if(hasil != null){
                    setDataNull(false);
                    setInovasi(hasil);
                } else {
                    setDataNull(true);
                    setInovasi([]);
                }
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };
        if(user?.roles != undefined){    
            fetchInovasi();
        }
    },[id, user, token, isOpenNewInovasi, IsOpenEditInovasi, Deleted]);

    const handleModalNewInovasi = () => {
        if(isOpenNewInovasi){
            setIsOpenNewInovasi(false);
        } else {
            setIsOpenNewInovasi(true);
        }
    }
    const handleModalEditInovasi = (id: string) => {
        if(IsOpenEditInovasi){
            setIsOpenEditInovasi(false);
            setIdEdit('');
        } else {
            setIdEdit(id);
            setIsOpenEditInovasi(true);
        }
    }

    const hapusInovasi = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/inovasi/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("response !ok saat hapus inovasi");
            }
            setInovasi(inovasi.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data inovasi Berhasil Dihapus", "success", 1000);
            setDeleted((prev) => !prev);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if(Loading){
        return(
            <>
                <div className="mt-3 rounded-t-xl border px-5 py-3">
                    <h1 className="font-bold">Inovasi</h1>
                </div>
                <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                    <LoadingSync />
                </div>
            </>
        );
    }

    return(
        <>
            {/* Inovasi Sasaran */}
            <div className="flex flex-wrap justify-between items-center mt-3 rounded-t-xl border px-5 py-3">
                <h1 className="font-bold">Inovasi Sasaran</h1>
                <ButtonSky onClick={handleModalNewInovasi}>tambah inovasi sasaran</ButtonSky>
                <ModalInovasi onClose={handleModalNewInovasi} isOpen={isOpenNewInovasi} id_rekin={id}/>
            </div>
            <div className="rounded-b-xl shadow-lg border-x border-b px-5 py-3">
                <div className="overflow-auto m-2 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-300 border border-gray-300">
                                <td className="border-r border-b px-6 py-3 min-w-[20]">no.</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Judul Inovasi</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Jenis Inovasi</td>
                                <td className="border-r border-b px-6 py-3 min-w-[200px]">Gambaran nilai kebaruan</td>
                                <td className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</td>
                            </tr>
                        </thead>
                        <tbody className='border'>
                            {dataNull ? 
                                <tr>
                                    <td className="px-6 py-3" colSpan={4}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                            :
                                inovasi.map((data: any, index) => (
                                <tr key={data.id}>
                                    <td className="border px-6 py-3">{index + 1}</td>
                                    <td className="border px-6 py-3">{data.judul_inovasi}</td>
                                    <td className="border px-6 py-3">{data.jenis_inovasi}</td>
                                    <td className="border px-6 py-3">{data.gambaran_nilai_kebaruan}</td>
                                    <td className="border px-6 py-3 flex flex-col gap-2">
                                        <ButtonSkyBorder className="w-full" onClick={() => handleModalEditInovasi(data.id)}>Edit</ButtonSkyBorder>
                                        <ModalInovasiEdit
                                            onClose={() => handleModalEditInovasi('')} 
                                            isOpen={IsOpenEditInovasi}
                                            id_rekin={id}
                                            id={IdEdit}
                                        />
                                        <ButtonRedBorder
                                            className="w-full"
                                            onClick={() => {
                                                AlertQuestion("Hapus?", "Hapus Inovasi yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                    if(result.isConfirmed){
                                                        hapusInovasi(data.id);
                                                    }
                                                });
                                            }}
                                        >
                                            Hapus
                                        </ButtonRedBorder>
                                    </td>
                                </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Inovasi;