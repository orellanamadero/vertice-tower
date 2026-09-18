import { useState, useEffect } from "react";
import { getContacto } from "../../../services/api";
import { getUbicacion } from "../../../services/api";

function Contacto() {
    const [contacto, setContacto] = useState(null);
    const [ubicacion, setUbicacion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function cargarContacto() {
            try {
                const data = await getContacto();
                const ubi = await getUbicacion();
                setContacto(data);
                setUbicacion(ubi);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        cargarContacto();
    }, []);

    const [form, setForm] = useState({
        nombre: "",
        telefono: "",
        correo: "",
        mensaje: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "nombre") {
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
                return;
            }
            if (value.length > 100) {
                return;
            }
        }
        if (name === "telefono") {
            if (!/^\d*$/.test(value)) {
                return;
            }
            if (value.length > 8) {
                return;
            }
        }
        if (name === "correo") {
            if (value.length > 100) {
                return;
            }
        }
        if (name === "mensaje") {
            if (value.length > 500) {
                return;
            }
        }
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {event.preventDefault();
    const mensaje = `Hola, estoy interesada/o en obtener información sobre el proyecto ${contacto.proyecto.nombreProyecto}.
        Nombre: ${form.nombre}
        Teléfono: ${form.telefono}
        Correo: ${form.correo}
        Mensaje:${form.mensaje}`;
    const mailtoUrl = `mailto:${contacto.correo}?subject=${encodeURIComponent(`Consulta sobre ${contacto.proyecto.nombreProyecto}`
    )}&body=${encodeURIComponent(mensaje)}`;
    window.location.href = mailtoUrl;
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Cargando contacto...</p>
            </main>
        );
    }

    if (!contacto) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>No se pudo cargar la información de contacto.</p>
            </main>
        );
    }

    return (
<main className="relative w-full min-h-screen overflow-hidden bg-[#ffffff]">

    <div
        className="
            absolute
            left-1/2
            top-1/2
            w-full
            aspect-[1920/1080]
            -translate-x-1/2
            -translate-y-1/2
            scale-160
            lg:scale-100
        "
    >
        <img
            src={contacto.imagecontacto}
            alt="Contacto"
            className="
                absolute
                inset-0
                w-full
                h-full
                object-contain
            "
        />
        <svg
            viewBox="0 0 1920 1080"
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
        >
            <a
                href={contacto.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
            >
                <g className="animate-pulse">
                    <path
                        d="M1263.5 451.5C1363 451.5 1368.5 625.5 1263.5 625.5H714.5C694.012 651.748 679.034 657.984 647.5 657.5L509.5 625.5C490.959 610.145 480.268 601.745 483.5 571L509.5 434C521.402 410.908 531.226 403.156 554 398L660 389C672.673 391.674 679.697 394.469 692 403L724.5 421.5C736.589 437.926 740.787 445.054 740.5 451.5C740.5 451.5 1164 451.5 1263.5 451.5ZM740.5 451.5H1263.5"
                        fill="var(--color-verde)"
                        fillOpacity="0.4"
                        className="
                            cursor-pointer
                            transition-all
                            duration-300
                            group-hover:fill-[var(--color-verde)]
                            group-hover:stroke-[var(--color-verde)]
                        "
                    />
                </g>
            </a>
        </svg>
    </div>
</main>
    );
}

export default Contacto;