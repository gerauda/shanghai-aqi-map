//index.js
//获取应用实例
const token = '769fd1423ee942133111846c78664694833a5b78'
const latlng = '30.89,121.10,31.41,121.76'
const apiUrl = `https://api.waqi.info/map/bounds/?token=${token}&latlng=${latlng}`

const aqiObjects = [
  { min: 0, max: 50, title: 'Good', color: '#009966' },
  { min: 51, max: 100, title: 'Moderate', color: '#ffde33' },
  { min: 101, max: 150, title: 'Unhealthy for Sensitive', color: '#ff9933' },
  { min: 151, max: 200, title: 'Unhealthy', color: '#cc0033' },
  { min: 201, max: 300, title: 'Very Unhealthy', color: '#660099' },
  { min: 301, max: 999, title: 'Hazardous', color: '#7e0023' },
  ]

const getAqiColor = (aqi) => {
  const aqiObj = aqiObjects.find(obj => aqi >= obj.min && aqi <= obj.max)
  return aqiObj ? aqiObj.color : '#ffffff' }

Page({
  data: {
    markers: [],
    points: null,
  },
  onLoad() {
    console.log(apiUrl)

    wx.setNavigationBarTitle({
      title: 'AQI Map'
    })

    wx.showNavigationBarLoading()

    wx.request({
      url: apiUrl,
      success: (res) => {

        const part2 = res.data.data.map(point => {
          return {
            latitude: point.lat,
            longitude: point.lon,
            title: point.station.name,
            label: {
              content: point.aqi,
              bgColor: getAqiColor(point.aqi),
              padding: 5,
              textAlign: 'center',
              borderRadius: 4,
              color: '#ffffff'
              
            }
          }
        })
        const markers = [...this.data.markers, ...part2]

        // console.log(`${JSON.stringify(markers)}`)
        const points = res.data.data.map(point => {
          return {
            latitude: point.lat,
            longitude: point.lon,
          }
        })
        console.log('Points loaded')
        this.setData({
          markers,
          points,
        })
        wx.hideNavigationBarLoading()

      },
    })


    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        
        const apiUrl2 = `https://api.waqi.info/feed/geo:${res.latitude};${res.longitude}/?token=${token}`
        console.log(`${apiUrl2}`)
        console.log('Your location loaded')

        wx.request({
          url: apiUrl2,
          success: (res) => {

            const point = res.data.data

            const markers = this.data.markers
              markers.push({ 
                latitude: point.city.geo[0],
                longitude: point.city.geo[1],
                title: 'you',
                label: {
                  content: `${point.aqi}   YOU`,
                  bgColor: '#0000ff',
                  padding: 5,
                  textAlign: 'center',
                  borderRadius: 4,
                  color: '#ffffff'
                }
              })

        this.setData({
          markers,
        })
          }
        })
      }

    })
  }
})