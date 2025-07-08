import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import { ToastContainer, toast } from "react-toastify";
import Paginator from "../Paginator/Paginator";
import './Users.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const [editingUserId, setEditingUserId] = useState(null);
    const [editedData, setEditedData] = useState({});

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(9);
    const [totalCount, setTotalCount] = useState(0);

    const getUsers = async () => {
        try {
            const res = await axiosPrivate.get(`/users?pageNumber=${page}&pageSize=${pageSize}`);
            setUsers(res.data.data);
            setTotalCount(res.data.count);
        } catch (err) {
            console.error("Eroare la fetch users:", err);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate, navigate, location, page, pageSize]);

    useEffect(() => {
        let result = [...users];

        if (filterType !== "all") {
            result = result.filter(u => u.type === filterType);
        }

        if (search.trim() !== "") {
            const term = search.toLowerCase();
            result = result.filter((u) => {
                const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
                return (
                    u.email.toLowerCase().includes(term) ||
                    u.firstName.toLowerCase().includes(term) ||
                    u.lastName.toLowerCase().includes(term) ||
                    fullName.includes(term)
                );
            });
        }
        setFiltered(result);
    }, [search, filterType, users]);

    const startEditing = (user) => {
        setEditingUserId(user.userId);
        setEditedData({ ...user }); // copiem toate datele inițiale
    };

    const saveEdit = async (id) => {
        try {
            await axiosPrivate.put(`/users/${id}`, editedData);
            toast.success("Modificare efectuata cu succes!", {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setEditingUserId(null);

            // Refetch users for current page and pageSize
            await getUsers();
        } catch (err) {
            console.error("Eroare la salvare:", err.response?.data || err.message);
            toast.error("Eroare la adăugare utilizator!", {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const cancelEdit = () => {
        setEditingUserId(null);
        setEditedData({});
    };

    const handleDeleteUser = async (id) => {
        const confirm = window.confirm("Ești sigur că vrei să ștergi acest utilizator?");
        if (!confirm) return;

        try {
            await axiosPrivate.delete(`/users/${id}`);
            toast.success("Utilizator șters cu succes!");
            const updated = users.filter(u => u.userId !== id);
            setUsers(updated);
            setFiltered(updated);
        } catch (err) {
            console.error("Eroare la ștergere:", err.response?.data || err.message);
            toast.error("Eroare la ștergerea utilizatorului!");
        }
    };



    return (
        <div className="user-page">
            <ToastContainer />
            <SideBar />
            <main className="user-content">
                <h2>Utilizatori existenți</h2>

                <div className="user-controls">
                    <input
                        type="text"
                        placeholder="Caută după email, nume sau prenume"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />


                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">Toți</option>
                        <option value="student">Student</option>
                        <option value="secretar">Secretar</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Prenume</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Program</th>
                            <th>An Studiu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ?
                            filtered.map((user) => (
                                <tr key={user.userId}>
                                    {editingUserId === user.userId ? (
                                        <>
                                            <td>
                                                <input
                                                    value={editedData.firstName || ""}
                                                    onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    value={editedData.lastName || ""}
                                                    onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    value={editedData.email || ""}
                                                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                                                />
                                            </td>
                                            <td>{user.type}</td>
                                            <td>
                                                <input
                                                    value={editedData.program_studiu || ""}
                                                    onChange={(e) => setEditedData({ ...editedData, program_studiu: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={editedData.an_studiu || ""}
                                                    onChange={(e) => setEditedData({ ...editedData, an_studiu: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="download-btn"
                                                    onClick={() => saveEdit(user.userId)}>Salvează</button>
                                                <button
                                                    className="delete-btn "
                                                    onClick={cancelEdit}>Anulează</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.type}</td>
                                            <td>{user.program_studiu || '-'}</td>
                                            <td>{user.an_studiu || '-'}</td>
                                            <td>
                                                <button
                                                    className="download-btn"
                                                    onClick={() => startEditing(user)}>Modifică</button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteUser(user.userId)}
                                                >
                                                    Șterge
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                            : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>Niciun utilizator găsit.</td>
                                </tr>
                            )}
                    </tbody>
                </table>

                <Paginator
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    totalRecords={totalCount}
                />


            </main>
        </div>
    );
}

export default Users;
