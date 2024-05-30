import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return<>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="792923753754-euf2eti6tismhthbat1i97qsv478b4e6.apps.googleusercontent.com">
          <Toaster />
          <Component {...pageProps} />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </>

}
