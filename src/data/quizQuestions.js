/**
 * Level 2 — Memory Challenge questions.
 * Edit freely: add/remove questions, change options, or update answers.
 * `correctIndex` is the 0-based index of the right option.
 * Optional `memory` unlocks after a correct answer (photo + caption).
 */
export const quizQuestions = [
  {
    id: 1,
    question: 'Where did we first meet?',
    options: ['University', 'School', 'A coffee shop', 'Online'],
    correctIndex: 1,
    memory: {
      title: 'The beginning',
      text: 'From school desks to forever — that first hello still makes my heart smile.',
      // Add a photo path like "/photos/first-meet.jpg" or leave null for a styled placeholder
      photo: null,
    },
  },
  {
    id: 2,
    question: 'How long have we been together?',
    options: [
      'About 2 years',
      'More than 6 years',
      'Just 1 year',
      'Almost 4 years',
    ],
    correctIndex: 1,
    memory: {
      title: 'Our timeline',
      text: 'More than 6 years of love, laughter, and choosing each other — and still my favorite story.',
      photo: null,
    },
  },
  {
    id: 3,
    question: 'Which country are you currently working in?',
    options: ['Sri Lanka', 'Australia', 'Japan', 'Singapore'],
    correctIndex: 2,
    memory: {
      title: 'Miles apart, hearts together',
      text: 'Japan may have you for work, but my heart travels with you every day.',
      photo: null,
    },
  },
  {
    id: 4,
    question: 'Who is making this special birthday surprise?',
    options: ['A secret admirer', 'Your fiancé ❤️', 'Your friends', 'Santa Claus'],
    correctIndex: 1,
    memory: {
      title: 'Made with love',
      text: 'Built with late nights, soft music, and so much love — just for you.',
      photo: null,
    },
  },
];
