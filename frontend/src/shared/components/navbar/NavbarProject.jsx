import { useState } from "react";
import { Link } from "react-router-dom";

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

    const empresa = project?.empresa;

    return (
        <header
            className="
                fixed
                left-0
                top-0
                z-60
                h-15
                w-full
                bg-black/65
                lg:h-17
            "
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
                    {/* LOGO */}
                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="
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
                        {empresa?.logo1 ? (
                            <img
                                src={empresa.logo1}
                                alt={
                                    empresa.nombre ||
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

                    {/* MENÚ MÓVIL */}
                    <div
                        id="mobile-project-menu"
                        className={`
                            absolute
                            right-0
                            top-15
                            z-1000
                            w-[140px]
                            overflow-hidden
                            rounded-bl-lg
                            bg-black/65
                            shadow-xl
                            transition-all
                            duration-300
                            md:hidden
                            ${
                                isMenuOpen
                                    ? "max-h-96 opacity-100"
                                    : "pointer-events-none max-h-0 opacity-0"
                            }
                        `}
                    >
                        <div
                            className="
                                flex
                                max-h-[80vh]
                                flex-col
                                overflow-y-auto
                                py-1
                            "
                        >
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMenu}
                                    className="
                                        px-4
                                        py-3
                                        text-right
                                        text-sm
                                        text-slate-50
                                        text-shadow-lg
                                        hover:bg-slate-50
                                        hover:text-black
                                    "
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default NavbarProject;