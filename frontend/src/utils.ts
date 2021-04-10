import { isISO8601 } from 'class-validator';
import { compareAsc } from 'date-fns';

export default class Utils {
  static baseUrl = `${process.env.REACT_APP_API_SCHEME || 'http'}://${
    process.env.REACT_APP_API_HOST
  }${
    process.env.REACT_APP_API_PORT
      ? `:${process.env.REACT_APP_API_PORT}`
      : ':3001'
  }${process.env.REACT_APP_API_BASE || ''}`;

  static videoUrl = process.env.REACT_APP_VIDEO_HOST || '';

  static sortDateStrings(a: string, b: string): number {
    if (isISO8601(a, { strict: true }) && !isISO8601(b, { strict: true })) {
      return 1;
    }
    if (!isISO8601(a, { strict: true }) && isISO8601(b, { strict: true })) {
      return -1;
    }
    return compareAsc(new Date(a), new Date(b));
  }

  static localDateTimeString(dateTimeString: string): string {
    if (!isISO8601(dateTimeString)) {
      return dateTimeString;
    }
    return `${this.localDateString(dateTimeString)} ${new Date(
      dateTimeString
    ).toLocaleTimeString(Intl.DateTimeFormat().resolvedOptions().locale, {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })}`;
  }

  static localDateString(dateString: string): string {
    if (!isISO8601(dateString)) {
      return dateString;
    }
    return new Date(dateString).toLocaleDateString(
      Intl.DateTimeFormat().resolvedOptions().locale,
      {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    );
  }
}
