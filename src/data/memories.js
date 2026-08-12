/**
 * Photo gallery memories.
 *
 * HOW TO ADD PHOTOS
 * 1. Drop your images into the folder:  public/photos/
 * 2. Name each file exactly as listed in `src` below (lowercase, .jpg).
 * 3. That's it — no code changes needed.
 *
 * Expected filenames:
 *   public/photos/first-smile.jpg
 *   public/photos/across-the-distance.jpg
 *   public/photos/adventures.jpg
 *   public/photos/your-laugh.jpg
 *   public/photos/how-far-we-came.jpg
 *   public/photos/still-choosing-you.jpg
 *
 * Any photo you haven't added yet quietly falls back to the gradient card.
 * Tip: portrait crops (4:5) look best — e.g. 1080 x 1350.
 */
export const memories = [
  {
    id: 1,
    title: 'Our first smile',
    caption: "The little moment that started a story neither of us knew we'd be writing.",
    src: '/photos/first-smile.jpg',
    accent: '#3A2A35',
  },
  {
    id: 2,
    title: 'Across the distance',
    caption: 'Miles between us, but somehow you always felt close to my heart.',
    src: '/photos/across-the-distance.jpg',
    accent: '#2A3340',
  },
  {
    id: 3,
    title: 'Adventures together',
    caption: 'Every place was more special simply because I was there with you.',
    src: '/photos/adventures.jpg',
    accent: '#243248',
  },
  {
    id: 4,
    title: 'Your laugh',
    caption: 'The sound I could never get tired of hearing.',
    src: '/photos/your-laugh.jpg',
    accent: '#342830',
  },
  {
    id: 5,
    title: 'How far we came',
    caption: 'From two people with a little beginning to a love that became our whole world.',
    src: '/photos/how-far-we-came.jpg',
    accent: '#2E2A28',
  },
  {
    id: 6,
    title: 'Still choosing you',
    caption: "After every moment, every mile, and every year — I'd still choose you. 🤍",
    src: '/photos/still-choosing-you.jpg',
    accent: '#3A2832',
  },
];
