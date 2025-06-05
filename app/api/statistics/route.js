import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// PostgreSQL connection

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
})

// must be named GET uppercased so Nextjs map all get requestes to this function

export async function GET() {
  try 
  {
    const client = await pool.connect()

    const [numChannels, numVideos, numComments] = await Promise.all([
      client.query('SELECT COUNT(*) FROM chaines'),
      client.query('SELECT COUNT(*) FROM videos'),
      client.query('SELECT COUNT(*) FROM commentaires'),
    ])

    client.release()

    return NextResponse.json({
      numChannels: parseInt(numChannels.rows[0].count),
      numVideos: parseInt(numVideos.rows[0].count),
      numComments: parseInt(numComments.rows[0].count),
    })
  } 
  catch (error) 
  {
    console.error('Error fetching statistics:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
