-- Tabla de Alumnos
CREATE TABLE public.students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    plan TEXT NOT NULL,
    base_fee NUMERIC NOT NULL,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('paid', 'pending')),
    amount_paid NUMERIC NOT NULL,
    preferred_days JSONB NOT NULL DEFAULT '[]'::jsonb,
    registration_date TEXT NOT NULL,
    payment_month TEXT NOT NULL
);

-- Tabla de Números de Rifa
CREATE TABLE public.raffle_numbers (
    number INTEGER PRIMARY KEY,
    status TEXT NOT NULL CHECK (status IN ('available', 'pending', 'confirmed')),
    reserved_by_name TEXT,
    reserved_by_phone TEXT,
    transfer_details TEXT,
    reserved_at TEXT
);

-- Tabla de Turnos / Clases Reservadas (Opcional por ahora)
CREATE TABLE public.bookings (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    student_phone TEXT NOT NULL,
    slot_id TEXT NOT NULL,
    class_name TEXT NOT NULL,
    class_day TEXT NOT NULL,
    class_time TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('confirmed', 'pending'))
);

-- Inicializar la Rifa (Números del 1 al 200)
-- Ejecutar solo una vez
DO $$
BEGIN
    FOR i IN 1..200 LOOP
        INSERT INTO public.raffle_numbers (number, status)
        VALUES (i, 'available')
        ON CONFLICT (number) DO NOTHING;
    END LOOP;
END;
$$;
