import { IoClose } from "react-icons/io5";

function UsuarioForm({
    formulario,
    setFormulario,
    onSubmit,
    onCancel,
    guardando,
    modo = "editar",
}) {
    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked
        } = event.target;
        setFormulario((prev) => ({
            ...prev,
            [name]: type === "checkbox"
                ? checked
                : value,
        }));
    };

    return (
        <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/60
            px-4
            backdrop-blur-sm
        ">
            <div className="
                w-full
                max-w-lg
                rounded-2xl
                bg-white
                shadow-2xl
            ">
                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-black/10
                    px-6
                    py-5
                ">
                    <div>
                        <h2 className="
                            text-xl
                            font-semibold
                        ">
                            {modo === "crear"
                                ? "Nuevo usuario"
                                : "Editar usuario"}
                        </h2>
                        <p className="
                            mt-1
                            text-sm
                            text-gray-500
                        ">
                            {modo === "crear"
                                ? "Registra un nuevo usuario en el sistema."
                                : "Modifica los datos del usuario."}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={guardando}
                        className="
                            rounded-full
                            p-2
                            text-gray-500
                            transition
                            hover:bg-gray-100
                            hover:text-gray-900
                    ">
                        <IoClose className="size-6" />
                    </button>
                </div>
                <form
                    onSubmit={onSubmit}
                    className="px-6 py-6"
                >
                    <div className="
                        grid
                        gap-4
                        sm:grid-cols-2
                    ">
                        <div className="sm:col-span-2">
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            ">
                                Usuario
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formulario.username}
                                onChange={handleChange}
                                required
                                autoComplete="username"
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-slate-900
                                "
                            />
                        </div>
                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            ">
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formulario.first_name}
                                onChange={handleChange}
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-slate-900
                                "
                            />
                        </div>
                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            ">
                                Apellido
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formulario.last_name}
                                onChange={handleChange}
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-slate-900
                                "
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            ">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formulario.email}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-slate-900
                                "
                            />
                        </div>
                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            ">
                                Rol
                            </label>
                            <select
                                name="group"
                                value={formulario.group}
                                onChange={handleChange}
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-slate-900
                            ">
                                <option value="">
                                    Selecciona un rol
                                </option>
                                <option value="ADMINISTRADOR">
                                    Administrador
                                </option>
                                <option value="ASESOR">
                                    Asesor
                                </option>
                            </select>
                        </div>
                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            ">
                                Estado
                            </label>

                            <label className="
                                flex
                                h-[42px]
                                cursor-pointer
                                items-center
                                gap-3
                                rounded-lg
                                border
                                border-gray-300
                                px-3
                            ">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formulario.is_active}
                                    onChange={handleChange}
                                    className="size-4"
                                />
                                <span className="text-sm">
                                    Usuario activo
                                </span>
                            </label>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            ">
                                {modo === "crear"
                                    ? "Contraseña"
                                    : "Nueva contraseña"}
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formulario.password}
                                onChange={handleChange}
                                required={modo === "crear"}
                                autoComplete="new-password"
                                placeholder={
                                    modo === "editar"
                                        ? "Dejar vacío para mantener la actual"
                                        : ""
                                }
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-slate-900
                                "
                            />
                        </div>
                    </div>
                    <div className="
                        mt-6
                        flex
                        justify-end
                        gap-3
                    ">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={guardando}
                            className="
                                rounded-lg
                                border
                                border-gray-300
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-gray-700
                                transition
                                hover:bg-gray-100
                        ">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={guardando}
                            className="
                                rounded-lg
                                bg-slate-900
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-slate-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                        ">
                            {guardando
                                ? modo === "crear"
                                    ? "Creando..."
                                    : "Guardando..."
                                : modo === "crear"
                                    ? "Crear usuario"
                                    : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UsuarioForm;