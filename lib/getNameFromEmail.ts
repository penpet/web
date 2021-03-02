const EMAIL_MATCH = /^(.+)@.+\..+$/

const getNameFromEmail = (email: string) => email.match(EMAIL_MATCH)?.[1]

export default getNameFromEmail
