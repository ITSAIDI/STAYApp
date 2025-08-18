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
        SELECT * FROM channelsMentions LIMIT 100;
        `
        const { rows } = await client.query(query)
        client.release()

        if (rows.length === 0) {
        return NextResponse.json({ nodes: [], links: [] })
        }

        const links = []
        const nodes = new Map()

        for (const row of rows) {
            if (nodes.size === 0 || nodes.has(row.sourcechannelid) || nodes.has(row.targetchannelid)) 
            {
                // Add source node if not already added
                if (!nodes.has(row.sourcechannelid)) {
                nodes.set(row.sourcechannelid, {
                    id: row.sourcechannelid,
                    logo: row.sourcelogo   // whatever field contains logo
                })
                }

                // Add target node if not already added
                if (!nodes.has(row.targetchannelid)) {
                nodes.set(row.targetchannelid, {
                    id: row.targetchannelid,
                    logo: row.targetlogo
                })
                }

                // Push the link
                links.push({
                source: row.sourcechannelid,
                target: row.targetchannelid,
                mentioncount: row.mentioncount
                })
            }
            }
        const nodesArray = Array.from(nodes.values());

        return NextResponse.json({ nodes: nodesArray,links})


    } 
    catch (error) 
    {
        console.log('error in api : mentions data',error)
        return NextResponse.json({ error: 'Failed to fetch mentions data' }, { status: 500 });
    }
    
}