import TematikKab from "@/components/pages/Pohon/TematikKab/TematikKab";
import { FiHome } from "react-icons/fi";
import React, {Suspense} from "react";
import { LoadingClip } from "@/components/global/Loading";

const pohonkinerjakota = () => {
    return(
        <Suspense 
            fallback={
                <LoadingClip />
            }
        >
            <div className="flex flex-wrap items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan Pemda</p>
                <p className="mr-1">/ Pohon Kinerja Pemda</p>
            </div>
            <TematikKab />
        </Suspense>
    )
}

export default pohonkinerjakota;