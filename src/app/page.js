"use client";
import { SWRConfig } from "swr";
// helpers
import useCookieValidation from "@/helpers/useCookieValidation";
import fetcher from "@/helpers/swrFetcher";
// components
import Homepage from "@/page-components/Homepage";

export default function Home() {
  useCookieValidation();

  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <Homepage />
    </SWRConfig>
  );
}
