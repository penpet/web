import { NextPageContext } from 'next'
import Router from 'next/router'

const redirect = ({ res }: NextPageContext, href: string, permanent = true) => {
	if (res) {
		res.writeHead(permanent ? 301 : 307, {
			Location: href,
			'Content-Type': 'text/html; charset=utf-8'
		})
		res.end()
	} else {
		Router.replace(href)
	}
}

export default redirect
