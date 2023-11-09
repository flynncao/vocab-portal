import axios from 'axios'
import cheerio from 'cheerio'
import type { Vocab } from '~/types/Vocab'

const vocab: Vocab = {
  title: '',
  pos: '',
  dpos: '',
  uk_pron: '',
  us_pron: '',
  definitions: [],
  dataset_examples: [],
}

export function showInfo(): string {
  const info: string = 'This is a scraper'
  return info
}

export const scrapeInfoFromCambridgeDictionary = async function (word: string): Promise<Vocab | void> {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
  ]

  const requestURL = `https://dictionary.cambridge.org/dictionary/english/${word}/`
  return new Promise((resolve, reject) => {
    axios
      .get(requestURL, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
        },
      })
      .catch((error) => {
        throw new Error(error)
        reject(vocab)
      })
      .then((response: any) => {
        const $ = cheerio.load(response.data)
        const title = $('div.di-title:first>span>span').text()
        vocab.title = title
        const pos = $(
          'div.posgram.dpos-g.hdib.lmr-5:first span.pos.dpos',
        ).text()
        const dpos = $(
          'div.posgram.dpos-g.hdib.lmr-5:first span.gram.dgram',
        ).text()
        vocab.pos = pos
        vocab.dpos = dpos
        const uk_pron = $('span.uk.dpron-i:first span.ipa.dipa.lpl-1').text()
        const us_pron = $('span.us.dpron-i:first span.ipa.dipa.lpl-1').text()
        vocab.uk_pron = uk_pron
        vocab.us_pron = us_pron
        $('div.def-block.ddef_block').each((i, elem) => {
          const description = $(elem).find('div.def.ddef_d.db').text()
          vocab.definitions.push({ description, examples: [] })
          const subList = $(elem).find(
            'div.def-body.ddef_b div.examp.dexamp',
          )
          if (subList.length !== 0) {
            subList.each((j, item) => {
              vocab.definitions[i].examples.push($(item).text())
            })
          }
        })
        $('#dataset-example')
          .find('div.lbb.lb-cm.lpt-10')
          .each((i, elem) => {
            const dataExample = $(elem)
              .find('span.deg')
              .text()
              .trim()
              .replace(/\n/g, '')
            vocab.dataset_examples.push(dataExample)
          })
        resolve(vocab)
      })
  })
}
