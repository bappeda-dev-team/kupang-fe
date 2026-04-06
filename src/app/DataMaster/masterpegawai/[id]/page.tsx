import { FiHome } from "react-icons/fi";
import { FormEditMasterPegawai } from "@/components/pages/datamaster/masterpegawai/FormMasterPegawai";

const editPegawai = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Pegawai</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditMasterPegawai />
        </>
    )
}

export default editPegawai;