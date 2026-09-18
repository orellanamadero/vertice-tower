import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UnidadLabel from "../../components/Recorrido/UnidadLabel";

function UnidadMap({ floor, project, size }) {
    const navigate = useNavigate();

    const [hoveredUnit, setHoveredUnit] = useState(null);
    const [pulseUnit, setPulseUnit] = useState(null);

    const { width, height } = size;
    const units = floor?.unidades || [];

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

    const handleUnitClick = (unit) => {
        if (!unit || unit.estado !== 1) {
            return;
        }
        navigate(
            `/recorrido/${floor.id}/${unit.tipoUnidad.codigo}`
        );
    };

    useEffect(() => {
        const availableUnits = units.filter(
            unit => unit.estado === 1
        );
        if (availableUnits.length === 0) {
            setPulseUnit(null);
            return;
        }

        let index = 0;

        setPulseUnit(
            availableUnits[0].id
        );

        const interval = setInterval(() => {

            index =
                (index + 1) %
                availableUnits.length;

            setPulseUnit(
                availableUnits[index].id
            );

        }, 1500);

        return () => {
            clearInterval(interval);
        };

    }, [floor.id, units]);

    return (
        <div className="absolute inset-0">

            <svg
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                className="
                    absolute
                    inset-0
                    h-full
                    w-full
            ">
                {units.map((unit) => {
                    const path =
                        unit.tipoUnidad?.path;
                    if (!path) {
                        return null;
                    }
                    const isPulsing =
                        pulseUnit === unit.id &&
                        unit.estado === 1;
                    const isHovered =
                        hoveredUnit === unit.id;
                    const color =
                        getUnitColor(unit.estado);
                    return (
                        <path
                            key={unit.id}
                            d={path}
                            fill={
                                isHovered || isPulsing
                                    ? color
                                    : "transparent"
                            }
                            fillOpacity={
                                isHovered || isPulsing
                                    ? 0.65
                                    : 0
                            }
                            className={`
                                cursor-pointer
                                transition
                                duration-500
                                ${
                                    isPulsing
                                        ? "unit-pulse"
                                        : ""
                                }
                            `}
                            onMouseEnter={() =>
                                setHoveredUnit(unit.id)
                            }
                            onMouseLeave={() =>
                                setHoveredUnit(null)
                            }
                            onClick={() =>
                                handleUnitClick(unit)
                            }
                        />
                    );
                })}

            </svg>

            {units.map((unit) => {

                const tipoUnidad =
                    unit.tipoUnidad;

                if (
                    !tipoUnidad ||
                    tipoUnidad.x == null ||
                    tipoUnidad.y == null
                ) {
                    return null;
                }

                return (
                    <UnidadLabel
                        key={`label-${unit.id}`}
                        unidad={{
                            x: tipoUnidad.x,
                            y: tipoUnidad.y,
                            piso: floor.numero,
                            codigo: tipoUnidad.codigo,
                            estado: unit.estado,
                        }}
                        width={width}
                        height={height}
                        onClick={() =>
                            handleUnitClick(unit)
                        }
                    />
                );
            })}

        </div>
    );
}

export default UnidadMap;