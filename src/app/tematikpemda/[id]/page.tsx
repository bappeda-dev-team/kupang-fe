import { FiHome } from "react-icons/fi";
import { FormEditTematikKab } from "@/components/pages/tematikkota/FormTematikKab";

const Edittematik = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan Kabupaten</p>
                <p className="mr-1">/ Tematik Kabupaten</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditTematikKab />
        </>
    )
}

export default Edittematik;