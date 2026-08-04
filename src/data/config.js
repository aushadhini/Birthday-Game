/**
 * Site-wide personalization settings.
 * Edit these values to customize the birthday quest.
 */
export const siteConfig = {
  projectName: 'Birthday Quest for Adeesha',
  recipientName: 'Adeesha',
  creatorName: 'Your fiancé',

  // Password shown before entering the experience (case-insensitive).
  // Tip: use your special date, e.g. "14-08" or "ourday".
  password: '0814',
  passwordHint: 'A birthday only you would know… 🎂',

  // Birthday countdown target (month is 0-indexed in Date, so August = 7)
  birthdayMonth: 7, // August
  birthdayDay: 14,

  // Our song — place the mp3 at /public/music/until-i-found-you.mp3
  musicSrc: '/music/until-i-found-you.mp3',
  musicTitle: 'Until I Found You',
  musicArtist: 'Stephen Sanchez',
  musicLabel: 'Our Song',
};
