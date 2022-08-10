import { writeFileSync } from 'fs'

import * as cheerio from 'cheerio'
import { v4 } from 'uuid'

import { fetch } from './helpers/fetch'
import { parseDate } from './helpers/parseDate'

interface Product {
  readonly city: string
  readonly date: string
  readonly id: string
  readonly link: string
  readonly price: string
  readonly title: string
}

const URL = 'https://www.olx.pl/d/oferty/q-yeezy/?search%5Border%5D=created_at:desc'

// eslint-disable-next-line -- need mutable array
const items: Product[] = []

const scrap = async () => {
  const html = await fetch<string>(URL)
  const $ = cheerio.load(html)

  // remove span with text and style tags
  $('.css-e2218f').remove()
  $('style').remove()

  // iterate through listings
  $('.css-u2ayx9').each((i, el) => {
    const title = $(el).find('h6').text()
    const price = $(el).text().slice(title.length)
    const city = $(el).next().text().split(' -')[0]
    const date = parseDate($(el).next().text().split(' - ')[1])

    // eslint-disable-next-line -- a wont be undefined here
    const link = 'https://www.olx.pl/' + $(el).closest('a').attr()!.href
    const id = v4()

    // check if listing is already in the array
    if (!items.find(i => i.link === link) && date) {
      items.push({ id, title, city, price, link, date })
    }
  })

  writeFileSync('results.json', JSON.stringify(items))
}

setInterval(() => scrap(), 30000)
