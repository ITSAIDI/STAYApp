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

const mapList = {
    views : 'nombre_vues_total',
    subscribers:'nombre_abonnes_total',
    videos:'nombre_videos_total'
}
export async function POST(request){
    try 
    {
        const body = await request.json() // Parse the variables


        console.log('Received body:', body)

        const client = await pool.connect() 
        const results = await client.query(`select * from chaines  inner join chaines_metriques on chaines.id_chaine =  chaines_metriques.id_chaine order by ${mapList[body.statChoice]} ${body.order} limit 10;`)
        client.release()
        
        return NextResponse.json(results.rows);
        
    } 
    catch (error) 
    {
        console.log('error in api : channels sorting',error)
        return NextResponse.json({ error: 'Failed to fetch sorted channels' }, { status: 500 });
    }

}








