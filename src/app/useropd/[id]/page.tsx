import { FiHome } from "react-icons/fi";
import { FormEditUserOpd } from "@/components/pages/useropd/FormUserOpd";

const editUserOpd = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan OPD</p>
                <p className="mr-1">/ User OPD</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditUserOpd />
        </>
    )
}

export default editUserOpd;