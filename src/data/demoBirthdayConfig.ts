import type { BirthdayConfig } from "../types/birthday";

export const demoBirthdayConfig: BirthdayConfig = {
  recipientName: "Priya",
  version: "ROMANTIC",

  birthdayDate: "2026-08-24",

  intro: {
    eyebrow: "A little something for you",
    titlePrefix: "Hey",
    subtitle: "I have been keeping something special for you.",
  },

  birthday: {
    happyText: "HAPPY",
    title: "BIRTHDAY",
    message:
      "Another year of you. You've come through quite a lot this year, and I hope the days ahead feel a little lighter, a little kinder, and bring some good news your way. Here's to better days, new reasons to smile, and good things finding you when you least expect them.",
  },

  gallery: {
    heading: "A little gallery,",
    highlightedText: "just for today.",
    description: "A few pictures that deserved to be here.",

    photos: [
      {
        id: "1",
        src: "/images/photo-1.jpg",
        caption: "Just a good picture.",
        rotation: -3,
      },
      {
        id: "2",
        src: "/images/photo-2.jpg",
        caption: "This one deserved a frame.",
        rotation: 2,
      },
      {
        id: "3",
        src: "/images/photo-3.jpg",
        caption: "A little extra sunshine.",
        rotation: -2,
      },
      {
        id: "4",
        src: "/images/photo-4.jpg",
        caption: "Could not leave this one out.",
        rotation: 3,
      },
      {
        id: "5",
        src: "/images/photo-5.jpg",
        caption: "Just because.",
        rotation: -1,
      },
      {
        id: "6",
        src: "/images/photo-6.jpg",
        caption: "One more for the gallery.",
        rotation: 2,
      },
    ],
  },

  preciousThing: {
    label: "One thing I hope you never lose",
    thing: "smile",
    imageSrc: "/images/smile.jpg",
    compliment:
      "I like it because it feels completely real. It has this way of making everything around you seem a little lighter, and honestly, I think you should have more reasons to wear it.",
  },

  gift: {
    type: "ORDER",

    orderId: "YOUR_ORDER_ID",
    expectedDeliveryDate: "24 August",

    message: "I have one last thing for you.",

    revealMessage:
      "A little something is on its way. Hope it gives you one more reason to smile :)",
  },
};