export default class Utils {
  static baseUrl = `${process.env.REACT_APP_API_SCHEME || 'http'}://${
    process.env.REACT_APP_API_HOST
  }${
    process.env.REACT_APP_API_PORT
      ? `:${process.env.REACT_APP_API_PORT}`
      : ':3001'
  }${process.env.REACT_APP_API_BASE || ''}`;

  static videoUrl = process.env.REACT_APP_VIDEO_HOST || '';
}
