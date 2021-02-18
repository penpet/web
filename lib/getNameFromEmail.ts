const getNameFromEmail = (email: string) => email.match(/^(.+)@.+\..+$/)?.[1]

export default getNameFromEmail
