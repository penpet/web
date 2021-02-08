export default interface Pal {
	id: string
	name: string
	email: string
	password: string
}

export type PublicPal = Omit<Pal, 'password'>

export const palToPublic = ({ id, name, email }: Pal): PublicPal => ({
	id,
	name,
	email
})
