import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api";
import { invalidarProyectoRecorridoCache } from "../../../services/api";
import { useOutletContext } from "react-router-dom";
import { CiEdit, CiSearch, CiRedo} from "react-icons/ci";
import { FiBox, FiCheckCircle, FiTag, FiBookmark, FiExternalLink } from "react-icons/fi";
import fondoUnidades from "../images/fondoUnidades.webp";

function Dashboard() {
    const { proyecto, usuario } = useOutletContext();
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [filtroPiso, setFiltroPiso] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [filtroTipoUnidad, setFiltroTipoUnidad] = useState("todos");
    const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
    const [modal, setModal] = useState(null);
    const [tiposVenta, setTiposVenta] = useState([]);
    const cargarTiposVenta = async () => {
        try {
            const response = await apiFetch(
                "/proyectos/unidades/tipos-venta/"
            );
            if (!response.ok) {
                throw new Error(
                    "No se pudieron obtener los tipos de venta"
                );
            }
            const data = await response.json();
            setTiposVenta(data);
        } catch (error) {
            console.error(
                "Error al cargar tipos de venta:",
                error
            );
        }
    };
    const [formulario, setFormulario] = useState({
        precio: "",
        moneda: 1,
        estado: 1,
        tipoVenta: "",
        documentoVenta: null,
    });

    const cargarUnidades = async () => {
        try {
            const response = await apiFetch(
                "/proyectos/unidades/"
            );
            if (!response.ok) {
                throw new Error("No se pudieron cargar las unidades");
            }

            const data = await response.json();
            const unidadesVenta = data.filter(
                unidad =>
                    unidad.tipoUnidad?.categoriaNombre !== "AREA COMUN"
            );
            setUnidades(unidadesVenta);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        cargarUnidades();
        cargarTiposVenta();
    }, []);
    const esAdministrador = usuario?.groups?.includes("ADMINISTRADOR");
    const editarUnidad = async () => {
        if (!unidadSeleccionada) {
            console.log("No hay unidad seleccionada");
            return;
        }
        const estadoAnterior = Number(unidadSeleccionada.estado);
        const estadoNuevo = Number(formulario.estado);
        if (
            [2, 3].includes(estadoNuevo) &&
            estadoAnterior !== estadoNuevo &&
            !formulario.documentoVenta
        ) {
            alert(
                estadoNuevo === 2
                    ? "Debe subir un documento de respaldo para vender la unidad."
                    : "Debe subir un documento de respaldo para reservar la unidad."
            );
            return;
        }
        if (
            [2, 3].includes(estadoNuevo) &&
            !formulario.tipoVenta
        ) {
            alert("Debe seleccionar el tipo de venta.");
            return;
        }
        try {
            console.log("EDITANDO UNIDAD:", unidadSeleccionada.id);
            console.log("FORMULARIO:", formulario);
            console.log("ES ADMIN:", esAdministrador);

            const formData = new FormData();

            if (esAdministrador) {
                const precioNumerico = Number(formulario.precio);
                console.log("PRECIO NUMÉRICO:", precioNumerico);
                if (
                    !Number.isFinite(precioNumerico) ||
                    precioNumerico < 0
                ) {
                    console.log("PRECIO INVÁLIDO");
                    return;
                }
                formData.append(
                    "precio",
                    precioNumerico.toFixed(2)
                );
                formData.append(
                    "moneda",
                    formulario.moneda
                );
            }
            formData.append(
                "estado",
                formulario.estado
            );
            if (formulario.tipoVenta) {
                formData.append(
                    "tipoVenta",
                    formulario.tipoVenta
                );
            }
            if (formulario.documentoVenta) {
                formData.append(
                    "documentoVenta",
                    formulario.documentoVenta
                );
            }
            console.log("ENVIANDO PETICIÓN...");
            const response = await apiFetch(
                `/proyectos/unidades/${unidadSeleccionada.id}/editar/`,
                {
                    method: "PATCH",
                    body: formData,
                }
            );
            console.log("STATUS:", response.status);
            if (!response.ok) {
                const errorData = await response.json();
                console.error(
                    "ERROR DEL BACKEND:",
                    errorData
                );
                throw new Error(
                    "No se pudo editar la unidad"
                );
            }
            const data = await response.json();
            console.log(
                "UNIDAD ACTUALIZADA:",
                data
            );
            invalidarProyectoRecorridoCache();
            await cargarUnidades();
            setModal(null);
            setUnidadSeleccionada(null);
            setFormulario({
                precio: "",
                moneda: 1,
                estado: 1,
                tipoVenta: "",
                documentoVenta: null,
            });

        } catch (error) {
            console.error(
                "ERROR AL EDITAR:",
                error
            );
        }
    };

    const pisos = useMemo(() => {
        return [...new Set(
            unidades.map((unidad) => unidad.numeroPiso)
        )];
    }, [unidades]);

    const tiposUnidad = useMemo(() => {
        return [
            ...new Set(
                unidades
                    .map((unidad) => unidad.tipoUnidad?.tipo)
                    .filter(Boolean)
            )
        ].sort();
    }, [unidades]);

    const unidadesFiltradas = useMemo(() => {
        return unidades.filter((unidad) => {
            const coincideEstado =
                filtroEstado === "todos" ||
                unidad.estado === Number(filtroEstado);
            const coincidePiso =
                filtroPiso === "todos" ||
                unidad.numeroPiso === Number(filtroPiso);
            const coincideTipo =
                filtroTipoUnidad === "todos" ||
                unidad.tipoUnidad?.tipo === filtroTipoUnidad;
            const textoBusqueda = busqueda
                .trim()
                .toLowerCase();
            const coincideBusqueda =
                textoBusqueda === "" ||
                unidad.tipoUnidad?.nombre
                    ?.toLowerCase()
                    .includes(textoBusqueda) ||
                unidad.tipoUnidad?.codigo
                    ?.toLowerCase()
                    .includes(textoBusqueda);
            return (
                coincideEstado &&
                coincidePiso &&
                coincideTipo &&
                coincideBusqueda
            );
        });
    }, [
        unidades,
        filtroEstado,
        filtroPiso,
        filtroTipoUnidad,
        busqueda
    ]);
    const total = unidades.length;
    const disponibles = unidades.filter(
        (unidad) => unidad.estado === 1
    ).length;
    const vendidas = unidades.filter(
        (unidad) => unidad.estado === 2
    ).length;
    const reservadas = unidades.filter(
        (unidad) => unidad.estado === 3
    ).length;

    const resumen = [
        {
            label: "Total",
            value: total,
            description: "Unidades en el proyecto",
            icon: FiBox,
            iconClass: "text-slate-600",
            iconBg: "bg-slate-100",
            valueClass: "text-slate-950",
        },
        {
            label: "Disponibles",
            value: disponibles,
            description: "Unidades disponibles",
            icon: FiCheckCircle,
            iconClass: "text-emerald-600",
            iconBg: "bg-emerald-50",
            valueClass: "text-emerald-600",
        },
        {
            label: "Vendidas",
            value: vendidas,
            description: "Unidades vendidas",
            icon: FiTag,
            iconClass: "text-red-600",
            iconBg: "bg-red-50",
            valueClass: "text-red-600",
        },
        {
            label: "Reservadas",
            value: reservadas,
            description: "Unidades reservadas",
            icon: FiBookmark,
            iconClass: "text-amber-600",
            iconBg: "bg-amber-50",
            valueClass: "text-amber-600",
        },
    ];
    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Cargando unidades...</p>
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
                            Proyecto
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
                            {proyecto?.nombreProyecto}
                        </h1>
                        <p className="
                            mt-1
                            text-base
                            text-slate-500
                            md:text-lg
                        ">
                            Gestión de unidades
                        </p>
                    </div>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            inline-flex
                            w-fit
                            items-center
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
                        "
                    >
                        <FiExternalLink size={17} />
                        Ver showroom
                    </a>
                </header>
                <section
                    aria-label="Resumen de unidades"
                    className="
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

                <section
                    aria-label="Filtros de unidades"
                    className="
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
                        xl:grid-cols-[1.6fr_1fr_1fr_1fr_auto]
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
                                    placeholder="Buscar unidad..."
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
                                    setFiltroEstado(event.target.value)
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
                                <option value="1">
                                    Disponible
                                </option>
                                <option value="2">
                                    Vendido
                                </option>
                                <option value="3">
                                    Reservado
                                </option>
                            </select>
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
                                {[...pisos]
                                    .sort((a, b) => a - b)
                                    .map((piso) => (
                                        <option
                                            key={piso}
                                            value={piso}
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
                                Tipo
                            </label>
                            <select
                                value={filtroTipoUnidad}
                                onChange={(event) =>
                                    setFiltroTipoUnidad(
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
                                    Todos los tipos
                                </option>
                                {tiposUnidad.map((tipo) => (
                                    <option
                                        key={tipo}
                                        value={tipo}
                                    >
                                        {tipo}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setBusqueda("");
                                setFiltroEstado("todos");
                                setFiltroPiso("todos");
                                setFiltroTipoUnidad("todos");
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
                                    <th scope="col" className="table-header">
                                        Piso
                                    </th>
                                    <th scope="col" className="table-header">
                                        Departamento
                                    </th>
                                    <th scope="col" className="table-header">
                                        Tipo
                                    </th>

                                    <th scope="col" className="table-header">
                                        Precio
                                    </th>

                                    <th scope="col" className="table-header">
                                        Estado
                                    </th>

                                    <th className="
                                        px-7
                                        py-4
                                        text-center
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-slate-600
                                    ">
                                        Acción
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="
                                divide-y
                                divide-slate-100
                            ">

                                {[...unidadesFiltradas]
                                    .sort((a, b) => {

                                        if (
                                            a.numeroPiso !==
                                            b.numeroPiso
                                        ) {
                                            return (
                                                a.numeroPiso -
                                                b.numeroPiso
                                            );
                                        }

                                        return a.tipoUnidad.codigo.localeCompare(
                                            b.tipoUnidad.codigo
                                        );
                                    })
                                    .map((unidad) => (

                                        <tr
                                            key={unidad.id}
                                            className="
                                                transition
                                                hover:bg-slate-50/80
                                            "
                                        >

                                            <td className="table-body">
                                                {unidad.numeroPiso}
                                            </td>

                                            <td className="table-body">
                                                {unidad.tipoUnidad.nombre}
                                            </td>

                                            <td className="table-body">
                                                {unidad.tipoUnidad.tipo}
                                            </td>

                                            <td className="table-body">
                                                {unidad.precio
                                                    ? `${Number(
                                                        unidad.precio
                                                    ).toLocaleString(
                                                        "es-BO",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )} ${unidad.tipoMoneda}`
                                                    : "—"
                                                }
                                            </td>

                                            <td className="
                                                px-7
                                                py-4
                                            ">

                                                <span
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        rounded-full
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-medium
                                                        ${
                                                            unidad.estado === 1
                                                                ? "bg-emerald-50 text-emerald-700"
                                                                : unidad.estado === 2
                                                                    ? "bg-red-50 text-red-700"
                                                                    : "bg-amber-50 text-amber-700"
                                                        }
                                                    `}
                                                >
                                                    {unidad.estado === 1
                                                        ? "Disponible"
                                                        : unidad.estado === 2
                                                            ? "Vendido"
                                                            : "Reservado"
                                                    }
                                                </span>

                                            </td>

                                            <td className="
                                                px-7
                                                py-4
                                                text-center
                                            ">

                                                <button
                                                    type="button"
                                                    onClick={() => {

                                                        setUnidadSeleccionada(
                                                            unidad
                                                        );

                                                        setFormulario({
                                                            precio:
                                                                unidad.precio ?? "",
                                                            moneda:
                                                                unidad.moneda ?? 1,
                                                            estado:
                                                                unidad.estado ?? 1,
                                                            tipoVenta:
                                                                unidad.tipoVenta ?? "",
                                                            documentoVenta:
                                                                null,
                                                        });

                                                        setModal("editar");
                                                    }}
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
                                                    "
                                                >
                                                    <CiEdit size={18} />

                                                    Editar
                                                </button>

                                            </td>

                                        </tr>
                                    ))}

                            </tbody>

                        </table>

                    </div>

                </section>

            </div>
            {modal === "editar" && unidadSeleccionada && (
                <div className="
                    fixed
                    inset-0
                    z-50
                    flex
                    items-center
                    justify-center
                    bg-black/40
                    backdrop-blur-sm
                    px-4
                ">
                    <div className="
                        w-full
                        max-w-md
                        max-h-[90vh]
                        overflow-y-auto
                        rounded-2xl
                        bg-white
                        p-6
                        shadow-2xl
                    ">
                        <h2 className="text-xl font-semibold">
                            Editar unidad
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 uppercase">
                            {unidadSeleccionada.tipoUnidad.nombre}
                            {" · "}
                            Piso {unidadSeleccionada.numeroPiso}
                        </p>
                        <div className="mt-6">
                            <label className="
                                mb-2
                                block
                                text-xs
                                uppercase
                                tracking-widest
                                text-gray-500
                            ">
                                Precio
                            </label>
                            {usuario?.groups?.includes("ADMINISTRADOR") ? (
                                <div className="
                                    flex
                                    items-center
                                    rounded-xl
                                    border
                                    border-black/10
                                    bg-zinc-50
                                    px-4
                                ">
                                    <span className="text-sm text-gray-400">
                                        {formulario.moneda === 1
                                            ? "$US"
                                            : "BOB"
                                        }
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formulario.precio}
                                        onChange={(event) =>
                                            setFormulario(prev => ({
                                                ...prev,
                                                precio: event.target.value
                                            }))
                                        }
                                        className="
                                            w-full
                                            bg-transparent
                                            px-3
                                            py-3
                                            outline-none
                                        "
                                    />
                                </div>
                            ) : (
                                <div className="
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-100
                                    px-4
                                    py-3
                                    text-gray-500
                                ">
                                    {Number(
                                        formulario.precio || 0
                                    ).toLocaleString("es-BO", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                    {" "}
                                    {formulario.moneda === 1
                                        ? "$US"
                                        : "BOB"
                                    }
                                    <span className="
                                        ml-2
                                        text-xs
                                        text-gray-400
                                    ">
                                        (Solo administrador)
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <label className="
                                mb-2
                                block
                                text-xs
                                uppercase
                                tracking-widest
                                text-gray-500
                            ">
                                Moneda
                            </label>
                            {usuario?.groups?.includes("ADMINISTRADOR") ? (
                                <select
                                    value={formulario.moneda}
                                    onChange={(event) =>
                                        setFormulario(prev => ({
                                            ...prev,
                                            moneda: Number(event.target.value)
                                        }))
                                    }
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-black/10
                                        bg-zinc-50
                                        px-4
                                        py-3
                                        outline-none
                                ">
                                    <option value={1}>
                                        $US
                                    </option>

                                    <option value={2}>
                                        BOB
                                    </option>
                                </select>
                            ) : (
                                <div className="
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-100
                                    px-4
                                    py-3
                                    text-gray-500
                                ">
                                    {formulario.moneda === 1
                                        ? "$US"
                                        : "BOB"
                                    }
                                    <span className="
                                        ml-2
                                        text-xs
                                        text-gray-400
                                    ">
                                        (Solo administrador)
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <label className="
                                mb-2
                                block
                                text-xs
                                uppercase
                                tracking-widest
                                text-gray-500
                            ">
                                Estado
                            </label>
                            <select
                                value={formulario.estado}
                                onChange={(event) => {
                                    const nuevoEstado = Number(event.target.value);
                                    setFormulario(prev => ({
                                        ...prev,
                                        estado: nuevoEstado,
                                        tipoVenta: [2, 3].includes(nuevoEstado)
                                            ? prev.tipoVenta
                                            : "",
                                        documentoVenta: null,
                                    }));
                                }}
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-black/10
                                    bg-zinc-50
                                    px-4
                                    py-3
                                    outline-none
                            ">
                                <option value={1}>
                                    Disponible
                                </option>
                                <option value={2}>
                                    Vendido
                                </option>
                                <option value={3}>
                                    Reservado
                                </option>
                            </select>
                        </div>
                        {[2, 3].includes(Number(formulario.estado)) && (
                            <div className="mt-4">
                                <label className="
                                    mb-2
                                    block
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    text-gray-500
                                ">
                                    Tipo de venta
                                </label>
                                <select
                                    value={formulario.tipoVenta}
                                    onChange={(event) =>
                                        setFormulario(prev => ({
                                            ...prev,
                                            tipoVenta: Number(
                                                event.target.value
                                            )
                                        }))
                                    }
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-black/10
                                        bg-zinc-50
                                        px-4
                                        py-3
                                        outline-none
                                ">
                                    <option value="">
                                        Seleccionar tipo de venta
                                    </option>
                                    {tiposVenta.map((tipo) => (
                                        <option
                                            key={tipo.id}
                                            value={tipo.id}
                                        >
                                            {tipo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {[2, 3].includes(Number(formulario.estado)) && (
                            <div className="mt-4">
                                <label className="
                                    mb-2
                                    block
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    text-gray-500
                                ">
                                    Documento de respaldo
                                </label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(event) =>
                                        setFormulario(prev => ({
                                            ...prev,
                                            documentoVenta:
                                                event.target.files[0] || null
                                        }))
                                    }
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-black/10
                                        bg-zinc-50
                                        px-4
                                        py-3
                                        text-sm
                                    "
                                />
                                {unidadSeleccionada.documentoVenta && (
                                    <div className="
                                        mt-3
                                        rounded-xl
                                        border
                                        border-black/10
                                        bg-zinc-50
                                        p-3
                                    ">
                                        <p className="
                                            text-xs
                                            text-gray-500
                                        ">
                                            Documento actual
                                        </p>
                                        <p className="
                                            mt-1
                                            truncate
                                            text-sm
                                            font-medium
                                            text-gray-700
                                        ">
                                            {unidadSeleccionada.documentoVenta
                                                .split("/")
                                                .pop()
                                            }
                                        </p>
                                        <a
                                            href={unidadSeleccionada.documentoVenta}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                                                mt-2
                                                inline-block
                                                text-sm
                                                font-medium
                                                text-blue-600
                                                hover:text-blue-800
                                                hover:underline
                                        ">
                                            Ver documento
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="
                            mt-6
                            flex
                            justify-end
                            gap-3
                        ">
                            <button
                                onClick={() => {
                                    setModal(null);
                                    setUnidadSeleccionada(null);
                                    setFormulario({
                                        precio: "",
                                        moneda: 1,
                                        estado: 1,
                                        tipoVenta: "",
                                        documentoVenta: null,
                                    });
                                }}
                                className="
                                    rounded-full
                                    bg-gray-100
                                    px-5
                                    py-2
                                    text-sm
                                    hover:bg-gray-200
                            ">
                                Cancelar
                            </button>
                            <button
                                onClick={editarUnidad}
                                className="
                                    rounded-full
                                    bg-green-600
                                    px-5
                                    py-2
                                    text-sm
                                    font-medium
                                    text-white
                                    hover:bg-green-700
                            ">
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
export default Dashboard;