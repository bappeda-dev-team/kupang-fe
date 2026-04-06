import { FiHome } from "react-icons/fi";
import { FormEditSubKegiatan } from "@/components/pages/datamaster/masterprogramkegiatan/subkegiatan/FormSubKegiatan";

const editSubKegiatan = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Sub Kegiatan</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditSubKegiatan />
        </>
    )
}

export default editSubKegiatan;