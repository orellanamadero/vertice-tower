import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import NavbarProject from "../shared/components/navbar/NavbarProject";
import Footer from "../shared/components/footer/Footer";
import { getProyectoBase } from "../services/api";

function ProjectLayout() {
    const [project, setProject] = useState(null);
    const [hideFooter, setHideFooter] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const cargarProyecto = async () => {
            try {
                const data = await getProyectoBase();
                setProject(data);
            } catch (error) {
                console.error(
                    "Error al cargar información del proyecto:",
                    error
                );
            }
        };

        cargarProyecto();
    }, []);
    const ocultarFooter = hideFooter || location.pathname === "/amenidades";

    return (
        <div className="relative flex min-h-screen flex-col">
            <NavbarProject project={project} />
            <main className="flex-1 min-h-0">
                <Outlet
                    context={{
                        project,
                        setHideFooter,
                    }}
                />
            </main>
                {!ocultarFooter && (
                    <Footer project={project} />
                )}
        </div>
    );
}

export default ProjectLayout;