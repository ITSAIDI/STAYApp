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

     //console.log("The received body videos :",body)

    const { 
      //collectionDate, 
      publicationDateFrom, publicationDateTo, statChoice, order } = body
     
    let query = `
      SELECT 
            videos.id_video,
            videos.miniature,
            videos.titre,
            videos.date_publication,
            videos.description,
            videos.tags,
            videos.duree,
            videos_metriques.nombre_vues,
            videos_metriques.nombre_likes,
            videos_metriques.date_releve_video
        FROM videos
        INNER JOIN videos_metriques 
        ON videos.id_video = videos_metriques.id_video
        `
    const conditions = []
    const values = []

    if (publicationDateFrom) {
      values.push(publicationDateFrom)
      conditions.push(`date_publication >= $${values.length}`)
    }

    if (publicationDateTo) {
      values.push(publicationDateTo)
      conditions.push(`date_publication <= $${values.length}`)
    }
    /*
    if (collectionDate) {
      values.push(collectionDate)
      conditions.push(`date_releve_video = $${values.length}`)
    }
    */
   
    if (conditions.length > 0) {
      query += ' WHERE date_releve_video = (SELECT MAX(date_releve_video) FROM videos_metriques) AND ' + conditions.join(' AND ')
    }
    
    if (statChoice) {
      query += ` ORDER BY ${statChoice}`
      if (order && (order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc')) {
        query += ` ${order.toUpperCase()}`
      }
    }

    //query += ' LIMIT 10'

    const client = await pool.connect()
    const results = await client.query(query, values)
    client.release()

    return NextResponse.json(results.rows)

  } catch (error) {
    console.error('Error in API: videos filtering', error)
    return NextResponse.json({ error: 'Failed to fetch filtered videos' }, { status: 500 })
  }
}

