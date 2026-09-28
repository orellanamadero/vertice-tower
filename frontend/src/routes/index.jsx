import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import ProjectLayout from "../layouts/ProjectLayout";
import HomeProject from "../modules/showroom/pages/HomeProject";
import Recorrido from "../modules/showroom/pages/Recorrido";
import DepartamentDetail from "../modules/showroom/pages/DepartamentDetail";
import Amenidades from "../modules/showroom/pages/Amenidades";
import Ubicacion from "../modules/showroom/pages/Ubicacion";
import ContactoProject from "../modules/showroom/pages/ContactoProject";
import Login from "../modules/admin/pages/Login";
import Dashboard from "../modules/admin/pages/Dashboard";
import ProtectedRoute from "../modules/admin/components/ProtectedRoute";
import Historial from "../modules/admin/pages/Historial";
import AdminLayout from "../modules/admin/components/AdminLayout";
import Usuarios from "../modules/admin/pages/Usuario";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
               <Route
                    path="/admin/login"
                    element={<Login />}
                />
                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route
                            path="/admin"
                            element={<Dashboard />}
                        />
                        <Route
                            path="/admin/historial"
                            element={<Historial />}
                        />
                        <Route
                            path="/admin/usuarios"
                            element={<Usuarios />}
                        />
                    </Route>
                </Route>
                <Route
                    element={<ProjectLayout />}
                >
                    <Route
                        path="/"
                        element={<HomeProject />}
                    />
                    <Route
                        path="/recorrido"
                        element={<Recorrido />}
                    />
                    <Route
                        path="/recorrido/:floorId/:codigo"
                        element={<DepartamentDetail />}
                    />
                    <Route
                        path="/amenidades"
                        element={<Amenidades />}
                    />
                    <Route
                        path="/ubicacion"
                        element={<Ubicacion/>}
                    />
                    <Route
                        path="/contacto"
                        element={<ContactoProject />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
export default AppRoutes;