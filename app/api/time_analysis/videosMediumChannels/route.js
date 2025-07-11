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
        
        await client.query('CALL getVideosMediumChannels();');
        const results = await client.query('SELECT * FROM videosMediumChannels;');

        client.release()

        return NextResponse.json(results.rows);
    } 
    catch (error) 
    {
        console.log('error in api : videosMediumChannels',error)
        return NextResponse.json({ error: 'Failed to fetch videosMediumChannels' }, { status: 500 });
    }
    
}