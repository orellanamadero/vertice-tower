function AvanceMes({ avance }) {
    
    return (
        <article className="pt-3">
            <div
                className="
                    grid
                    gap-5
                    md:grid-cols-[220px_1fr]
                    md:gap-8
            ">
                <div>
                    <span
                        className="
                            text-base
                            uppercase
                            tracking-[0.25em]
                            text-gray-500
                    ">
                        {avance.nombreMes} {avance.anio}
                    </span>
                    <h2
                        className="
                            text-3xl
                            font-semibold
                            md:text-4xl
                    ">
                        {avance.porcentaje}%
                    </h2>
                    <span
                        className="
                            text-sm
                            uppercase
                            tracking-wider
                            text-gray-500
                    ">
                        avance de obra
                    </span>
                </div>
                <div className="flex h-full flex-col justify-end">
                    <p
                        className="
                            max-w-3xl
                            text-sm
                            leading-relaxed
                            text-gray-600
                            md:text-base
                    ">
                        {avance.descripcion}
                    </p>
                </div>
            </div>
            <div
                className="
                    mt-8
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-3
            ">
            {avance.imagenes.map((imagen, index) => (
                <div
                    key={imagen.id}
                    className="
                        group
                        relative
                        aspect-[4/3]
                        overflow-hidden
                        rounded-xl
                        bg-gray-100
                ">
                    <img
                        src={imagen.imagen}
                        alt={`Avance de obra ${avance.nombreMes} ${index + 1}`}
                        className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-105
                        "
                    />
                </div>
            ))}
            </div>
        </article>
    );
}

export default AvanceMes;