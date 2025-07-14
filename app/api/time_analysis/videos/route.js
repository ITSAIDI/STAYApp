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
                SELECT EXTRACT(YEAR FROM date_publication) AS publicationYear,
                COUNT(*) AS videosNumber
                FROM videos
                WHERE EXTRACT(YEAR FROM date_publication) < (SELECT MAX(EXTRACT(YEAR FROM date_publication)) FROM videos)
                GROUP BY publicationYear
                ORDER BY publicationYear ASC;
                `
        const results = await client.query(Query)
        client.release()

        return NextResponse.json(results.rows);
    } 
    catch (error) 
    {
        console.log('error in api : Numbre of videos by year',error)
        return NextResponse.json({ error: 'Failed to fetch numbre of videos by year' }, { status: 500 });
    }
    
}