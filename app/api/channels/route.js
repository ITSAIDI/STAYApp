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
        const results = await client.query("select * from chaines  inner join chaines_metriques on chaines.id_chaine =  chaines_metriques.id_chaine order by nombre_vues_total desc limit 10;")
        client.release()

        return NextResponse.json(results.rows);
    } 
    catch (error) 
    {
        console.log('error in api : channels fetching',error)
        return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 });
    }
    
}