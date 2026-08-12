Us, on the memory cards in Level 2.

Drop two square images in this folder, e.g.:
  her.png   — you
  him.png   — Adeesha

Then point src/data/config.js at them:
  avatarHer: '/avatars/her.png',
  avatarHim: '/avatars/him.png',

Square images (512x512 or so) look best — they're shown in a circle.
Bitmoji, Memoji, an avatar app export, or a tightly cropped photo all work.

If these stay null, or a file is missing, the game draws simple avatars
instead — nothing ever breaks.
