import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import RomanticBirthday from "./RomanticBirtday";
import { supabase } from "../lib/supabase";

import type { BirthdayConfig } from "../types/birthday";

type PageStatus = "LOADING" | "SUCCESS" | "NOT_FOUND";

const BirthdayPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const [status, setStatus] =
    useState<PageStatus>("LOADING");

  const [config, setConfig] =
    useState<BirthdayConfig | null>(null);

  useEffect(() => {
    const loadBirthdayPage = async () => {
      if (!slug) {
        console.error("Birthday page slug is missing");

        setStatus("NOT_FOUND");
        return;
      }

      console.log("Loading birthday page with slug:", slug);

      const { data, error } = await supabase
        .from("birthday_pages")
        .select("config")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error(
          "Could not load birthday page:",
          error
        );

        setStatus("NOT_FOUND");
        return;
      }

      if (!data?.config) {
        console.error(
          "Birthday page not found for slug:",
          slug
        );

        setStatus("NOT_FOUND");
        return;
      }

      setConfig(data.config as BirthdayConfig);
      setStatus("SUCCESS");
    };

    loadBirthdayPage();
  }, [slug]);

  if (status === "LOADING") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-pink-200/50">
            Just a moment
          </p>

          <p className="mt-4 text-sm text-white/50">
            Something special is opening...
          </p>
        </div>
      </main>
    );
  }

  if (status === "NOT_FOUND" || !config) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-pink-200/50">
            This page is unavailable
          </p>

          <h1 className="mt-5 text-3xl font-light text-white sm:text-4xl">
            This little surprise
            <br />
            has already had its moment.
          </h1>

          <p className="mt-5 text-sm leading-7 text-white/45">
            This birthday page may have expired or the link
            may not be valid.
          </p>
        </div>
      </main>
    );
  }

  return <RomanticBirthday config={config} />;
};

export default BirthdayPage;