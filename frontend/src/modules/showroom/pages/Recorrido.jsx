import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {getProyectoRecorrido,getProyectoRecorridoCache,} from "../../../services/api";
import FloorPlan from "../components/Recorrido/FloorPlan";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import fondo from "../images/fondo.webp";
import logo from "../images/BLANCO.webp";
import { motion, AnimatePresence } from "framer-motion";
import { FaHandPointUp } from "react-icons/fa";

function obtenerPisoInicial(project, floorId) {
    if (!project?.pisos?.length) {
        return null;
    }

    const pisoPorId = project.pisos.find(
        (piso) => piso.id === Number(floorId)
    );

    if (pisoPorId) {
        return pisoPorId;
    }

    return [...project.pisos].sort(
        (a, b) => Number(b.numero) - Number(a.numero)
    )[0];
}
function Recorrido() {
    const location = useLocation();
    const floorId = location.state?.floorId;
    const cachedProject = getProyectoRecorridoCache();
    const [project, setProject] = useState(cachedProject);
    const [loading, setLoading] = useState(!cachedProject);
    const volverAlPiso = location.state?.volverAlPiso === true;
    const [showIntro, setShowIntro] = useState( !volverAlPiso );
    const [showSwipeHint, setShowSwipeHint] = useState(false);
    const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
    const [selectedFloor, setSelectedFloor] = useState(() => obtenerPisoInicial(
        cachedProject,
        floorId)
    );
    const handleAcceptIntro = () => { setShowIntro(false);};
    useEffect(() => {
        const vieneDeUnidad =
            location.state?.volverAlPiso === true;
        setShowIntro(!vieneDeUnidad);
        setShowSwipeHint(false);
    }, [location.key]);

    useEffect(() => {
        if (showIntro) return;
        if (!hasHorizontalScroll) return;
        setShowSwipeHint(true);
        const timer = setTimeout(() => {
            setShowSwipeHint(false);
        }, 3500);
        return () => {
            clearTimeout(timer);
        };
    }, [
        location.key,
        showIntro,
        hasHorizontalScroll,
    ]);

    const [showFloors, setShowFloors] = useState(true);

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
        <>
            <Helmet>
                <title>Vertice Tower | Recorrido</title>

                <meta
                    name="description"
                    content="Explora los departamentos disponibles de Vértice Tower, revisa pisos, tipologías, ubicación y disponibilidad de unidades."
                />

                <link
                    rel="canonical"
                    href="https://maderosrl.com/recorrido"
                />
            </Helmet>
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
                {showIntro && (
                    <div
                        className="
                            fixed
                            inset-0
                            z-[1200]

                            flex
                            items-center
                            justify-center

                            bg-black/60
                            backdrop-blur-md
                        "
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="recorrido-welcome-title"
                            aria-describedby="recorrido-welcome-description"

                            initial={{
                                opacity: 0,
                                scale: 0.95,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.35,
                                ease: "easeOut",
                            }}

                            className="
                                w-[90%]
                                max-w-md

                                rounded-2xl

                                border
                                border-white/20

                                bg-[var(--color-naranja)]/75

                                px-6
                                py-6

                                text-center
                                text-white

                                shadow-2xl
                                backdrop-blur-xl
                            "
                        >

                            {logo && (
                                <img
                                    src={logo}
                                    alt=""
                                    className="
                                        mx-auto
                                        block
                                        h-15
                                        w-auto
                                        object-contain
                                        brightness-0
                                        invert
                                        p-2
                                    "
                                />
                            )}

                            <h2
                                id="recorrido-welcome-title"
                                className="
                                    text-base
                                    font-semibold
                                    md:text-lg
                                "
                            >
                                BIENVENIDO A TU FUTURO HOGAR
                            </h2>

                            <p
                                id="recorrido-welcome-description"
                                className="
                                    mt-2
                                    text-sm
                                    text-white/90
                                "
                            >
                                Desliza hacia la derecha y toca un departamento disponible.
                            </p>

                            <button
                                type="button"
                                onClick={handleAcceptIntro}
                                className="
                                    mt-5
                                    rounded-lg
                                    bg-white
                                    px-7
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-black
                                    shadow-lg
                                    transition
                                    duration-200

                                    hover:bg-slate-900
                                    hover:text-white

                                    active:scale-95
                                "
                            >
                                Aceptar
                            </button>

                        </motion.div>
                    </div>
                )}
                <div
                    className="
                        fixed
                        left-4
                        top-20
                        z-40

                        flex
                        flex-col
                        gap-2.5

                        rounded-2xl

                        bg-black/50
                        px-4
                        py-3

                        text-xs
                        font-medium
                        text-white

                        shadow-xl
                        backdrop-blur-md

                        md:left-6
                        md:top-24
                        md:px-5
                        md:py-4
                        md:text-sm
                        lg:left-20
                    "
                >
                    <div className="flex items-center gap-2.5">
                        <span
                            className="
                                h-2.5
                                w-2.5
                                shrink-0
                                rounded-full
                                bg-[var(--color-verde)]
                                shadow-sm
                            "
                        />

                        <span>
                            Disponible
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <span
                            className="
                                h-2.5
                                w-2.5
                                shrink-0
                                rounded-full
                                bg-[var(--color-rojo)]
                                shadow-sm
                            "
                        />

                        <span>
                            Vendido
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <span
                            className="
                                h-2.5
                                w-2.5
                                shrink-0
                                rounded-full
                                bg-[var(--color-yellow)]
                                shadow-sm
                            "
                        />

                        <span>
                            Reservado
                        </span>
                    </div>
                </div>
                <AnimatePresence>
                    {showSwipeHint && hasHorizontalScroll && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: 20,
                            }}
                            transition={{
                                duration: 0.35,
                            }}
                            className="
                                pointer-events-none
                                absolute
                                bottom-24
                                left-1/2
                                z-50
                                -translate-x-1/2
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    whitespace-nowrap
                                    rounded-full
                                    bg-[var(--color-naranja)]/70
                                    px-5
                                    py-3
                                    text-sm
                                    text-white
                                    shadow-xl
                                    backdrop-blur-md
                                "
                            >
                                <motion.div
                                    animate={{
                                        x: [12, -12, 12],
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="flex"
                                >
                                    <MdKeyboardArrowRight size={20} />
                                    <MdKeyboardArrowRight size={20} />
                                </motion.div>

                                <span>
                                    Desliza hacia la derecha
                                </span>

                                <motion.span
                                    animate={{
                                        x: [8, -8, 8],
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="text-xl"
                                >
                                    <FaHandPointUp />
                                </motion.span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <nav
                    className="
                        absolute
                        right-4
                        z-30
                        mt-20
                        md:mt-24
                        md:right-6
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
                            backdrop-blur-md
                            p-1.5
                            text-sm
                            lg:text-base
                            font-normal
                            shadow-xl
                            transition
                            bg-[var(--color-naranja)]/90
                            hover:bg-white/80
                            hover:text-slate-800
                            text-white
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
                        onHorizontalScrollChange={setHasHorizontalScroll}
                    />
                </section>
            </div>
        </main>
        </>
    );
}
export default Recorrido;