import { useEffect, useState, Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "./common/Loader";
import { UIProvider } from "./context/UIProvider"; // 👈 importa tu provider

const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <UIProvider> {/* 👈 Envolvemos todo dentro del provider */}
      <Toaster position="top-right" reverseOrder={false} containerClassName="overflow-auto" />
      <Suspense fallback={<Loader />}>
        <DefaultLayout />
      </Suspense>
    </UIProvider>
  );
}

export default App;
