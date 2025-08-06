import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_ADMIN,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_ADMIN_PASSWORD,
  port: parseInt(process.env.DB_PORT),
})

export async function GET() {
  try {

    const query = "select * from get_KN_random_samples();"

    const client = await pool.connect()
    const results = await client.query(query)
    client.release()

    return NextResponse.json(results.rows)

  } catch (error) {
    console.error('Error in API', error)
    return NextResponse.json({ error: 'Failed to fetch keyword network initial samples' }, { status: 500 })
  }
}
