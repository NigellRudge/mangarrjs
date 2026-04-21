import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NavigationStateProvider from "@/providers/NavigationStateProvider";
import SettingsProvider from "@/providers/SettingsProvider";
import AuthProvider from "@/providers/AuthProvider";

import { Inter } from "next/font/google";

const interFont = Inter({
  weight: "500",
  subsets: ["latin"],
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NavigationStateProvider>
      <AuthProvider>
        <SettingsProvider>
          <main className={interFont.className}>
            <Component {...pageProps} />
          </main>
        </SettingsProvider>
      </AuthProvider>
    </NavigationStateProvider>
  );
}
