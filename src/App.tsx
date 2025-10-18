import { useEffect, useState, Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "./common/Loader";
import { UIProvider } from "./context/UIProvider"; // 👈 importa tu provider
import { Route, Routes } from "react-router-dom";
// import SignIn from './pages/Authentication/SignIn';
// import SignUp from './pages/Authentication/SignUp';
import routes from './routes';


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
    <Toaster position="top-right" reverseOrder={false} containerClassName="overflow-auto" /> 
    <UIProvider> {/* 👈 Envolvemos todo dentro del provider */}
      <Routes>
        {/* <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} /> */}
        
          <Route element={<DefaultLayout/>}>
            <Route index element={<Loader/>} />
            {routes.map((routes, index) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}> {/*Da espera a que el componente se cargue, mientras tanto muestra el Loader */}
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
        
      </Routes>
    </UIProvider> 
    </>
  );
}

export default App;
