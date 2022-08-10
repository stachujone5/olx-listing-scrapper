import axios from 'axios'

export const fetch = async <ResponseData>(URL: string) => {
  try {
    const res = await axios.get<ResponseData>(URL)

    return res.data
  } catch (err) {
    throw new Error('Unable to fetch')
  }
}
