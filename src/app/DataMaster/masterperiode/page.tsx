'use client'

import { FiHome } from "react-icons/fi";
import Table from "@/components/pages/datamaster/masterperiode/Table";
import { ButtonSky } from "@/components/global/Button";
import { TbPlus } from "react-icons/tb";

const MasterPeriode = () => {

    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Periode</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <Table />
            </div>
        </>
    )
}

export default MasterPeriode;