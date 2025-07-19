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

    //console.log("The received body :",body)

    const { collectionDate, creationDateFrom, creationDateTo, statChoice, order } = body

    let query = `
      SELECT * FROM chaines
      INNER JOIN chaines_metriques ON chaines.id_chaine = chaines_metriques.id_chaine
    `
    const conditions = []
    const values = []

    if (creationDateFrom) {
      values.push(creationDateFrom)
      conditions.push(`date_creation >= $${values.length}`)
    }

    if (creationDateTo) {
      values.push(creationDateTo)
      conditions.push(`date_creation <= $${values.length}`)
    }

    if (collectionDate) {
      values.push(collectionDate)
      conditions.push(`date_releve_chaine = $${values.length}`)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    if (statChoice) {
      query += ` ORDER BY ${statChoice}`
      if (order && (order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc')) {
        query += ` ${order.toUpperCase()}`
      }
    }

    query += ' LIMIT 10'

    const client = await pool.connect()
    const results = await client.query(query, values)
    client.release()

    return NextResponse.json(results.rows)
  } catch (error) {
    console.error('Error in API: channels filtering', error)
    return NextResponse.json({ error: 'Failed to fetch filtered channels' }, { status: 500 })
  }
}

