import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../modules/showroom/images/BLANCO.webp";

const menuItems = [
    { label: "Home", path: "/" },
    { label: "Nosotros", path: "/nosotros" },
    { label: "Recorrido", path: "/recorrido" },
    { label: "Amenidades", path: "/amenidades" },
    { label: "Avances", path: "/avances" },
    { label: "Ubicación", path: "/ubicacion" },
    { label: "Contáctanos", path: "/contacto" },
];

function NavbarProject({ project }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const location = useLocation();

    const navbarTransparente =
        location.pathname === "/" ||
        location.pathname.startsWith("/recorrido");

    const empresa = project?.empresa;

    return (
        <header
            className={`
                fixed
                left-0
                top-0
                z-[1100]
                h-15
                w-full
                transition-all
                duration-500
                lg:h-17

                ${
                    navbarTransparente
                        ? "bg-transparent"
                        : "bg-black/75 backdrop-blur-md shadow-lg"
                }
            `}
        >
            <div
                className="
                    mx-auto
                    max-w-8xl
                    px-0
                    md:px-3
                    lg:px-20
                "
            >
                <nav
                    className="
                        relative
                        flex
                        items-center
                        justify-between
                        p-3
                    "
                >
                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="
                            relative
                            z-[1200]
                            flex
                            items-center
                            pl-2
                            text-xl
                            font-bold
                            text-stone-50
                            md:pl-0
                        "
                        aria-label="Ir al inicio"
                    >
                        {logo ? (
                            <img
                                src={logo}
                                alt={
                                    empresa?.nombre ||
                                    "Logo del proyecto"
                                }
                                className="
                                    h-8
                                    w-auto
                                    max-w-[180px]
                                    object-contain
                                    lg:h-10
                                "
                            />
                        ) : (
                            <div
                                className="
                                    h-8
                                    w-[120px]
                                    animate-pulse
                                    rounded
                                    bg-white/10
                                    lg:h-10
                                "
                            />
                        )}
                    </Link>

                    {/* BOTÓN HAMBURGUESA */}
                    <button
                        type="button"
                        onClick={() =>
                            setIsMenuOpen(
                                (open) => !open
                            )
                        }
                        className="
                            relative
                            z-[1200]
                            flex
                            flex-col
                            gap-1.5
                            pr-2
                            text-stone-50
                            md:hidden
                        "
                        aria-label={
                            isMenuOpen
                                ? "Cerrar menú"
                                : "Abrir menú"
                        }
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-project-menu"
                    >
                        <span
                            className={`
                                block
                                h-0.5
                                w-6
                                bg-current
                                transition
                                duration-300
                                ${
                                    isMenuOpen
                                        ? "translate-y-2 rotate-45"
                                        : ""
                                }
                            `}
                        />

                        <span
                            className={`
                                block
                                h-0.5
                                w-6
                                bg-current
                                transition
                                duration-300
                                ${
                                    isMenuOpen
                                        ? "opacity-0"
                                        : ""
                                }
                            `}
                        />

                        <span
                            className={`
                                block
                                h-0.5
                                w-6
                                bg-current
                                transition
                                duration-300
                                ${
                                    isMenuOpen
                                        ? "-translate-y-2 -rotate-45"
                                        : ""
                                }
                            `}
                        />
                    </button>

                    {/* MENÚ DESKTOP */}
                    <div
                        className="
                            hidden
                            items-center
                            gap-6
                            text-xs
                            text-stone-50
                            md:flex
                            md:text-sm
                            lg:gap-8
                        "
                    >
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="menu-link"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <div
                        id="mobile-project-menu"
                        className={`
                            fixed
                            inset-0
                            z-[999]

                            flex
                            h-screen
                            w-screen
                            items-center
                            justify-center

                            bg-black/75
                            backdrop-blur-md

                            transition-all
                            duration-500
                            ease-in-out

                            md:hidden

                            ${
                                isMenuOpen
                                    ? "visible opacity-100"
                                    : "invisible pointer-events-none opacity-0"
                            }
                        `}
                    >
                        <nav
                            className={`
                                flex
                                flex-col
                                items-center
                                justify-center

                                gap-2

                                transition-all
                                duration-500
                                ease-out

                                ${
                                    isMenuOpen
                                        ? "translate-y-0 opacity-100"
                                        : "translate-y-6 opacity-0"
                                }
                            `}
                        >
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMenu}
                                    className="
                                        relative
                                        px-8
                                        py-3

                                        text-center
                                        text-base
                                        font-light
                                        tracking-wide
                                        text-white

                                        transition-all
                                        duration-300

                                        hover:text-[var(--color-naranja)]
                                    "
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default NavbarProject;