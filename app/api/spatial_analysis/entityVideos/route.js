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

    const entityID  = body.id_entite_spatiale

    //console.log("entityID :",entityID)


    const query = `SELECT * FROM getVideos_spatial_Entity($1, '2025-05-19')`
    
    const client = await pool.connect()
    const results = await client.query(query, [entityID])
    client.release()

    return NextResponse.json(results.rows)
  } 
  catch (error) {
    console.error('Error in API: getVideos_spatial_Entity', error)
    return NextResponse.json({ error: 'Failed to fetch getVideos_spatial_Entity' }, { status: 500 })
  }
}

