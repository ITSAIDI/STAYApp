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

        await client.query('CALL getVideosLargeChannels();');
        const results = await client.query('SELECT * FROM videosLargeChannels;');
        
        client.release()

        return NextResponse.json(results.rows);
    } 
    catch (error) 
    {
        console.log('error in api : videosLargeChannels',error)
        return NextResponse.json({ error: 'Failed to fetch videosLargeChannels' }, { status: 500 });
    }
    
}