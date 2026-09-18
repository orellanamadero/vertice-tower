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
                bg-white/90
                px-3
                py-1
                text-[10px]
                shadow-xl
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
                {unidad.piso} - {unidad.codigo}
            </span>
        </div>
    );
}

export default UnidadLabel;