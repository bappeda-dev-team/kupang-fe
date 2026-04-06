import TematikPemda from "./TematikPemda";
import { FiHome } from "react-icons/fi";
import React, {Suspense} from "react";
import { LoadingClip } from "@/components/global/Loading";

const LaporanCascadingPemda = () => {
    return(
        <Suspense 
            fallback={
                <LoadingClip />
            }
        >
            <div className="flex flex-wrap items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Laporan</p>
                <p className="mr-1">/ Cascading Pemda</p>
            </div>
            <TematikPemda />
        </Suspense>
    )
}

export default LaporanCascadingPemda;