import { FiHome } from "react-icons/fi";
import { FormEditMasterLembaga } from "@/components/pages/datamaster/masterlembaga/FormMasterLembaga";

const editLembaga = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Lembaga</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditMasterLembaga />
        </>
    )
}

export default editLembaga;