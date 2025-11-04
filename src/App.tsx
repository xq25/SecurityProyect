import { useEffect, useState, Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "./common/Loader";
import Home from "./pages/Home";
//Importacion de provedores
import { UIProvider } from "./context/UIProvider"; // 👈 importa tu provider
import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux"; 
import { store } from "./store/store";
import SignIn from "./pages/Authentication/SignIn";
import ProtectedRout from './components/Auth/ProtectedRoute';

import routes from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Navigate } from "react-router-dom"; // ✅ Asegúrate de importar Navigate



const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster position="top-right" reverseOrder={false} containerClassName="overflow-auto"/>
      <Provider store={store}>
        <UIProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/auth/signin" element={<SignIn />} />
            
            {/* Rutas protegidas */}
            <Route element={<ProtectedRout />}>
              <Route element={<DefaultLayout />}>
                <Route index element={<Home />} />
                {routes.map((routes, index) => {
                  const { path, component: Component } = routes;
                  return (
                    <Route
                      key={index}
                      path={path}
                      element={
                        <Suspense fallback={<Loader />}> {/*Mientras carga el componente debemos mostrar el loading */}
                          <Component />
                        </Suspense>
                      }
                    />
                  );
                })}
              </Route>
            </Route>
          </Routes>:
        </UIProvider>
      </Provider>
    </>
  );
}

export default App;
