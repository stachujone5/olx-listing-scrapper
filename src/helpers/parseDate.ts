export const parseDate = (date: string) => {
  if (date.includes('Dzisiaj')) {
    return new Date().toLocaleDateString()
  }
}
