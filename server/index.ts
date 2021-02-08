import express from 'express'
import next from 'next'
import { join } from 'path'

import routes from './routes'
import database from './database'
import { PORT } from './constants'

const app = express()

const nextApp = next({
	dev: process.env.NODE_ENV === 'development',
	dir: join(__dirname, '..')
})
const nextRequestHandler = nextApp.getRequestHandler()

app.set('trust proxy', 1)

app.use(routes)
app.use((req, res) => nextRequestHandler(req, res))

const start = async () => {
	await Promise.all([database.connect(), nextApp.prepare()])

	app.listen(PORT, () => {
		console.log(`Listening on http://localhost:${PORT}`)
	})
}

start()
