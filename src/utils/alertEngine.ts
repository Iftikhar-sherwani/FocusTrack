import { getDay } from 'date-fns'

const alertMessages = [
  "You're {hours} behind. Your competition clocked out hours ago - they never stopped.",
  '2 days wasted. While you scrolled, someone shipped what you planned.',
  "You're {hours} in the hole. Momentum doesn't wait for motivation.",
  'Half the week gone. Half your goal untouched. Fix it today.',
  'The gap between where you are and where you want to be has a name: these missing hours.',
]

export const shouldTriggerWeeklyAlert = (weeklyDeficit: number, thresholdHours: number) => {
  const day = getDay(new Date())
  const isWednesdayOrLater = day >= 3
  return isWednesdayOrLater && weeklyDeficit >= thresholdHours
}

export const getAlertMessage = (hoursBehind: number) => {
  const pick = alertMessages[Math.floor(Math.random() * alertMessages.length)]
  return pick.replaceAll('{hours}', `${hoursBehind.toFixed(1)} hours`)
}
