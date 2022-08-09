import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'

const stream = fs.createWriteStream('append.txt', { flags: 'a' })

const items = []

const fetch = async () => {
	try {
		const { data } = await axios.get('https://www.olx.pl/d/oferty/q-yeezy/?search%5Border%5D=created_at:desc')
		const $ = cheerio.load(data)

		// remove span with text and style tags
		$('.css-e2218f').remove()
		$('style').remove()

		// iterate through listings
		$('.css-u2ayx9').each((i, el) => {
			const heading = $(el).find('h6').text()
			const city = $(el).next().text().split(' -')[0]
			const price = $(el).text().slice(heading.length)
			const link = 'https://www.olx.pl/' + $(el).closest('a').attr().href

			// check if listing is already in the array
			if (!items.includes(heading)) {
				console.log(`Added listing: ${heading} ${price}`)
				items.push(heading)
				stream.write(
					'Title: ' +
						heading +
						'\n' +
						'Price: ' +
						price +
						'\n' +
						'City: ' +
						city +
						'\n' +
						'URL: ' +
						link +
						'\n' +
						'\n' +
						'\n'
				)
			}
		})
	} catch (err) {
		console.log(err)
	}
}

setInterval(() => fetch(), 5000)
