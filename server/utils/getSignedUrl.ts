import { S3 } from 'aws-sdk'
import { getExtension } from 'mime'

import Pal from '../models/Pal'
import HttpError from './HttpError'
import newId from './newId'

const bucket = process.env.AWS_S3_BUCKET
if (!bucket) throw new Error('Missing AWS bucket')

const ACL = 'public-read'

const s3 = new S3()

export interface SignedUrl {
	url: string
	destination: string
}

const getSignedUrl = (pal: Pal, name: string, type: string) =>
	new Promise<SignedUrl>((resolve, reject) => {
		const extension = getExtension(type)
		if (!extension) return reject(new HttpError(400, 'Invalid type'))

		const id = `${newId()}.${extension}`

		s3.getSignedUrl(
			'putObject',
			{
				ACL,
				Bucket: bucket,
				Key: id,
				Expires: 60,
				ContentType: type,
				Metadata: { name, user: pal.id }
			},
			(error, url) => {
				error
					? reject(error)
					: resolve({ url, destination: `https://${bucket}/${id}` })
			}
		)
	})

export default getSignedUrl
