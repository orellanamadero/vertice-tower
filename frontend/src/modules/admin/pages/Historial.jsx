import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api";
import { CiSearch, CiRedo } from "react-icons/ci";
import { FiClock, FiRefreshCw, FiDollarSign, FiFileText,} from "react-icons/fi";
import fondoUnidades from "../images/fondoUnidades.webp";

function Historial() {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sinPermiso, setSinPermiso] = useState(false);
    const [filtroPiso, setFiltroPiso] = useState("todos");
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [busqueda, setBusqueda] = useState("");

    const historialFiltrado = useMemo(() => {
        const textoBusqueda = busqueda.trim().toLowerCase();
        return historial.filter((registro) => {
            const coincidePiso =
                filtroPiso === "todos" ||
                String(registro.numero_piso) === filtroPiso;
            const coincideTipo =
                filtroTipo === "todos" ||
                registro.tipo === filtroTipo;
            const coincideBusqueda =
                textoBusqueda === "" ||
                registro.unidad_codigo
                    ?.toLowerCase()
                    .includes(textoBusqueda) ||
                registro.usuario_nombre
                    ?.toLowerCase()
                    .includes(textoBusqueda) ||
                registro.tipo_venta_nombre
                    ?.toLowerCase()
                    .includes(textoBusqueda);
            return (
                coincidePiso &&
                coincideTipo &&
                coincideBusqueda
            );
        });
    }, [
        historial,
        filtroPiso,
        filtroTipo,
        busqueda
    ]);
    const totalRegistros = historial.length;
    const cambiosEstado = historial.filter(registro => registro.tipo === "estado").length;
    const cambiosPrecio = historial.filter(registro => registro.tipo === "precio").length;
    const respaldos = historial.filter(registro => registro.documento_venta).length;
    const resumen = [
        {
            label: "Registros",
            value: totalRegistros,
            description: "Movimientos registrados",
            icon: FiClock,
            iconClass: "text-slate-600",
            iconBg: "bg-slate-100",
            valueClass: "text-slate-950",
        },
        {
            label: "Estados",
            value: cambiosEstado,
            description: "Cambios de estado",
            icon: FiRefreshCw,
            iconClass: "text-blue-600",
            iconBg: "bg-blue-50",
            valueClass: "text-blue-600",
        },
        {
            label: "Precios",
            value: cambiosPrecio,
            description: "Cambios de precio",
            icon: FiDollarSign,
            iconClass: "text-emerald-600",
            iconBg: "bg-emerald-50",
            valueClass: "text-emerald-600",
        },
        {
            label: "Respaldos",
            value: respaldos,
            description: "Documentos registrados",
            icon: FiFileText,
            iconClass: "text-amber-600",
            iconBg: "bg-amber-50",
            valueClass: "text-amber-600",
        },
    ];
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
                            Historial
                        </h1>
                        <p className="
                            mt-1
                            text-base
                            text-slate-500
                            md:text-lg
                        ">
                            Registro de cambios de estados y precios
                        </p>
                    </div>
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
                                    border-white/95
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
                                <div>
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
                    bg-white/95
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
                                        setBusqueda(event.target.value)
                                    }
                                    placeholder="Unidad, usuario o tipo de venta..."
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
                                Piso
                            </label>
                            <select
                                value={filtroPiso}
                                onChange={(event) =>
                                    setFiltroPiso(event.target.value)
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
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="
                                text-xs
                                font-medium
                                text-slate-500
                            ">
                                Tipo de cambio
                            </label>
                            <select
                                value={filtroTipo}
                                onChange={(event) =>
                                    setFiltroTipo(event.target.value)
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
                                <option value="estado">
                                    Estado
                                </option>
                                <option value="precio">
                                    Precio
                                </option>
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setBusqueda("");
                                setFiltroPiso("todos");
                                setFiltroTipo("todos");
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
                        <table className="w-full min-w-[1100px] border-collapse">
                            <thead className="
                                whitespace-nowrap
                                border-b
                                border-slate-200
                                bg-slate-50/80
                                text-sm
                                font-semibold
                                text-slate-900
                            ">
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
                                        className="
                                            text-center
                                            transition
                                            hover:bg-slate-100/80
                                    ">
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
                </section>
            </div>
        </main>
    );
}

export default Historial;
