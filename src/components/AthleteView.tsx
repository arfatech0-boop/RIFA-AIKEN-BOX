/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Dumbbell, 
  Calendar, 
  Clock, 
  Ticket, 
  User, 
  Check, 
  Phone, 
  Bike, 
  Shirt, 
  Sparkles, 
  ShieldAlert, 
  Info,
  MapPin,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Service, ClassSlot, Booking, RaffleNumber } from '../types';
import { DAYS_OF_WEEK } from '../data/initialData';

interface AthleteViewProps {
  services: Service[];
  classSlots: ClassSlot[];
  raffleNumbers: RaffleNumber[];
  bookings: Booking[];
  onAddBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
  onReserveRaffle: (numbers: number[], name: string, phone: string, transferDetails: string) => void;
}

export default function AthleteView({
  services,
  classSlots,
  raffleNumbers,
  bookings,
  onAddBooking,
  onReserveRaffle
}: AthleteViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>('raffle');
  
  // States for Booking
  const [selectedSlot, setSelectedSlot] = useState<ClassSlot | null>(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // States for Raffle
  const [selectedRaffleNums, setSelectedRaffleNums] = useState<number[]>([]);
  const [raffleName, setRaffleName] = useState('');
  const [rafflePhone, setRafflePhone] = useState('');
  const [raffleTransfer, setRaffleTransfer] = useState('');
  const [raffleSuccess, setRaffleSuccess] = useState(false);
  const [raffleFilter, setRaffleFilter] = useState<'all' | 'available' | 'reserved' | 'my-selections'>('all');

  // Handle number click in raffle grid
  const handleRaffleNumClick = (num: number, status: 'available' | 'pending' | 'confirmed') => {
    if (status !== 'available') return; // cannot select already pending/confirmed

    if (selectedRaffleNums.includes(num)) {
      setSelectedRaffleNums(selectedRaffleNums.filter(n => n !== num));
    } else {
      setSelectedRaffleNums([...selectedRaffleNums, num].sort((a, b) => a - b));
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !bookingName || !bookingPhone) return;

    onAddBooking({
      studentName: bookingName,
      studentPhone: bookingPhone,
      slotId: selectedSlot.id,
      className: selectedSlot.name,
      classDay: selectedSlot.day,
      classTime: selectedSlot.time,
      date: new Date().toISOString().split('T')[0] // today's date for demo
    });

    setBookingSuccess(true);
    setBookingName('');
    setBookingPhone('');
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedSlot(null);
    }, 3000);
  };

  const handleRaffleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRaffleNums.length === 0 || !raffleName || !rafflePhone) return;

    onReserveRaffle(selectedRaffleNums, raffleName, rafflePhone, 'A coordinar');
    setRaffleSuccess(true);
    setSelectedRaffleNums([]);
    setRaffleName('');
    setRafflePhone('');
    setRaffleTransfer('');
    
    setTimeout(() => {
      setRaffleSuccess(false);
    }, 4000);
  };

  // Group slots by day
  const slotsByDay = (day: string) => classSlots.filter(slot => slot.day === day);

  // Calculate stats
  const totalRaffleTickets = 200;
  const availableRaffleTickets = raffleNumbers.filter(n => n.status === 'available').length;
  const confirmedRaffleTickets = raffleNumbers.filter(n => n.status === 'confirmed').length;
  const pendingRaffleTickets = raffleNumbers.filter(n => n.status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 p-8 md:p-12 shadow-2xl">
        {/* Gritty overlay accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-zinc-800/20 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/20 px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-red-400">Box Oficial Aiken CrossFit</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-none">
            AIKEN <span className="text-red-500">BOX</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-zinc-400 leading-relaxed">
            Participa en nuestra gran rifa exclusiva para atletas de Aiken Box y gana increíbles premios.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setActiveSubTab('raffle')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 transition text-white font-bold rounded-xl shadow-lg shadow-red-600/20 inline-flex items-center gap-2 text-sm cursor-pointer"
              id="btn-hero-raffle"
            >
              <Ticket className="w-4 h-4" />
              Participar en la Rifa
            </button>
          </div>
        </div>

        {/* Dynamic Quick Info */}
        <div className="mt-12 pt-8 border-t border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-1">Ubicación</p>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                49 e 20 y 21
              </p>
          </div>
          <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-1">Coach Principal</p>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-red-500" />
                Michelle Melonari
              </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Números Rifa</p>
            <p className="text-sm font-medium text-white flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-red-500" />
              {availableRaffleTickets} Disponibles
            </p>
          </div>
          <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-1">Contacto Directo</p>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                2473 461737
              </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-zinc-800 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveSubTab('raffle')}
          className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'raffle'
              ? 'border-red-600 text-red-500'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
          id="tab-athlete-raffle"
        >
          <Ticket className="w-4 h-4 animate-bounce" />
          Rifa Aiken Box
          <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded-full font-black uppercase">¡Nueva!</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {/* SERVICES TAB */}
        {activeSubTab === 'services' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, idx) => (
              <div 
                key={service.id} 
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                id={`service-card-${service.id}`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <span className="p-3 rounded-xl bg-zinc-800 text-red-500 border border-zinc-700 inline-block">
                      {idx === 0 ? <Dumbbell className="w-6 h-6" /> : 
                       idx === 1 ? <Sparkles className="w-6 h-6" /> :
                       idx === 2 ? <User className="w-6 h-6" /> :
                       idx === 3 ? <Calendar className="w-6 h-6" /> :
                       <Info className="w-6 h-6" />}
                    </span>
                    <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-full ${
                      service.intensity === 'Extrema' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      service.intensity === 'Alta' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      service.intensity === 'Media' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      Intensidad {service.intensity}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">{service.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Beneficios clave:</p>
                    <ul className="space-y-1.5">
                      {service.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="text-xs text-zinc-300 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-zinc-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    Duración: {service.duration}
                  </span>
                  <button 
                    onClick={() => setActiveSubTab('schedule')}
                    className="text-red-500 font-bold hover:text-red-400 flex items-center gap-0.5 group cursor-pointer"
                  >
                    Ver Horarios
                    <ChevronRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* CLASS SCHEDULE TAB */}
        {activeSubTab === 'schedule' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Cronograma y Reserva de Clases</h3>
                  <p className="text-xs text-zinc-400 mt-1">Selecciona la clase a la que deseas asistir en la semana y reserva tu cupo instantáneamente.</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded bg-zinc-800 border border-zinc-700" /> Disponible
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded bg-red-500/20 border border-red-500/40" /> Últimos cupos
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-600" /> Completo
                  </span>
                </div>
              </div>

              {/* Weekly Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {DAYS_OF_WEEK.map((day) => {
                  const daySlots = slotsByDay(day);
                  return (
                    <div key={day} className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-4 flex flex-col space-y-3">
                      <div className="border-b border-zinc-800 pb-2 mb-1">
                        <h4 className="font-extrabold text-sm text-zinc-200 uppercase tracking-wide">{day}</h4>
                        <p className="text-[10px] text-zinc-500">{daySlots.length} clases hoy</p>
                      </div>

                      {daySlots.length === 0 ? (
                        <p className="text-xs text-zinc-600 italic py-4 text-center">Sin clases programadas</p>
                      ) : (
                        <div className="space-y-2.5">
                          {daySlots.map((slot) => {
                            const isFull = slot.bookedCount >= slot.maxSpots;
                            const isFillingFast = !isFull && (slot.maxSpots - slot.bookedCount) <= 3;
                            
                            return (
                              <div
                                key={slot.id}
                                onClick={() => {
                                  if (!isFull) {
                                    setSelectedSlot(slot);
                                    // Smooth scroll to form
                                    setTimeout(() => {
                                      document.getElementById('booking-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
                                    }, 100);
                                  }
                                }}
                                className={`group p-3 rounded-xl border text-left transition-all duration-150 ${
                                  isFull 
                                    ? 'bg-zinc-950 border-zinc-900/60 opacity-50 cursor-not-allowed'
                                    : selectedSlot?.id === slot.id
                                    ? 'bg-red-600/20 border-red-500 shadow-md ring-1 ring-red-500/50'
                                    : isFillingFast
                                    ? 'bg-red-950/10 border-red-500/30 hover:border-red-500/60 hover:bg-red-950/20 cursor-pointer'
                                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 cursor-pointer'
                                }`}
                                id={`slot-${slot.id}`}
                              >
                                <div className="flex items-center justify-between gap-1 mb-1.5">
                                  <span className="text-[11px] font-bold text-zinc-400 group-hover:text-white flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-red-500" />
                                    {slot.time}
                                  </span>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                    isFull ? 'bg-zinc-900 text-zinc-500 border border-zinc-800' :
                                    isFillingFast ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/30' :
                                    'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                  }`}>
                                    {slot.bookedCount}/{slot.maxSpots} Cupos
                                  </span>
                                </div>
                                <h5 className="text-xs font-black text-white truncate uppercase">{slot.name}</h5>
                                <p className="text-[10px] text-zinc-500 mt-1 truncate">Coach: {slot.coach}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Booking Form (Anchor / Interactive panel) */}
            <div id="booking-form-anchor" className="scroll-mt-8">
              {selectedSlot ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900 border border-red-500/30 rounded-2xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20">
                        <Dumbbell className="w-5 h-5" />
                      </span>
                      <div>
                        <h4 className="text-lg font-bold text-white">Completar Reserva de Turno</h4>
                        <p className="text-xs text-zinc-400">Reserva instantánea para la clase seleccionada.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedSlot(null)}
                      className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition"
                    >
                      <span className="text-xs font-bold">Cancelar</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Selected details card */}
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Resumen del Turno</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-zinc-400">Clase</p>
                          <p className="text-sm font-black text-white uppercase">{selectedSlot.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-zinc-400">Día</p>
                            <p className="text-sm font-bold text-zinc-200">{selectedSlot.day}</p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-400">Horario</p>
                            <p className="text-sm font-bold text-zinc-200">{selectedSlot.time}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400">Coach asignado</p>
                          <p className="text-sm font-bold text-zinc-200">{selectedSlot.coach}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400">Cupos disponibles</p>
                          <p className="text-sm font-bold text-emerald-400">{selectedSlot.maxSpots - selectedSlot.bookedCount} lugares libres</p>
                        </div>
                      </div>
                    </div>

                    {/* Booking Form Inputs */}
                    <div className="lg:col-span-2">
                      {bookingSuccess ? (
                        <div className="bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 p-6 rounded-xl flex flex-col items-center text-center space-y-3">
                          <span className="p-3 bg-emerald-500/20 rounded-full text-emerald-400">
                            <Check className="w-8 h-8" />
                          </span>
                          <h4 className="text-lg font-bold">¡Reserva Registrada Exitosamente!</h4>
                          <p className="text-sm text-zinc-300 max-w-md">Tu cupo para la clase de {selectedSlot.name} el {selectedSlot.day} a las {selectedSlot.time} ha sido registrado. Te esperamos listo para entrenar.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nombre Completo *</label>
                              <input 
                                type="text"
                                required
                                placeholder="Ej: Juan Pérez"
                                value={bookingName}
                                onChange={(e) => setBookingName(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Teléfono de Contacto *</label>
                              <input 
                                type="tel"
                                required
                                placeholder="Ej: +57 300 123 4567"
                                value={bookingPhone}
                                onChange={(e) => setBookingPhone(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition"
                              />
                            </div>
                          </div>

                          <div className="bg-zinc-950 border border-zinc-800/85 rounded-xl p-4 flex gap-3 text-xs text-zinc-400">
                            <Info className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <p>Recuerda asistir 10 minutos antes de la clase con ropa cómoda y tu propia hidratación. Si necesitas cancelar el turno, avisa con al menos 2 horas de anticipación.</p>
                          </div>

                          <div className="pt-2">
                            <button
                              type="submit"
                              className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.99] transition text-white font-extrabold rounded-xl shadow-lg shadow-red-600/20 text-sm cursor-pointer uppercase tracking-wider"
                            >
                              Confirmar Mi Reserva de Turno
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="border border-dashed border-zinc-800 rounded-2xl p-8 text-center text-zinc-500">
                  <Calendar className="w-8 h-8 mx-auto mb-3 text-zinc-700" />
                  <p className="text-sm font-medium">Haz clic en cualquier turno disponible del cronograma para iniciar el proceso de reserva.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* RAFFLE TICKET SALES TAB */}
        {activeSubTab === 'raffle' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Visual Recreation of the Flyer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Flyer card */}
              <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Brick-style top background accent */}
                <div className="bg-zinc-950 p-6 text-center border-b border-zinc-800 relative">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 opacity-25 font-black tracking-widest text-[40px] text-zinc-800 uppercase pointer-events-none">AIKEN</div>
                  <span className="text-red-500 font-extrabold text-sm tracking-widest uppercase block mb-1">KOY</span>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">AIKEN <span className="text-red-500">BOX</span></h3>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 mt-2 inline-block">SINCE 2026</span>
                </div>

                <div className="p-6 space-y-6 bg-amber-50/5 text-zinc-200">
                  <div className="text-center space-y-1">
                    <h4 className="text-xl font-black tracking-wider text-white uppercase bg-red-600/20 py-2 border-y border-red-500/20">RIFA EXCLUSIVA DEL BOX</h4>
                    <p className="text-xs text-red-400 font-bold tracking-widest uppercase pt-1">GIMNASIO CROSSFIT</p>
                  </div>

                  {/* Prizes visual panel */}
                  <div className="space-y-4">
                    <p className="text-xs font-black uppercase text-red-500 tracking-wider flex items-center gap-1.5 border-b border-zinc-800 pb-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" /> PREMIOS:
                    </p>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                        <span className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 flex-shrink-0">
                          <Bike className="w-8 h-8" />
                        </span>
                        <div>
                          <p className="text-xs text-amber-400 uppercase font-black tracking-wider">1º Premio Exclusivo</p>
                          <p className="text-base font-black text-white">¡BICICLETA NUEVA!</p>
                          <p className="text-[10px] text-zinc-500">Todo terreno, montañera de alto rendimiento</p>
                        </div>
                      </div>

                      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                        <span className="p-3 bg-zinc-800 text-red-400 rounded-xl border border-zinc-700 flex-shrink-0">
                          <Shirt className="w-8 h-8" />
                        </span>
                        <div>
                          <p className="text-xs text-zinc-400 uppercase font-bold">2º y 3º Premio</p>
                          <p className="text-sm font-bold text-white">PRENDA DE ROPA OFICIAL</p>
                          <p className="text-[10px] text-zinc-500">Remera o short técnico del box Aiken</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Valor y Transferencia */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 text-center space-y-4">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">VALOR DEL NÚMERO</p>
                      <p className="text-3xl font-black text-red-500">$10,000 COP</p>
                    </div>

                    <div className="border-t border-zinc-800/80 pt-3">
                      <p className="text-[10px] text-zinc-400 uppercase font-medium">NÚMEROS DISPONIBLES: <span className="font-bold text-white">1 - 200</span></p>
                    </div>

                    <div className="bg-red-600/10 border border-red-500/20 rounded-lg py-2 px-3">
                      <p className="text-[10px] text-red-400 uppercase font-bold tracking-widest">TRANSFERENCIAS AL ALIAS:</p>
                      <p className="text-lg font-black text-white select-all">aiken.box</p>
                    </div>

                    <p className="text-[11px] font-bold text-zinc-400 italic">¡Suerte a todos los atletas!</p>
                  </div>
                </div>
              </div>

              {/* Grid Selector and Booking panel */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
                    <div>
                      <h4 className="text-lg font-bold text-white">Selecciona tus Números de la Rifa</h4>
                      <p className="text-xs text-zinc-400">Haz clic para reservar uno o varios números disponibles.</p>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex flex-wrap gap-1.5">
                      <button 
                        onClick={() => setRaffleFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          raffleFilter === 'all' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Todos ({totalRaffleTickets})
                      </button>
                      <button 
                        onClick={() => setRaffleFilter('available')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          raffleFilter === 'available' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Libres ({availableRaffleTickets})
                      </button>
                      <button 
                        onClick={() => setRaffleFilter('reserved')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          raffleFilter === 'reserved' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Reservados ({pendingRaffleTickets + confirmedRaffleTickets})
                      </button>
                    </div>
                  </div>

                  {/* Grid of 200 numbers */}
                  <div className="max-h-[380px] overflow-y-auto pr-2 grid grid-cols-5 sm:grid-cols-10 gap-2 scrollbar-thin scrollbar-thumb-zinc-800">
                    {raffleNumbers
                      .filter(rn => {
                        if (raffleFilter === 'available') return rn.status === 'available';
                        if (raffleFilter === 'reserved') return rn.status !== 'available';
                        return true;
                      })
                      .map((rn) => {
                        const isSelected = selectedRaffleNums.includes(rn.number);
                        const isPending = rn.status === 'pending';
                        const isConfirmed = rn.status === 'confirmed';
                        
                        return (
                          <button
                            key={rn.number}
                            onClick={() => handleRaffleNumClick(rn.number, rn.status)}
                            disabled={isPending || isConfirmed}
                            className={`aspect-square rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center relative select-none cursor-pointer ${
                              isSelected
                                ? 'bg-red-500 text-white border-2 border-white/20 shadow-lg scale-95'
                                : isConfirmed
                                ? 'bg-red-950/20 border border-red-900/40 text-red-600 cursor-not-allowed opacity-60'
                                : isPending
                                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-500 cursor-not-allowed opacity-80'
                                : 'bg-zinc-950 border border-zinc-850 text-zinc-400 hover:border-zinc-700 hover:text-white hover:scale-105'
                            }`}
                            title={`Número ${rn.number} - ${
                              isConfirmed ? `Confirmado a ${rn.reservedByName}` : 
                              isPending ? `Reserva pendiente de ${rn.reservedByName}` : 'Disponible'
                            }`}
                            id={`raffle-num-${rn.number}`}
                          >
                            <span>{rn.number}</span>
                            {/* status dot indicators */}
                            {isConfirmed && <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1" />}
                            {isPending && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 animate-pulse" />}
                          </button>
                        );
                      })}
                  </div>

                  {/* Legends */}
                  <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-wrap justify-between items-center text-xs text-zinc-500 gap-4">
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-zinc-950 border border-zinc-850" /> Disponible</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-500/40" /> Pendiente (Admin verf.)</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-950/20 border border-red-900/40" /> Vendido / Bloqueado</span>
                    </div>
                    {selectedRaffleNums.length > 0 && (
                      <button 
                        onClick={() => setSelectedRaffleNums([])}
                        className="text-red-500 font-bold hover:underline"
                      >
                        Limpiar Selección
                      </button>
                    )}
                  </div>
                </div>

                {/* Reservation Form */}
                {selectedRaffleNums.length > 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-zinc-800">
                      <span className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
                        <Ticket className="w-5 h-5" />
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-white">Solicitar Números Elegidos</h4>
                        <p className="text-xs text-zinc-400">Total a abonar: <span className="font-black text-red-400">COP ${(selectedRaffleNums.length * 10000).toLocaleString()}</span></p>
                      </div>
                    </div>

                    <form onSubmit={handleRaffleSubmit} className="space-y-4">
                      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">Números Seleccionados:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedRaffleNums.map((n) => (
                            <span key={n} className="bg-red-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg">
                              #{n}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nombre Completo de Alumno *</label>
                          <input 
                            type="text"
                            required
                            placeholder="Ej: Facu Cascardo"
                            value={raffleName}
                            onChange={(e) => setRaffleName(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Teléfono de Contacto *</label>
                          <input 
                            type="tel"
                            required
                            placeholder="Ej: +57 320 000 0000"
                            value={rafflePhone}
                            onChange={(e) => setRafflePhone(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition"
                          />
                        </div>
                      </div>



                      <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex gap-3 text-xs text-zinc-400">
                        <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <p>Los números solicitados se reservarán provisionalmente a tu nombre. El administrador del box validará tu pago con el alias <span className="text-white font-bold font-mono">aiken.box</span> y confirmará tu cupo para que aparezca definitivo.</p>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] transition text-zinc-950 font-black rounded-xl shadow-lg text-sm uppercase tracking-wider cursor-pointer"
                      >
                        Enviar Solicitud de Reserva de Rifa
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  raffleSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 p-6 rounded-2xl flex items-center gap-4 shadow-xl"
                    >
                      <span className="p-3 bg-emerald-500/20 rounded-full text-emerald-400 flex-shrink-0">
                        <Check className="w-8 h-8" />
                      </span>
                      <div>
                        <h4 className="text-lg font-bold">¡Reserva Enviada Correctamente!</h4>
                        <p className="text-sm text-zinc-300">Tus números han quedado en estado <span className="text-amber-400 font-bold">Pendiente</span>. El administrador verificará la transferencia al alias <span className="font-mono text-white">aiken.box</span> para realizar la confirmación definitiva.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="border border-dashed border-zinc-800 rounded-2xl p-8 text-center text-zinc-500">
                      <Ticket className="w-8 h-8 mx-auto mb-3 text-zinc-700" />
                      <p className="text-sm">Por favor, haz clic en los números disponibles en el tablero para comenzar la reserva.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* MY CLASS BOOKINGS TAB */}
        {activeSubTab === 'my-bookings' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-2">Mis Turnos de Clase</h3>
              <p className="text-xs text-zinc-400 mb-6">Listado de reservas vigentes realizadas durante la simulación de esta sesión.</p>

              {bookings.length === 0 ? (
                <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
                  <User className="w-10 h-10 mx-auto mb-3 text-zinc-700" />
                  <p className="text-base font-semibold mb-1">Aún no has reservado ningún turno</p>
                  <p className="text-xs text-zinc-500 mb-4">Puedes consultar el cronograma de clases y agendarte.</p>
                  <button 
                    onClick={() => setActiveSubTab('schedule')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 transition text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Ver Cronograma de Clases
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between"
                      id={`booking-card-${booking.id}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-red-600/15 border border-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full font-black uppercase">
                            {booking.className}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">ID: {booking.id}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-1">
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase font-bold">Día</p>
                            <p className="text-sm font-bold text-white">{booking.classDay}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase font-bold">Hora</p>
                            <p className="text-sm font-bold text-white">{booking.classTime}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-900 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-[10px] text-zinc-500">Atleta</p>
                            <p className="font-semibold text-zinc-300">{booking.studentName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-500">Teléfono</p>
                            <p className="font-semibold text-zinc-300">{booking.studentPhone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/15">
                          <Check className="w-3.5 h-3.5" />
                          Cupo Asegurado
                        </span>
                        <span className="text-[10px] text-zinc-500">Fecha: {booking.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
