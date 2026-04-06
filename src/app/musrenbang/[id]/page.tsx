import { FiHome } from "react-icons/fi";
import { FormEditMusrenbang } from "@/components/pages/usulan/musrenbang/FormMusrenbang";

const EditMusrenbang = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Musrenbang</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditMusrenbang />
        </>
    )
}

export default EditMusrenbang;