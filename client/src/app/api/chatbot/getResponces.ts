import type { NextApiRequest, NextApiResponse } from 'next'

const SONAR_API_KEY = process.env.SONAR_API_KEY
const SONAR_API_URL = 'https://api.perplexity.ai/sonar/v1'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method != 'POST') {
        return res.status(405).json({ message: 'method not allowed' })
    }
}

const { query } = req.body

if (!query) {
    return res.status(405).json({ message: 'Query is Required' })
}