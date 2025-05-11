"use client";
import { SWRConfig } from "swr";
// helpers
import useCookieValidation from "@/helpers/useCookieValidation";
import fetcher from "@/helpers/swrFetcher";
// components
import DynamicPage from "@/page-components/DynamicPage";
import ToastProvider from "@/components/Toast/Provider";

export default function Page() {
  useCookieValidation();

  return (
    <ToastProvider>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <DynamicPage />
      </SWRConfig>
    </ToastProvider>
  );
}
