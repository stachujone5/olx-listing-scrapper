import { writeFileSync } from 'fs'

import axios from 'axios'
import * as cheerio from 'cheerio'
import { v4 } from 'uuid'

interface Product {
  readonly city: string
  readonly id: string
  readonly link: string
  readonly price: string
  readonly title: string
}

// eslint-disable-next-line -- need mutable array
const items: Product[] = []

const fetch = async () => {
  try {
    const { data } = await axios.get<string>('https://www.olx.pl/d/oferty/q-yeezy/?search%5Border%5D=created_at:desc')
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

    writeFileSync('results.json', JSON.stringify(items))
  } catch (err) {
    console.log(err)
  }
}

void fetch()
