import { siteConfig } from './config';

/**
 * Birthday maths in one place — the countdown, the hero engraving and the
 * candles all used to work this out separately.
 */

/** "August 14", built from config so no month name is ever hardcoded. */
export function birthdayLabel() {
  return new Date(2000, siteConfig.birthdayMonth, siteConfig.birthdayDay).toLocaleDateString(
    'en-US',
    { month: 'long', day: 'numeric' },
  );
}

/**
 * The age reached at this year's birthday — on the day itself, the number of
 * candles on the cake. Once the birthday has passed, it rolls forward to the
 * next one so a later visit doesn't show a stale count.
 */
export function ageTurning(now = new Date()) {
  if (!siteConfig.birthYear) return null;

  const thisYearsBirthday = new Date(
    now.getFullYear(),
    siteConfig.birthdayMonth,
    siteConfig.birthdayDay,
    0,
    0,
    0,
  );

  // Still counts as "today" for the whole of the birthday
  const birthdayIsPast = now > new Date(thisYearsBirthday.getTime() + 24 * 60 * 60 * 1000 - 1);
  const year = birthdayIsPast ? now.getFullYear() + 1 : now.getFullYear();

  return year - siteConfig.birthYear;
}
