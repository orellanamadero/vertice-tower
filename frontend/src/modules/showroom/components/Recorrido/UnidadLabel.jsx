function UnidadLabel({ unidad, width, height, onClick }) {

    const getUnitColor = (estado) => {
        switch (estado) {
            case 1:
                return "var(--color-verde)";
            case 2:
                return "var(--color-rojo)";
            case 3:
                return "var(--color-yellow)";
            default:
                return "#94a3b8";
        }
    };
    const color = getUnitColor(unidad.estado);

    return (
        <div
            onClick={onClick}
            className="
                absolute
                z-20
                flex
                items-center
                gap-2
                rounded-full
                bg-black/70
                py-2
                px-5
                font-normal
                text-white
                text-[10px]
                shadow-xl
                backdrop-blur-md
                whitespace-nowrap
                cursor-pointer
                md:text-sm
            "
            style={{
                left: `${(unidad.x / width) * 100}%`,
                top: `${(unidad.y / height) * 100}%`,
                transform: "translate(-50%, -50%)",
            }}
        >
            <span
                className="
                    h-2.5
                    w-2.5
                    rounded-full
                "
                style={{
                    backgroundColor: color,
                }}
            />
            <span>
                {unidad.esAreaComun ? (
                    <span>
                        {unidad.nombre}
                    </span>

                ) : unidad.esOficina ? (

                    <span className="flex flex-col items-center gap-1">
                        <span>
                            {unidad.nombre}
                        </span>
                        <span className="text-[9px] tracking-wide text-white/70 md:text-xs">
                            Ver brochure
                        </span>
                    </span>

                ) : (
                    <span>
                        {unidad.piso} - {unidad.codigo}
                    </span>
                )}
            </span>
        </div>
    );
}

export default UnidadLabel;