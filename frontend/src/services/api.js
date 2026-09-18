export const API_URL = import.meta.env.VITE_API_URL;

export async function getProyecto() {

    const response = await fetch(
        `${API_URL}/proyectos/`
    );

    if (!response.ok) {
        throw new Error(
            "No se pudo obtener el proyecto"
        );
    }

    const data = await response.json();

    return data[0];
}

let recorridoCache = null;
let recorridoCacheTime = 0;
let recorridoPromise = null;

const RECORRIDO_CACHE_TTL = 60 * 1000;

export function getProyectoRecorridoCache() {
    if (!recorridoCache) {
        return null;
    }
    const cacheValida =
        Date.now() - recorridoCacheTime <
        RECORRIDO_CACHE_TTL;

    if (!cacheValida) {
        return null;
    }

    return recorridoCache;
}
export function invalidarProyectoRecorridoCache() {
    recorridoCache = null;
    recorridoCacheTime = 0;
    recorridoPromise = null;
}

export async function getProyectoRecorrido() {
    const cached = getProyectoRecorridoCache();
    if (cached) {
        return cached;
    }
    if (recorridoPromise) {
        return recorridoPromise;
    }
    recorridoPromise = fetch(
        `${API_URL}/proyectos/1/recorrido/`
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    "No se pudo obtener el recorrido"
                );
            }

            return response.json();
        })
        .then((data) => {
            recorridoCache = data;
            recorridoCacheTime = Date.now();

            return data;
        })
        .finally(() => {
            recorridoPromise = null;
        });

    return recorridoPromise;
}

export async function descargarFichaTecnica(unidadId) {

    const response = await fetch(
        `${API_URL}/proyectos/unidades/${unidadId}/ficha-tecnica/`
    );

    if (!response.ok) {
        throw new Error(
            "No se pudo descargar la ficha técnica"
        );
    }

    return response.blob();
}
export async function getProyectoBase() {

    const response = await fetch(
        `${API_URL}/proyectos/1/empresa/`
    );

    if (!response.ok) {
        throw new Error(
            "No se pudo obtener el recorrido"
        );
    }

    return response.json();
}
export async function getNosotros() {
    const response = await fetch(
         `${API_URL}/proyectos/1/nosotros/`
    );
    if (!response.ok) {
        throw new Error("Error al obtener Nosotros");
    }
    return response.json();
}

export async function getProyectoHero() {
    const response = await fetch(
         `${API_URL}/proyectos/1/hero/`
    );

    if (!response.ok) {
        throw new Error("Error al obtener el Hero");
    }

    return await response.json();
}

export async function getAvances() {
    const response = await fetch(
         `${API_URL}/proyectos/1/avances/`
    );

    if (!response.ok) {
        throw new Error("Error al obtener los avances");
    }

    return response.json();
}

export async function getUbicacion() {
    const response = await fetch(
         `${API_URL}/proyectos/1/ubicacion/`
    );

    if (!response.ok) {
        throw new Error("Error al obtener los ubicacion");
    }

    return response.json();
}
export async function getContacto() {
    const response = await fetch(
         `${API_URL}/proyectos/1/contacto/`
    );

    if (!response.ok) {
        throw new Error("Error al obtener los contacto");
    }

    return response.json();
}