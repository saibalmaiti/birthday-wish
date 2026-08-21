import { supabase } from "../lib/supabase";
import type {
  BirthdayConfig,
  GalleryPhoto,
} from "../types/birthday";

type CreateBirthdayPageResult = {
  slug: string;
};

type UploadedBirthdayImages = {
  galleryPhotos: GalleryPhoto[];
  preciousImageSrc: string;
  giftCardImageSrc?: string;
};

const STORAGE_BUCKET = "birthday-images";

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
  const expiryDate = new Date(birthday);

  expiryDate.setDate(expiryDate.getDate() + 2);
  expiryDate.setHours(0, 0, 0, 0);

  return expiryDate.toISOString();
};

const getFileExtension = (file: File) => {
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  if (!extension) {
    throw new Error(
      `Could not determine the file type for ${file.name}.`
    );
  }

  return extension;
};

const uploadFile = async (
  slug: string,
  folder: string,
  file: File,
  fileName: string
): Promise<string> => {
  const extension = getFileExtension(file);

  const filePath =
    `${slug}/${folder}/${fileName}.${extension}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Failed to upload image:", {
      message: error.message,
      name: error.name,
      cause: error.cause,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      filePath,
    });

    throw new Error(
      `Failed to upload ${file.name}: ${error.message}`
    );
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const uploadBirthdayImages = async (
  slug: string,
  galleryPhotos: GalleryPhoto[],
  galleryFiles: File[],
  preciousImageFile: File,
  giftCardImageFile?: File
): Promise<UploadedBirthdayImages> => {
  if (galleryPhotos.length !== galleryFiles.length) {
    throw new Error(
      "Photo data does not match the selected files."
    );
  }

  const uploadedGalleryPhotos = await Promise.all(
    galleryPhotos.map(async (photo, index) => {
      const publicUrl = await uploadFile(
        slug,
        "gallery",
        galleryFiles[index],
        `photo-${index + 1}`
      );

      return {
        ...photo,
        src: publicUrl,
      };
    })
  );

  const preciousImageSrc = await uploadFile(
    slug,
    "precious",
    preciousImageFile,
    "precious"
  );

  let giftCardImageSrc: string | undefined;

  if (giftCardImageFile) {
    giftCardImageSrc = await uploadFile(
      slug,
      "gift",
      giftCardImageFile,
      "myntra-card"
    );
  }

  return {
    galleryPhotos: uploadedGalleryPhotos,
    preciousImageSrc,
    giftCardImageSrc,
  };
};

export const createBirthdayPage = async (
  config: BirthdayConfig,
  slug: string
): Promise<CreateBirthdayPageResult> => {
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

export const generateBirthdaySlug = () => {
  return generateSlug();
};