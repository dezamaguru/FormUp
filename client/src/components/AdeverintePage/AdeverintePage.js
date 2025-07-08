import "./AdeverintePage.css";
import { useState } from "react";
import AddAdeverinta from "./AddAdeverinta";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import SideBar from "../SideBar/SideBar";
import { ToastContainer } from 'react-toastify';
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";
import Paginator from "../Paginator/Paginator";
import Header from '../Header/Header';

function AdeverintePage() {
  useFirebaseNotifications();
  const [showDropDown, setShowDropDown] = useState(false);
  const [adeverinte, setAdeverinte] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [totalCount, setTotalCount] = useState(0);


  const getAdeverinte = async (
    controller = new AbortController(),
    isMounted = true
  ) => {
    try {
      const response = await axiosPrivate.get(`/adeverinte?pageNumber=${page}&pageSize=${pageSize}`, {
        signal: controller.signal,
      });
      if (isMounted) {
        setAdeverinte(response.data.data);
        setTotalCount(response.data.count);
      }
    } catch (error) {
      if (error.name === "CanceledError") {
        console.log("Request canceled:", error.message);
      } else {
        console.error(error.response?.data);
        navigate("/", { state: { from: location }, replace: true });
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    getAdeverinte(controller, isMounted);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, navigate, location, page, pageSize]);

  return (
    <div className="student-page">
      <ToastContainer />
      <SideBar />

      <main className="main-content">
        <Header />

        {auth?.type === "student" && (
          <div>
            <button className="submit-btn" onClick={() => setShowDropDown((prev) => !prev)}>
              Adauga cerere
            </button>
            {showDropDown && <AddAdeverinta onAdd={getAdeverinte} />}


            <div className="history-list">
              <p className="section-title">Istoric solicitări</p>
              {Array.isArray(adeverinte) && adeverinte.length > 0 ? (
                adeverinte.map((adeverinta) => (
                  <div
                    key={adeverinta.id_adeverinta}
                    className="history-card"
                    onClick={() => navigate(`/adeverinte/${adeverinta.id_adeverinta}`)}
                  >
                    <strong>{adeverinta.tip_adeverinta}</strong>
                    <p>{adeverinta.nume_student}</p>
                    <small>{adeverinta.status}</small>
                  </div>
                ))
              ) : (
                <p>Nu există solicitări pentru adeverințe.</p>
              )}
            </div>

            <Paginator
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              totalRecords={totalCount}
            />
          </div>
        )}

        {auth?.type === "secretar" && (
          <div>
            <div className="history-list">
              <p className="section-title">Solicitari adeverinte</p>
              {Array.isArray(adeverinte) && adeverinte.length > 0 ?
                (adeverinte.map((adeverinta) => (
                  <div
                    key={adeverinta.id_adeverinta}
                    className="history-card"
                    onClick={() => navigate(`/adeverinte/${adeverinta.id_adeverinta}`)}
                  >
                    <strong>{adeverinta.tip_adeverinta}</strong>
                    <p>{adeverinta.nume_student}</p>
                    <small>{adeverinta.status}</small>
                  </div>
                ))
                ) : (
                  <p>Nu exista solicitari pentru adeverinte.</p>
                )}
            </div>
            <Paginator
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              totalRecords={totalCount}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default AdeverintePage;
