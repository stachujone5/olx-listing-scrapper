export const parseDate = (date: string) => {
  if (date.includes('Dzisiaj')) {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const day = today.getDate()
    const time = date.split(' o ')[1]
    const hours = time.split(':')[0]
    const minutes = time.split(':')[1]

    const formatedDate = new Date(year, month, day, Number(hours), Number(minutes))

    return formatedDate.toLocaleString().slice(0, -3)
  }
}
