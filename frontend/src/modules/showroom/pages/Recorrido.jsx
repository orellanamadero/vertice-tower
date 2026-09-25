import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {getProyectoRecorrido,getProyectoRecorridoCache,} from "../../../services/api";
import FloorPlan from "../components/Recorrido/FloorPlan";
import { MdKeyboardArrowDown } from "react-icons/md";
import fondo from "../images/fondo.webp";
import logo from "../images/BLANCO.webp";

function obtenerPisoInicial(project, floorId) {
    if (!project?.pisos?.length) {
        return null;
    }
    return (
        project.pisos.find(
            (piso) =>
                piso.id === Number(floorId)
        ) ||
        project.pisos[0]
    );
}
function Recorrido() {
    const location = useLocation();
    const floorId = location.state?.floorId;
    const cachedProject = getProyectoRecorridoCache();
    const [project, setProject] = useState(cachedProject);
    const [loading, setLoading] = useState(!cachedProject);
    const [selectedFloor, setSelectedFloor] = useState(() => obtenerPisoInicial(
        cachedProject,
        floorId)
    );

    const [showFloors, setShowFloors] = useState(false);
    const [showHint, setShowHint] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const actualizarRecorrido = async (forzar = false) => {
            try {
                const data = await getProyectoRecorrido(forzar);
                if (cancelled) return;
                setProject(data);
                setSelectedFloor((pisoActual) => {
                    const pisoIdActual =
                        pisoActual?.id ?? floorId;
                    return obtenerPisoInicial(
                        data,
                        pisoIdActual
                    );
                });
                setLoading(false);
            } catch (error) {
                console.error(
                    "Error al actualizar recorrido:",
                    error
                );
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        const cached = getProyectoRecorridoCache();
        if (cached) {
            setProject(cached);
            setSelectedFloor(
                obtenerPisoInicial(
                    cached,
                    floorId
                )
            );
            setLoading(false);
            actualizarRecorrido(true);
        } else {
            setLoading(true);
            actualizarRecorrido(true);
        }

        const intervalId = setInterval(() => {
            actualizarRecorrido(true);
        }, 5000);
        const actualizarAlVolver = () => {
            if (document.visibilityState === "visible") {
                actualizarRecorrido(true);
            }
        };
        window.addEventListener(
            "focus",
            actualizarAlVolver
        );
        document.addEventListener(
            "visibilitychange",
            actualizarAlVolver
        );
        return () => {
            cancelled = true;
            clearInterval(intervalId);
            window.removeEventListener(
                "focus",
                actualizarAlVolver
            );
            document.removeEventListener(
                "visibilitychange",
                actualizarAlVolver
            );
        };
    }, [floorId]);

    if (loading) {
        return (
            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
            ">
                <p>
                    Cargando recorrido...
                </p>
            </main>
        );
    }

    if (!project) {
        return (
            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
            ">
                <p>
                    No se pudo cargar la información del recorrido.
                </p>
            </main>
        );
    }
    if (!selectedFloor) {
        return (
            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
            ">
                <p>
                    No hay pisos disponibles.
                </p>
            </main>
        );
    }

    return (
        <main
            className="
                relative
                h-[100vh]
                w-full
                overflow-hidden
                bg-zinc-100
            "
            style={{
                backgroundImage: `url(${fondo})`,
            }}
        >
            <div
                className="
                    relative
                    h-full
                    w-full
                    overflow-hidden
            ">
                {showHint && (
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="recorrido-welcome-title"
                        aria-describedby="recorrido-welcome-description"
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            z-50
                            w-[90%]
                            max-w-md
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-2xl
                            bg-[var(--color-naranja)]/70
                            shadow-xl/30
                            px-6
                            py-6
                            text-center
                            text-white
                            shadow-2xl
                    ">
                        { logo  && (
                            <img
                                src={logo}
                                alt=""
                                className="
                                    mx-auto
                                    block
                                    h-15
                                    w-auto
                                    object-contain
                                    md:h-15
                                    brightness-0
                                    invert
                                    p-2
                                "
                            />
                        )}

                        <h2 id="recorrido-welcome-title"
                            className="
                                text-base
                                md:text-lg
                                font-semibold
                        ">
                            BIENVENIDO A TU FUTURO HOGAR
                        </h2>
                        <p id="recorrido-welcome-description"
                            className="
                                mt-2
                                text-sm
                                text-white
                        ">
                            Desliza y toca un departamento disponible para conocer sus detalles.
                        </p>
                        <div
                            className="
                                mt-4
                                flex
                                items-center
                                justify-center
                                gap-5
                                text-xs
                                text-white/90
                                md:text-sm
                        ">
                            <div className="flex items-center gap-2">
                                <span
                                    className="
                                        h-2.5
                                        w-2.5
                                        rounded-full
                                        bg-[var(--color-verde)]
                                        shadow-sm
                                    "
                                />
                                <span>Disponible</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className="
                                        h-2.5
                                        w-2.5
                                        rounded-full
                                        bg-[var(--color-rojo)]
                                        shadow-sm
                                    "
                                />
                                <span>Vendido</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className="
                                        h-2.5
                                        w-2.5
                                        rounded-full
                                        bg-[var(--color-yellow)]
                                        shadow-sm
                                    "
                                />
                                <span>Reservado</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                setShowHint(false)
                            }
                            className="
                                mt-5
                                rounded-lg
                                bg-white
                                px-7
                                py-2.5
                                text-sm
                                font-medium
                                text-black
                                transition
                                duration-200
                                hover:bg-slate-900
                                hover:text-white
                                active:scale-95
                        ">
                            Aceptar
                        </button>
                    </div>
                )}
                <nav
                    className="
                        absolute
                        right-4
                        z-30
                        mt-18
                        lg:mt-25
                        lg:right-20
                    "
                >
                    <button
                        onClick={() =>
                            setShowFloors(!showFloors)
                        }
                        className="
                            flex
                            w-22
                            lg:w-27
                            items-center
                            justify-center
                            gap-1
                            rounded-lg
                            bg-white/90
                            p-1.5
                            text-sm
                            lg:text-base
                            font-medium
                            text-slate-800
                            shadow-xl
                            transition
                            hover:bg-[var(--color-naranja)]/90
                            hover:text-white
                            lg:px-2
                            lg:py-2
                        "
                    >
                        <span>
                            PISOS
                        </span>
                        <span
                            className={`
                                transition-transform
                                duration-200
                                ${
                                    showFloors
                                        ? "rotate-180"
                                        : ""
                                }
                            `}
                        >
                            <MdKeyboardArrowDown
                                className="size-5 md:size-6"
                            />
                        </span>
                    </button>

                    {showFloors && (
                        <div
                            className="
                                absolute
                                right-0
                                mt-2
                                w-18
                                lg:w-22
                                max-h-[calc(100dvh-132px)]
                                lg:max-h-[calc(100dvh-168px)]
                                overflow-y-auto
                                overscroll-contain
                                rounded-lg
                                border
                                border-slate-100
                                bg-white/70
                                p-1
                                shadow-2xl
                        ">
                            {[...project.pisos]
                                .sort(
                                    (a, b) =>
                                        Number(b.numero) -
                                        Number(a.numero)
                                )
                                .map((piso) => (
                                    <button
                                        key={piso.id}
                                        onClick={() => {
                                            setSelectedFloor(piso);
                                        }}
                                        className={`
                                            w-full
                                            shrink-0
                                            rounded-lg
                                            px-1
                                            py-1.5
                                            my-0.5
                                            text-center
                                            text-xs
                                            lg:text-base
                                            transition
                                            ${
                                                selectedFloor.id === piso.id
                                                    ? "bg-[var(--color-naranja)] text-white"
                                                    : "hover:bg-white"
                                            }
                                        `}
                                    >
                                        {piso.nombrePiso}
                                    </button>
                                ))}
                        </div>
                    )}
                </nav>

                <section
                    aria-label="Plano interactivo del edificio"
                    className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        overflow-hidden
                ">
                    <FloorPlan
                        project={project}
                        floor={selectedFloor}
                    />
                </section>
            </div>
        </main>
    );
}
export default Recorrido;