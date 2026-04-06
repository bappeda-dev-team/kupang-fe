import { FiHome } from "react-icons/fi";
import { FormEditMasterJabatan } from "@/components/pages/datamaster/masterjabatan/FormMasterJabatan";

const editJabatan = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Jabatan</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditMasterJabatan />
        </>
    )
}

export default editJabatan;