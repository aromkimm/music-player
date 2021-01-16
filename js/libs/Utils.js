export function getDateString (date) {
  return `${date.getFullYear()}-${padStr(date.getMonth() + 1)}-${padStr(date.getDate())}`
}

export function getTimeString (date, withMs = false) {
  let tStr = `${padStr(date.getHours())}:${padStr(date.getMinutes())}:${padStr(date.getSeconds())}`

  if (withMs) {
    tStr = `${tStr}.${date.getMilliseconds()}`
  }

  return tStr
}

export function getDateTimeString (date) {
  return `${getDateString(date)} ${getTimeString(date)}`
}

export function padStr (num) {
  return `${num < 10 ? '0' : ''}${num}`
}

export function getAudioTimeFormat (currentTimeVal) {
  if (isNaN(currentTimeVal)) {
    // currentTime이 NaN일 경우 return
    return false
  }
  let currentTime = Math.floor(currentTimeVal)
  let currentHour = Math.floor((currentTime % (60 * 60 * 60)) / (60 * 60))
  let currentMinute = Math.floor((currentTime % (60 * 60)) / 60)
  let currentSecond = Math.floor(currentTime % 60)

  if (currentMinute < 10) {
    currentMinute = '0' + currentMinute
  }

  if (currentSecond < 10) {
    currentSecond = '0' + currentSecond
  }

  // 1시간이 되지않는다면 분, 초만 표시 ex) 00:00
  if (currentHour > 0) {
    return currentHour + ':' + currentMinute + ':' + currentSecond
  } else {
    return currentMinute + ':' + currentSecond
  }
}