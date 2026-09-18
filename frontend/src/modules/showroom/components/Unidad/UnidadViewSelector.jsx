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
            className="
                absolute
                bottom-13
                md:bottom-10
                left-1/2
                -translate-x-1/2
                z-30
                flex
                items-center
                justify-around
                gap-1
                rounded-full
                bg-white/70
                p-1
                shadow-2xl
                w-[320px]
                md:w-[410px]
                lg:w-auto
        ">
            {availableViews.map((item) => (
                <button
                    key={item.key}
                    onClick={() => setView(item.key)}
                    className={`
                        rounded-full
                        p-1
                        text-[9px]
                        font-medium
                        transition
                        md:text-[12px]
                        lg:text-sm
                        lg:px-4
                        lg:py-2
                        ${
                            view === item.key
                                ? "bg-[var(--color-naranja)]/90 text-white"
                                : "text-slate-600 hover:bg-slate-100/80 hover:shadow-lg"
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