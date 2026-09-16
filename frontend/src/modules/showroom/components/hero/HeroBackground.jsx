import {
    useEffect,
    useRef,
    useState,
} from "react";

const TRANSITION_DURATION = 700;

function HeroBackground({
    desktopVideo,
    nextVideo,
    currentPoster,
    nextPoster,
    loop = false,
    muted = false,
    onTimeUpdate,
}) {
    const videoARef = useRef(null);
    const videoBRef = useRef(null);

    const initializedRef = useRef(false);
    const activeSlotRef = useRef("A");
    const transitionTimeoutRef = useRef(null);

    const [activeSlot, setActiveSlot] = useState("A");

    const setVideoSource = (
        video,
        src,
        poster = null
    ) => {
        if (!video || !src) return;

        if (poster) {
            video.poster = poster;
        } else {
            video.removeAttribute("poster");
        }

        if (video.dataset.source === src) {
            return;
        }

        video.dataset.source = src;
        video.src = src;
        video.load();
    };

    const waitUntilCanPlay = (video) => {
        return new Promise((resolve, reject) => {
            if (video.readyState >= 3) {
                resolve();
                return;
            }

            const handleCanPlay = () => {
                cleanup();
                resolve();
            };

            const handleError = () => {
                cleanup();

                reject(
                    new Error(
                        "No se pudo preparar el siguiente video"
                    )
                );
            };

            const cleanup = () => {
                video.removeEventListener(
                    "canplay",
                    handleCanPlay
                );

                video.removeEventListener(
                    "error",
                    handleError
                );
            };

            video.addEventListener(
                "canplay",
                handleCanPlay,
                { once: true }
            );

            video.addEventListener(
                "error",
                handleError,
                { once: true }
            );
        });
    };

    useEffect(() => {
        const videoA = videoARef.current;
        const videoB = videoBRef.current;

        if (!videoA || !videoB || !desktopVideo) {
            return;
        }

        if (!initializedRef.current) {
            initializedRef.current = true;

            setVideoSource(
                videoA,
                desktopVideo,
                currentPoster
            );

            videoA.muted = muted;
            videoA.loop = loop;

            const preloadNextVideo = () => {
                if (!nextVideo) return;

                setVideoSource(
                    videoB,
                    nextVideo,
                    nextPoster
                );

                videoB.muted = true;
                videoB.loop = false;
                videoB.preload = "auto";
            };

            videoA.addEventListener(
                "playing",
                preloadNextVideo,
                { once: true }
            );

            videoA
                .play()
                .catch((error) => {
                    console.log(
                        "No se pudo reproducir video inicial:",
                        error
                    );
                });

            return () => {
                videoA.removeEventListener(
                    "playing",
                    preloadNextVideo
                );
            };
        }

        const outgoingVideo =
            activeSlotRef.current === "A"
                ? videoA
                : videoB;

        const incomingVideo =
            activeSlotRef.current === "A"
                ? videoB
                : videoA;

        if (
            outgoingVideo.dataset.source ===
            desktopVideo
        ) {
            outgoingVideo.muted = muted;
            outgoingVideo.loop = loop;

            return;
        }

        let cancelled = false;

        const startTransition = async () => {
            setVideoSource(
                incomingVideo,
                desktopVideo,
                currentPoster
            );

            incomingVideo.muted = muted;
            incomingVideo.loop = loop;
            incomingVideo.currentTime = 0;

            try {
                await waitUntilCanPlay(
                    incomingVideo
                );

                if (cancelled) return;

                await incomingVideo.play();

                if (cancelled) return;

                const newActiveSlot =
                    activeSlotRef.current === "A"
                        ? "B"
                        : "A";

                activeSlotRef.current =
                    newActiveSlot;

                setActiveSlot(
                    newActiveSlot
                );

                transitionTimeoutRef.current =
                    setTimeout(() => {
                        if (cancelled) return;

                        outgoingVideo.pause();

                        if (nextVideo) {
                            setVideoSource(
                                outgoingVideo,
                                nextVideo,
                                nextPoster
                            );

                            outgoingVideo.muted = true;
                            outgoingVideo.loop = false;
                            outgoingVideo.preload =
                                "auto";
                        } else {
                            outgoingVideo.removeAttribute(
                                "src"
                            );

                            outgoingVideo.removeAttribute(
                                "poster"
                            );

                            delete outgoingVideo.dataset
                                .source;

                            outgoingVideo.load();
                        }
                    }, TRANSITION_DURATION);
            } catch (error) {
                console.log(
                    "Error durante transición:",
                    error
                );
            }
        };

        startTransition();

        return () => {
            cancelled = true;

            if (
                transitionTimeoutRef.current
            ) {
                clearTimeout(
                    transitionTimeoutRef.current
                );
            }
        };
    }, [
        desktopVideo,
        nextVideo,
        currentPoster,
        nextPoster,
        loop,
        muted,
    ]);

    return (
        <div
            className="
                absolute
                inset-0
                z-0
                overflow-hidden
                bg-black
            "
        >
            {/* VIDEO A */}
            <video
                ref={videoARef}
                playsInline
                preload="auto"
                onTimeUpdate={
                    activeSlot === "A"
                        ? onTimeUpdate
                        : undefined
                }
                className={`
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    scale-105
                    transition-opacity
                    duration-700
                    ease-in-out

                    ${
                        activeSlot === "A"
                            ? "opacity-100"
                            : "opacity-0"
                    }
                `}
            />

            {/* VIDEO B */}
            <video
                ref={videoBRef}
                playsInline
                preload="none"
                onTimeUpdate={
                    activeSlot === "B"
                        ? onTimeUpdate
                        : undefined
                }
                className={`
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    scale-105
                    transition-opacity
                    duration-700
                    ease-in-out

                    ${
                        activeSlot === "B"
                            ? "opacity-100"
                            : "opacity-0"
                    }
                `}
            />
        </div>
    );
}

export default HeroBackground;