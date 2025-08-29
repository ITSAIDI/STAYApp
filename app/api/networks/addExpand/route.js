import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_ADMIN,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_ADMIN_PASSWORD,
  port: parseInt(process.env.DB_PORT),
})



export async function POST(request) {
  try {
    const body = await request.json()

    let query = `
    SELECT * FROM channelsMentions
    WHERE targetchannelid = $1 OR sourcechannelid = $1
    ORDER BY mentioncount DESC
    LIMIT 10;
    `

    const client = await pool.connect()
    const results = await client.query(query, [body.channelID])
    client.release()

    return NextResponse.json(results.rows)
  } catch (error) {
    console.error('Error in API: channel descendents', error)
    return NextResponse.json({ error: 'Failed to fetch channel descendents' }, { status: 500 })
  }
}

