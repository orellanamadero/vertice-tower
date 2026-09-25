import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { getProyectoRecorrido } from "../../../services/api";
import UnidadInfo from "../components/Unidad/UnidadInfo";
import UnidadViewSelector from "../components/Unidad/UnidadViewSelector";
import UnidadViewer from "../components/Unidad/UnidadViewer";
import { HiMiniArrowLeftStartOnRectangle } from "react-icons/hi2";
import { HiMiniArrowRightStartOnRectangle } from "react-icons/hi2";

function DepartmentDetail() {

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("3d");
    const [showInfo, setShowInfo] = useState(false);
    const navigate = useNavigate();
    const { floorId, codigo } = useParams();
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });
    const dragging = useRef(false);
    const startTouch = useRef({
        x: 0,
        y: 0,
    });

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        dragging.current = true;
        startTouch.current = {
            x: touch.clientX - position.x,
            y: touch.clientY - position.y,
        };
    };

    const handleTouchMove = (e) => {

        if (!dragging.current) return;

        const touch = e.touches[0];

        setPosition({
            x: touch.clientX - startTouch.current.x,
            y: touch.clientY - startTouch.current.y,
        });
    };

    const handleTouchEnd = () => {
        dragging.current = false;
    };

    useEffect(() => {
        async function cargarProyecto() {
            try {
                const data = await getProyectoRecorrido();
                setProject(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        cargarProyecto();
    }, []);

    const floor = project?.pisos?.find(
        piso => piso.id === Number(floorId)
    );

    const unit = floor?.unidades?.find(
        unidad =>
            unidad.tipoUnidad?.codigo === codigo
    );

    useEffect(() => {
        if (!unit) return;
        const tipoUnidad = unit.tipoUnidad;
        if (tipoUnidad.render3D) {
            setView("3d");
            return;
        }
        if (tipoUnidad.planoTecnico) {
            setView("technical");
            return;
        }
        if (
            Array.isArray(tipoUnidad.galeria) &&
            tipoUnidad.galeria.length > 0
        ) {
            setView("gallery");
            return;
        }
        if (tipoUnidad.tour360) {
            setView("tour");
            return;
        }
    }, [unit]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p>
                    Cargando unidad...
                </p>
            </main>
        );
    }

    if (!project) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">
                        Proyecto no encontrado
                    </h1>
                </div>
            </main>
        );
    }

    if (!floor) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">
                        Piso no encontrado
                    </h1>
                    <p className="mt-3 text-slate-500">
                        El piso {floorId} no existe.
                    </p>
                </div>
            </main>
        );
    }

    if (!unit) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">
                        Unidad no encontrada
                    </h1>
                    <p className="mt-3 text-slate-500">
                        La unidad {codigo} no existe en el piso {floor.numero}.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main
            className="
                relative
                h-[100vh]
                overflow-hidden
        ">
            <div
                className="
                    relative
                    w-full
                    h-full
                    overflow-hidden
            ">
                <button
                    onClick={() =>
                        navigate("/recorrido", {
                            state: {
                                floorId: floor.id,
                            },
                        })
                    }
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                        transform: `
                            translate(
                                ${position.x}px,
                                ${position.y}px
                            )
                        `,
                    }}
                    className="
                        group
                        fixed
                        right-4
                        bottom-23
                        lg:bottom-9
                        z-80
                        w-35
                        h-20
                        rounded-lg
                        overflow-hidden
                        shadow-2xl
                        transition-none
                        md:transition-transform
                        md:duration-300
                        origin-bottom-right
                        md:h-30
                        md:w-45
                        lg:h-40
                        lg:w-70
                        lg:hover:scale-150
                        touch-none
                        cursor-grab
                        active:cursor-grabbing
                ">
                    {unit.tipoUnidad.frame && (
                        <img
                            src={unit.tipoUnidad.frame}
                            alt="Ubicación en piso"
                            className="
                                h-full
                                w-full
                                object-cover
                                m-0
                            "
                        />
                    )}
                    <span
                        className="
                            absolute
                            bottom-0
                            left-0
                            w-full
                            bg-black/80
                            px-2
                            py-1
                            text-xs
                            text-white
                            text-center
                            transition-opacity
                            duration-300
                            group-hover:opacity-0
                            lg:text-sm
                        "
                    >
                        Ubicación en Piso
                    </span>
                </button>
                {unit.tipoUnidad?.categoriaNombre !== "AREA COMUN" && (
                    <aside
                        id="unidad-info-panel"
                        aria-label="Información de la unidad"
                        className={`
                            absolute
                            left-0
                            top-0
                            w-[270px]
                            h-full
                            z-100
                            shadow-[8px_0_18px_-10px_rgba(0,0,0,0.35)]
                            transition-all
                            duration-500
                            ease-out
                            ${
                                showInfo
                                    ? "translate-x-0"
                                    : "-translate-x-full"
                            }
                        `}
                    >
                        <UnidadInfo
                            project={project}
                            unidad={unit}
                            floor={floor}
                        />
                    </aside>
                )}

                <section
                    aria-label="Visualización de la unidad"
                    className={`
                        relative
                        h-full
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                        transition-[margin]
                        duration-500
                        ease-out
                        ${
                            showInfo
                                ? "ml-[270px]"
                                : "ml-0"
                        }
                    `}
                >
                    <UnidadViewer
                        view={view}
                        unit={unit}
                    />
                    <UnidadViewSelector
                        view={view}
                        setView={setView}
                        unit={unit}
                    />
                </section>
            </div>
            {unit.tipoUnidad?.categoriaNombre !== "AREA COMUN" && (
                <button
                    type="button"
                    onClick={() => setShowInfo(!showInfo)}
                    aria-label={
                        showInfo
                            ? "Ocultar información de la unidad"
                            : "Mostrar información de la unidad"
                    }
                    aria-expanded={Boolean(showInfo)}
                    aria-controls="unidad-info-panel"
                    className="
                        fixed
                        left-0
                        top-18
                        z-130
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-r-full
                        bg-[var(--color-naranja)]
                        text-white
                        shadow-xl
                        transition
                        hover:bg-slate-900
                        lg:left-9
                        lg:top-25
                        lg:h-12
                        lg:w-12
                        lg:rounded-full
                ">
                    {showInfo ? (
                        <HiMiniArrowLeftStartOnRectangle className="size-6" />
                    ) : (
                        <HiMiniArrowRightStartOnRectangle className="size-6" />
                    )}
                </button>
            )}
        </main>
    );
}

export default DepartmentDetail;