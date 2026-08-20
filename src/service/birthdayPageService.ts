import { supabase } from "../lib/supabase";
import type { BirthdayConfig } from "../types/birthday";

type CreateBirthdayPageResult = {
  slug: string;
};

const generateSlug = () => {
  return crypto.randomUUID().replace(/-/g, "");
};

const getExpiresAt = (birthdayDate: string) => {
  const [year, month, day] = birthdayDate
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    throw new Error("Invalid birthday date.");
  }

  const birthday = new Date(
    year,
    month - 1,
    day,
    0,
    0,
    0,
    0
  );

  if (Number.isNaN(birthday.getTime())) {
    throw new Error("Invalid birthday date.");
  }

  // Keep the page active for the birthday
  // and the complete following day.
  //
  // Example:
  // Birthday: 21 Dec 2026
  // Expires: 23 Dec 2026 at 00:00
  const expiryDate = new Date(birthday);

  expiryDate.setDate(expiryDate.getDate() + 2);
  expiryDate.setHours(0, 0, 0, 0);

  return expiryDate.toISOString();
};

export const createBirthdayPage = async (
  config: BirthdayConfig
): Promise<CreateBirthdayPageResult> => {
  const slug = generateSlug();

  const expiresAt = getExpiresAt(
    config.birthdayDate
  );

  console.log("Creating birthday page:", {
    slug,
    birthdayDate: config.birthdayDate,
    expiresAt,
    now: new Date().toISOString(),
  });

  const { data, error } = await supabase
    .from("birthday_pages")
    .insert({
      slug,
      birthday_date: config.birthdayDate,
      config,
      expires_at: expiresAt,
    })
    .select("slug")
    .single();

  if (error) {
    console.error(
      "Failed to create birthday page:",
      error
    );

    throw new Error(
      "Could not create the birthday page. Please try again."
    );
  }

  if (!data?.slug) {
    throw new Error(
      "Birthday page was created but no share link was returned."
    );
  }

  return {
    slug: data.slug,
  };
};