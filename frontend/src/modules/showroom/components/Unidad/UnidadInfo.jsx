import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { LiaRulerCombinedSolid } from "react-icons/lia";
import { IoBedOutline } from "react-icons/io5";
import { PiToilet } from "react-icons/pi";
import { MdOutlineKitchen } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { VscFilePdf } from "react-icons/vsc";
import UnidadCaracteristica from "../../components/Unidad/UnidadCaracteristica";
import { MdOutlineChair } from "react-icons/md";
import { PiWashingMachine } from "react-icons/pi";
import { TbPicnicTable } from "react-icons/tb";
import { useState } from "react";
import { descargarFichaTecnica } from "../../../../services/api";

function UnidadInfo({ project, unidad, floor }) {
    const [descargandoFicha, setDescargandoFicha] = useState(false);
    const tipoUnidad = unidad.tipoUnidad;

    const statusStyle = {
    1: "bg-green-100 text-green-700",
    2: "bg-red-100 text-red-700",
};

    const statusNombre = unidad.estadoNombre;

    const handleDescargarFicha = async () => {
        if (descargandoFicha) return;
        try {
            setDescargandoFicha(true);
            const blob = await descargarFichaTecnica(unidad.id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download =`fichaTecnica-${tipoUnidad?.codigo}-Piso${floor.numero}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(
                "Error al descargar la ficha técnica:",
                error
            );
        } finally {
            setDescargandoFicha(false);
        }
    };

    const whatsappMessage = `Hola, estoy interesada en el departamento ${tipoUnidad?.codigo} del piso ${floor.numero}°. Me podría brindar más información.`;
    const whatsappUrl = `https://wa.me/${project.contacto?.numeroContacto}?text=${encodeURIComponent(
        whatsappMessage
    )}`;

    const caracteristicas = [
        {
            icon: <IoBedOutline />,
            label: "Dormitorios",
            value: tipoUnidad?.dormitorios,
        },
        {
            icon: <PiToilet />,
            label: "Baños",
            value: tipoUnidad?.banos,
        },
        {
            icon: <MdOutlineChair />,
            label: "Sala",
            value: tipoUnidad?.sala,
        },
        {
            icon: <PiWashingMachine />,
            label: "Lavanderia",
            value: tipoUnidad?.lavanderia,
        },
        {
            icon: <MdOutlineKitchen />,
            label: "Cocina",
            value: tipoUnidad?.cocina,
        },
        {
            icon: <TbPicnicTable />,
            label: "Comedor",
            value: tipoUnidad?.comedor,
        },
    ];

    return (

        <aside
            className="
                absolute
                z-100
                left-0
                top-0
                right-0
                bottom-0
                w-full
                bg-white/95
                backdrop-blur-sm
                overflow-y-auto
                p-3
                pt-30
                md:right-auto
                md:bottom-0
                md:left-0
                md:h-auto
                md:w-[270px]
                md:p-6
                md:bg-white/95
                md:z-110
                md:flex
                md:flex-col
                md:pt-40
        ">
            <div className="p-3 mb-2 pt-1">
                <h2
                    className="
                        text-lg
                        lg:text-xl
                        font-semibold
                        leading-tight
                        text-slate-900
                ">
                    {tipoUnidad?.nombre}
                </h2>
                <p
                    className="
                        mt-1
                        md:mt-2
                        text-sm
                        text-slate-500
                        uppercase
                ">
                    {tipoUnidad?.tipo}
                </p>
                <p
                    className="
                        mt-1
                        text-xl
                        lg:text-2xl
                        font-bold
                        leading-tight
                        text-slate-900
                ">
                    {unidad.precio != null
                        ? Number(unidad.precio).toLocaleString("es-BO", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })
                        : "Consultar"
                    }

                    {unidad.precio != null && (
                        <> {unidad.tipoMoneda}</>
                    )}
                </p>
                <span
                    className={`
                        inline-block
                        rounded-full
                        px-4
                        py-1
                        mt-2.5
                        md:mt-3
                        text-sm
                        font-medium
                        ${statusStyle[unidad.estado] ?? "bg-slate-100 text-slate-600"}
                    `}
                >
                    {statusNombre ?? "No disponible"}
                </span>
            </div>

            <div className="my-2 border-t border-slate-200">
                <div className="p-3">
                    <h3
                        className="
                            text-base
                            font-semibold
                            text-slate-800
                            mb-2
                    ">
                        Superficie
                    </h3>
                    {tipoUnidad?.superficie != null && (
                        <UnidadCaracteristica
                            icon={<LiaRulerCombinedSolid />}
                            label="Superficie total"
                            value={`${tipoUnidad.superficie} m²`}
                        />
                    )}
                    <UnidadCaracteristica
                        icon={<HiOutlineSquare3Stack3D />}
                        label="Piso"
                        value={`${floor.numero}°`}
                    />
                </div>
            </div>

            {tipoUnidad?.categoriaNombre === "DEPARTAMENTO" && (
                <div className="my-2 border-t border-slate-200">
                    <div className="p-3">
                        <h3
                            className="
                                text-base
                                font-semibold
                                text-slate-800
                                mb-2
                        ">
                            Distribución
                        </h3>
                        <div>
                            {caracteristicas
                                .filter(
                                    item =>
                                        item.value != null &&
                                        item.value != 0
                                )
                                .map((item) => (

                                    <UnidadCaracteristica
                                        key={item.label}
                                        icon={item.icon}
                                        label={item.label}
                                        value={item.value}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            )}

            <div
                className="
                    flex
                    flex-col
                    mt-auto
                    border-slate-200
            ">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            flex
                            gap-2
                            m-1
                            items-center
                            justify-center
                            rounded-full
                            bg-lime-500
                            p-2
                            text-sm
                            text-white
                            transition
                            hover:bg-slate-900
                            animate-pulse
                            shadow-lg
                        "
                    >
                        <FaWhatsapp className="size-5" />
                        Solicitar información
                    </a>
                    <button
                        type="button"
                        onClick={handleDescargarFicha}
                        disabled={descargandoFicha}
                        className="
                            flex
                            gap-2
                            m-1
                            items-center
                            justify-center
                            rounded-full
                            bg-[var(--color-naranja)]
                            p-2
                            text-sm
                            text-white
                            transition
                            hover:bg-slate-900
                            shadow-lg
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                    ">
                        <VscFilePdf className="size-5" />
                        {descargandoFicha
                            ? "Generando ficha..."
                            : "Ficha técnica"
                        }
                    </button>
                    <a
                        href={project.brochure}
                        download
                        className="
                            flex
                            gap-2
                            m-1
                            items-center
                            justify-center
                            rounded-full
                            bg-[var(--color-naranja)]
                            p-2
                            text-sm
                            text-white
                            transition
                            hover:bg-slate-900
                            shadow-lg
                    ">
                        <VscFilePdf className="size-5" />
                        Brochure
                    </a>
            </div>
        </aside>
    );
}

export default UnidadInfo;