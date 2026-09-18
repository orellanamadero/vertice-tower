import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
function Historial() {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sinPermiso, setSinPermiso] = useState(false);
    const [filtroPiso, setFiltroPiso] = useState("todos");
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const historialFiltrado = historial.filter((registro) => {
        const coincidePiso =
            filtroPiso === "todos" ||
            String(registro.numero_piso) === filtroPiso;
        const coincideTipo =
            filtroTipo === "todos" ||
            registro.tipo === filtroTipo;
        return coincidePiso && coincideTipo;
    });
    const pisosDisponibles = [
        ...new Set(
            historial.map((registro) => registro.numero_piso)
        ),
    ].sort((a, b) => a - b);

    const cargarHistorial = async () => {
        try {
            const response = await apiFetch(
                "/proyectos/historial/"
            );

            if (response.status === 403) {
                setSinPermiso(true);
                return;
            }
            if (!response.ok) {
                throw new Error(
                    "No se pudo cargar el historial"
                );
            }
            const data = await response.json();
            setHistorial(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        cargarHistorial();
    }, []);
    const getDocumentoUrl = (documento) => {
        if (!documento) return "";
        const backendUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
        const pathname = documento.startsWith("http")
            ? new URL(documento).pathname
            : documento.startsWith("/")
                ? documento
                : `/${documento}`;
        return `${backendUrl}${pathname}`;
    };
    if (sinPermiso) {
        return (
            <main className="
                flex
                min-h-screen
                flex-col
                items-center
                justify-center
                gap-2
            ">
                <h1 className="text-2xl font-semibold">
                    Acceso denegado
                </h1>

                <p className="text-gray-500">
                    No tienes permisos para acceder al historial.
                </p>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="
                flex
                min-h-screen
                items-center
                justify-center
            ">
                <p>Cargando historial...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white pt-25">

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
                        Historial
                    </h1>

                    <p className="
                        mt-1
                        text-base
                        md:text-lg
                        text-gray-500
                    ">
                        Registro de cambios de estados y precios
                    </p>
                </div>
            </header>

            <div className="
                mx-auto
                max-w-7xl
                p-6
            ">
                <div className="
                    mb-6
                    flex
                    flex-col
                    gap-4
                    rounded-2xl
                    bg-white
                    p-5
                    shadow-sm
                    md:flex-row
                    md:items-end
                ">

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">
                            Piso
                        </label>

                        <div className="relative w-fit">
                            <select
                                value={filtroPiso}
                                onChange={(e) => setFiltroPiso(e.target.value)}
                                className="
                                    appearance-none
                                    rounded-xl
                                    border
                                    border-black/10
                                    bg-white
                                    py-2.5
                                    pl-4
                                    pr-10
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-[var(--color-naranja)]
                                "
                            >
                                <option value="todos">
                                    Todos los pisos
                                </option>

                                {pisosDisponibles.map((piso) => (
                                    <option
                                        key={piso}
                                        value={String(piso)}
                                    >
                                        Piso {piso}
                                    </option>
                                ))}
                            </select>

                            <span className="
                                pointer-events-none
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-500
                            ">
                                ▼
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">
                            Tipo de cambio
                        </label>
                            <div className="relative w-fit">
                            <select
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                                className="
                                    appearance-none
                                    rounded-xl
                                    border
                                    border-black/10
                                    bg-white
                                    py-2.5
                                    pl-4
                                    pr-10
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-[var(--color-naranja)]
                                "
                            >
                                <option value="todos">
                                    Todos
                                </option>

                                <option value="estado">
                                    Estado
                                </option>

                                <option value="precio">
                                    Precio
                                </option>
                            </select>
                            <span className="
                                pointer-events-none
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-500
                            ">
                                ▼
                            </span>
                        </div>
                    </div>

                    {(filtroPiso !== "todos" || filtroTipo !== "todos") && (
                        <button
                            type="button"
                            onClick={() => {
                                setFiltroPiso("todos");
                                setFiltroTipo("todos");
                            }}
                            className="
                                rounded-xl
                                border
                                border-black/10
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-gray-600
                                transition
                                hover:bg-zinc-50
                            "
                        >
                            Limpiar filtros
                        </button>
                    )}

                </div>
                <div className="
                    overflow-hidden
                ">
                    <div className="max-w-7xl mx-auto border border-slate-200 rounded-2xl overflow-x-auto">
                        <table className="w-full">
                            <thead className="text-slate-900 text-sm font-semibold border-b border-slate-300 whitespace-nowrap">
                                <tr className="bg-slate-50">
                                    <th scope="col" className="table-header">
                                        Piso
                                    </th>
                                    <th scope="col" className="table-header">
                                        Unidad
                                    </th>
                                    <th scope="col" className="table-header">
                                        Tipo de cambio
                                    </th>
                                    <th scope="col" className="table-header">
                                        Cambio
                                    </th>
                                    <th scope="col" className="table-header">
                                        Respaldo
                                    </th>
                                    <th scope="col" className="table-header">
                                        Usuario
                                    </th>
                                    <th scope="col" className="table-header">
                                        Fecha
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="text-sm divide-y divide-slate-200">

                                {historialFiltrado.map((registro) => (
                                    <tr
                                        key={`${registro.tipo}-${registro.id}`}
                                        className="hover:bg-slate-50 text-center"
                                    >
                                        <td className="table-body">
                                            {registro.numero_piso}°
                                        </td>
                                        <td className="table-body">
                                            {registro.unidad_codigo}
                                        </td>
                                        <td className="table-body">
                                            {registro.tipo === "estado" ? (
                                                <span className="
                                                    rounded-full
                                                    bg-blue-100
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-medium
                                                    text-blue-700
                                                ">
                                                    Estado
                                                </span>
                                            ) : (
                                                <span className="
                                                    rounded-full
                                                    bg-amber-100
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-medium
                                                    text-amber-700
                                                ">
                                                    Precio
                                                </span>
                                            )}

                                        </td>
                                        <td className="table-body">
                                            {registro.tipo === "estado" ? (
                                                <div className="
                                                    flex
                                                    flex-col
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                ">
                                                    <div className="
                                                        flex
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                    ">
                                                        <span className="
                                                            rounded-full
                                                            bg-zinc-100
                                                            px-3
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            text-gray-600
                                                        ">
                                                            {registro.estado_anterior_nombre}
                                                        </span>
                                                        <span className="
                                                            text-gray-400
                                                        "> → </span>
                                                        <span
                                                            className={`
                                                                rounded-full
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                font-medium
                                                                ${
                                                                    registro.estado_nuevo === 1
                                                                        ? "bg-green-100 text-green-700"
                                                                        : registro.estado_nuevo === 2
                                                                            ? "bg-red-100 text-red-700"
                                                                            : "bg-amber-100 text-amber-700"
                                                                }
                                                            `}
                                                        >
                                                            {registro.estado_nuevo_nombre}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                ">
                                                    <span className="
                                                        text-gray-500
                                                    ">
                                                        {Number(
                                                            registro.precio_anterior
                                                        ).toLocaleString(
                                                            "es-BO",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </span>
                                                    <span className="
                                                        text-gray-400
                                                    "> → </span>
                                                    <span className="
                                                        font-medium
                                                    ">
                                                        {Number(
                                                            registro.precio_nuevo
                                                        ).toLocaleString(
                                                            "es-BO",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="table-body">
                                            {[2, 3].includes(registro.estado_nuevo) ? (
                                                <div className="
                                                    flex
                                                    flex-col
                                                    items-center
                                                    gap-1
                                                    text-xs
                                                ">
                                                    <span className="
                                                        font-medium
                                                        text-gray-400
                                                    ">
                                                        {registro.tipo_venta_nombre || "-"}
                                                    </span>
                                                    {registro.documento_venta ? (
                                                        <a
                                                            href={getDocumentoUrl(registro.documento_venta)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="
                                                                font-medium
                                                                text-blue-600
                                                                hover:text-blue-800
                                                                hover:underline
                                                            "
                                                        >
                                                            Ver documento
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400">
                                                            -
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                "-"
                                            )}
                                        </td>

                                        <td className="table-body">
                                            {registro.usuario_nombre}
                                        </td>
                                        <td className="table-body">
                                            {new Date(
                                                registro.fecha
                                            ).toLocaleString(
                                                "es-BO"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Historial;
