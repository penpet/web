import type { S3 } from 'aws-sdk'

import HttpError from 'models/HttpError'
import fetchJson from './fetch'

interface UploadData {
	url: string
	data: S3.PresignedPost
}

const upload = async (file: File) => {
	if (!file.type.startsWith('image/'))
		throw new Error('You must upload an image')

	const { url, data } = await fetchJson<UploadData>('upload', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name: file.name, type: file.type })
	})

	const form = new FormData()

	for (const [key, value] of Object.entries(data.fields))
		form.append(key, value)

	form.append('file', file)

	const response = await fetch(data.url, {
		method: 'POST',
		body: form
	})

	if (!response.ok) throw new HttpError(response.status, await response.text())

	return url
}

export default upload
