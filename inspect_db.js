import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data: rentals, error: rErr } = await supabase.from('rentals').select('*');
    if (rErr) console.error("error rentals", rErr);
    else console.log("Rentals:", JSON.stringify(rentals, null, 2));

    const { data: cars, error: cErr } = await supabase.from('cars').select('*');
    if (cErr) console.error("error cars", cErr);
    else console.log("Cars:", JSON.stringify(cars, null, 2));

    if (rentals && rentals.length > 0) {
        for (const r of rentals) {
            const carStatus = r.status === 'Aktif' ? 'Disewa' : 'Tersedia';
            console.log(`Updating car ${r.car_id} to ${carStatus}`);
            const { error: updateErr, data: uData } = await supabase.from('cars').update({ status: carStatus }).eq('id', r.car_id).select();
            console.log("Update result:", updateErr ? "Error: " + JSON.stringify(updateErr) : "Success: " + JSON.stringify(uData));
        }
    }
}

main();
