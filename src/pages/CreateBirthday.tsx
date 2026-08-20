import { useState } from "react";
import { motion } from "framer-motion";
import type { FormEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import type {
  BirthdayConfig,
  BirthdayVersion,
  GalleryPhoto,
  GiftConfig,
} from "../types/birthday";

import { createBirthdayPage } from "../service/birthdayPageService";

const MAX_PHOTOS = 6;

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

  const [preciousImageSrc, setPreciousImageSrc] =
    useState("");

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
    useState<GiftConfig["type"]>("ORDER");

  const [giftMessage, setGiftMessage] = useState(
    "I have one last thing for you."
  );

  const [
    giftRevealMessage,
    setGiftRevealMessage,
  ] = useState(
    "A little something is waiting for you. Hope it gives you one more reason to smile :)"
  );

  const [orderId, setOrderId] = useState("");

  const [
    expectedDeliveryDate,
    setExpectedDeliveryDate,
  ] = useState("");

  const [giftCardUrl, setGiftCardUrl] = useState("");

  const [giftCardCode, setGiftCardCode] = useState("");

  const [giftError, setGiftError] = useState("");

  // --------------------------------
  // Submission state
  // --------------------------------

  const [isValidatingImages, setIsValidatingImages] =
    useState(false);

  const [isCreating, setIsCreating] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  // --------------------------------
  // Gallery functions
  // --------------------------------

  const addPhoto = () => {
    if (photos.length >= MAX_PHOTOS) {
      return;
    }

    const newPhoto: GalleryPhoto = {
      id: crypto.randomUUID(),
      src: "",
      caption: "",
      rotation: getRandomRotation(),
    };

    setPhotos((previous) => [
      ...previous,
      newPhoto,
    ]);

    setGalleryError("");
  };

  const updatePhoto = (
    id: GalleryPhoto["id"],
    field: "src" | "caption",
    value: string
  ) => {
    setPhotos((previous) =>
      previous.map((photo) =>
        photo.id === id
          ? {
              ...photo,
              [field]: value,
            }
          : photo
      )
    );

    if (field === "src") {
      setGalleryError("");
    }
  };

  const removePhoto = (
    id: GalleryPhoto["id"]
  ) => {
    setPhotos((previous) =>
      previous.filter(
        (photo) => photo.id !== id
      )
    );

    setGalleryError("");
  };

  // --------------------------------
  // Image URL validation
  // --------------------------------

  const validateImageUrl = (
    url: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        const parsedUrl = new URL(url);

        if (
          parsedUrl.protocol !== "http:" &&
          parsedUrl.protocol !== "https:"
        ) {
          resolve(false);
          return;
        }

        const image = new Image();

        image.onload = () => {
          resolve(true);
        };

        image.onerror = () => {
          resolve(false);
        };

        image.src = url;
      } catch {
        resolve(false);
      }
    });
  };

  // --------------------------------
  // Gift functions
  // --------------------------------

  const handleAddGift = () => {
    setHasGift(true);
    setGiftError("");
  };

  const handleRemoveGift = () => {
    setHasGift(false);

    setOrderId("");
    setExpectedDeliveryDate("");
    setGiftCardUrl("");
    setGiftCardCode("");
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

    const emptyPhotoIndex = photos.findIndex(
      (photo) => !photo.src.trim()
    );

    if (emptyPhotoIndex !== -1) {
      setGalleryError(
        `Please enter an image URL for Photo ${
          emptyPhotoIndex + 1
        }.`
      );
      return;
    }

    // --------------------------------
    // Precious image validation
    // --------------------------------

    if (!preciousImageSrc.trim()) {
      setPreciousImageError(
        "Please add a photo for the precious thing."
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

      if (giftType === "ORDER") {
        if (!orderId.trim()) {
          setGiftError(
            "Please enter the order ID."
          );
          return;
        }

        if (!expectedDeliveryDate) {
          setGiftError(
            "Please select the expected delivery date."
          );
          return;
        }
      }

      if (giftType === "GIFT_CARD") {
        if (
          !giftCardUrl.trim() &&
          !giftCardCode.trim()
        ) {
          setGiftError(
            "Please provide either a gift card link or gift card code."
          );
          return;
        }
      }
    }

    // --------------------------------
    // Validate all images
    // --------------------------------

    setIsValidatingImages(true);

    try {
      const galleryValidationResults =
        await Promise.all(
          photos.map((photo) =>
            validateImageUrl(photo.src.trim())
          )
        );

      const invalidPhotoIndex =
        galleryValidationResults.findIndex(
          (isValid) => !isValid
        );

      if (invalidPhotoIndex !== -1) {
        setGalleryError(
          `Photo ${
            invalidPhotoIndex + 1
          } could not be loaded. Please make sure the image is publicly accessible and the URL points to an actual image.`
        );

        return;
      }

      const isPreciousImageValid =
        await validateImageUrl(
          preciousImageSrc.trim()
        );

      if (!isPreciousImageValid) {
        setPreciousImageError(
          "This image could not be loaded. Please make sure it is publicly accessible and the URL points to an actual image."
        );

        return;
      }
    } finally {
      setIsValidatingImages(false);
    }

    // --------------------------------
    // Build gift
    // --------------------------------

    let gift: GiftConfig | undefined;

    if (hasGift) {
      if (giftType === "ORDER") {
        gift = {
          type: "ORDER",
          message: giftMessage.trim(),
          revealMessage:
            giftRevealMessage.trim(),
          orderId: orderId.trim(),
          expectedDeliveryDate,
        };
      } else {
        gift = {
          type: "GIFT_CARD",
          message: giftMessage.trim(),
          revealMessage:
            giftRevealMessage.trim(),
          giftCardUrl:
            giftCardUrl.trim() || undefined,
          giftCardCode:
            giftCardCode.trim() || undefined,
        };
      }
    }

    // --------------------------------
    // Build config
    // --------------------------------

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
        photos,
      },

      preciousThing: {
        label: preciousLabel.trim(),
        thing: preciousThing.trim(),
        imageSrc: preciousImageSrc.trim(),
        compliment:
          preciousCompliment.trim(),
      },

      ...(gift ? { gift } : {}),
    };

    // --------------------------------
    // Save to Supabase
    // --------------------------------

    try {
      setIsCreating(true);
      setSubmitError("");

      const result = await createBirthdayPage(
        config
      );

      console.log(
        "Birthday surprise created:",
        result
      );

      navigate(`/created/${result.slug}`);
    } catch (error) {
      console.error(
        "Failed to create birthday surprise:",
        error
      );

      setSubmitError(
        "Something went wrong while creating the birthday surprise. Please try again."
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
                  Photo link instructions
                </p>

                <ul className="mt-2 space-y-1 text-xs leading-5 text-white/40">
                  <li>
                    • You need exactly 6 publicly accessible
                    photos.
                  </li>
                  <li>
                    • Use direct image URLs whenever possible.
                  </li>
                  <li>
                    • Google Drive or Google Photos images
                    must be shared publicly.
                  </li>
                  <li>
                    • Private or login-protected links will
                    not work.
                  </li>
                  <li>
                    • All images are checked before the
                    birthday surprise is created.
                  </li>
                </ul>
              </div>

              {galleryError && (
                <div className="mb-5 rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200">
                  {galleryError}
                </div>
              )}

              {photos.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/10 px-5 py-8 text-center">
                  <p className="text-sm text-white/35">
                    No photos added yet.
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

                      <div className="space-y-4">
                        <Input
                          label="Photo URL"
                          value={photo.src}
                          onChange={(value) =>
                            updatePhoto(
                              photo.id,
                              "src",
                              value
                            )
                          }
                          placeholder="https://..."
                          required
                        />

                        <Input
                          label="Caption (optional)"
                          value={
                            photo.caption || ""
                          }
                          onChange={(value) =>
                            updatePhoto(
                              photo.id,
                              "caption",
                              value
                            )
                          }
                          placeholder="Just a good picture."
                        />
                      </div>
                    </div>
                  )
                )}
              </div>

              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={addPhoto}
                  className="mt-6 w-full rounded-xl border border-pink-200/20 bg-pink-200/10 px-4 py-3 text-sm text-pink-100 transition hover:bg-pink-200/20"
                >
                  + Add photo (
                  {photos.length} / {MAX_PHOTOS})
                </button>
              )}

              {photos.length === MAX_PHOTOS && (
                <div className="mt-6 rounded-xl border border-green-400/10 bg-green-400/[0.04] px-4 py-3 text-center text-xs text-green-200/70">
                  All 6 photos have been added. They will be
                  checked when you create the surprise.
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
              <Input
                label="Photo URL"
                value={preciousImageSrc}
                onChange={(value) => {
                  setPreciousImageSrc(value);
                  setPreciousImageError("");
                }}
                placeholder="https://..."
                required
              />

              <p className="mt-2 text-xs leading-5 text-white/35">
                This photo is required and must be publicly
                accessible.
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
                Optional — add a physical gift or gift card.
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
                    label:
                      "Physical / ordered gift",
                    value: "ORDER",
                  },
                  {
                    label: "Gift card",
                    value: "GIFT_CARD",
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

              {giftType === "ORDER" && (
                <>
                  <Input
                    label="Order ID"
                    value={orderId}
                    onChange={setOrderId}
                    placeholder="Your order reference"
                    required
                  />

                  <Input
                    label="Expected delivery date"
                    type="date"
                    value={expectedDeliveryDate}
                    onChange={
                      setExpectedDeliveryDate
                    }
                    required
                  />
                </>
              )}

              {giftType === "GIFT_CARD" && (
                <>
                  <Input
                    label="Gift card link"
                    value={giftCardUrl}
                    onChange={setGiftCardUrl}
                    placeholder="https://..."
                  />

                  <Input
                    label="Gift card code"
                    value={giftCardCode}
                    onChange={setGiftCardCode}
                    placeholder="Optional code"
                  />

                  <p className="text-xs leading-5 text-white/35">
                    Add at least one: a gift card link or gift
                    card code.
                  </p>
                </>
              )}
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
            disabled={
              isValidatingImages || isCreating
            }
            whileHover={
              !isValidatingImages && !isCreating
                ? { scale: 1.02 }
                : undefined
            }
            whileTap={
              !isValidatingImages && !isCreating
                ? { scale: 0.98 }
                : undefined
            }
            className="w-full rounded-2xl bg-pink-200 px-6 py-4 text-sm font-medium text-[#2a1022] shadow-lg shadow-pink-400/20 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isValidatingImages
              ? "Checking your photos..."
              : isCreating
                ? "Creating your surprise..."
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