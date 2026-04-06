'use client'

import Table from "@/components/pages/datamaster/masteruser/Table";
import { ButtonSky, ButtonBlack } from "@/components/global/Button";
import { useRouter } from "next/navigation";
import { TbCirclePlus, TbUsers } from "react-icons/tb";
import { FiHome } from "react-icons/fi";

const MasterUser = () => {
    
    const router = useRouter();
    
    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master User</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-col items-end">
                        <h1 className="uppercase font-bold">Daftar User</h1>
                    </div>
                    <div className="flex flex-col gap-1">
                        <ButtonSky
                            className="flex items-center justify-center"
                            halaman_url='/DataMaster/masteruser/tambah'
                        >
                            <TbCirclePlus className="mr-1" />
                            Tambah User
                        </ButtonSky>
                        <ButtonBlack
                            className="flex items-center gap-1"
                            onClick={() => router.push("/DataMaster/masteruser/user-admin-opd")}
                        >
                            <TbUsers />
                            Daftar Admin OPD
                        </ButtonBlack>
                    </div>
                </div>
                <Table />
            </div>
        </>
    )
}

export default MasterUser;