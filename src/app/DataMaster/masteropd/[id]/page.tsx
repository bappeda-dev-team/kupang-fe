import { FiHome } from "react-icons/fi";
import { FormEditMasterOpd } from "@/components/pages/datamaster/masteropd/FormMasterOpd";

const editOpd = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master OPD</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditMasterOpd />
        </>
    )
}

export default editOpd;