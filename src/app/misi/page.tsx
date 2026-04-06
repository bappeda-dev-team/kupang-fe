import { FiHome } from "react-icons/fi";
import Table from "@/components/pages/misi/Table";

const Misi = () => {
    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan Pemda</p>
                <p className="mr-1">/ Misi</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <Table />
            </div>
        </>
    )
}

export default Misi;