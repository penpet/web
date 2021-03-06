import TimeAgo from 'javascript-time-ago'
import locale from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(locale)
const timeAgo = new TimeAgo('en-US')

const formatTimeAgo = (date: Date) =>
	timeAgo.format(Math.min(Date.now(), date.getTime()))

export default formatTimeAgo
