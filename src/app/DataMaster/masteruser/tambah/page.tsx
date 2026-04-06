import { FiHome } from "react-icons/fi";
import { FormUser } from "@/components/pages/datamaster/masteruser/FormUser";

const tambahUser = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master User</p>
                <p className="mr-1">/ Tambah</p>
            </div>
            <FormUser />
        </>
    )
}

export default tambahUser;