import express from 'express'
import ws from 'express-ws'
import next from 'next'

const app = express()
ws(app)

import routes from './routes'
import database from './database'
import { DEV, ROOT, PORT } from './constants'

const nextApp = next({ dev: DEV, dir: ROOT })
const nextRequestHandler = nextApp.getRequestHandler()

app.set('trust proxy', 1)

app.disable('x-powered-by')
app.disable('via')
app.disable('server')

app.use(routes)
app.use((req, res) => nextRequestHandler(req, res))

const start = async () => {
	await Promise.all([database.connect(), nextApp.prepare()])

	await new Promise<void>(resolve => {
		app.listen(PORT, resolve)
	})

	console.log(`Listening on http://localhost:${PORT}`)
}

start()
