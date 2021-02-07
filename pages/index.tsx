import { NextPage } from 'next'

import User from 'models/User'

interface HomeProps {
	user: User | null
}

const Home: NextPage<HomeProps> = ({ user }) => <>{user?.name}</>

export default Home
