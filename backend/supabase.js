const { createClient } = require('@supabase/supabase-js')

// Creamos el cliente de Supabase una sola vez y lo exportamos
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)

module.exports = supabase
