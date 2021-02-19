import { S3 } from 'aws-sdk'
import { getExtension } from 'mime'

import Pal from '../models/Pal'
import HttpError from './HttpError'
import newId from './newId'

const BUCKET = process.env.AWS_S3_BUCKET
if (!BUCKET) throw new Error('Missing AWS bucket')

const ACL = 'public-read'
const MAX_SIZE = 1024 * 1024 * 30 // 30 MB

const s3 = new S3()

export interface UploadOptions {
	name: string
	type: string
}

export interface UploadData {
	url: string
	data: S3.PresignedPost
}

const upload = async (
	pal: Pal,
	{ name, type }: UploadOptions
): Promise<UploadData> => {
	const extension = getExtension(type)
	if (!extension) throw new HttpError(400, 'Invalid type')

	if (!type.startsWith('image/'))
		throw new HttpError(400, 'You must upload an image')

	const id = `${newId()}.${extension}`

	const data = await new Promise<S3.PresignedPost>((resolve, reject) => {
		s3.createPresignedPost(
			{
				Expires: 60,
				Bucket: BUCKET,
				Fields: {
					ACL,
					Bucket: BUCKET,
					Key: id,
					'Content-Type': type,
					'Content-Disposition': `inline; filename=${JSON.stringify(name)}`,
					'Cache-Control': 'public, max-age=31536000, immutable',
					'X-Amz-Meta-Name': name,
					'X-Amz-Meta-User': pal.id
				},
				Conditions: [['content-length-range', 0, MAX_SIZE]]
			},
			(error, data) => {
				error ? reject(error) : resolve(data)
			}
		)
	})

	return { url: `https://${BUCKET}/${id}`, data }
}

export default upload
