/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { getCSP, SELF, INLINE, EVAL } = require('csp-header')

const DEV = process.env.NODE_ENV === 'development'
const ORIGIN = DEV ? 'http://localhost:3000' : 'https://pen.pet'

const plugins = [
	[require('next-optimized-classnames')],
	[require('next-optimized-images')]
]

const config = {
	headers: () => [
		{
			source: '/(.*)',
			headers: [
				{ key: 'Access-Control-Allow-Origin', value: ORIGIN },
				{
					key: 'Content-Security-Policy',
					value: getCSP({
						directives: {
							'default-src': [SELF],
							'connect-src': [SELF, 'accounts.google.com'],
							'style-src': [SELF, INLINE, 'accounts.google.com'],
							'script-src': [
								SELF,
								...(DEV ? [EVAL] : []),
								'accounts.google.com'
							],
							'frame-src': [SELF, 'accounts.google.com'],
							'base-uri': SELF,
							'block-all-mixed-content': true,
							'upgrade-insecure-requests': true
						}
					})
				},
				{ key: 'Expect-CT', value: '0' },
				{ key: 'Referrer-Policy', value: 'no-referrer' },
				{ key: 'Strict-Transport-Security', value: 'max-age=15552000' },
				{ key: 'X-Content-Type-Options', value: 'nosniff' },
				{ key: 'X-DNS-Prefetch-Control', value: 'off' },
				{ key: 'X-Download-Options', value: 'noopen' },
				{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
				{ key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
				{ key: 'X-XSS-Protection', value: '0' }
			]
		}
	]
}

module.exports = require('next-compose-plugins')(plugins, config)
