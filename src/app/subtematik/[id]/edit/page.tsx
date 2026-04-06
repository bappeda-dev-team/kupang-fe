import { FiHome } from "react-icons/fi";
import { FormEditSubTematikKab } from "@/components/pages/subtematik/FormSubTematikKab";

const EditSubTematik = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan Kabupaten</p>
                <p className="mr-1">/ Sub Tematik Kabupaten</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditSubTematikKab />
        </>
    )
}

export default EditSubTematik;