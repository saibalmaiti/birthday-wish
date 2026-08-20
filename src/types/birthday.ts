export type BirthdayVersion = "ROMANTIC" | "FRIEND";

export type GalleryPhoto = {
  id: string;
  src: string;
  caption?: string;
  rotation: number;
};

export type OrderedGift = {
  type: "ORDER";

  message: string;
  revealMessage: string;

  orderId: string;
  expectedDeliveryDate: string;
};

export type GiftCard = {
  type: "GIFT_CARD";

  message: string;
  revealMessage: string;

  giftCardUrl?: string;
  giftCardCode?: string;
};

export type GiftConfig = OrderedGift | GiftCard;

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