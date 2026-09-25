import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { apiFetch } from "../services/api";
import logo from "../../showroom/images/BLANCO.webp";

function AdminNavbar({ proyecto }) {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const cargarUsuario = async () => {
            const response = await apiFetch("/proyectos/usuario/");

            if (response.ok) {
                const data = await response.json();
                setUsuario(data);
            }
        };

        cargarUsuario();
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        navigate("/admin/login");
    };

    const cerrarMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header
            className="
                fixed
                top-0
                left-0
                z-60
                w-full
                bg-black
        ">
            <div
                className="
                    mx-auto
                    flex
                    max-w-7xl
                    items-center
                    justify-between
                    px-4
                    py-3
                    md:px-6
                    md:py-4
            ">
                {logo && (
                    <img
                        src={logo}
                        alt={proyecto?.empresa?.nombre || "Empresa"}
                        className="h-9 w-auto md:h-10"
                    />
                )}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="
                        flex
                        items-center
                        justify-center
                        p-2
                        text-white
                        hover:bg-white/10
                        md:hidden
                    "
                    aria-label="Abrir menú"
                >
                    {menuOpen ? (
                        <HiX className="size-7" />
                    ) : (
                        <HiMenu className="size-7" />
                    )}
                </button>
                <nav
                    className="
                        hidden
                        items-center
                        gap-6
                        text-sm
                        text-slate-200
                        md:flex
                ">
                    <Link to="/admin" className="menu-link">
                        Unidades
                    </Link>
                    {usuario?.groups?.includes("ADMINISTRADOR") && (
                        <>
                            <Link
                                to="/admin/historial"
                                className="menu-link"
                            >
                                Historial
                            </Link>

                            <Link
                                to="/admin/usuarios"
                                className="menu-link"
                            >
                                Usuarios
                            </Link>
                        </>
                    )}

                    <button
                        onClick={cerrarSesion}
                        className="
                            rounded-xl
                            p-2
                            text-red-600
                            transition
                            duration-500
                            hover:bg-red-600
                            hover:text-white
                        "
                    >
                        Cerrar sesión
                    </button>

                    {usuario && (
                        <span className="flex items-center gap-2 text-gray-200">
                            <FaUserAlt className="size-4" />
                            {usuario.username}
                        </span>
                    )}
                </nav>
            </div>

            {menuOpen && (
                <nav
                    className="
                        border-t
                        border-white/10
                        bg-black
                        px-4
                        pb-5
                        pt-3
                        md:hidden
                ">
                    <div className="flex flex-col gap-2">
                        <Link
                            to="/admin"
                            onClick={cerrarMenu}
                            className="
                                rounded-lg
                                px-3
                                py-3
                                text-slate-200
                                transition
                                hover:bg-white/10
                        ">
                            Unidades
                        </Link>

                        {usuario?.groups?.includes("ADMINISTRADOR") && (
                            <>
                                <Link
                                    to="/admin/historial"
                                    onClick={cerrarMenu}
                                    className="
                                        rounded-lg
                                        px-3
                                        py-3
                                        text-slate-200
                                        transition
                                        hover:bg-white/10
                                ">
                                    Historial
                                </Link>
                                <Link
                                    to="/admin/usuarios"
                                    onClick={cerrarMenu}
                                    className="
                                        rounded-lg
                                        px-3
                                        py-3
                                        text-slate-200
                                        transition
                                        hover:bg-white/10
                                ">
                                    Usuarios
                                </Link>
                            </>
                        )}
                        <div className="my-2 h-px bg-white/10" />
                        {usuario && (
                            <div className="flex items-center gap-2 px-3 py-3 text-gray-200">
                                <FaUserAlt className="size-4" />
                                <span>{usuario.username}</span>
                            </div>
                        )}
                        <button
                            onClick={cerrarSesion}
                            className="
                                rounded-lg
                                px-3
                                py-3
                                text-left
                                text-red-500
                                transition
                                hover:bg-red-600
                                hover:text-white
                        ">
                            Cerrar sesión
                        </button>
                    </div>
                </nav>
            )}
        </header>
    );
}

export default AdminNavbar;