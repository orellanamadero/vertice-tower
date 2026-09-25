import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api";
import { CiEdit, CiSearch, CiRedo,} from "react-icons/ci";
import { FiUsers, FiUserCheck, FiUserX, FiShield, FiUserPlus,} from "react-icons/fi";
import UsuarioForm from "../components/UsuarioForm";
import fondoUnidades from "../images/fondoJefe.png";

const formularioInicial = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    group: "",
    password: "",
    is_active: true,
};

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuarioEditar, setUsuarioEditar] = useState(null);
    const [mostrarNuevoUsuario, setMostrarNuevoUsuario] = useState(false);
    const [formulario, setFormulario] = useState( formularioInicial);
    const [guardando, setGuardando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [filtroRol, setFiltroRol] = useState("todos");
    const cargarUsuarios = async () => {
        try {
            const response = await apiFetch(
                "/proyectos/usuarios/"
            );
            if (!response.ok) {
                throw new Error(
                    "No se pudieron cargar los usuarios"
                );
            }
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        cargarUsuarios();
    }, []);

    const mostrarMensaje = (mensaje) => {
        setMensajeExito(mensaje);
        setTimeout(() => {
            setMensajeExito("");
        }, 3000);

    };

    const abrirNuevoUsuario = () => {
        setFormulario(formularioInicial);
        setMostrarNuevoUsuario(true);
    };

    const cerrarNuevoUsuario = () => {
        if (guardando) {
            return;
        }
        setMostrarNuevoUsuario(false);
    };

    const crearUsuario = async (event) => {
        event.preventDefault();
        setGuardando(true);
        try {
            const response = await apiFetch(
                "/proyectos/usuarios/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formulario),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                console.error(errorData);
                throw new Error(
                    "No se pudo crear el usuario"
                );
            }
            await cargarUsuarios();
            setMostrarNuevoUsuario(false);
            setFormulario(formularioInicial);
            mostrarMensaje(
                "Usuario creado correctamente."
            );
        } catch (error) {
            console.error(error);
            alert(
                "No se pudo crear el usuario."
            );
        } finally {
            setGuardando(false);
        }
    };

    const handleEditar = (usuario) => {
        setUsuarioEditar(usuario);
        setFormulario({
            username: usuario.username || "",
            first_name: usuario.first_name || "",
            last_name: usuario.last_name || "",
            email: usuario.email || "",
            group: usuario.groups?.[0] || "",
            password: "",
            is_active: usuario.is_active,
        });
    };

    const cerrarModal = () => {
        if (guardando) {
            return;
        }
        setUsuarioEditar(null);
    };

    const guardarCambios = async (event) => {
        event.preventDefault();
        if (!usuarioEditar) {
            return;
        }
        setGuardando(true);
        try {
            const datos = {
                username: formulario.username,
                first_name: formulario.first_name,
                last_name: formulario.last_name,
                email: formulario.email,
                group: formulario.group,
                is_active: formulario.is_active,
            };
            if (formulario.password.trim()) {
                datos.password = formulario.password;
            }
            const response = await apiFetch(
                `/proyectos/usuarios/${usuarioEditar.id}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(datos),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error(errorData);
                throw new Error(
                    "No se pudieron guardar los cambios"
                );
            }
            await cargarUsuarios();
            cerrarModal();
            mostrarMensaje(
                "Cambios guardados correctamente."
            );
        } catch (error) {
            console.error(error);
            alert(
                "No se pudieron guardar los cambios."
            );
        } finally {
            setGuardando(false);
        }
    };

    const totalUsuarios = usuarios.length;
    const usuariosActivos = usuarios.filter( usuario => usuario.is_active).length;
    const usuariosInactivos = usuarios.filter(usuario => !usuario.is_active).length;
    const administradores = usuarios.filter(usuario =>usuario.groups?.includes("ADMINISTRADOR")).length;

    const resumen = [
        {
            label: "Usuarios",
            value: totalUsuarios,
            description: "Usuarios registrados",
            icon: FiUsers,
            iconClass: "text-slate-600",
            iconBg: "bg-slate-100",
            valueClass: "text-slate-950",
        },
        {
            label: "Activos",
            value: usuariosActivos,
            description: "Usuarios habilitados",
            icon: FiUserCheck,
            iconClass: "text-emerald-600",
            iconBg: "bg-emerald-50",
            valueClass: "text-emerald-600",
        },
        {
            label: "Inactivos",
            value: usuariosInactivos,
            description: "Usuarios deshabilitados",
            icon: FiUserX,
            iconClass: "text-red-600",
            iconBg: "bg-red-50",
            valueClass: "text-red-600",
        },
        {
            label: "Administradores",
            value: administradores,
            description: "Acceso administrativo",
            icon: FiShield,
            iconClass: "text-blue-600",
            iconBg: "bg-blue-50",
            valueClass: "text-blue-600",
        },
    ];
    const rolesDisponibles = useMemo(() => {
        return [
            ...new Set(
                usuarios.flatMap(
                    usuario => usuario.groups || []
                )
            )
        ].sort();
    }, [usuarios]);

    const usuariosFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();
        return usuarios.filter((usuario) => {
            const coincideBusqueda =
                texto === "" ||
                usuario.username
                    ?.toLowerCase()
                    .includes(texto) ||
                usuario.first_name
                    ?.toLowerCase()
                    .includes(texto) ||
                usuario.last_name
                    ?.toLowerCase()
                    .includes(texto) ||
                usuario.email
                    ?.toLowerCase()
                    .includes(texto);
            const coincideEstado =
                filtroEstado === "todos" ||
                (
                    filtroEstado === "activo" &&
                    usuario.is_active
                ) ||
                (
                    filtroEstado === "inactivo" &&
                    !usuario.is_active
                );
            const coincideRol =
                filtroRol === "todos" ||
                usuario.groups?.includes(filtroRol);
            return (
                coincideBusqueda &&
                coincideEstado &&
                coincideRol
            );
        });
    }, [
        usuarios,
        busqueda,
        filtroEstado,
        filtroRol
    ]);

    if (loading) {
        return (
            <main className="
                flex
                min-h-screen
                items-center
                justify-center
            ">
                <p>
                    Cargando usuarios...
                </p>
            </main>
        );
    }

    return (
        <main
            className="
                relative
                min-h-screen
                overflow-hidden
                pt-24
            ">
            <div
                className="
                    pointer-events-none
                    fixed
                    inset-0
                    z-0
                    h-screen
                    w-screen
                    bg-cover
                    bg-left
                    bg-no-repeat
                "
                style={{
                    backgroundImage: `url(${fondoUnidades})`,
                    backgroundPosition: "left center",
                }}
            />
            {mensajeExito && (
                <div className="
                    fixed
                    right-6
                    top-24
                    z-[100]
                    rounded-xl
                    bg-emerald-600
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-white
                    shadow-xl
                ">
                    ✓ {mensajeExito}
                </div>

            )}
            <div className="
                relative
                z-10
                mx-auto
                w-full
                max-w-[1380px]
                px-5
                pb-12
                md:px-8
                lg:pl-40
                lg:pr-10
            ">
                <header className="
                    flex
                    flex-col
                    gap-5
                    py-7
                    md:flex-row
                    md:items-end
                    md:justify-between
                ">
                    <div>
                        <span className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.35em]
                            text-slate-400
                        ">
                            Administración
                        </span>
                        <h1 className="
                            mt-2
                            text-3xl
                            font-bold
                            uppercase
                            tracking-tight
                            text-slate-950
                            md:text-4xl
                        ">
                            Usuarios
                        </h1>

                        <p className="
                            mt-1
                            text-base
                            text-slate-500
                            md:text-lg
                        ">
                            Gestiona los usuarios del sistema
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={abrirNuevoUsuario}
                        className="
                            inline-flex
                            w-fit
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-slate-950
                            px-5
                            py-3
                            text-sm
                            font-medium
                            text-white
                            shadow-lg
                            shadow-black/10
                            transition
                            hover:bg-slate-800
                    ">
                        <FiUserPlus size={18} />
                        Nuevo usuario
                    </button>
                </header>
                <section className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                ">
                    {resumen.map((item) => {
                        const Icon = item.icon;
                        return (
                            <article
                                key={item.label}
                                className="
                                    flex
                                    min-h-[110px]
                                    items-center
                                    gap-5
                                    rounded-2xl
                                    border
                                    border-white/80
                                    bg-white
                                    p-6
                                    shadow-xl
                                    backdrop-blur
                            ">
                                <div
                                    className={`
                                        flex
                                        h-14
                                        w-14
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        ${item.iconBg}
                                        ${item.iconClass}
                                    `}
                                >
                                    <Icon size={25} />
                                </div>
                                <div className="min-w-0">
                                    <p className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.14em]
                                        text-slate-500
                                    ">
                                        {item.label}
                                    </p>
                                    <p
                                        className={`
                                            mt-1
                                            text-3xl
                                            font-bold
                                            tracking-tight
                                            ${item.valueClass}
                                        `}
                                    >
                                        {item.value}
                                    </p>
                                    <p className="
                                        mt-1
                                        text-xs
                                        text-slate-400
                                    ">
                                        {item.description}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </section>
                <section className="
                    mt-6
                    rounded-2xl
                    border
                    border-slate-200/70
                    bg-white/90
                    p-5
                    shadow-xl
                    backdrop-blur
                ">
                    <div className="
                        grid
                        grid-cols-1
                        items-end
                        gap-4
                        md:grid-cols-2
                        xl:grid-cols-[1.6fr_1fr_1fr_auto]
                    ">
                        <div className="flex flex-col gap-2">
                            <label className="
                                text-xs
                                font-medium
                                text-slate-500
                            ">
                                Buscar
                            </label>
                            <div className="relative">
                                <CiSearch
                                    size={21}
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />
                                <input
                                    type="text"
                                    value={busqueda}
                                    onChange={(event) =>
                                        setBusqueda(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Nombre, usuario o correo..."
                                    className="
                                        h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        pl-11
                                        pr-4
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-slate-400
                                        focus:ring-4
                                        focus:ring-slate-100
                                    "
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="
                                text-xs
                                font-medium
                                text-slate-500
                            ">
                                Estado
                            </label>
                            <select
                                value={filtroEstado}
                                onChange={(event) =>
                                    setFiltroEstado(
                                        event.target.value
                                    )
                                }
                                className="
                                    h-12
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-4
                                    text-sm
                                    text-slate-700
                                    outline-none
                            ">
                                <option value="todos">
                                    Todos
                                </option>
                                <option value="activo">
                                    Activos
                                </option>
                                <option value="inactivo">
                                    Inactivos
                                </option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="
                                text-xs
                                font-medium
                                text-slate-500
                            ">
                                Rol
                            </label>
                            <select
                                value={filtroRol}
                                onChange={(event) =>
                                    setFiltroRol(
                                        event.target.value
                                    )
                                }
                                className="
                                    h-12
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-4
                                    text-sm
                                    text-slate-700
                                    outline-none
                            ">
                                <option value="todos">
                                    Todos los roles
                                </option>
                                {rolesDisponibles.map((rol) => (
                                    <option
                                        key={rol}
                                        value={rol}
                                    >
                                        {rol}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setBusqueda("");
                                setFiltroEstado("todos");
                                setFiltroRol("todos");
                            }}
                            className="
                                flex
                                h-12
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-5
                                text-sm
                                font-medium
                                text-slate-600
                                transition
                                hover:bg-slate-50
                        ">
                            <CiRedo size={20} />
                            Limpiar
                        </button>
                    </div>
                </section>
                <section className="
                    mt-6
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white/95
                    shadow-[0_10px_35px_rgba(15,23,42,0.06)]
                    backdrop-blur
                ">
                    <div className="overflow-x-auto">
                        <table className="
                            w-full
                            min-w-[900px]
                            border-collapse
                        ">
                            <thead>
                                <tr className="
                                    border-b
                                    border-slate-200
                                    bg-slate-50/80
                                ">
                                    <th className="table-header">
                                        Usuario
                                    </th>
                                    <th className="table-header">
                                        Nombre
                                    </th>
                                    <th className="table-header">
                                        Email
                                    </th>
                                    <th className="table-header">
                                        Rol
                                    </th>
                                    <th className="table-header">
                                        Estado
                                    </th>
                                    <th className="table-header">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="
                                divide-y
                                divide-slate-100
                            ">
                                {usuariosFiltrados.map(
                                    (usuario) => (
                                        <tr
                                            key={usuario.id}
                                            className="
                                                transition
                                                hover:bg-slate-50/80
                                        ">
                                            <td className="table-body">
                                                <span className="
                                                    font-medium
                                                    text-slate-800
                                                ">
                                                    {usuario.username}
                                                </span>
                                            </td>
                                            <td className="table-body">
                                                {usuario.first_name}
                                                {" "}
                                                {usuario.last_name}
                                            </td>
                                            <td className="table-body">
                                                {usuario.email || "—"}
                                            </td>
                                            <td className="table-body">
                                                <div className="
                                                    flex
                                                    flex-wrap
                                                    justify-center
                                                    gap-1
                                                ">
                                                    {usuario.groups?.map(
                                                        (group) => (
                                                            <span
                                                                key={group}
                                                                className="
                                                                    rounded-full
                                                                    bg-slate-100
                                                                    px-3
                                                                    py-1.5
                                                                    text-xs
                                                                    font-medium
                                                                    text-slate-700
                                                            ">
                                                                {group}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                            <td className="table-body">
                                                <span
                                                    className={`
                                                        inline-flex
                                                        rounded-full
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-medium
                                                        ${
                                                            usuario.is_active
                                                                ? "bg-emerald-50 text-emerald-700"
                                                                : "bg-red-50 text-red-700"
                                                        }
                                                    `}
                                                >
                                                    {usuario.is_active
                                                        ? "Activo"
                                                        : "Inactivo"
                                                    }
                                                </span>
                                            </td>
                                            <td className="table-body">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditar(
                                                            usuario
                                                        )
                                                    }
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-lg
                                                        border
                                                        border-slate-300
                                                        bg-white
                                                        px-4
                                                        py-2
                                                        text-sm
                                                        font-medium
                                                        text-slate-700
                                                        transition
                                                        hover:border-slate-400
                                                        hover:bg-slate-50
                                                        hover:text-slate-950
                                                ">
                                                    <CiEdit size={18} />
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
            {usuarioEditar && (
                <UsuarioForm
                    formulario={formulario}
                    setFormulario={setFormulario}
                    onSubmit={guardarCambios}
                    onCancel={cerrarModal}
                    guardando={guardando}
                    modo="editar"
                />
            )}
            {mostrarNuevoUsuario && (
                <UsuarioForm
                    formulario={formulario}
                    setFormulario={setFormulario}
                    onSubmit={crearUsuario}
                    onCancel={cerrarNuevoUsuario}
                    guardando={guardando}
                    modo="crear"
                />
            )}
        </main>
    );
}
export default Usuarios;