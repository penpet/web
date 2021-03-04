import express from 'express'
import { join } from 'path'

import { ROOT } from '../constants'

const assets = (name: string) =>
	express.static(join(ROOT, 'assets', name), {
		setHeaders: res => {
			res.header('Access-Control-Allow-Origin', '*')
			res.header('Cache-Control', 'public, max-age=31536000, immutable')
		}
	})

export default assets
