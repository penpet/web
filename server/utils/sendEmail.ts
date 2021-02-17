import { SES } from 'aws-sdk'

const ses = new SES()

export interface EmailOptions {
	from: string
	to: string
	replyTo: string
	template: string
	context: Record<string, unknown>
}

const sendEmail = ({ from, to, replyTo, template, context }: EmailOptions) =>
	new Promise<void>((resolve, reject) => {
		ses.sendTemplatedEmail(
			{
				Source: from,
				Destination: { ToAddresses: [to] },
				ReplyToAddresses: [replyTo],
				Template: template,
				TemplateData: JSON.stringify(context)
			},
			error => {
				error ? reject(error) : resolve()
			}
		)
	})

export default sendEmail
