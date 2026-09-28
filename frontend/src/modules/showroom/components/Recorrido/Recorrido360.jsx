import { useEffect, useState } from "react";

function Recorrido360({ src, title }) {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
    }, [src]);

    return (
        <div
            className="
                relative
                h-full
                w-full
                overflow-hidden
                bg-black
            ">
            <div
                className={`
                    absolute
                    inset-0
                    z-20

                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-5

                    bg-black

                    transition-opacity
                    duration-800

                    ${
                        loading
                            ? "opacity-100"
                            : "pointer-events-none opacity-0"
                    }
                `}
            >
                <div className="relative flex items-center justify-center">
                    <div
                        className="
                            h-20
                            w-20
                            animate-spin
                            rounded-full
                            border-2
                            border-white/20
                            border-t-white
                        "
                    />
                    <span
                        className="
                            absolute
                            text-sm
                            font-semibold
                            tracking-wide
                            text-white
                    ">
                        360°
                    </span>
                </div>
                <div className="text-center">
                    <p
                        className="
                            text-sm
                            font-medium
                            tracking-wide
                            text-white
                    ">
                        Cargando Tour 360°
                    </p>
                    <p
                        className="
                            mt-1
                            text-xs
                            text-white/50
                    ">
                        Preparando la experiencia
                    </p>
                </div>
                <div className="flex gap-1.5">
                    <span
                        className="
                            h-1.5
                            w-1.5
                            animate-pulse
                            rounded-full
                            bg-white
                        "
                    />
                    <span
                        className="
                            h-1.5
                            w-1.5
                            animate-pulse
                            rounded-full
                            bg-white/70
                            [animation-delay:250ms]
                        "
                    />
                    <span
                        className="
                            h-1.5
                            w-1.5
                            animate-pulse
                            rounded-full
                            bg-white/40
                            [animation-delay:400ms]
                        "
                    />

                </div>
            </div>
            <iframe
                src={src}
                title={title}
                onLoad={() => {
                    setTimeout(() => {
                        setLoading(false);
                    }, 600);
                }}
                className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    border-0
                "
                allow="
                    fullscreen;
                    accelerometer;
                    gyroscope
                "
                allowFullScreen
            />
        </div>
    );
}
export default Recorrido360;