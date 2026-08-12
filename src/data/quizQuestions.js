/**
 * Level 2 — Memory Challenge questions.
 * Edit freely: add/remove questions, change options, or update answers.
 *
 * TWO KINDS OF QUESTION
 * 1. `anyAnswer: true`  — every option is accepted and unlocks the memory.
 *    Use this for reflective questions where there is no wrong answer.
 * 2. `correctIndex: n`  — only option n is accepted (0-based); anything else
 *    shows "Not quite — try again". Use this when there IS a right answer.
 *
 * Optional `memory` unlocks after an accepted answer, as a popup over the
 * question. No photo needed — the card shows the two of us (see avatarHer /
 * avatarHim in src/data/config.js) over a soft animated backdrop.
 * Add `photo: '/photos/name.jpg'` only if you'd rather show a real picture.
 */
export const quizQuestions = [
  {
    id: 1,
    question: 'Where was our first photo together taken?',
    options: [
      'At school, where it all started',
      'At home, on the sofa',
      'On one of our little trips',
      'In the car, on the way to somewhere',
    ],
    correctIndex: 3,
    memory: {
      title: 'Our first frame',
      text: 'In the car, on the way to somewhere. Not planned, not posed — and I still have it saved.',
      photo: null,
    },
  },
  {
    id: 2,
    question: 'What was our first trip together?',
    options: [
      'Our first beach day',
      'A little road trip',
      'The one we planned for weeks',
      'The one we decided on in a second',
    ],
    correctIndex: 3,
    memory: {
      title: 'Just the two of us',
      text: 'No planning, no packing list — we just decided and went. The whole world shrank down to you, me, and a bag of snacks.',
      photo: null,
    },
  },
  {
    id: 3,
    question: 'What nickname do I call you the most?',
    options: ['Babe', 'Sudu', 'My love', 'Manika'],
    // Trick question — every one of them is right.
    anyAnswer: true,
    memory: {
      title: 'All of them',
      text: 'Babe, Sudu, my love, Manika — you answer to all of them, and every one of them means the same thing.',
      photo: null,
    },
  },
  {
    id: 4,
    question: 'What is one word that describes us?',
    options: ['Home', 'Forever', 'Ours', 'Soulmates'],
    anyAnswer: true,
    memory: {
      title: 'One word',
      text: 'Whichever one you picked — I would have picked it too.',
      photo: null,
    },
  },
  {
    id: 5,
    question: 'What is one thing you want us to do together on your next birthday?',
    options: [
      'Wake up in the same city',
      'A trip, just the two of us',
      'A quiet dinner at home',
      'Whatever it is — as husband and wife',
    ],
    anyAnswer: true,
    memory: {
      title: 'Next year',
      text: 'Hold that thought. Next birthday, it is my job to make it happen.',
      photo: null,
    },
  },
  {
    id: 6,
    question: 'After all these memories, who would you choose again?',
    options: [
      'Mmm, let me think about it',
      'You. Obviously 😌❤️',
      'Ask me tomorrow',
      'I plead the fifth',
    ],
    correctIndex: 1,
    memory: {
      title: 'Correct answer, always',
      text: 'Me. Obviously. 😌❤️ And I would choose you again too — every single time, without thinking about it.',
      photo: null,
    },
  },
];
