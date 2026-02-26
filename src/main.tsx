import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"
// import { Toaster } from "react-hot-toast";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
  <Suspense fallback={<div>Loading...</div>}>
    <GoogleOAuthProvider clientId={clientId}>
      
      <App />
    </GoogleOAuthProvider>

  </Suspense>
</PersistGate>
    </Provider>
    </QueryClientProvider>
  </StrictMode>
);
