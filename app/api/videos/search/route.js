import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_ADMIN,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_ADMIN_PASSWORD,
  port: parseInt(process.env.DB_PORT),
})


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('query');

  // Test of the query is empty, null or undefined
  if (!q || q.trim() === '') 
  {
    return NextResponse.json([]); // No suggestions
  }

  try 
  {
    const client = await pool.connect();

    const results = await client.query(
      `
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
        ON videos.id_video = videos_metriques.id_video AND videos_metriques.date_releve_video = '2025-05-21'
        where lower(videos.titre) like $1 
        order by videos.titre  
        limit 5;
      `,
      [`%${q.toLowerCase()}%`]
    );

    client.release();

    return NextResponse.json(results.rows);

  } 
  catch (error) 
  {
    console.error('Error in API: video search', error);
    return NextResponse.json(
      { error: 'Failed to search videos' },
      { status: 500 }
    );
  }
}
