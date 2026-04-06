import { FiHome } from "react-icons/fi";
import { FormEditRole } from "@/components/pages/datamaster/masterrole/FormRole";

const editRole = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Role</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditRole />
        </>
    )
}

export default editRole;