import { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";

function AdaugaConversatie() {
    const [titlu, setTitlu] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!titlu) {
            alert("Subiect obligatoriu!");
            return;
        }

        try{
            const res = await axiosPrivate.post('/inbox/upload', {
                titlu
            });

            console.log("Conversatie: ", res.data);
            setTitlu("");
        }catch(err){
            console.error('Eroare la upload conversatie:', err.response?.data);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={titlu}
                    onChange={(e) => setTitlu(e.target.value)}
                    placeholder="Subiect"
                    required
                />
                <button type="submit">Incepe conversatie</button>
            </form>
        </div>
    )
}

export default AdaugaConversatie;