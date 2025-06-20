import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('query');

  // Test of the query is empty, null or undefined
  if (!q || q.trim() === '') 
  {
    return NextResponse.json([]); // No suggestions
  }

  try 
  {
    const client = await pool.connect();

    const results = await client.query(
      `
        select * from chaines  inner join chaines_metriques  
        on chaines.id_chaine =  chaines_metriques.id_chaine  
        where lower(chaines.nom) like $1 
        order by chaines.nom  
        limit 5;
      `,
      [`%${q.toLowerCase()}%`]
    );

    client.release();

    return NextResponse.json(results.rows);

  } 
  catch (error) 
  {
    console.error('Error in API: channel search', error);
    return NextResponse.json(
      { error: 'Failed to search channels' },
      { status: 500 }
    );
  }
}
