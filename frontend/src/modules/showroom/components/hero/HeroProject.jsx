import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HeroBackground from "./HeroBackground";
import { GoArrowRight } from "react-icons/go";
import {getProyectoRecorrido} from "../../../../services/api";

function HeroProject({ project }) {
    const navigate = useNavigate();

    const [stage, setStage] = useState(0);
    const [showButton, setShowButton] = useState(true);

    const stages = Array.isArray(project?.hero)
        ? [...project.hero].sort((a, b) => a.orden - b.orden)
        : [];

    const currentStage = stages[stage];
    const nextStage = stages[stage + 1];

    const isLastStage = stages.length > 0 && stage === stages.length - 1;
    useEffect(() => {
        if (!isLastStage) {
            return;
        }
        const connection =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;

        const conexionMuyLenta =
            connection?.saveData ||
            connection?.effectiveType === "2g" ||
            connection?.effectiveType === "slow-2g";

        if (conexionMuyLenta) {
            return;
        }

        const timer = setTimeout(() => {
            getProyectoRecorrido().catch(
                (error) => {
                    console.error(
                        "No se pudo precargar el recorrido:",
                        error
                    );
                }
            );
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [isLastStage]);
    if (!currentStage) {
        return null;
    }

    const handleButtonClick = () => {
        if (isLastStage) {
            navigate("/recorrido");
            return;
        }

        setShowButton(false);
        setStage(stage + 1);
    };

    const handleTimeUpdate = (e) => {
        if (stage === 0) return;
        const video = e.currentTarget;
        if (!video.duration) return;
        const remaining = video.duration - video.currentTime;
        if (remaining <= 10) {
            setShowButton(true);
        }
    };

    return (
        <section
            className="
                relative
                h-screen
                w-full
                overflow-hidden
            "
        >
            <HeroBackground
                desktopVideo={currentStage.video}
                nextVideo={nextStage?.video}
                currentPoster={currentStage.poster}
                nextPoster={nextStage?.poster}
                loop={stage === 0 || stage === 1}
                muted={stage === 0}
                onTimeUpdate={handleTimeUpdate}
            />

            <div
                className="
                    absolute
                    inset-0
                    z-20
                    flex
                    items-center
                    justify-center
                    px-6
                    pt-45
                    lg:pt-70
            ">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={stage}
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
                            y: -20,
                        }}
                        transition={{
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="
                            max-w-3xl
                            text-center
                            text-white
                    ">
                        <span
                            className="
                                lg:my-6
                                block
                                tracking-[0.2em]
                                text-white/80
                                text-xs
                                font-light
                                md:text-sm
                                lg:text-base
                            "
                        >
                            {currentStage.subtitle}
                        </span>
                        <img
                            src={currentStage.imagenHero}
                            alt=""
                            className="
                                mx-auto
                                my-5
                                block
                                h-20
                                w-auto
                                object-contain
                                md:h-30
                                lg:h-40
                                landscape:max-h-[25vh]
                                landscape:w-auto
                            "
                        />
                        <AnimatePresence>
                            {showButton && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: 10,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    <button
                                        onClick={handleButtonClick}
                                        className="animated-button tracking-widest"
                                    >
                                        <GoArrowRight className="arr-2" />

                                        <span className="text">
                                            {currentStage.button}
                                        </span>

                                        <span className="circle"></span>

                                        <GoArrowRight className="arr-1" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {stage === 0 && (
                            <img
                                src={project.logoProyecto}
                                alt={project.nombreProyecto}
                                className="
                                    absolute
                                    right-6
                                    block
                                    h-10
                                    w-auto
                                    object-contain
                                    brightness-0
                                    invert
                                    md:bottom-8
                                    md:h-16
                                    bottom-15
                                    lg:right-12
                                    lg:h-20
                                "
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}

export default HeroProject;