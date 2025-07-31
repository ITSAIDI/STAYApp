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

    //console.log('received body  :',body)

    const entities = body.entitiesIds

    if (!Array.isArray(entities) || entities.length === 0) 
    {
     return NextResponse.json({ error: 'Missing entity IDs list' }, { status: 400 });
    }

    const placeholders = entities.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
    SELECT 
      esv.id_entite_spatiale,
      v.id_video,
      v.tags
    FROM entites_spatiales_videos esv
    JOIN videos v ON esv.id_video = v.id_video
    WHERE esv.id_entite_spatiale IN (${placeholders}); `;

    const client = await pool.connect()
    const results = await client.query(query, entities)
    client.release()

    return NextResponse.json(results.rows)
  }
  catch (error) {
    console.error('Error in API', error)
    return NextResponse.json({ error: 'Failed to fetch tags of videos-entites' }, { status: 500 })
  }
  }















