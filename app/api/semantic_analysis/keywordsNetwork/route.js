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
    const query = `
      SELECT *
      FROM tag_cooccurrence_view
      WHERE source NOT LIKE '% %'
        AND target NOT LIKE '% %'
      ORDER BY weight DESC
      LIMIT 30;
    `

    const client = await pool.connect()
    const { rows } = await client.query(query)
    client.release()

    if (rows.length === 0) {
      return NextResponse.json({ nodes: [], links: [] })
    }

    const links = []
    const nodes = new Set()

    for (const row of rows) {
      if (nodes.size === 0 || nodes.has(row.source) || nodes.has(row.target)) {
        nodes.add(row.source)
        nodes.add(row.target)
        links.push(row)
      }
    }

    

    return NextResponse.json(
      { nodes: Array.from(nodes).map(tag=>({id:tag})),
       links
      }
  )

  } catch (error) {
    console.error('Error in API', error)
    return NextResponse.json(
      { error: 'Failed to fetch connected keyword network' },
    )
  }
}
