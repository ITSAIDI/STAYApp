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

    //console.log('body :',body)

    
    const query = `
      SELECT 
          EXTRACT(YEAR FROM date_publication) AS annee,
          COUNT(*) AS nombre_mentions
      FROM videos
      WHERE $1 = ANY (tags)
      AND EXTRACT(YEAR FROM date_publication) < (
          SELECT MAX(EXTRACT(YEAR FROM date_publication)) FROM videos
      )
      GROUP BY annee
      ORDER BY annee;
    `

    const client = await pool.connect()
    const results = await client.query(query, [keyword])
    client.release()

    return NextResponse.json(results.rows)
  } catch (error) {
    console.error('Error in API', error)
    return NextResponse.json({ error: 'Failed to fetch keyword time data' }, { status: 500 })
  }
}
