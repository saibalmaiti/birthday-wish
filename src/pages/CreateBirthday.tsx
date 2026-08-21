import { useState } from "react";
import { motion } from "framer-motion";
import type {
  ChangeEvent,
  FormEvent,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import type {
  BirthdayConfig,
  BirthdayVersion,
  GalleryPhoto,
  GiftConfig,
} from "../types/birthday";

import {
  createBirthdayPage,
  generateBirthdaySlug,
  uploadBirthdayImages,
} from "../service/birthdayPageService";

const MAX_PHOTOS = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const ALLOWED_ROTATIONS = [-3, -2, -1, 1, 2, 3];

const getRandomRotation = (): number => {
  const randomIndex = Math.floor(
    Math.random() * ALLOWED_ROTATIONS.length
  );

  return ALLOWED_ROTATIONS[randomIndex];
};

const CreateBirthday = () => {
  const navigate = useNavigate();

  // --------------------------------
  // Basic details
  // --------------------------------

  const [recipientName, setRecipientName] = useState("");

  const [version, setVersion] =
    useState<BirthdayVersion>("ROMANTIC");

  const [birthdayDate, setBirthdayDate] = useState("");

  // --------------------------------
  // Intro
  // --------------------------------

  const [introEyebrow, setIntroEyebrow] = useState(
    "A little something for you"
  );

  const [introTitlePrefix, setIntroTitlePrefix] =
    useState("Hey");

  const [introSubtitle, setIntroSubtitle] = useState(
    "I have been keeping something special for you."
  );

  // --------------------------------
  // Birthday reveal
  // --------------------------------

  const [happyText, setHappyText] = useState("HAPPY");

  const [birthdayTitle, setBirthdayTitle] =
    useState("BIRTHDAY");

  const [birthdayMessage, setBirthdayMessage] =
    useState(
      "Another year of you. You have come through a lot this year, and I hope the days ahead are kinder, lighter, and full of some really good news coming your way."
    );

  // --------------------------------
  // Gallery
  // --------------------------------

  const [galleryHeading, setGalleryHeading] =
    useState("A little gallery,");

  const [
    galleryHighlightedText,
    setGalleryHighlightedText,
  ] = useState("just for today.");

  const [galleryDescription, setGalleryDescription] =
    useState(
      "A few pictures that deserved to be here."
    );

  const [photos, setPhotos] = useState<GalleryPhoto[]>(
    []
  );

  const [galleryFiles, setGalleryFiles] = useState<
    File[]
  >([]);

  const [galleryError, setGalleryError] =
    useState("");

  // --------------------------------
  // Precious thing
  // --------------------------------

  const [preciousLabel, setPreciousLabel] = useState(
    "One thing I hope you never lose"
  );

  const [preciousThing, setPreciousThing] =
    useState("smile");

  const [
    preciousImageFile,
    setPreciousImageFile,
  ] = useState<File | null>(null);

  const [
    preciousImagePreview,
    setPreciousImagePreview,
  ] = useState("");

  const [
    preciousImageError,
    setPreciousImageError,
  ] = useState("");

  const [
    preciousCompliment,
    setPreciousCompliment,
  ] = useState(
    "I like it because it feels completely real. It has this way of making everything around you seem a little lighter, and honestly, I think you should have more reasons to wear it."
  );

  // --------------------------------
  // Optional Gift
  // --------------------------------

  const [hasGift, setHasGift] = useState(false);

  const [giftType, setGiftType] =
    useState<GiftConfig["type"]>(
      "MYNTRA_GIFT_CARD"
    );

  const [giftMessage, setGiftMessage] = useState(
    "I have one last thing for you."
  );

  const [
    giftRevealMessage,
    setGiftRevealMessage,
  ] = useState(
    "A little something is waiting for you. Hope it gives you one more reason to smile :)"
  );

  const [
    giftCardNumber,
    setGiftCardNumber,
  ] = useState("");

  const [giftCardPin, setGiftCardPin] =
    useState("");

  const [
    addToAccountUrl,
    setAddToAccountUrl,
  ] = useState("");

  const [
    giftCardImageFile,
    setGiftCardImageFile,
  ] = useState<File | null>(null);

  const [
    giftCardImagePreview,
    setGiftCardImagePreview,
  ] = useState("");

  const [
    giftCardImageError,
    setGiftCardImageError,
  ] = useState("");

  const [giftError, setGiftError] = useState("");

  // --------------------------------
  // Submission state
  // --------------------------------

  const [isCreating, setIsCreating] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  // --------------------------------
  // File validation
  // --------------------------------

  const validateImageFile = (
    file: File
  ): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Only JPEG, PNG and WebP images are supported.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Each image must be smaller than 5 MB.";
    }

    return null;
  };

  // --------------------------------
  // Gallery functions
  // --------------------------------

  const handleGalleryFilesChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (!selectedFiles.length) {
      return;
    }

    const remainingSlots =
      MAX_PHOTOS - photos.length;

    if (selectedFiles.length > remainingSlots) {
      setGalleryError(
        `You can upload only ${remainingSlots} more photo${
          remainingSlots === 1 ? "" : "s"
        }.`
      );

      event.target.value = "";
      return;
    }

    for (const file of selectedFiles) {
      const validationError =
        validateImageFile(file);

      if (validationError) {
        setGalleryError(
          `${file.name}: ${validationError}`
        );

        event.target.value = "";
        return;
      }
    }

    const newPhotos: GalleryPhoto[] =
      selectedFiles.map((file) => ({
        id: crypto.randomUUID(),
        src: URL.createObjectURL(file),
        caption: "",
        rotation: getRandomRotation(),
      }));

    setPhotos((previous) => [
      ...previous,
      ...newPhotos,
    ]);

    setGalleryFiles((previous) => [
      ...previous,
      ...selectedFiles,
    ]);

    setGalleryError("");

    event.target.value = "";
  };

  const updatePhotoCaption = (
    id: GalleryPhoto["id"],
    caption: string
  ) => {
    setPhotos((previous) =>
      previous.map((photo) =>
        photo.id === id
          ? {
              ...photo,
              caption,
            }
          : photo
      )
    );
  };

  const removePhoto = (
    id: GalleryPhoto["id"]
  ) => {
    const photoIndex = photos.findIndex(
      (photo) => photo.id === id
    );

    if (photoIndex === -1) {
      return;
    }

    const removedPhoto = photos[photoIndex];

    if (removedPhoto.src.startsWith("blob:")) {
      URL.revokeObjectURL(removedPhoto.src);
    }

    setPhotos((previous) =>
      previous.filter((photo) => photo.id !== id)
    );

    setGalleryFiles((previous) =>
      previous.filter(
        (_, index) => index !== photoIndex
      )
    );

    setGalleryError("");
  };

  // --------------------------------
  // Precious image
  // --------------------------------

  const handlePreciousImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError =
      validateImageFile(file);

    if (validationError) {
      setPreciousImageError(validationError);
      event.target.value = "";
      return;
    }

    if (preciousImagePreview) {
      URL.revokeObjectURL(
        preciousImagePreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setPreciousImageFile(file);
    setPreciousImagePreview(previewUrl);
    setPreciousImageError("");

    event.target.value = "";
  };

  // --------------------------------
  // Gift functions
  // --------------------------------

  const handleAddGift = () => {
    setHasGift(true);
    setGiftError("");
  };

  const handleGiftCardImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError =
      validateImageFile(file);

    if (validationError) {
      setGiftCardImageError(validationError);
      event.target.value = "";
      return;
    }

    if (giftCardImagePreview) {
      URL.revokeObjectURL(
        giftCardImagePreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setGiftCardImageFile(file);
    setGiftCardImagePreview(previewUrl);
    setGiftCardImageError("");

    event.target.value = "";
  };

  const handleRemoveGift = () => {
    setHasGift(false);

    setGiftCardNumber("");
    setGiftCardPin("");
    setAddToAccountUrl("");

    if (giftCardImagePreview) {
      URL.revokeObjectURL(
        giftCardImagePreview
      );
    }

    setGiftCardImageFile(null);
    setGiftCardImagePreview("");
    setGiftCardImageError("");
    setGiftError("");
  };

  // --------------------------------
  // Submit
  // --------------------------------

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setGalleryError("");
    setPreciousImageError("");
    setGiftError("");
    setGiftCardImageError("");
    setSubmitError("");

    // --------------------------------
    // Basic validation
    // --------------------------------

    if (!recipientName.trim()) {
      setSubmitError(
        "Please enter the recipient's name."
      );
      return;
    }

    if (!birthdayDate) {
      setSubmitError(
        "Please select the birthday date."
      );
      return;
    }

    // --------------------------------
    // Gallery validation
    // --------------------------------

    if (photos.length !== MAX_PHOTOS) {
      setGalleryError(
        `Please add exactly ${MAX_PHOTOS} photos to continue.`
      );
      return;
    }

    if (galleryFiles.length !== MAX_PHOTOS) {
      setGalleryError(
        "Please select all 6 photos again."
      );
      return;
    }

    // --------------------------------
    // Precious image validation
    // --------------------------------

    if (!preciousImageFile) {
      setPreciousImageError(
        "Please select a photo for the precious thing."
      );
      return;
    }

    // --------------------------------
    // Gift validation
    // --------------------------------

    if (hasGift) {
      if (!giftMessage.trim()) {
        setGiftError(
          "Please add a gift introduction message."
        );
        return;
      }

      if (!giftRevealMessage.trim()) {
        setGiftError(
          "Please add a gift reveal message."
        );
        return;
      }

      if (!giftCardNumber.trim()) {
        setGiftError(
          "Please enter the Myntra gift card number."
        );
        return;
      }

      if (!giftCardPin.trim()) {
        setGiftError(
          "Please enter the Myntra gift card PIN."
        );
        return;
      }

      if (!giftCardImageFile) {
        setGiftCardImageError(
          "Please upload the Myntra gift card image."
        );
        return;
      }

      if (addToAccountUrl.trim()) {
        try {
          const parsedUrl = new URL(
            addToAccountUrl.trim()
          );

          if (
            parsedUrl.protocol !== "https:" &&
            parsedUrl.protocol !== "http:"
          ) {
            throw new Error();
          }
        } catch {
          setGiftError(
            "Please enter a valid Add to Account URL."
          );
          return;
        }
      }
    }

    // --------------------------------
    // Upload and create
    // --------------------------------

    try {
      setIsCreating(true);
      setSubmitError("");

      const slug = generateBirthdaySlug();

      const {
        galleryPhotos,
        preciousImageSrc,
        giftCardImageSrc,
      } = await uploadBirthdayImages(
        slug,
        photos,
        galleryFiles,
        preciousImageFile,
        hasGift
          ? giftCardImageFile || undefined
          : undefined
      );

      let gift: GiftConfig | undefined;

      if (hasGift) {
        if (!giftCardImageSrc) {
          throw new Error(
            "Failed to upload the Myntra gift card image."
          );
        }

        gift = {
          type: "MYNTRA_GIFT_CARD",
          message: giftMessage.trim(),
          revealMessage:
            giftRevealMessage.trim(),
          giftCardNumber:
            giftCardNumber.trim(),
          pin: giftCardPin.trim(),
          addToAccountUrl:
            addToAccountUrl.trim() || undefined,
          cardImageSrc: giftCardImageSrc,
        };
      }

      const config: BirthdayConfig = {
        recipientName: recipientName.trim(),
        version,
        birthdayDate,

        intro: {
          eyebrow: introEyebrow.trim(),
          titlePrefix: introTitlePrefix.trim(),
          subtitle: introSubtitle.trim(),
        },

        birthday: {
          happyText: happyText.trim(),
          title: birthdayTitle.trim(),
          message: birthdayMessage.trim(),
        },

        gallery: {
          heading: galleryHeading.trim(),
          highlightedText:
            galleryHighlightedText.trim(),
          description:
            galleryDescription.trim(),
          photos: galleryPhotos,
        },

        preciousThing: {
          label: preciousLabel.trim(),
          thing: preciousThing.trim(),
          imageSrc: preciousImageSrc,
          compliment:
            preciousCompliment.trim(),
        },

        ...(gift ? { gift } : {}),
      };

      const result = await createBirthdayPage(
        config,
        slug
      );

      navigate(`/created/${result.slug}`);
    } catch (error) {
      console.error(
        "Failed to create birthday surprise:",
        error
      );

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the birthday surprise. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="min-h-screen px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mb-12 text-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-pink-200/60">
            Create a surprise
          </p>

          <h1 className="mt-4 text-3xl font-light text-white sm:text-5xl">
            Make their birthday
            <br />
            <span className="italic text-pink-200">
              a little more special.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/50">
            Fill in the details and create a personalised
            birthday experience they can open through a
            simple link.
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic details */}

          <FormSection title="Basic details">
            <Input
              label="Their name"
              value={recipientName}
              onChange={setRecipientName}
              placeholder="Priya"
              required
            />

            <Input
              label="Birthday date"
              type="date"
              value={birthdayDate}
              onChange={setBirthdayDate}
              required
            />

            <Select
              label="Version"
              value={version}
              onChange={(value) =>
                setVersion(
                  value as BirthdayVersion
                )
              }
              options={[
                {
                  label: "Romantic",
                  value: "ROMANTIC",
                },
                {
                  label: "Friend",
                  value: "FRIEND",
                },
              ]}
            />
          </FormSection>

          {/* First page */}

          <FormSection title="First page">
            <Input
              label="Small heading"
              value={introEyebrow}
              onChange={setIntroEyebrow}
            />

            <Input
              label="Greeting"
              value={introTitlePrefix}
              onChange={setIntroTitlePrefix}
            />

            <TextArea
              label="Intro message"
              value={introSubtitle}
              onChange={setIntroSubtitle}
            />
          </FormSection>

          {/* Birthday message */}

          <FormSection title="Birthday message">
            <Input
              label="Top text"
              value={happyText}
              onChange={setHappyText}
            />

            <Input
              label="Main title"
              value={birthdayTitle}
              onChange={setBirthdayTitle}
            />

            <TextArea
              label="Birthday message"
              value={birthdayMessage}
              onChange={setBirthdayMessage}
            />
          </FormSection>

          {/* Photo gallery */}

          <FormSection title="Photo gallery">
            <Input
              label="Heading"
              value={galleryHeading}
              onChange={setGalleryHeading}
            />

            <Input
              label="Highlighted text"
              value={galleryHighlightedText}
              onChange={
                setGalleryHighlightedText
              }
            />

            <TextArea
              label="Description"
              value={galleryDescription}
              onChange={setGalleryDescription}
            />

            <div className="border-t border-white/10 pt-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-white/70">
                    Gallery photos
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/40">
                    Add exactly 6 photos. Each photo will
                    automatically receive a subtle
                    Instax-style rotation.
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-pink-100/70">
                  {photos.length} / {MAX_PHOTOS}
                </span>
              </div>

              <div className="mb-6 rounded-xl border border-pink-200/10 bg-pink-200/[0.04] p-4">
                <p className="text-xs font-medium text-pink-100">
                  Upload photos
                </p>

                <p className="mt-2 text-xs leading-5 text-white/40">
                  Select exactly 6 photos from your device.
                  JPEG, PNG and WebP images up to 5 MB are
                  supported.
                </p>
              </div>

              {galleryError && (
                <div className="mb-5 rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200">
                  {galleryError}
                </div>
              )}

              {photos.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/10 px-5 py-8 text-center">
                  <p className="text-sm text-white/35">
                    No photos selected yet.
                  </p>

                  <p className="mt-2 text-xs text-white/25">
                    You need exactly 6 photos.
                  </p>
                </div>
              )}

              <div className="space-y-5">
                {photos.map(
                  (photo, index) => (
                    <div
                      key={photo.id}
                      className="rounded-2xl border border-white/10 bg-black/10 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-pink-100">
                          Photo {index + 1}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            removePhoto(photo.id)
                          }
                          className="text-xs text-white/35 transition hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>

                      <img
                        src={photo.src}
                        alt={`Preview ${index + 1}`}
                        className="mb-4 h-48 w-full rounded-xl object-cover"
                      />

                      <Input
                        label="Caption (optional)"
                        value={photo.caption || ""}
                        onChange={(value) =>
                          updatePhotoCaption(
                            photo.id,
                            value
                          )
                        }
                        placeholder="Just a good picture."
                      />
                    </div>
                  )
                )}
              </div>

              {photos.length < MAX_PHOTOS && (
                <label className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-xl border border-pink-200/20 bg-pink-200/10 px-4 py-3 text-sm text-pink-100 transition hover:bg-pink-200/20">
                  + Select photo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={
                      handleGalleryFilesChange
                    }
                    className="hidden"
                  />
                </label>
              )}

              {photos.length === MAX_PHOTOS && (
                <div className="mt-6 rounded-xl border border-green-400/10 bg-green-400/[0.04] px-4 py-3 text-center text-xs text-green-200/70">
                  All 6 photos have been selected and are
                  ready to upload.
                </div>
              )}
            </div>
          </FormSection>

          {/* Precious thing */}

          <FormSection title="The precious thing">
            <Input
              label="Small heading"
              value={preciousLabel}
              onChange={setPreciousLabel}
            />

            <Input
              label="The thing"
              value={preciousThing}
              onChange={setPreciousThing}
              placeholder="smile"
            />

            <div>
              <label className="block">
                <span className="mb-2 block text-sm text-white/60">
                  Photo
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handlePreciousImageChange
                  }
                  className="block w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-pink-200/10 file:px-3 file:py-2 file:text-sm file:text-pink-100"
                />
              </label>

              {preciousImagePreview && (
                <img
                  src={preciousImagePreview}
                  alt="Precious thing preview"
                  className="mt-4 h-56 w-full rounded-xl object-cover"
                />
              )}

              <p className="mt-2 text-xs leading-5 text-white/35">
                Select a JPEG, PNG or WebP image up to 5 MB.
              </p>

              {preciousImageError && (
                <p className="mt-2 text-xs leading-5 text-red-200">
                  {preciousImageError}
                </p>
              )}
            </div>

            <TextArea
              label="Why do you like it?"
              value={preciousCompliment}
              onChange={setPreciousCompliment}
            />
          </FormSection>

          {/* Optional Gift */}

          {!hasGift ? (
            <motion.button
              type="button"
              onClick={handleAddGift}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full flex-col items-center justify-center rounded-3xl border border-dashed border-pink-200/20 bg-pink-200/[0.04] px-6 py-8 text-center transition hover:bg-pink-200/[0.08]"
            >
              <span className="text-3xl">
                🎁
              </span>

              <span className="mt-3 text-sm text-pink-100">
                Add a final gift
              </span>

              <span className="mt-1 text-xs text-white/40">
                Optional — add a gift card surprise.
              </span>
            </motion.button>
          ) : (
            <FormSection title="Final gift 🎁">
              <div className="flex items-start justify-between gap-5">
                <p className="text-sm leading-6 text-white/45">
                  This is optional and will appear as the
                  final reveal.
                </p>

                <button
                  type="button"
                  onClick={handleRemoveGift}
                  className="shrink-0 text-xs text-white/40 transition hover:text-red-300"
                >
                  Remove gift
                </button>
              </div>

              {giftError && (
                <div className="rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-3 text-sm text-red-200">
                  {giftError}
                </div>
              )}

              <Select
                label="Gift type"
                value={giftType}
                onChange={(value) => {
                  setGiftType(
                    value as GiftConfig["type"]
                  );
                  setGiftError("");
                }}
                options={[
                  {
                    label: "Myntra Gift Card",
                    value: "MYNTRA_GIFT_CARD",
                  },
                ]}
              />

              <TextArea
                label="Gift introduction"
                value={giftMessage}
                onChange={setGiftMessage}
              />

              <TextArea
                label="Gift reveal message"
                value={giftRevealMessage}
                onChange={setGiftRevealMessage}
              />

              <Input
                label="Myntra gift card number"
                value={giftCardNumber}
                onChange={setGiftCardNumber}
                placeholder="Enter gift card number"
                required
              />

              <Input
                label="Myntra gift card PIN"
                value={giftCardPin}
                onChange={setGiftCardPin}
                placeholder="Enter PIN"
                required
              />

              <Input
                label="Add to Account link (optional)"
                value={addToAccountUrl}
                onChange={setAddToAccountUrl}
                placeholder="Paste the ADD TO ACCOUNT link from the Myntra email"
              />

              <p className="text-xs leading-5 text-white/35">
                If available, copy the complete ADD TO ACCOUNT
                link from the Myntra gift card email.
              </p>

              <div>
                <label className="block">
                  <span className="mb-2 block text-sm text-white/60">
                    Myntra gift card image
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleGiftCardImageChange
                    }
                    className="block w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-pink-200/10 file:px-3 file:py-2 file:text-sm file:text-pink-100"
                  />
                </label>

                {giftCardImagePreview && (
                  <img
                    src={giftCardImagePreview}
                    alt="Myntra gift card preview"
                    className="mt-4 max-h-80 w-full rounded-xl object-contain"
                  />
                )}

                <p className="mt-2 text-xs leading-5 text-white/35">
                  Upload the gift card image received from
                  Myntra. JPEG, PNG and WebP images up to 5 MB
                  are supported.
                </p>

                {giftCardImageError && (
                  <p className="mt-2 text-xs leading-5 text-red-200">
                    {giftCardImageError}
                  </p>
                )}
              </div>
            </FormSection>
          )}

          {/* Submission error */}

          {submitError && (
            <div className="rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-3 text-center text-sm leading-6 text-red-200">
              {submitError}
            </div>
          )}

          {/* Submit */}

          <motion.button
            type="submit"
            disabled={isCreating}
            whileHover={
              !isCreating
                ? { scale: 1.02 }
                : undefined
            }
            whileTap={
              !isCreating
                ? { scale: 0.98 }
                : undefined
            }
            className="w-full rounded-2xl bg-pink-200 px-6 py-4 text-sm font-medium text-[#2a1022] shadow-lg shadow-pink-400/20 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating
              ? "Uploading photos and creating..."
              : "Create birthday surprise →"}
          </motion.button>
        </form>
      </div>
    </main>
  );
};

// --------------------------------
// Form Section
// --------------------------------

type FormSectionProps = {
  title: string;
  children: ReactNode;
};

const FormSection = ({
  title,
  children,
}: FormSectionProps) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-7">
      <h2 className="mb-6 text-lg font-light text-pink-100">
        {title}
      </h2>

      <div className="space-y-5">
        {children}
      </div>
    </section>
  );
};

// --------------------------------
// Input
// --------------------------------

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: InputProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/60">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-pink-200/40"
      />
    </label>
  );
};

// --------------------------------
// TextArea
// --------------------------------

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
}: TextAreaProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/60">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-pink-200/40"
      />
    </label>
  );
};

// --------------------------------
// Select
// --------------------------------

type SelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    label: string;
    value: string;
  }[];
};

const Select = ({
  label,
  value,
  onChange,
  options,
}: SelectProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/60">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-white/10 bg-[#1b0d18] px-4 py-3 text-sm text-white outline-none focus:border-pink-200/40"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default CreateBirthday;