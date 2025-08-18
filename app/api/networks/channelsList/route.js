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
        
        const query = `
        SELECT 
            id_chaine,
            LOWER(nom) as channelname,
            logo,
            date_creation
        FROM chaines 
        WHERE pertinente = TRUE;
        `
        const { rows } = await client.query(query)
        client.release()

        return NextResponse.json({channelsList : rows});

    
    } 
    catch (error) 
    {
        console.log('error in api : (networks) channelList',error)
        return NextResponse.json({ error: 'Failed to fetch channelList' }, { status: 500 });
    }
    
}