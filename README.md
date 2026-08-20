# Birthday Surprise

A personalized interactive birthday surprise web application built with React, TypeScript, Framer Motion, and Supabase.

The application allows someone to create a custom birthday experience for another person, including personalized messages, a memory gallery, a "precious thing" section, and optionally a final gift reveal.

Each created surprise gets a unique shareable link that can be opened by the recipient.

---

## Features

### Personalized Birthday Experience

Each birthday page can contain:

- Recipient name
- Personalized introduction
- Birthday message and reveal
- Interactive gift acceptance screen
- Animated birthday reveal
- Memory gallery with 6 photos
- Photo captions
- Automatically assigned subtle photo rotations
- Personalized "most precious thing about you" section
- A featured photo
- Optional final gift reveal
- Unique shareable URL

---

## Birthday Flow

The recipient experiences the surprise in multiple phases.

### 1. Gift Acceptance

The first screen introduces the surprise.

The recipient sees:

- Intro eyebrow text
- Personalized title
- Recipient name
- Intro subtitle
- Gift acceptance interaction

After accepting the surprise, the birthday reveal begins.

---

### 2. Birthday Reveal

The birthday message is displayed with animations.

Once completed, the user continues to the memory section.

---

### 3. Memory Gallery

The memory section displays six uploaded/shared photos.

Features include:

- Polaroid-style photo cards
- Hanging string design
- Photo clips
- Individual captions
- Subtle predefined rotations
- Continuous gentle animation
- Scroll-based entrance animations

The photo rotation is stored in the configuration but is automatically assigned by the application rather than manually entered by the user.

Only subtle rotation values are used to keep the gallery visually natural.

---

### 4. Scroll Transition

A transition section guides the recipient from the memory gallery to the next personalized section.

---

### 5. The Precious Thing

This section highlights something special about the recipient.

It contains:

- A label
- The thing being highlighted
- A personalized compliment/message
- A featured image
- Recipient name

Example:

> The most precious thing about you is your smile.

The featured image is displayed in an animated polaroid-style frame.

---

### 6. Optional Final Gift

A gift is completely optional.

If a gift has been configured, the recipient sees:

> One last thing 🎁

Clicking the button reveals the final gift section.

If no gift exists:

- The button is not displayed
- No empty gift section is shown
- The birthday experience ends after the Precious Thing section

Supported gift types currently include:

- Ordered gift
- Gift card

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Framer Motion
- Tailwind CSS

## Backend / Database

- Supabase
- PostgreSQL
- Supabase Row Level Security

---

# Project Structure

```text
src/
│
├── components/
│   └── romantic/
│       ├── AcceptGift.tsx
│       ├── BirthdayReveal.tsx
│       ├── MemoryGallery.tsx
│       ├── ScrollTransition.tsx
│       ├── PreciousThing.tsx
│       └── FinalGift.tsx
│
├── lib/
│   └── supabase.ts
│
├── pages/
│   ├── CreateBirthday.tsx
│   ├── BirthdayPage.tsx
│   └── CreatedBirthday.tsx
│
├── services/
│   └── birthdayPageService.ts
│
├── types/
│   └── birthday.ts
│
├── birthday/
│   └── RomanticBirthday.tsx
│
├── App.tsx
└── main.tsx