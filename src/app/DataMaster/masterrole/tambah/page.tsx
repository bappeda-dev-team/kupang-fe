import { FiHome } from "react-icons/fi";
import { FormRole } from "@/components/pages/datamaster/masterrole/FormRole";

const tambahRole = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Role</p>
                <p className="mr-1">/ Tambah</p>
            </div>
            <FormRole />
        </>
    )
}

export default tambahRole;