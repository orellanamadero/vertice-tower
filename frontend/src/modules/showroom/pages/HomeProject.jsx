import { HeroProject } from "../components/hero";
import { useEffect, useState } from "react";
import { getProyectoHero } from "../../../services/api";

function HomeProject() {
    const [project, setProject] = useState(null);
    useEffect(() => {
        async function cargarHero() {
            try {
                const data = await getProyectoHero();
                setProject(data);
            } catch (error) {
                console.error(error);
            }
        }
        cargarHero();
    }, []);

    if (!project) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Cargando...</p>
            </div>
        );
    }
    return (
        <HeroProject project={project} />
    );
}
export default HomeProject;