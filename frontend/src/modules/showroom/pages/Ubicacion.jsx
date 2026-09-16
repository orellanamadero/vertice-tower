import { useEffect, useState } from "react";
import { getUbicacion } from "../../../services/api";

function Ubicacion() {

    const [ubicacion, setUbicacion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function cargarUbicacion() {

            try {

                const data = await getUbicacion();

                setUbicacion(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }

        cargarUbicacion();

    }, []);


    if (loading) {

        return (
            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                "
            >
                <p>
                    Cargando ubicación...
                </p>
            </main>
        );

    }


    if (!ubicacion) {

        return (
            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                "
            >
                <p>
                    No se pudo cargar la información de ubicación.
                </p>
            </main>
        );

    }


    return (

        <main
            className="
                relative
                min-h-[100dvh]
                w-full
                overflow-hidden
                bg-white
            "
        >

            <div
                className="
                    absolute
                    inset-0
                    bg-cover
                    bg-center
                    bg-no-repeat
                    xl:hidden
                "
                style={{
                    backgroundImage: `
                        url(${
                            ubicacion.imageUbicacionMobile ||
                            ubicacion.imageUbicacion
                        })
                    `,
                }}
            />


            <div
                className="
                    absolute
                    inset-0
                    hidden

                    bg-cover
                    bg-center
                    bg-no-repeat

                    xl:block
                "
                style={{
                    backgroundImage: `
                        url(${ubicacion.imageUbicacion})
                    `,
                }}
            />
            <section
                aria-label="Mapa de ubicación del proyecto"
                className="
                    absolute
                    z-10
                    left-1/2
                    top-[52%]
                    h-[39%]
                    w-[84%]
                    -translate-x-1/2
                    overflow-hidden
                    rounded-[22px]
                    bg-white
                    shadow-xl
                    xl:left-[5%]
                    xl:top-[17%]
                    xl:h-[72%]
                    xl:w-[57%]
                    xl:translate-x-0
                    xl:rounded-2xl
                    xl:shadow-2xl
            ">
                <iframe
                    src={ubicacion.iframeUbicacion}
                    className="
                        block
                        h-full
                        w-full
                        border-0
                    "
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación del proyecto"
                />

            </section>

        </main>

    );

}

export default Ubicacion;