import { FiHome } from "react-icons/fi";
import { FormEditKegiatan } from "@/components/pages/datamaster/masterprogramkegiatan/kegiatan/FormKegiatan";

const editKegiatan = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Kegiatan</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditKegiatan />
        </>
    )
}

export default editKegiatan;