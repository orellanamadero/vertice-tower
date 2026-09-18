import { useEffect, useState } from "react";
import Container from "../../../shared/components/container/Container";
import AvanceMes from "../components/avances/AvanceMes";
import { MdConstruction } from "react-icons/md";
import PageHeader from "../components/pageHeader/PageHeader";
import { getAvances } from "../../../services/api";
import Section from "../../../shared/components/section/Section";

function Avances() {

    const [avances, setAvances] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function cargarAvances() {
            try {
                const data = await getAvances();
                setAvances(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        cargarAvances();
    }, []);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Cargando avances...</p>
            </main>
        );
    }
    if (!avances) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>No se pudo cargar la información de avances.</p>
            </main>
        );
    }

    return (
        <main
            className="
                w-full
                bg-gradient-to-bl
                from-zinc-100
                to-zinc-50
        ">
            <Container>
                <Section>
                    <PageHeader
                        icon={MdConstruction}
                        title="Avances de obra"
                        subtitle="Así crece nuestro proyecto"
                    />
                    <div className="mt-12 space-y-16 md:space-y-20">
                        {avances.map((avance) => (
                            <AvanceMes
                                key={`${avance.mes}-${avance.anio}`}
                                avance={avance}
                            />

                        ))}
                    </div>
                </Section>
            </Container>
        </main>
    );
}

export default Avances;