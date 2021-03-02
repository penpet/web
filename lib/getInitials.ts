const INITIALS_MATCH = /^([^\s]+).*?(?:\s+([^\s]+))?$/

const getInitials = (name: string) => {
	const match = name.match(INITIALS_MATCH)

	if (!match) return null
	const [, first, last] = match

	return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase()
}

export default getInitials
