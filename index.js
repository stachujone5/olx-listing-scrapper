import axios from 'axios'
import * as cheerio from 'cheerio'
import { writeFileSync } from 'fs'
import { v4 } from 'uuid'

let items = []

const fetch = async () => {
	try {
		const { data } = await axios.get('https://www.olx.pl/d/oferty/q-yeezy/?search%5Border%5D=created_at:desc')
		const $ = cheerio.load(data)

		// remove span with text and style tags
		$('.css-e2218f').remove()
		$('style').remove()

		// iterate through listings
		$('.css-u2ayx9').each((i, el) => {
			const title = $(el).find('h6').text()
			const city = $(el).next().text().split(' -')[0]
			const price = $(el).text().slice(title.length)
			const link = 'https://www.olx.pl/' + $(el).closest('a').attr().href
			const id = v4()

			// check if listing is already in the array
			if (!items.find(i => i.link === link)) {
				items.push({ id, title, city, price, link })
			}
		})
	} catch (err) {
		console.log(err)
	}
}

const updateJSON = () => {
	writeFileSync('results.json', JSON.stringify(items))
	items = []
}

setInterval(() => fetch(), 2500)
setInterval(() => updateJSON(), 5000)
