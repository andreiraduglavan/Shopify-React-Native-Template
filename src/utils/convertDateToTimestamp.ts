export const convertDateToTimestamp = (date: string) => {
  const timestamp = new Date(date).valueOf()

  return timestamp
}