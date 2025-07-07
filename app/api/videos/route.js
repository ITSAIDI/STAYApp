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

export async function GET() {
    try 
    {
        const client = await pool.connect() 
        const Query = `
        select * from videos  
        inner join videos_metriques 
        on videos.id_video =  videos_metriques.id_video AND date_releve_video = '2025-05-21'
        limit 10;
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