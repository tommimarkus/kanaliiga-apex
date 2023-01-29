import { type ReportCallback } from 'web-vitals'

const reportWebVitals = (onPerfEntry?: ReportCallback): void => {
  if ((onPerfEntry != null) && onPerfEntry instanceof Function) {
    import('web-vitals')
      .then(({ getCLS, getFCP, getFID, getLCP, getTTFB }) => {
        getCLS(onPerfEntry)
        getFCP(onPerfEntry)
        getFID(onPerfEntry)
        getLCP(onPerfEntry)
        getTTFB(onPerfEntry)
      })
      .catch((reason: any) => {
        console.error('Failed to import web vitals checker')
      })
  }
}

export default reportWebVitals
