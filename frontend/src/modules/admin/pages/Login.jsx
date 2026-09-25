import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imageLogin from "../images/fondoLogin.webp"

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/token/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );
            if (!response.ok) {
                throw new Error(
                    "Usuario o contraseña incorrectos"
                );
            }
            const data = await response.json();
            localStorage.setItem("access", data.access);
            navigate("/admin");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <main
            className="
                relative
                flex
                min-h-screen
                items-center
                justify-center
                overflow-hidden
                px-6
        ">
             <div
                className="
                    pointer-events-none
                    fixed
                    inset-0
                    z-0
                    h-screen
                    w-screen
                    bg-cover
                    bg-left
                    bg-no-repeat
                "
                style={{
                    backgroundImage: `url(${imageLogin})`,
                    backgroundPosition: "left center",
                }}
            />
            <div className="
                relative
                z-10
                w-full
                max-w-md
                rounded-3xl
                border
                border-white/40
                bg-white/20
                backdrop-blur-xl
                backdrop-saturate-150
                p-8
                shadow-[0_20px_60px_rgba(0,0,0,0.20)]
            ">

                <div className="
                    mb-8
                    text-center
                ">
                    <h1 className="
                        text-2xl
                        font-semibold
                        uppercase
                        tracking-wide
                    ">
                        Panel de administración
                    </h1>

                    <p className="
                        mt-2
                        text-sm
                        text-gray-500
                    ">
                        Ingresa con tu cuenta
                    </p>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label className="
                            mb-2
                            block
                            text-xs
                            uppercase
                            tracking-widest
                            text-gray-900
                        ">
                            Usuario
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            maxLength={25}
                            onChange={handleChange}
                            required
                            className="
                                w-full
                                rounded-lg
                                border
                                border-black/30
                                bg-zinc-50/50
                                px-4
                                py-3
                                outline-none
                                focus:border-black
                            "
                        />
                    </div>
                    <div>
                        <label className="
                            mb-2
                            block
                            text-xs
                            uppercase
                            tracking-widest
                            text-gray-900
                        ">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            maxLength={30}
                            onChange={handleChange}
                            required
                            className="
                                w-full
                                rounded-lg
                                border
                                border-black/30
                                bg-zinc-50/50
                                px-4
                                py-3
                                outline-none
                                focus:border-black
                            "
                        />
                    </div>
                    {error && (
                        <p className="
                            text-sm
                            text-red-600
                        ">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="
                            w-full
                            rounded-full
                            bg-[var(--color-naranja)]
                            px-6
                            py-3
                            text-sm
                            uppercase
                            tracking-widest
                            text-white
                            transition
                            hover:bg-slate-900
                    ">
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </main>
    );
}
export default Login;