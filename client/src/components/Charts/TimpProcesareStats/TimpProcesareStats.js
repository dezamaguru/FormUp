import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const TimpMediuProcesare = () => {
    const axiosPrivate = useAxiosPrivate();
    const [stats, setStats] = useState(null);
    const [filters, setFilters] = useState({
        program_studiu: "",
        an_studiu: "",
        facultate: "",
        forma_finantare: ""
    });

    const handleChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const fetchData = async () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));

        try {
            const res = await axiosPrivate.get(`/stats/processing-time?${params.toString()}`);
            setStats(res.data);
        } catch (err) {
            console.error("Eroare la încărcarea timpului mediu:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    return (
        <div className="statistici-container">
            <h2>Timp mediu de procesare (cereri aprobate)</h2>

            {/* Filtre */}
            <div className="filtru-container">
                <select name="program_studiu" onChange={handleChange} value={filters.program_studiu}>
                    <option value="">Toate programele</option>
                    <option value="licenta">Licență</option>
                    <option value="master">Master</option>
                </select>

                <select name="an_studiu" onChange={handleChange} value={filters.an_studiu}>
                    <option value="">Toți anii</option>
                    <option value="1">Anul 1</option>
                    <option value="2">Anul 2</option>
                    <option value="3">Anul 3</option>
                </select>

                <select name="facultate" onChange={handleChange} value={filters.facultate}>
                    <option value="">Toate facultățile</option>
                    <option value="Informatica Economica EN">Informatică Economică EN</option>
                    <option value="Informatica Economica">Informatică Economică</option>
                    <option value="Statistica">Statistică</option>
                    <option value="Cibernetica">Cibernetică</option>
                </select>


                <select name="forma_finantare" onChange={handleChange} value={filters.forma_finantare}>
                    <option value="">Toate formele</option>
                    <option value="buget">Buget</option>
                    <option value="taxa">Taxă</option>
                </select>
            </div>

            {!stats ? (
                <p>Se încarcă...</p>
            ) : (
                <div className="stat-card">
                    <h3>Rezultat:</h3>
                    <p>{stats.timpMediuZile} zile (~{stats.timpMediuOre} ore)</p>
                </div>
            )}
        </div>
    );
};

export default TimpMediuProcesare;
