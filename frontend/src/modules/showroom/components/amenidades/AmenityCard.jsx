import { useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

function AmenityCard({ amenity, reverse = false }) {
    const [currentImage, setCurrentImage] = useState(0);
    const images = amenity.imagenes.map((imagen) => imagen.imagen);
    const nextImage = () => {
        setCurrentImage((prev) =>
            prev === images.length - 1
                ? 0
                : prev + 1
        );
    };
    const previousImage = () => {
        setCurrentImage((prev) =>
            prev === 0
                ? images.length - 1
                : prev - 1
        );
    };

    return (
        <article
            className={`
                relative
                mx-auto
                flex
                w-full
                max-w-8xl
                flex-col
                gap-6
                p-4
                md:gap-0
                md:p-8
                ${reverse ? "md:flex-row-reverse" : "md:flex-row"}
            `}
        >
            <div
                className="
                    relative
                    z-20
                    flex
                    w-full
                    flex-col
                    justify-center
                    rounded-[2rem]
                    p-10
                    text-center
                    text-neutral-500
                    md:w-[42%]
                    md:min-h-[480px]
                    md:rounded-[3rem]
                    md:px-10
                    lg:px-14
            ">
                <h2
                    className="
                        text-2xl
                        font-semibold
                        uppercase
                        tracking-wide
                        md:text-4xl
                        lg:text-5xl
                ">
                    {amenity.nombreAmenidad}
                </h2>
                <p
                    className="
                        mx-auto
                        mt-5
                        max-w-lg
                        text-sm
                        leading-relaxed
                        text-slate-500
                        md:text-base
                ">
                    "{amenity.descripcionAmenidad}"
                </p>
            </div>
            <div
                className={`
                    relative
                    z-10
                    h-[350px]
                    w-full
                    overflow-hidden
                    rounded-[2rem]
                    md:h-[500px]
                    md:w-[62%]
                    md:rounded-[3rem]
                    ${reverse ? "md:-ml-8" : "md:-mr-8"}
                `}
            >
                <img
                    src={images[currentImage]}
                    alt={`${amenity.nombreAmenidad} - vista ${currentImage + 1}`}
                    className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-1000
                        hover:scale-105
                    "
                />
                {images.length > 1 && (
                    <button
                        type="button"
                        onClick={previousImage}
                        aria-label="Imagen anterior"
                        className="
                            absolute
                            left-4
                            top-1/2
                            flex
                            h-11
                            w-11
                            -translate-y-1/2
                            items-center
                            justify-center
                            rounded-full
                            bg-black/30
                            text-xl
                            text-white
                            backdrop-blur-sm
                            transition-all
                            duration-300
                            hover:bg-black/60
                            md:left-6
                        "
                    >
                        <MdKeyboardArrowLeft />
                    </button>
                )}

                {images.length > 1 && (
                    <button
                        type="button"
                        onClick={nextImage}
                        aria-label="Imagen siguiente"
                        className="
                            absolute
                            right-4
                            top-1/2
                            flex
                            h-11
                            w-11
                            -translate-y-1/2
                            items-center
                            justify-center
                            rounded-full
                            bg-black/30
                            text-xl
                            text-white
                            backdrop-blur-sm
                            transition-all
                            duration-300
                            hover:bg-black/60
                            md:right-6
                    ">
                        <MdKeyboardArrowRight />
                    </button>
                )}
                {images.length > 1 && (
                    <div
                        className="
                            absolute
                            bottom-5
                            left-1/2
                            flex
                            -translate-x-1/2
                            gap-2
                    ">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentImage(index)}
                                aria-label={`Ver imagen ${index + 1}`}
                                className={`
                                    h-2
                                    rounded-full
                                    transition-all
                                    duration-300
                                    ${
                                        currentImage === index
                                            ? "w-6 bg-white"
                                            : "w-2 bg-white/50"
                                    }
                                `}
                            />
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}

export default AmenityCard;