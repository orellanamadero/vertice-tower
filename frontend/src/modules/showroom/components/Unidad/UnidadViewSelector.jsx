function UnidadViewSelector({
    view,
    setView,
    unit,
}) {
    if (!unit?.tipoUnidad) {
        return null;
    }

    const tipoUnidad = unit.tipoUnidad;
    const views = [
        {
            key: "3d",
            label: "VISTA 3D",
            available: Boolean(tipoUnidad.render3D),
        },
        {
            key: "technical",
            label: "PLANO TÉCNICO",
            available: Boolean(tipoUnidad.planoTecnico),
        },
        {
            key: "gallery",
            label: "GALERÍA",
            available:
                Array.isArray(tipoUnidad.galeria) &&
                tipoUnidad.galeria.length > 0,
        },
        {
            key: "tour",
            label: "RECORRIDO 360°",
            available: Boolean(tipoUnidad.tour360),
        },
    ];

    const availableViews = views.filter(
        (item) => item.available
    );

    return (
    <nav
        className={`
            absolute
            left-1/2
            -translate-x-1/2
            z-40

            flex
            items-center
            justify-around
            gap-1

            rounded-full
            border
            p-1
            shadow-2xl
            backdrop-blur-md

            w-[330px]
            md:w-[410px]
            lg:w-auto

            transition-all
            duration-500
            ease-out

            ${
                view === "tour"
                    ? `
                        bottom-22

                        bg-black/55
                        border-white/20
                    `
                    : `
                        bottom-13
                        md:bottom-10

                        bg-white/70
                        border-white/30
                    `
            }
        `}
    >
        {availableViews.map((item) => (
            <button
                key={item.key}
                type="button"
                onClick={() => setView(item.key)}
                className={`
                    rounded-full

                    px-2
                    py-1.5

                    text-[9px]
                    font-medium

                    transition-all
                    duration-300

                    md:px-3
                    md:text-[12px]

                    lg:px-4
                    lg:py-2
                    lg:text-sm

                    ${
                        view === item.key
                            ? `
                                bg-[var(--color-naranja)]
                                text-white
                                shadow-lg
                            `
                            : view === "tour"
                                ? `
                                    text-white/80
                                    hover:bg-white/10
                                    hover:text-white
                                `
                                : `
                                    text-slate-600
                                    hover:bg-slate-100/80
                                    hover:shadow-lg
                                `
                    }
                `}
            >
                {item.label}
            </button>
        ))}
    </nav>
);
}

export default UnidadViewSelector;