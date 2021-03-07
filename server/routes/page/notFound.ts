import { Router } from 'express'

import page from '../../models/Page'

const router = Router()

router.use((_req, res) => {
	res.status(404).send(
		page({
			id: 'error',
			title: '404 | penpet',
			description: "This pen doesn't exist",
			body: `
				<h1 id="title">Uh oh!</h1>
				<p id="message">This pen doesn't exist</p>
			`
		})
	)
})

export default router
