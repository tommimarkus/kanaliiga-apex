import { DateTime } from 'luxon';

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
    if (a === b || (a && !b)) {
      return 1;
    }
    if (!a && b) {
      return -1;
    }
    const aDate = DateTime.fromISO(a);
    const bDate = DateTime.fromISO(b);
    return aDate > bDate ? 1 : -1;
  }
}
