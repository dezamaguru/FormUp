import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, LabelList
} from "recharts";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import './StatisticiAnProgram.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="tooltip-box">
        <p className="tooltip-title">{label}</p>
        <p className="tooltip-line"><span>Cereri:</span> {payload[0]?.value}</p>
      </div>
    );
  }
  return null;
};

const StatisticiAnProgram = () => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  const [program, setProgram] = useState("");

  const fetch = async () => {
    try {
      const query = program ? `?program_studiu=${program}` : "";
      const res = await axiosPrivate.get(`/stats/distributie-an-program${query}`);
      setData(res.data);
    } catch (err) {
      console.error("Eroare la încărcarea statisticii an/program:", err);
    }
  };

  useEffect(() => {
    fetch();
  }, [program]);

  return (
    <div className="statistici-container">
      <h2 className="statistici-title">Distribuție cereri pe an și program</h2>

      <div className="filtru-container">
        <label htmlFor="program">Filtru program studiu:</label>
        <select
          id="program"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
        >
          <option value="">Toate</option>
          <option value="licenta">Licență</option>
          <option value="master">Master</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data} margin={{ top: 30, right: 20, left: 10, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="categorie" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="cereri" fill="#60a5fa" radius={[10, 10, 0, 0]}>
            <LabelList dataKey="cereri" position="top" style={{ fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatisticiAnProgram;
