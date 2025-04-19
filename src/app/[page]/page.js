"use client";
import { SWRConfig } from "swr";
// helpers
import useCookieValidation from "@/helpers/useCookieValidation";
import fetcher from "@/helpers/swrFetcher";
// components
import DynamicPage from "@/page-components/DynamicPage";

export default function Page() {
  useCookieValidation();

  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <DynamicPage />
    </SWRConfig>
  );
}
