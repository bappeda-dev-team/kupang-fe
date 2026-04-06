'use client'

import Table from "@/components/pages/useropd/Table";
import { ButtonSky } from "@/components/global/Button";
import { TbCirclePlus } from "react-icons/tb";
import { FiHome } from "react-icons/fi";
import { useBrandingContext } from "@/context/BrandingContext";

const MasterUser = () => {

    const {branding} = useBrandingContext();

    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Master User</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex flex-wrap items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-col items-start">
                        <h1 className="uppercase font-bold">
                            Daftar User OPD 
                        </h1>
                        <h1>
                            {(branding?.user?.roles == "super_admin" || branding?.user?.roles == "reviewer") ? 
                                `${branding?.opd?.label || ""}`
                                :
                                `${branding?.user?.nama_opd || ""}`
                            }
                        </h1>
                    </div>
                    <div className="flex flex-col">
                        <ButtonSky 
                            className="flex items-center justify-center"
                            halaman_url='/useropd/tambah'
                        >
                            <TbCirclePlus className="mr-1"/>
                            Tambah User
                        </ButtonSky>
                    </div>
                </div>
                <Table />
            </div>
        </>
    )
}

export default MasterUser;