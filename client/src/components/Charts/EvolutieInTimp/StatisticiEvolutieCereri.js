import { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from "recharts";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import './StatisticiEvolutieCereri.css';

const StatisticiEvolutieCereri = () => {
    const axiosPrivate = useAxiosPrivate();
    const [data, setData] = useState([]);
    const [tip, setTip] = useState("cereri");
    const [filters, setFilters] = useState({
        program_studiu: "",
        an_studiu: "",
        forma_finantare: "",
        facultate: ""
    });

    const handleChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };


    const fetchData = async () => {
        try {
            const params = new URLSearchParams({ tip });
            Object.entries(filters).forEach(([key, val]) => {
                if (val) params.append(key, val);
            });

            const res = await axiosPrivate.get(`/stats/evolutie-cereri?${params.toString()}`);
            setData(res.data);
        } catch (err) {
            console.error("Eroare la evoluție:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters, tip]);

    return (
        <div className="statistici-container">
            <h2>Evoluția cererilor în timp</h2>

            <div className="filtru-container">

                <select value={tip} onChange={e => setTip(e.target.value)}>
                    <option value="cereri">Cereri</option>
                    <option value="adeverinte">Adeverințe</option>
                </select>

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

                <select name="forma_finantare" onChange={handleChange} value={filters.forma_finantare}>
                    <option value="">Toate formele</option>
                    <option value="buget">Buget</option>
                    <option value="taxa">Taxă</option>
                </select>

                <select name="facultate" onChange={handleChange} value={filters.facultate}>
                    <option value="">Toate facultățile</option>
                    <option value="Cibernetica">Cibernetică</option>
                    <option value="Statistica">Statistică</option>
                    <option value="Informatica Economica">Informatică Economică</option>
                    <option value="Informatica Economica EN">Informatică Economică EN</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data} margin={{ top: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="luna" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="valoare" stroke="#f59e0b" strokeWidth={3} name={tip === "cereri" ? "Cereri" : "Adeverințe"} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatisticiEvolutieCereri;
