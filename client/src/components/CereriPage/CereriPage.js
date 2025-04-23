import { useEffect, useState } from 'react';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from 'react-router-dom';

function Cereri() {
  const [cereri, setCereri] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const axiosPrivate = useAxiosPrivate(); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getCereri = async () => {
      try {
        const response = await axiosPrivate.get('/cereri', {
          signal: controller.signal,
        });
        if (isMounted) {
          setCereri(response.data);
        }
      } catch (error) {
        if (error.name === 'CanceledError') {
          console.log('Request canceled:', error.message); // Handle cancellation gracefully
      } else {
        console.error(error.response.data);
              navigate('/', { state: { from: location }, replace: true });
          }
      }
    };

    getCereri();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, navigate, location]);

  const handleDownload = async (id) => {
    try {
      const res = await axiosPrivate.get(`/cereri/download/${id}`, {
        responseType: 'blob'
      });
      
      if (!res.data) {
        throw new Error('Nu s-au primit date de la server');
      }

      // Corectăm extragerea numelui fișierului
      const disposition = res.headers['content-disposition'];
      let filename;
      
      if (disposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      
      if (!filename) {
        // Folosim numele din lista de cereri dacă îl avem
        const cerere = cereri.find(c => c.id === id);
        filename = cerere ? cerere.filename : `cerere_${id}`;
      }

      const blob = new Blob([res.data], { 
        type: res.headers['content-type'] || 'application/octet-stream' 
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch(err) {
      console.error('Eroare la descărcare:', err);
      alert('A apărut o eroare la descărcarea fișierului. Vă rugăm să încercați din nou.');
    }
  };
  

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !file) return alert('Completează titlul și alege un fișier.');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file',  file);
    
    try {
        const res = await axiosPrivate.post('/cereri/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        // Adăugăm noua cerere direct în state
        setCereri(prev => [...prev, res.data.cerere]);
        
        // Resetăm formularul
        setTitle('');
        setFile(null);
    } catch (err) {
        console.error('Eroare completă:', err);
        console.error('Răspuns server:', err.response?.data);
        alert(err.response?.data?.message || 'Eroare la upload');
    }
  };

  return (
    <div>
      <h2>Cereri disponibile pentru descărcare</h2>

      <form onSubmit={handleUpload} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Titlu cerere"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit"> Încarcă cerere </button>
      </form>

      <article>
        {Array.isArray(cereri) && cereri.length > 0 ? (
          <ul>
            {cereri.map(cerere => (
              <li key={cerere.id}>
                {cerere.title}
                <button onClick={() => handleDownload(cerere.id)}>
                   Descarcă 
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nu există cereri disponibile.</p>
        )}
      </article>
    </div>
  );
}

export default Cereri;
