import { useState} from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Recorrido360 from "../Recorrido/Recorrido360";

function UnidadViewer({ view, unit }) {

    const [galleryIndex, setGalleryIndex] = useState(0);
    const [previousIndex, setPreviousIndex] = useState(null);
    const [isFading, setIsFading] = useState(false);
    const gallery = unit?.tipoUnidad?.galeria || [];
    const changeGallery = (newIndex) => {
        setPreviousIndex(galleryIndex);
        setGalleryIndex(newIndex);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsFading(true);
            });
        });

    };

    return (
        <section
            className="
                w-full
                h-full
                overflow-y-hidden
        ">
            {view === "3d" && (
                <div
                    className="
                        w-full
                        h-full
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                ">
                    <img
                        src={unit.tipoUnidad.render3D}
                        alt={`Render ${unit.tipoUnidad.codigo}`}
                        className="
                            block
                            max-h-full
                            max-w-full
                            h-auto
                            w-auto
                            object-contain
                        "
                    />
                </div>
            )}
            {view === "technical" && (
                <div
                    className="
                        w-full
                        h-full
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                        bg-[#ffffff]
                ">
                    <img
                        src={unit.tipoUnidad.planoTecnico}
                        alt={`Plano técnico ${unit.tipoUnidad.codigo}`}
                        className="
                            block
                            max-h-full
                            max-w-full
                            h-auto
                            w-auto
                            object-contain
                        "
                    />
                </div>
            )}
            {view === "gallery" && gallery.length > 0 && (
                <div
                    className="
                        relative
                        w-full
                        h-full
                        overflow-hidden
                        bg-black
                        flex
                        items-center
                        justify-center
                        pt-5
                        pb-10
                        md:pt-15
                ">
                    <img
                        src={gallery[galleryIndex].image}
                        alt=""
                        aria-hidden="true"
                        className="
                            absolute
                            inset-0
                            w-full
                            h-full
                            object-cover
                            scale-110
                            blur-md
                        "
                    />
                    <div
                        className="
                            absolute
                            inset-0
                            bg-black/25
                    ">
                        <div
                            className="
                                absolute
                                inset-0
                                w-full
                                h-full
                                shadow-[0_0_30px_rgba(0,0,0,0.90)]
                        ">
                            <img
                                src={gallery[galleryIndex].image}
                                alt={`Galería ${unit.tipoUnidad.codigo}`}
                                className="
                                    absolute
                                    inset-0
                                    w-full
                                    h-full
                                    pt-16
                                    lg:pt-18
                                    md:pb-21
                                    lg:pb-22
                                    object-contain
                                    transition-opacity
                                    duration-500
                                    ease-in-out
                                "
                            />
                            {previousIndex !== null && (
                                <img
                                    src={
                                        gallery[previousIndex].image
                                    }
                                    alt=""
                                    className={`
                                        absolute
                                        inset-0
                                        w-full
                                        h-full
                                        pt-16
                                        lg:pt-18
                                        md:pb-21
                                        lg:pb-22
                                        object-contain
                                        transition-opacity
                                        duration-900
                                        ease-in-out
                                        ${
                                            isFading
                                                ? "opacity-0"
                                                : "opacity-100"
                                        }
                                    `}
                                    onTransitionEnd={() => {
                                        setPreviousIndex(null);
                                        setIsFading(false);
                                    }}
                                />
                            )}
                        </div>
                        <button
                            onClick={() =>
                                changeGallery(
                                    galleryIndex === 0
                                        ? gallery.length - 1
                                        : galleryIndex - 1
                                )
                            }
                            className="
                                absolute
                                md:left-5
                                left-1
                                top-1/2
                                -translate-y-1/2
                                z-20
                                h-10
                                w-10
                                rounded-full
                                flex
                                items-center
                                justify-center
                                bg-slate-50
                                text-slate-700
                                hover:scale-110
                                transition
                        ">
                            <IoIosArrowBack size={20} />
                        </button>
                        <button
                            onClick={() =>
                                changeGallery(
                                    galleryIndex === gallery.length - 1
                                        ? 0
                                        : galleryIndex + 1
                                )
                            }
                            className="
                                absolute
                                right-1
                                md:right-5
                                top-1/2
                                -translate-y-1/2
                                z-20
                                h-10
                                w-10
                                rounded-full
                                flex
                                items-center
                                justify-center
                                bg-white/80
                                text-slate-800
                                hover:scale-110
                                transition
                        ">
                            <IoIosArrowForward size={20} />
                        </button>
                        <div
                            className="
                                absolute
                                bottom-23
                                lg:bottom-25
                                left-1/2
                                -translate-x-1/2
                                z-20
                                flex
                                items-center
                                gap-1
                                rounded-full
                                bg-black/40
                                px-2
                                py-2
                        ">
                            {gallery.map((image, index) => (
                                <span
                                    key={image.id}
                                    className={`
                                        h-1
                                        w-1
                                        rounded-full
                                        transition-all
                                        duration-300
                                        ${
                                            galleryIndex === index
                                                ? "bg-white scale-125"
                                                : "bg-white/50"
                                        }
                                    `}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {view === "tour" && (
                <Recorrido360 
                    src={unit.tipoUnidad.tour360}
                    title="Recorrido 360°"
                />
        )}
        </section>
    );
}
export default UnidadViewer;