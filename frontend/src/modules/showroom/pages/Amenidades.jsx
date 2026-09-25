import { useEffect, useState } from "react";
import { getProyectoRecorrido } from "../../../services/api";
import Recorrido360 from "../components/Recorrido/Recorrido360";

function Amenidades() {
    const [amenidades, setAmenidades] = useState([]);
    const [selectedAmenidad, setSelectedAmenidad] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function cargarRecorrido() {
            try {
                setLoading(true);
                const data = await getProyectoRecorrido();
                const areasComunes = data.pisos.flatMap(
                    piso =>
                        piso.unidades
                            .filter(
                                unidad =>
                                    unidad.tipoUnidad?.categoriaNombre ===
                                    "AREA COMUN"
                            )
                            .filter(
                                unidad =>
                                    unidad.tipoUnidad?.tour360
                            )
                            .map(unidad => ({
                                ...unidad,
                                piso: piso.numero,
                            }))
                );

                setAmenidades(areasComunes);

                if (areasComunes.length > 0) {
                    setSelectedAmenidad(areasComunes[0]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        cargarRecorrido();
    }, []);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Cargando amenidades...</p>
            </main>
        );
    }

    if (amenidades.length === 0) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>No se encontraron amenidades disponibles.</p>
            </main>
        );
    }

    return (
        <main className="relative h-screen w-full overflow-hidden bg-black">
            <Recorrido360
                src={selectedAmenidad.tipoUnidad.tour360}
                title={selectedAmenidad.tipoUnidad.nombre}
            />
            <div
                className="
                    absolute
                    bottom-15
                    md:bottom-9
                    left-1/2
                    z-20
                    flex
                    -translate-x-1/2
                    gap-1
                    rounded-full
                    bg-black/40
                    p-1
                    lg:p-2
                    backdrop-blur-md
                "
            >
                {amenidades.map((amenidad) => {
                    const isSelected =
                        selectedAmenidad.id === amenidad.id;
                    return (
                        <button
                            key={amenidad.id}
                            onClick={() =>
                                setSelectedAmenidad(amenidad)
                            }
                            className={`
                                rounded-full
                                p-1
                                w-auto
                                md:px-5
                                md:py-2
                                text-[9px]
                                md:text-sm
                                font-medium
                                transition-all
                                duration-300
                                ${
                                    isSelected
                                        ? "bg-[var(--color-naranja)] text-white"
                                        : "text-white hover:bg-white/20"
                                }
                            `}
                        >
                            {amenidad.tipoUnidad.nombre}
                        </button>
                    );
                })}
            </div>
        </main>
    );
}

export default Amenidades;