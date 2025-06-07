import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    ResponsiveContainer, CartesianGrid, LabelList
} from "recharts";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import './StatisticiStatus.css';

const StatisticiStatus = () => {
    const axiosPrivate = useAxiosPrivate();
    const [data, setData] = useState([]);
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
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, val]) => {
                if (val) params.append(key, val);
            });

            const res = await axiosPrivate.get(`/stats/status-distribution?${params.toString()}`);
            const { cereri, adeverinte } = res.data;

            const statusuri = ["Trimisa", "Procesare", "Aprobata", "Respinsa"];
            const mapped = statusuri.map(status => ({
                status,
                cereri: cereri[status] || 0,
                adeverinte: adeverinte[status] || 0
            }));

            setData(mapped);
        } catch (err) {
            console.error("Eroare la preluarea datelor:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload?.length) {
            return (
                <div className="tooltip-box">
                    <p className="tooltip-title">{label}</p>
                    <p className="tooltip-line"><span>Cereri:</span> {payload[0]?.value}</p>
                    <p className="tooltip-line"><span>Adeverințe:</span> {payload[1]?.value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="statistici-container">
            <h2>Distribuția pe statusuri</h2>

            {/* Filtre comune */}
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

                <select name="facultate" onChange={handleChange} value={filters.forma_finantare}>
                    <option value="">Toate facultatile</option>
                    <option value="Cibernetica">Cibernetica</option>
                    <option value="Statistica">Statistica</option>
                    <option value="Informatica Economica">Informatica Economica</option>
                    <option value="Informatica Economica EN">Informatica Economica EN</option>
                </select>

                <select name="forma_finantare" onChange={handleChange} value={filters.forma_finantare}>
                    <option value="">Toate formele</option>
                    <option value="buget">Buget</option>
                    <option value="taxa">Taxă</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="cereri" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                        <LabelList dataKey="cereri" position="top" />
                    </Bar>
                    <Bar dataKey="adeverinte" fill="#a855f7" radius={[8, 8, 0, 0]}>
                        <LabelList dataKey="adeverinte" position="top" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatisticiStatus;
