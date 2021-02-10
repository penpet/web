/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { getCSP, SELF, INLINE, EVAL } = require('csp-header')

const DEV = process.env.NODE_ENV === 'development'

const PUBLIC_ORIGIN = process.env.NEXT_PUBLIC_ORIGIN
if (!PUBLIC_ORIGIN) throw new Error('Missing public origin')

const ORIGIN = DEV ? 'http://localhost:5000' : PUBLIC_ORIGIN

const plugins = [
	[require('next-optimized-classnames')],
	[require('next-optimized-images')]
]

const config = {
	distDir: 'client-build',
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
							'style-src': [SELF, INLINE],
							'script-src': [
								SELF,
								...(DEV ? [EVAL] : []),
								"'sha256-Nqnn8clbgv+5l0PgxcTOldg8mkMKrFn4TvPL+rYUUGg='" // Render-blocking script
							],
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
