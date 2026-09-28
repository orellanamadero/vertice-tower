import { HeroProject } from "../components/hero";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getProyectoHero } from "../../../services/api";

function HomeProject() {
    const { project: projectBase } = useOutletContext();
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
        <>
            <Helmet>
                <title>Vertice Tower | Madero SRL</title>

                <meta
                    name="description"
                    content="Descubre Vértice Tower, sus departamentos, amenidades, recorridos virtuales y ubicación."
                />

                <link
                    rel="canonical"
                    href="https://maderosrl.com/"
                />
            </Helmet>
            <HeroProject
                project={project}
                empresa={projectBase?.empresa}
            />
        </>
        
    );
}
export default HomeProject;