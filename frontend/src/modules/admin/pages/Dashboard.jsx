import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api";
import { invalidarProyectoRecorridoCache } from "../../../services/api";
import { useOutletContext } from "react-router-dom";
import { CiEdit } from "react-icons/ci";

function Dashboard() {
    const { proyecto, usuario } = useOutletContext();
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [filtroPiso, setFiltroPiso] = useState("todos");
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
            estadoNuevo === 2 &&
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

    const unidadesFiltradas = useMemo(() => {
        return unidades.filter((unidad) => {
            const coincideEstado =
                filtroEstado === "todos" ||
                unidad.estado === Number(filtroEstado);
            const coincidePiso =
                filtroPiso === "todos" ||
                unidad.numeroPiso === Number(filtroPiso);

            return coincideEstado && coincidePiso;
        });
    }, [unidades, filtroEstado, filtroPiso]);

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
        },
        {
            label: "Disponibles",
            value: disponibles,
            valueClass: "text-green-600",
        },
        {
            label: "Vendidas",
            value: vendidas,
            valueClass: "text-red-600",
        },
        {
            label: "Reservadas",
            value: reservadas,
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
                        {proyecto?.nombreProyecto}
                    </h1>

                    <p className="
                        mt-1
                        text-base
                        md:text-lg
                        text-gray-500
                    ">
                        Gestión de unidades
                    </p>
                </div>
            </header>

            <div className="
                mx-auto
                max-w-7xl
                p-6
            ">
                {/* RESUMEN */}

                <div className="
                    grid
                    gap-4
                    md:grid-cols-4
                ">
                    {resumen.map((item) => (
                        <div
                            key={item.label}
                            className="
                                rounded-2xl
                                bg-stone-50
                                p-5
                                shadow-md
                            "
                        >
                            <span className="
                                text-sm
                                uppercase
                                tracking-widest
                                text-gray-500
                            ">
                                {item.label}
                            </span>

                            <p
                                className={`
                                    mt-2
                                    text-xl
                                    lg:text-3xl
                                    font-semibold
                                    ${item.valueClass ?? ""}
                                `}
                            >
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="
                    mt-8
                    flex
                    flex-col
                    gap-4
                    rounded-2xl
                    bg-white
                    p-5
                    shadow-sm
                    md:flex-row
                ">

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">
                            Estado
                        </label>
                        <div className="relative w-fit">
                            <select
                                value={filtroEstado}
                                onChange={(event) =>
                                    setFiltroEstado(event.target.value)
                                }
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
                            Piso
                        </label>
                        <div className="relative w-fit">
                            <select
                                value={filtroPiso}
                                onChange={(event) =>
                                    setFiltroPiso(event.target.value)
                                }
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

                <div className="
                    overflow-hidden mt-10
                ">
                    <div className="max-w-7xl mx-auto border border-slate-200 rounded-2xl overflow-x-auto">
                        <table className="w-full">
                            <thead className="text-slate-900 text-sm font-semibold border-b border-slate-300 whitespace-nowrap">
                                <tr class="bg-slate-50">
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
                                    <th scope="col" className="table-header">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="text-sm divide-y divide-slate-200">
                                {[...unidadesFiltradas]
                                    .sort((a, b) => {
                                        if (a.numeroPiso !== b.numeroPiso) {
                                            return a.numeroPiso - b.numeroPiso;
                                        }
                                        return a.tipoUnidad.codigo.localeCompare(
                                            b.tipoUnidad.codigo
                                        );
                                    })
                                    .map((unidad) => (
                                    <tr
                                        key={unidad.id}
                                        class="hover:bg-slate-50 text-center"
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
                                                ? `${Number(unidad.precio).toLocaleString("es-BO", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })} ${unidad.tipoMoneda}`
                                                : "—"
                                            }
                                        </td>
                                        <td className="table-body">
                                            <span className={`
                                                inline-flex
                                                rounded-full
                                                px-3
                                                py-1
                                                text-xs
                                                font-medium
                                                ${
                                                    unidad.estado === 1
                                                        ? "bg-green-100 text-green-700"
                                                        : unidad.estado === 2
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-amber-100 text-amber-700"
                                                }
                                            `}>
                                                {unidad.estado === 1
                                                    ? "Disponible"
                                                    : unidad.estado === 2
                                                        ? "Vendido"
                                                        : "Reservado"
                                                }
                                            </span>

                                        </td>
                                        <td className="table-body">
                                            <div className="
                                                flex
                                                justify-center
                                                gap-2
                                            ">
                                                <button
                                                    onClick={() => {
                                                        setUnidadSeleccionada(unidad);

                                                        setFormulario({
                                                            precio: unidad.precio ?? "",
                                                            moneda: unidad.moneda ?? 1,
                                                            estado: unidad.estado ?? 1,
                                                            tipoVenta: unidad.tipoVenta ?? "",
                                                            documentoVenta: null,
                                                        });

                                                        setModal("editar");
                                                    }}
                                                    className="flex items-center gap-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                                                >
                                                    <CiEdit size={20} />
                                                    Editar unidad
                                                </button>
                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

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
                        <p className="mt-1 text-sm text-gray-500">
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
                                    "
                                >
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
                                        tipoVenta: nuevoEstado === 2
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
                                "
                            >
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
                                    "
                                >
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
                                            "
                                        >
                                            Ver documento
                                        </a>
                                    </div>
                                )}
                            </div>

                        )}


                        {/* BOTONES */}

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
                                "
                            >
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
                                "
                            >
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