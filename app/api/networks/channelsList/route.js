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
                c.id_chaine,
                LOWER(c.nom) as nom,
                c.logo,
                c.date_creation,
                cm.nombre_abonnes_total
            FROM chaines c JOIN chaines_metriques cm ON c.id_chaine = cm.id_chaine
            WHERE pertinente = TRUE 
            AND cm.date_releve_chaine = (SELECT MAX(date_releve_chaine) FROM chaines_metriques);
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