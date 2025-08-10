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

    const keyword = body.keyword

    let query = `
    SELECT * FROM tag_cooccurrence_view
    WHERE LOWER(source) = $1 OR LOWER(target) = $1
    ORDER BY weight desc
    LIMIT 10;
    `

    const client = await pool.connect()
    const results = await client.query(query, [keyword])
    client.release()

    return NextResponse.json(results.rows)
  } catch (error) {
    console.error('Error in API: keyword links', error)
    return NextResponse.json({ error: 'Failed to fetch keyword links' }, { status: 500 })
  }
}

