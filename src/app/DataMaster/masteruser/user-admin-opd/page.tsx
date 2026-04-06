import { FiHome } from "react-icons/fi";
import Table from "./Table";

const masteruser = () => {
    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master User</p>
                <p className="mr-1">/ User Admin OPD</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-col items-end">
                        <h1 className="uppercase font-bold">Daftar Admin OPD</h1>
                    </div>
                </div>
                <Table />
            </div>
        </>
    )
}

export default masteruser;