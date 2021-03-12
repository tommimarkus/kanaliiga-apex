namespace Utils {
  const baseUrl = `${process.env.REACT_APP_API_SCHEME || 'http'}://${
    process.env.REACT_APP_API_HOST
  }${process.env.REACT_APP_API_PORT || ':3001'}`;
}
