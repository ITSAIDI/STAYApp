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
        select * from chaines  
        inner join chaines_metriques 
        on chaines.id_chaine =  chaines_metriques.id_chaine and date_releve_chaine = '2025-05-19'
        limit 10;
        `

        const results = await client.query(Query)
        client.release()

        return NextResponse.json(results.rows);
    } 
    catch (error) 
    {
        console.log('error in api : channels fetching',error)
        return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 });
    }
    
}