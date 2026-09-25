import { FaWhatsapp } from "react-icons/fa";
import { FiFacebook } from "react-icons/fi";

function Footer({ project }) {
    const empresa = project?.empresa;

    return (
        <footer
            className="
                absolute
                bottom-0
                left-0
                z-50
                w-full
                bg-gradient-to-t
                from-black/55
                via-black/20
                to-transparent
            "
        >
            <div
                className="
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-x-2
                    gap-y-0.5
                    p-3
                    lg:px-5
                "
            >
                <p
                    className="
                        text-center
                        text-[10px]
                        text-white/70
                        md:text-xs
                    "
                >
                    © {new Date().getFullYear()} ARQA 360° {" · "}
                    Todos los derechos reservados.
                </p>

                <div className="flex items-center gap-1">
                    <p
                        className="
                            text-center
                            text-[10px]
                            text-white/70
                            md:text-xs
                        "
                    >
                        Plataforma desarrollada por nuestro equipo.
                    </p>

                    {empresa?.whatsapp && (
                        <a
                            href="https://wa.link/a6rzle"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            className="
                                text-white/70
                                transition
                                hover:scale-110
                                hover:text-[var(--color-naranja)]
                            "
                        >
                            <FaWhatsapp className="size-3 md:size-4" />
                        </a>
                    )}

                    {empresa?.facebook && (
                        <a
                            href="https://www.facebook.com/share/1YFvFihXCn/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="
                                text-white/70
                                transition
                                hover:scale-110
                                hover:text-[var(--color-naranja)]
                            "
                        >
                            <FiFacebook className="size-3 md:size-4" />
                        </a>
                    )}
                </div>
            </div>
        </footer>
    );
}

export default Footer;