import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import './StatisticiGenerale.css';

const StatisticCard = ({ title, value }) => (
  <div className="stat-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

const SecretariatStats = () => {
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

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.append(key, val);
      });

      const res = await axiosPrivate.get(`/stats/general?${params.toString()}`);
      setStats(res.data);
    } catch (err) {
      console.error("Eroare la încărcarea statisticilor:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filters]);

  return (
    <div className="statistici-container">
      <h2>Statistici generale</h2>

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

      {/* Afișare statistici */}
      {!stats ? (
        <p>Se încarcă statisticile...</p>
      ) : (
        <div className="stat-grid">
          <StatisticCard title="Total cereri trimise" value={stats.totalCereri} />
          <StatisticCard title="Total adeverințe generate" value={stats.totalAdeverinte} />
          <StatisticCard title="Cereri procesate" value={stats.cereriProcesate} />
          <StatisticCard title="Cereri în așteptare" value={stats.cereriInAsteptare} />
        </div>
      )}
    </div>
  );
};

export default SecretariatStats;
