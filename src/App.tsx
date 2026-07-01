import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Dumbbell, Sliders, Phone, Activity, ShieldAlert, ChevronRight, Info,
  Sparkles, Ticket, Instagram, Facebook, LogOut, User as UserIcon
} from 'lucide-react';
import { Service, ClassSlot, Booking, RaffleNumber, Student, User as UserType } from './types';
import { INITIAL_SERVICES, INITIAL_CLASS_SLOTS } from './data/initialData';
import AthleteView from './components/AthleteView';
import AdminView from './components/AdminView';
import LoginModal from './components/LoginModal';
import { supabase } from './lib/supabase';

export default function App() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const role = currentUser?.role || 'athlete';

  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [raffleNumbers, setRaffleNumbers] = useState<RaffleNumber[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // Fetch data from Supabase
  const fetchData = async () => {
    // Students
    const { data: studentsData } = await supabase.from('students').select('*');
    if (studentsData) {
      setStudents(studentsData.map(s => ({
        id: s.id,
        name: s.name,
        phone: s.phone,
        email: s.email,
        plan: s.plan,
        baseFee: s.base_fee,
        paymentStatus: s.payment_status,
        amountPaid: s.amount_paid,
        preferredDays: s.preferred_days,
        registrationDate: s.registration_date,
        paymentMonth: s.payment_month
      })));
    }

    // Raffle
    const { data: raffleData, error: raffleError } = await supabase.from('raffle_numbers').select('*').order('number');
    if (raffleData && raffleData.length > 0) {
      setRaffleNumbers(raffleData.map(r => ({
        number: r.number,
        status: r.status,
        reservedByName: r.reserved_by_name || undefined,
        reservedByPhone: r.reserved_by_phone || undefined,
        transferDetails: r.transfer_details || undefined,
        reservedAt: r.reserved_at || undefined
      })));
    } else {
      console.warn("Raffle data empty or error:", raffleError);
      setRaffleNumbers(Array.from({length: 200}, (_, i) => ({
        number: i + 1,
        status: 'available'
      })));
    }

    // Bookings
    const { data: bookingsData } = await supabase.from('bookings').select('*');
    if (bookingsData) {
      setBookings(bookingsData.map(b => ({
        id: b.id,
        studentName: b.student_name,
        studentPhone: b.student_phone,
        slotId: b.slot_id,
        className: b.class_name,
        classDay: b.class_day,
        classTime: b.class_time,
        date: b.date,
        status: b.status
      })));
    }
  };

  useEffect(() => {
    const savedUsers = localStorage.getItem('aiken_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    
    const savedSession = localStorage.getItem('aiken_session');
    if (savedSession) setCurrentUser(JSON.parse(savedSession));

    fetchData();

    // Supabase Realtime subscriptions
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'raffle_numbers' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const computedClassSlots = INITIAL_CLASS_SLOTS.map(slot => {
    const count = bookings.filter(b => b.slotId === slot.id).length;
    return { ...slot, bookedCount: count };
  });

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    localStorage.setItem('aiken_session', JSON.stringify(user));
    setShowLoginModal(false);
  };

  const handleRegister = (user: UserType) => {
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('aiken_users', JSON.stringify(updatedUsers));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aiken_session');
  };

  // --- HANDLERS FOR ATHLETE VIEW ---
  const handleAddBooking = async (bookingData: Omit<Booking, 'id' | 'status'>) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    const newId = 'res-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: newId,
      student_name: bookingData.studentName,
      student_phone: bookingData.studentPhone,
      slot_id: bookingData.slotId,
      class_name: bookingData.className,
      class_day: bookingData.classDay,
      class_time: bookingData.classTime,
      date: bookingData.date,
      status: 'confirmed'
    };

    await supabase.from('bookings').insert([newBooking]);
    await fetchData();
  };

  const handleReserveRaffle = async (numbers: number[], name: string, phone: string, transferDetails: string) => {
    for (const num of numbers) {
      await supabase.from('raffle_numbers').upsert({
        number: num,
        status: 'pending',
        reserved_by_name: name,
        reserved_by_phone: phone,
        transfer_details: transferDetails,
        reserved_at: new Date().toISOString()
      }, { onConflict: 'number' });
    }
    await fetchData();
  };

  // --- HANDLERS FOR ADMIN VIEW ---
  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'registrationDate'>) => {
    const newStudent = {
      id: 'alu-' + Math.floor(100 + Math.random() * 900),
      name: studentData.name,
      phone: studentData.phone,
      email: studentData.email,
      plan: studentData.plan,
      base_fee: studentData.baseFee,
      payment_status: studentData.paymentStatus,
      amount_paid: studentData.amountPaid,
      preferred_days: studentData.preferredDays,
      registration_date: new Date().toISOString().split('T')[0],
      payment_month: studentData.paymentMonth
    };
    await supabase.from('students').insert([newStudent]);
    await fetchData();
  };

  const handleUpdateStudent = async (id: string, updates: Partial<Student>) => {
    const sbUpdates: any = {};
    if (updates.name !== undefined) sbUpdates.name = updates.name;
    if (updates.phone !== undefined) sbUpdates.phone = updates.phone;
    if (updates.email !== undefined) sbUpdates.email = updates.email;
    if (updates.plan !== undefined) sbUpdates.plan = updates.plan;
    if (updates.baseFee !== undefined) sbUpdates.base_fee = updates.baseFee;
    if (updates.paymentStatus !== undefined) sbUpdates.payment_status = updates.paymentStatus;
    if (updates.amountPaid !== undefined) sbUpdates.amount_paid = updates.amountPaid;
    if (updates.preferredDays !== undefined) sbUpdates.preferred_days = updates.preferredDays;
    if (updates.paymentMonth !== undefined) sbUpdates.payment_month = updates.paymentMonth;

    if (Object.keys(sbUpdates).length > 0) {
      await supabase.from('students').update(sbUpdates).eq('id', id);
      await fetchData();
    }
  };

  const handleUpdateStudentPayment = async (id: string, status: 'paid' | 'pending', amount: number) => {
    await supabase.from('students').update({ payment_status: status, amount_paid: amount }).eq('id', id);
    await fetchData();
  };

  const handleUpdateStudentDays = async (id: string, days: string[]) => {
    await supabase.from('students').update({ preferred_days: days }).eq('id', id);
    await fetchData();
  };

  const handleStartNewMonth = async (monthName: string) => {
    // Note: To update all, Supabase requires eq or filter. Let's do a workaround by fetching and updating, or a simple trick.
    const { data } = await supabase.from('students').select('id');
    if (data) {
      for (const row of data) {
         await supabase.from('students').update({
           payment_status: 'pending',
           amount_paid: 0,
           payment_month: monthName
         }).eq('id', row.id);
      }
    }
    await fetchData();
  };

  const handleDeleteStudent = async (id: string) => {
    await supabase.from('students').delete().eq('id', id);
    await fetchData();
  };

  const handleApproveRaffle = async (number: number) => {
    await supabase.from('raffle_numbers').upsert({ number, status: 'confirmed' }, { onConflict: 'number' });
    await fetchData();
  };

  const handleRejectRaffle = async (number: number) => {
    await supabase.from('raffle_numbers').upsert({
      number,
      status: 'available',
      reserved_by_name: null,
      reserved_by_phone: null,
      transfer_details: null,
      reserved_at: null
    }, { onConflict: 'number' });
    await fetchData();
  };

  const handleResetRaffleNumber = async (number: number) => {
    await supabase.from('raffle_numbers').upsert({
      number,
      status: 'available',
      reserved_by_name: null,
      reserved_by_phone: null,
      transfer_details: null,
      reserved_at: null
    }, { onConflict: 'number' });
    await fetchData();
  };

  const handleManualRaffleReserve = async (
    number: number, name: string, phone: string, transferDetails: string, status: 'pending' | 'confirmed'
  ) => {
    await supabase.from('raffle_numbers').upsert({
      number,
      status,
      reserved_by_name: name,
      reserved_by_phone: phone,
      transfer_details: transferDetails,
      reserved_at: new Date().toISOString()
    }, { onConflict: 'number' });
    await fetchData();
  };

  const handleDeleteBooking = async (id: string) => {
    const targetBooking = bookings.find(b => b.id === id);
    if (!targetBooking) return;

    await supabase.from('bookings').delete().eq('id', id);
    await fetchData();
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans flex flex-col antialiased">
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur border-b border-zinc-900 py-3 px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-2">
          <div className="flex flex-col text-left leading-none">
            <span className="text-[10px] text-red-500 font-black tracking-widest uppercase">K O X</span>
            <span className="text-lg font-black text-white tracking-tight uppercase">AIKEN <span className="text-red-500">BOX</span></span>
          </div>
          <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-500 font-bold uppercase px-2 py-0.5 rounded-full ml-2">SISTEMA CENTRAL</span>
        </div>

        <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800/80 items-center shadow-inner gap-2">
          {currentUser ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-black text-white rounded-xl">
                {currentUser.role === 'admin' ? <Sliders className="w-3.5 h-3.5 text-red-500" /> : <Dumbbell className="w-3.5 h-3.5 text-red-500" />}
                <span className="uppercase">{currentUser.username}</span>
              </div>
              <button onClick={handleLogout} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-850 rounded-xl transition cursor-pointer" title="Cerrar sesión">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="px-4 py-2 text-xs font-black rounded-xl transition duration-200 flex items-center gap-2 cursor-pointer bg-red-600 text-white shadow-lg shadow-red-600/10">
              <UserIcon className="w-3.5 h-3.5" />
              INICIAR SESIÓN
            </button>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
          <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span className="text-emerald-500 font-semibold tracking-wide">CONECTADO A LA NUBE</span>
        </div>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8 space-y-12">
        {role === 'athlete' ? (
          <AthleteView services={services} classSlots={computedClassSlots} raffleNumbers={raffleNumbers} bookings={bookings} onAddBooking={handleAddBooking} onReserveRaffle={handleReserveRaffle} />
        ) : (
          <AdminView students={students} raffleNumbers={raffleNumbers} bookings={bookings} classSlots={computedClassSlots} onAddStudent={handleAddStudent} onUpdateStudent={handleUpdateStudent} onUpdateStudentPayment={handleUpdateStudentPayment} onUpdateStudentDays={handleUpdateStudentDays} onDeleteStudent={handleDeleteStudent} onStartNewMonth={handleStartNewMonth} onApproveRaffle={handleApproveRaffle} onRejectRaffle={handleRejectRaffle} onDeleteBooking={handleDeleteBooking} onResetRaffleNumber={handleResetRaffleNumber} onManualRaffleReserve={handleManualRaffleReserve} />
        )}
      </main>

      <footer className="bg-zinc-950 border-t border-zinc-900 py-10 px-4 md:px-8 mt-16 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-zinc-300 font-extrabold uppercase">AIKEN <span className="text-red-500">BOX</span></p>
            <p className="text-[11px] text-zinc-500 max-w-md">📍 49 e 20 y 21 Colón Bs As<br/>Planificación By BORA @borapico @borafuncional<br/><br/>Plataforma integrada de gestión deportiva.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2.5">
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition"><Facebook className="w-4 h-4" /></a>
            </div>
            <p className="text-[10px] font-mono">© 2026 Aiken Box. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} onRegister={handleRegister} users={users} />}
    </div>
  );
}
