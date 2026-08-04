/**
 * Site-wide personalization settings.
 * Edit these values to customize the birthday quest.
 */
export const siteConfig = {
  projectName: 'A Birthday to Remember',
  // Shown under the title on the password gate
  projectTagline: 'For Adeesha, with all my love',

  // Welcome hero, after login. Kept as two lines: a quiet greeting in italics
  // over the big foil-stamped line.
  heroGreeting: 'Well hello,',
  heroTitle: 'Birthday Boy',
  recipientName: 'Adeesha',
  creatorName: 'Your fiancé',

  // Password shown before entering the experience (case-insensitive).
  // Tip: use your special date, e.g. "14-08" or "ourday".
  password: '0814',
  // Accepted alongside the password above, so the order the date is typed in
  // never turns a love letter into a locked door.
  passwordAliases: ['1408', '14082026', '08142026', 'aug14', '14aug', 'august14', '14august'],
  passwordHint: 'Four digits — the day the world met you.',

  // Birthday countdown target (month is 0-indexed in Date, so August = 7)
  birthdayMonth: 7, // August
  birthdayDay: 14,
  // Year of birth — drives the candle count (14 Aug 2026 = turning 29)
  birthYear: 1997,

  // Our song — place the mp3 at /public/music/until-i-found-you.mp3
  musicSrc: '/music/until-i-found-you.mp3',
  musicTitle: 'Until I Found You',
  musicArtist: 'Stephen Sanchez',
  musicLabel: 'Our Song',

  // "Us, so far" live ticker on the welcome screen.
  // The day you two started — YYYY-MM-DD, read as a local date. '' hides it.
  relationshipStart: '2020-05-20',

  // Level 3 — candles on the cake (these can be blown out for real).
  // null = one per year of age, from birthYear above. Set a number to override.
  candleCount: null,

  // Hidden letter: typing this anywhere in the game opens it.
  // Defaults to their name; keep it lowercase and letters-only.
  secretPhrase: 'adeesha',
  // The nudge shown on the welcome screen (keyboard devices only).
  // Change this whenever you change secretPhrase above, or it points nowhere.
  secretHint: 'your own name is the key',
  secretLetterTitle: 'For the days after today',
  secretLetterBody: [
    'Today you will hear it from everybody — happy birthday, happy birthday. So I am not spending this page on that. I hid this one for an ordinary Tuesday, when nobody is singing.',
    'If you are reading this on a hard day: I am still here, still choosing you, still amazed that you said yes.',
    'This is the last birthday I get to call you my fiancé. Next year I will wake you up as your wife — and every birthday after that one is mine to look after.',
    'And if you are reading this on a good day: turn around and kiss me.',
  ],
};
