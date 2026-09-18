import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { apiFetch } from "../services/api";

function AdminLayout() {
    const [proyecto, setProyecto] = useState(null);
    const [usuario, setUsuario] = useState(null);
    useEffect(() => {
        const cargarProyecto = async () => {
            const response = await apiFetch(
                "/proyectos/1/empresa/"
            );
            if (response.ok) {
                const data = await response.json();
                setProyecto(data);
            }
        };
        cargarProyecto();
    }, []);

    useEffect(() => {
        const cargarUsuario = async () => {
            const response = await apiFetch(
                "/proyectos/usuario/"
            );
            if (response.ok) {
                const data = await response.json();
                setUsuario(data);
            }
        };
        cargarUsuario();
    }, []);

    return (
        <>
            <AdminNavbar proyecto={proyecto} />
            <Outlet
                context={{
                    proyecto,
                    usuario,
                }}
            />
        </>
    );
}

export default AdminLayout;