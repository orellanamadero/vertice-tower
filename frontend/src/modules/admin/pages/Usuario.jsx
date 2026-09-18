import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { CiEdit } from "react-icons/ci";
import UsuarioForm from "../components/UsuarioForm";

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
    const [formulario, setFormulario] = useState(
        formularioInicial
    );
    const [guardando, setGuardando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");
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
        <main className="
            min-h-screen
            bg-white
            pt-25
        ">
            {mensajeExito && (
                <div className="
                    fixed
                    right-6
                    top-24
                    z-[100]
                    rounded-xl
                    bg-green-600
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-white
                    shadow-lg
                ">
                    ✓ {mensajeExito}
                </div>
            )}
            <header className="
                px-6
                py-5
            ">
                <div className="
                    mx-auto
                    max-w-7xl
                ">
                    <h1 className="
                        text-3xl
                        font-semibold
                        uppercase
                    ">
                        Usuarios
                    </h1>
                    <p className="
                        my-1
                        text-base
                        md:text-lg
                        text-gray-500
                    ">
                        Gestiona los usuarios del sistema.
                    </p>
                    <button
                        type="button"
                        onClick={abrirNuevoUsuario}
                        className="
                            my-2
                            rounded-lg
                            bg-[var(--color-naranja)]
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-slate-700
                        "
                    >
                        Nuevo usuario
                    </button>
                </div>
                <div className="
                    mx-auto
                    max-w-7xl
                    pt-6
                ">
                    <div className="
                        overflow-hidden
                        rounded-2xl
                        bg-white
                        shadow-sm
                    ">
                        <div className="overflow-x-auto">
                            <table className="
                                w-full
                                min-w-[800px]
                            ">
                                <thead className="
                                    bg-[var(--color-naranja)]/80
                                    text-center
                                    text-stone-50
                                ">
                                    <tr>
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
                                    divide-black/10
                                ">
                                    {usuarios.map((usuario) => (
                                        <tr
                                            key={usuario.id}
                                            className="
                                                transition
                                                hover:bg-slate-50
                                        ">
                                            <td className="table-body">
                                                {usuario.username}
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
                                                {usuario.groups?.map(
                                                    (group) => (
                                                        <span
                                                            key={group}
                                                            className="
                                                                rounded-full
                                                                bg-slate-100
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                font-medium
                                                                text-slate-700
                                                        ">
                                                            {group}
                                                        </span>
                                                    )
                                                )}
                                            </td>
                                            <td className="table-body">
                                                <span
                                                    className={
                                                        usuario.is_active
                                                            ? `
                                                                rounded-full
                                                                bg-green-100
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                font-medium
                                                                text-green-700
                                                            `
                                                            : `
                                                                rounded-full
                                                                bg-red-100
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                font-medium
                                                                text-red-700
                                                            `
                                                    }
                                                >
                                                    {usuario.is_active
                                                        ? "Activo"
                                                        : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="table-body">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditar(usuario)
                                                    }
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        rounded-full
                                                        border
                                                        bg-blue-500
                                                        px-4
                                                        py-2
                                                        text-xs
                                                        font-medium
                                                        tracking-wide
                                                        text-slate-100
                                                        transition
                                                        hover:bg-slate-900
                                                ">
                                                    <CiEdit className="size-4" />
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </header>
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