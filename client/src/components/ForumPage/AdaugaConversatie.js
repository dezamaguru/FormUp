import { useEffect, useRef, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ToastContainer, toast } from 'react-toastify';
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";
import './AdaugaConversatie.css';
import useAuth from "../../hooks/useAuth";

function AdaugaConversatie({ onConversatieAdaugata }) {
  useFirebaseNotifications();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [titlu, setTitlu] = useState("");
  const [emailStudent, setEmailStudent] = useState("");
  const [sugestii, setSugestii] = useState([]);
  const [selectat, setSelectat] = useState(null);
  const [focusPeSugestii, setFocusPeSugestii] = useState(false);
  const [indexSelectat, setIndexSelectat] = useState(-1);

  const inputRef = useRef(null);

  const cautaSugestii = async (partial) => {
    try {
      if (partial.length < 2) return setSugestii([]);
      const res = await axiosPrivate.get(`/users/search?partial=${partial}`);
      setSugestii(res.data);
    } catch (err) {
      console.error("Eroare la sugestii:", err);
      setSugestii([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titlu || (auth.type === 'secretar' && !emailStudent)) {
      toast.warning("Completează toate câmpurile!");
      return;
    }

    try {
      const res = await axiosPrivate.post('/inbox/upload', {
        titlu,
        emailStudent: auth.type === 'secretar' ? emailStudent : undefined
      });

      toast.success("Conversație creată!");
      setTitlu("");
      setEmailStudent("");
      setSugestii([]);
      if (typeof onConversatieAdaugata === 'function') {
        onConversatieAdaugata();
      }
    } catch (err) {
      console.error('Eroare la upload conversatie:', err.response?.data);
      toast.error("Eroare la creare conversație");
    }
  };

  const handleKeyDown = (e) => {
    if (!sugestii.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndexSelectat((prev) => (prev + 1) % sugestii.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndexSelectat((prev) => (prev - 1 + sugestii.length) % sugestii.length);
    }

    if (e.key === "Enter" && indexSelectat >= 0) {
      const s = sugestii[indexSelectat];
      setEmailStudent(s.email);
      setSugestii([]);
      setSelectat(s);
    }
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="form-adauga-conversatie">
        {auth.type === 'secretar' && (
          <>
            <input
              type="email"
              ref={inputRef}
              value={emailStudent}
              onChange={(e) => {
                const val = e.target.value;
                setEmailStudent(val);
                cautaSugestii(val);
                setIndexSelectat(-1);
              }}
              onFocus={() => setFocusPeSugestii(true)}
              onBlur={() => setTimeout(() => setFocusPeSugestii(false), 100)}
              onKeyDown={handleKeyDown}
              placeholder="Email student"
              autoComplete="off"
            />

            {focusPeSugestii && sugestii.length > 0 && (
              <ul className="sugestii-list">
                {sugestii.map((s, i) => (
                  <li
                    key={s.userId}
                    style={{
                      background: i === indexSelectat ? "#e0f2fe" : "transparent"
                    }}
                    onMouseDown={() => {
                      setEmailStudent(s.email);
                      setSugestii([]);
                      setSelectat(s);
                    }}
                  >
                    {s.firstName} {s.lastName} — {s.email}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <input
          type="text"
          value={titlu}
          onChange={(e) => setTitlu(e.target.value)}
          placeholder="Subiect"
          required
        />
        <button type="submit">Începe conversație</button>
      </form>
    </div>
  );
}

export default AdaugaConversatie;
