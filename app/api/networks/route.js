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
            m.id_chaine as targetChannel,
            v.id_chaine as sourceChannel,
            m.id_video,
            m.mention_titre,
            m.mention_tags,
            m.mention_description
        FROM mentions AS m JOIN videos AS v ON m.id_video = v.id_video
        JOIN chaines AS c ON v.id_chaine = c.id_chaine
        WHERE c.pertinente = TRUE;
        `
        const results = await client.query(Query)
        client.release()

        return NextResponse.json(results.rows);
    } 
    catch (error) 
    {
        console.log('error in api : mentions data',error)
        return NextResponse.json({ error: 'Failed to fetch mentions data' }, { status: 500 });
    }
    
}