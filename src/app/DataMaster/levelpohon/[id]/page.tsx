import { FiHome } from "react-icons/fi";
import { FormEditLevelPohon } from "@/components/pages/datamaster/levelpohon/FormLevelPohon";

const editJabatan = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Level Pohon</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditLevelPohon />
        </>
    )
}

export default editJabatan;