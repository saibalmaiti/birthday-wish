export type BirthdayVersion = "ROMANTIC" | "FRIEND";

export type GalleryPhoto = {
  id: string;
  src: string;
  caption?: string;
  rotation: number;
};

export type MyntraGiftCard = {
  type: "MYNTRA_GIFT_CARD";

  message: string;

  revealMessage: string;

  giftCardNumber: string;

  pin: string;

  addToAccountUrl?: string;

  cardImageSrc: string;
};

export type GiftConfig = MyntraGiftCard;

export type BirthdayConfig = {
  recipientName: string;

  version: BirthdayVersion;

  birthdayDate: string;

  intro: {
    eyebrow: string;
    titlePrefix: string;
    subtitle: string;
  };

  birthday: {
    happyText: string;
    title: string;
    message: string;
  };

  gallery: {
    heading: string;
    highlightedText: string;
    description: string;
    photos: GalleryPhoto[];
  };

  preciousThing: {
    label: string;
    thing: string;
    imageSrc: string;
    compliment: string;
  };

  gift?: GiftConfig;
};