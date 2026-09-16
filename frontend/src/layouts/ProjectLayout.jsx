import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import NavbarProject from "../shared/components/navbar/NavbarProject";
import Footer from "../shared/components/footer/Footer";
import { getProyectoBase } from "../services/api";

function ProjectLayout() {
    const [project, setProject] = useState(null);

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

    return (
        <div className="relative flex min-h-screen flex-col">
            <NavbarProject project={project} />
            <main className="flex-1 min-h-0">
                <Outlet context={{ project }} />
            </main>
            <Footer project={project} />
        </div>
    );
}

export default ProjectLayout;