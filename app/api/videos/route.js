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

export async function GET() {
    try 
    {
        const client = await pool.connect() 
        const Query = `
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
            AND videos_metriques.date_releve_video = '2025-05-21'
        order by videos.id_video
        LIMIT 10;

        `
        const results = await client.query(Query)
        client.release()

        return NextResponse.json(results.rows);
    } 
    catch (error) 
    {
        console.log('error in api : videos fetching',error)
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
    
}