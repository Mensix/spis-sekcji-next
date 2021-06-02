import { eachWeekOfInterval, endOfISOWeek } from 'date-fns'

export const eachTwoWeeksFrom2021 = () => {
  const weeksFrom2021 = eachWeekOfInterval({
    start: endOfISOWeek(new Date(2021, 0, 1)),
    end: new Date(),
  })
  const twoWeeksFrom2021 = weeksFrom2021.filter((_, idx) => idx % 2 === 0)

  return twoWeeksFrom2021
}
