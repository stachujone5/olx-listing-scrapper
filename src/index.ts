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

process.env.TZ = 'Europe/Amsterdam' // set node tz to UTC-1

const QUERY = 'yeezy'

// eslint-disable-next-line -- need mutable array
const products: Product[] = []

const scrap = async () => {
  const html = await fetch<string>(`https://www.olx.pl/d/oferty/q-${QUERY}/?search%5Border%5D=created_at:desc`)
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
    // eslint-disable-next-line -- <a /> wont be undefined here
    const link = 'https://www.olx.pl/' + $(el).closest('a').attr()!.href
    const id = v4()

    // check if listing is already in the array
    if (!products.find(i => i.link === link) && date) {
      products.push({ id, title, city, price, link, date })

      writeFileSync('results.json', JSON.stringify(products))

      console.log('Added new item: ' + title + '  -------------------  ' + new Date().toLocaleTimeString())
    }
  })
}

setInterval(() => scrap(), 5000)
