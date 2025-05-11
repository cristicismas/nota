"use client";
import { SWRConfig } from "swr";
// helpers
import useCookieValidation from "@/helpers/useCookieValidation";
import fetcher from "@/helpers/swrFetcher";
// components
import Homepage from "@/page-components/Homepage";
import ToastProvider from "@/components/Toast/Provider";

export default function Home() {
  useCookieValidation();

  return (
    <ToastProvider>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <Homepage />
      </SWRConfig>
    </ToastProvider>
  );
}
