/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Ticket, 
  PlusCircle, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Check, 
  X, 
  TrendingUp, 
  Clock, 
  UserPlus, 
  BookOpen,
  Sliders,
  AlertCircle,
  Edit3,
  Phone,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Student, RaffleNumber, Booking, ClassSlot } from '../types';

interface AdminViewProps {
  students: Student[];
  raffleNumbers: RaffleNumber[];
  bookings: Booking[];
  classSlots: ClassSlot[];
  onAddStudent: (student: Omit<Student, 'id' | 'registrationDate'>) => void;
  onUpdateStudent: (id: string, updates: Partial<Student>) => void;
  onUpdateStudentPayment: (id: string, status: 'paid' | 'pending', amount: number) => void;
  onUpdateStudentDays: (id: string, days: string[]) => void;
  onDeleteStudent: (id: string) => void;
  onStartNewMonth: (monthName: string) => void;
  onApproveRaffle: (number: number) => void;
  onRejectRaffle: (number: number) => void;
  onDeleteBooking: (id: string) => void;
  onResetRaffleNumber: (number: number) => void;
  onManualRaffleReserve: (number: number, name: string, phone: string, transferDetails: string, status: 'pending' | 'confirmed') => void;
}

export default function AdminView({
  students,
  raffleNumbers,
  bookings,
  classSlots,
  onAddStudent,
  onUpdateStudent,
  onUpdateStudentPayment,
  onUpdateStudentDays,
  onDeleteStudent,
  onStartNewMonth,
  onApproveRaffle,
  onRejectRaffle,
  onDeleteBooking,
  onResetRaffleNumber,
  onManualRaffleReserve
}: AdminViewProps) {
  const [adminTab, setAdminTab] = useState<'dashboard' | 'payments' | 'raffle-approvals' | 'class-bookings'>('dashboard');
  const [pendingRaffleView, setPendingRaffleView] = useState<'grid' | 'list'>('list');
  const [showFullRaffleGrid, setShowFullRaffleGrid] = useState(false);

  // Search and filter states
  const [studentSearch, setStudentSearch] = useState('');
  const [studentPayFilter, setStudentPayFilter] = useState<'all' | 'paid' | 'pending'>('all');

  // Add student form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStuName, setNewStuName] = useState('');
  const [newStuPhone, setNewStuPhone] = useState('');
  const [newStuEmail, setNewStuEmail] = useState('');
  const [newStuPlan, setNewStuPlan] = useState('3 Días por semana');
  const [newStuPay, setNewStuPay] = useState<'paid' | 'pending'>('pending');
  const [newStuAmount, setNewStuAmount] = useState('130000');
  const [newStuDays, setNewStuDays] = useState<string[]>(['Lunes', 'Miércoles', 'Viernes']);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // Manual Raffle reservation states for Admin
  const [selectedAdminRaffle, setSelectedAdminRaffle] = useState<number | null>(null);
  const [adminRaffleName, setAdminRaffleName] = useState('');
  const [adminRafflePhone, setAdminRafflePhone] = useState('');
  const [adminRaffleTransfer, setAdminRaffleTransfer] = useState('Reserva manual de Administrador');
  const [adminRaffleStatus, setAdminRaffleStatus] = useState<'pending' | 'confirmed'>('confirmed');

  // Calculation values
  const totalRaffleTickets = 200;
  const raffleTicketPrice = 10000; // COP
  
  const pendingRaffleList = raffleNumbers.filter(rn => rn.status === 'pending');
  const confirmedRaffleList = raffleNumbers.filter(rn => rn.status === 'confirmed');
  
  const totalCollectedRaffle = confirmedRaffleList.length * raffleTicketPrice;
  const totalPendingRaffle = pendingRaffleList.length * raffleTicketPrice;

  const totalCollectedStudents = students
    .filter(s => s.paymentStatus === 'paid')
    .reduce((sum, s) => sum + s.amountPaid, 0);

  const totalPendingStudentsCollection = students
    .filter(s => s.paymentStatus === 'pending')
    .reduce((sum, s) => sum + (s.baseFee || 0), 0);

  const pendingStudentsCount = students.filter(s => s.paymentStatus === 'pending').length;
  const paidStudentsCount = students.filter(s => s.paymentStatus === 'paid').length;

  const ALL_WEEK_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Handle Add Student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStuName) return;

    if (editingStudentId) {
      onUpdateStudent(editingStudentId, {
        name: newStuName,
        phone: newStuPhone,
        email: newStuEmail,
        plan: newStuPlan,
        baseFee: Number(newStuAmount),
        paymentStatus: newStuPay,
        amountPaid: newStuPay === 'paid' ? Number(newStuAmount) : 0,
        preferredDays: newStuDays
      });
    } else {
      onAddStudent({
        name: newStuName,
        phone: newStuPhone,
        email: newStuEmail,
        plan: newStuPlan,
        baseFee: Number(newStuAmount),
        paymentStatus: newStuPay,
        amountPaid: newStuPay === 'paid' ? Number(newStuAmount) : 0,
        preferredDays: newStuDays,
        paymentMonth: 'Junio 2026'
      });
    }

    // Reset Form
    setNewStuName('');
    setNewStuPhone('');
    setNewStuEmail('');
    setNewStuPay('pending');
    setNewStuAmount('130000');
    setNewStuDays(['Lunes', 'Miércoles', 'Viernes']);
    setEditingStudentId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (student: Student) => {
    setEditingStudentId(student.id);
    setNewStuName(student.name);
    setNewStuPhone(student.phone);
    setNewStuEmail(student.email);
    setNewStuPlan(student.plan);
    setNewStuPay(student.paymentStatus);
    setNewStuAmount((student.baseFee || 0).toString());
    setNewStuDays(student.preferredDays);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNextMonthClick = () => {
    const nextMonthName = window.prompt("¿Deseas iniciar un nuevo mes? Esto pasará a todos los alumnos a estado PENDIENTE de pago.\\nIngresa el nombre del nuevo mes (ej: Julio 2026):");
    if (nextMonthName && nextMonthName.trim() !== "") {
      if (window.confirm(`¿Estás seguro de iniciar el mes de ${nextMonthName}?`)) {
        onStartNewMonth(nextMonthName.trim());
      }
    }
  };


  // Toggle preferred attendance days for students
  const togglePreferredDay = (studentId: string, currentDays: string[], day: string) => {
    let updated: string[];
    if (currentDays.includes(day)) {
      updated = currentDays.filter(d => d !== day);
    } else {
      updated = [...currentDays, day];
    }
    onUpdateStudentDays(studentId, updated);
  };

  // Toggle student day in "Add Student Form"
  const toggleFormDay = (day: string) => {
    if (newStuDays.includes(day)) {
      setNewStuDays(newStuDays.filter(d => d !== day));
    } else {
      setNewStuDays([...newStuDays, day]);
    }
  };

  // Handle Manual Raffle Reserve submission
  const handleAdminRaffleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAdminRaffle === null || !adminRaffleName) return;

    onManualRaffleReserve(
      selectedAdminRaffle,
      adminRaffleName,
      adminRafflePhone,
      adminRaffleTransfer,
      adminRaffleStatus
    );

    setSelectedAdminRaffle(null);
    setAdminRaffleName('');
    setAdminRafflePhone('');
    setAdminRaffleTransfer('Reserva manual de Administrador');
  };

  // Filter student list
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          student.phone.includes(studentSearch) || 
                          student.email.toLowerCase().includes(studentSearch.toLowerCase());

    let matchesPay = true;
    if (studentPayFilter === 'paid') matchesPay = student.paymentStatus === 'paid';
    if (studentPayFilter === 'pending') matchesPay = student.paymentStatus === 'pending';

    return matchesSearch && matchesPay;
  });

  return (
    <div className="space-y-8">
      {/* Admin Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-3 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20">
            <Sliders className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">PANEL DE CONTROL <span className="text-red-500">ADMINISTRATIVO</span></h2>
            <p className="text-xs text-zinc-400">Control centralizado de turnos, venta de rifas, cuotas y asistencia mensual.</p>
          </div>
        </div>

        <div className="flex overflow-x-auto scrollbar-none border-b border-zinc-800 p-1 bg-zinc-950 rounded-xl w-full md:max-w-fit gap-1">
          <button
            onClick={() => setAdminTab('dashboard')}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              adminTab === 'dashboard' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Métricas
          </button>
          <button
            onClick={() => setAdminTab('payments')}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              adminTab === 'payments' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Pagos y Alumnos
          </button>
          <button
            onClick={() => setAdminTab('raffle-approvals')}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              adminTab === 'raffle-approvals' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Aprobaciones Rifa ({pendingRaffleList.length})
          </button>
          <button
            onClick={() => setAdminTab('class-bookings')}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              adminTab === 'class-bookings' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Clases Reservadas ({bookings.length})
          </button>
        </div>
      </div>

      {/* ADMIN TABS CONTENT */}

      {/* DASHBOARD METRICS TAB */}
      {adminTab === 'dashboard' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main figures */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Box fees card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Caja Alumnos (Mes)</span>
                <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/15">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-black text-white">COP ${totalCollectedRaffle.toLocaleString()}</p>
              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <span>Alumnos Registrados: <b>{students.length}</b></span>
                <span className="text-emerald-400 font-bold">{paidStudentsCount} Abonados</span>
              </div>
            </div>

            {/* Total Student Monthly Income */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Total Recaudado Membresías</span>
                <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/15">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-black text-white">COP ${totalCollectedStudents.toLocaleString()}</p>
              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <span>Pendientes de Cobro: <b>{pendingStudentsCount}</b></span>
                <span className="text-amber-400 font-bold">-{totalPendingStudentsCollection.toLocaleString()} COP</span>
              </div>
            </div>

            {/* Raffle items sold */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Ventas Rifa (Confirmadas)</span>
                <span className="p-2 bg-red-600/10 text-red-500 rounded-lg border border-red-500/15">
                  <Ticket className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-black text-red-500">COP ${totalCollectedRaffle.toLocaleString()}</p>
              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <span>Números confirmados: <b>{confirmedRaffleList.length}</b> / 200</span>
                <span className="text-amber-500 font-bold">{pendingRaffleList.length} ptes.</span>
              </div>
            </div>

            {/* Bookings */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Asistencias Reservadas (Hoy)</span>
                <span className="p-2 bg-zinc-800 text-white rounded-lg border border-zinc-700">
                  <Calendar className="w-4 h-4" />
                </span>
              </div>
              <p className="text-3xl font-black text-white">{bookings.length} Turnos</p>
              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <span>Clases programadas: <b>{classSlots.length}</b></span>
                <span className="text-zinc-400">Semana completa</span>
              </div>
            </div>
          </div>

          {/* Quick analysis tools & lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Payment Summary */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Resumen de Membresías de Junio
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <div>
                    <p className="text-xs text-zinc-500">Total Abonados</p>
                    <p className="text-xl font-bold text-white">{paidStudentsCount} Alumnos</p>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg font-black border border-emerald-500/20">
                    {Math.round((paidStudentsCount / students.length) * 100)}% Al Día
                  </span>
                </div>

                <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <div>
                    <p className="text-xs text-zinc-500">Total Impagos</p>
                    <p className="text-xl font-bold text-white">{pendingStudentsCount} Alumnos</p>
                  </div>
                  <span className="text-xs bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-lg font-black border border-amber-500/20 animate-pulse">
                    {Math.round((pendingStudentsCount / students.length) * 100)}% Pendiente
                  </span>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-2">
                  <p className="text-xs text-zinc-400">Eficiencia Administrativa</p>
                  <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-800">
                    <div 
                      className="bg-emerald-500 h-full transition-all"
                      style={{ width: `${(paidStudentsCount / students.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">Se sugiere notificar por WhatsApp a los alumnos que figuren en estado Pendiente.</p>
                </div>
              </div>
            </div>

            {/* Quick Raffle status */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-red-500" />
                Venta de Rifa Exclusiva
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Vendido</p>
                    <p className="text-lg font-extrabold text-red-500">{confirmedRaffleList.length}</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Pediente</p>
                    <p className="text-lg font-extrabold text-amber-500">{pendingRaffleList.length}</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Disponible</p>
                    <p className="text-lg font-extrabold text-zinc-400">{200 - confirmedRaffleList.length - pendingRaffleList.length}</p>
                  </div>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Recaudación Confirmada:</span>
                    <span className="font-extrabold text-white">COP ${totalCollectedRaffle.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Recaudación en Espera:</span>
                    <span className="font-extrabold text-amber-400">COP ${totalPendingRaffle.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-zinc-800/80 pt-2 font-black">
                    <span className="text-zinc-300">Total Potencial (200 nros):</span>
                    <span className="text-red-500">COP $2,000,000</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* STUDENTS & PAYMENTS TAB */}
      {adminTab === 'payments' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Buscar por alumno, mail o teléfono..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs">
                <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                <select
                  value={studentPayFilter}
                  onChange={(e) => setStudentPayFilter(e.target.value as any)}
                  className="bg-transparent text-white focus:outline-none"
                >
                  <option className="bg-zinc-900 text-white" value="all">Todos los Estados</option>
                  <option className="bg-zinc-900 text-white" value="paid">Solo Abonados</option>
                  <option className="bg-zinc-900 text-white" value="pending">Solo Pendientes</option>
                </select>
              </div>

              <button
                onClick={() => {
                  if (showAddForm) {
                    setShowAddForm(false);
                    setEditingStudentId(null);
                  } else {
                    setNewStuName('');
                    setNewStuPhone('');
                    setNewStuEmail('');
                    setNewStuPay('pending');
                    setNewStuAmount('130000');
                    setNewStuDays(['Lunes', 'Miércoles', 'Viernes']);
                    setShowAddForm(true);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 transition active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                id="btn-add-student-toggle"
              >
                {showAddForm ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {showAddForm ? 'Cancelar' : 'Registrar Alumno'}
              </button>
            </div>
          </div>

          {/* Add Student Form */}
          {showAddForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >
              <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-zinc-800 flex items-center gap-2">
                {editingStudentId ? <Edit3 className="w-4 h-4 text-amber-500" /> : <PlusCircle className="w-4 h-4 text-red-500" />}
                {editingStudentId ? 'Editar Información del Alumno' : 'Nuevo Registro de Alumno y Plan Mensual'}
              </h3>

              <form onSubmit={handleAddStudentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Nombre de Alumno *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Marcelo Salas"
                      value={newStuName}
                      onChange={(e) => setNewStuName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Teléfono móvil</label>
                    <input
                      type="tel"
                      placeholder="Ej: +57 320 123 4567"
                      value={newStuPhone}
                      onChange={(e) => setNewStuPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Email corporativo/personal</label>
                    <input
                      type="email"
                      placeholder="Ej: marcelo@gmail.com"
                      value={newStuEmail}
                      onChange={(e) => setNewStuEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Descripción del Plan / Modalidad</label>
                    <input
                      type="text"
                      placeholder="Ej: 3 días, 1 clase, Pase Libre"
                      value={newStuPlan}
                      onChange={(e) => setNewStuPlan(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Estado de Pago del Mes</label>
                    <select
                      value={newStuPay}
                      onChange={(e) => setNewStuPay(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="pending">Pendiente (Sin pagar aún)</option>
                      <option value="paid">Abonado (Ya pagó)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Monto de la Cuota (COP)</label>
                    <input
                      type="number"
                      required
                      placeholder="Monto a cobrar/abonar"
                      value={newStuAmount}
                      onChange={(e) => setNewStuAmount(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Days Planner */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 block font-bold">Organización de Días de Asistencia en el Mes:</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_WEEK_DAYS.map((day) => {
                      const isSelected = newStuDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleFormDay(day)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            isSelected 
                              ? 'bg-red-600/20 border-red-500 text-red-400' 
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-zinc-500">Esto organiza los días fijos planificados para su control de asistencia recurrente.</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs uppercase cursor-pointer"
                  >
                    {editingStudentId ? 'Actualizar Alumno' : 'Guardar Alumno en la Base de Datos'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Payments Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-sm">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 mb-1">Abonado del Mes</p>
                <p className="text-2xl font-black text-emerald-500">${totalCollectedStudents.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-emerald-400/80 font-bold">{paidStudentsCount} Alumnos</p>
              </div>
            </div>
            
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-400 mb-1">Falta Cobrar</p>
                <p className="text-2xl font-black text-amber-500">${totalPendingStudentsCollection.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-amber-400/80 font-bold">{pendingStudentsCount} Alumnos</p>
              </div>
            </div>
          </div>

          {/* Students Grid/Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Base de Alumnos Registrados ({filteredStudents.length})</h3>
                <p className="text-[10px] text-zinc-500">Visualiza su situación de cuota y plan de entrenamiento del mes.</p>
              </div>
              <button
                onClick={handleStartNextMonthClick}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition rounded-lg text-[10px] font-bold uppercase tracking-wider border border-zinc-700 cursor-pointer shrink-0"
              >
                Arrancar Próximo Mes
              </button>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 italic">
                Ningún alumno coincide con los filtros especificados.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {filteredStudents.map((student) => {
                  return (
                    <div 
                      key={student.id} 
                      className="p-5 hover:bg-zinc-850/30 transition-all duration-150 flex flex-col xl:flex-row xl:items-center justify-between gap-6"
                      id={`student-row-${student.id}`}
                    >
                      {/* Left Block: Demographics */}
                      <div className="space-y-1.5 max-w-sm">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-white uppercase">{student.name}</h4>
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850">
                            ID: {student.id}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                          <span className="text-zinc-500">Plan:</span>
                          <span className="font-bold text-zinc-300">{student.plan}</span>
                          <span className="text-zinc-600">|</span>
                          <span className="text-zinc-500">Mes:</span>
                          <span className="font-bold text-zinc-300">{student.paymentMonth}</span>
                        </p>
                        <div className="text-[11px] text-zinc-500 space-y-0.5">
                          <p>Móvil: <span className="text-zinc-400 font-mono">{student.phone}</span></p>
                          <p>Email: <span className="text-zinc-400 font-mono">{student.email}</span></p>
                        </div>
                      </div>

                      {/* Middle Block: Attendance Calendar Setup (Días que van a ir) */}
                      <div className="space-y-2 flex-1 max-w-lg">
                        <p className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-red-500" />
                          Días de Asistencia Planificados ({student.preferredDays.length}):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {ALL_WEEK_DAYS.map((day) => {
                            const isSelected = student.preferredDays.includes(day);
                            return (
                              <button
                                key={day}
                                onClick={() => togglePreferredDay(student.id, student.preferredDays, day)}
                                className={`text-[10px] px-2 py-1 rounded font-bold border transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                                    : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-800'
                                }`}
                                title={`Haga clic para ${isSelected ? 'remover' : 'programar'} el día ${day}`}
                              >
                                {day.substring(0, 3)}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Block: Payment Status & Controls */}
                      <div className="flex flex-wrap items-center gap-4 bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80 min-w-fit">
                        
                        <div className="space-y-1 text-right min-w-[120px]">
                          <p className="text-[10px] text-zinc-500 uppercase font-bold">Estado Cuota</p>
                          {student.paymentStatus === 'paid' ? (
                            <button 
                              onClick={() => onUpdateStudentPayment(student.id, 'pending', 0)}
                              className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 px-2.5 py-1 rounded-full cursor-pointer transition"
                              title="Clic para marcar como Impago/Pendiente"
                            >
                              <CheckCircle className="w-3 h-3" />
                              ABONADO
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                const fee = student.baseFee || 0;
                                const inputAmount = window.prompt(`Ingresa el monto a cobrar para ${student.name}:`, fee.toString());
                                if (inputAmount !== null) {
                                  const parsed = parseInt(inputAmount, 10);
                                  if (!isNaN(parsed)) {
                                    onUpdateStudentPayment(student.id, 'paid', parsed);
                                  }
                                }
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 px-2.5 py-1 rounded-full animate-pulse cursor-pointer transition"
                              title="Clic para marcar como Abonado"
                            >
                              <AlertCircle className="w-3 h-3" />
                              PENDIENTE
                            </button>
                          )}
                          <div className="text-sm font-black text-white mt-1 flex items-center justify-end gap-2">
                            {student.paymentStatus === 'paid' ? `$${student.amountPaid.toLocaleString()}` : `$${(student.baseFee || 0).toLocaleString()}`}
                            {student.paymentStatus === 'paid' && (
                              <button
                                onClick={() => {
                                  const inputAmount = window.prompt(`Editar monto abonado por ${student.name}:`, student.amountPaid.toString());
                                  if (inputAmount !== null) {
                                    const parsed = parseInt(inputAmount, 10);
                                    if (!isNaN(parsed)) {
                                      onUpdateStudentPayment(student.id, 'paid', parsed);
                                    }
                                  }
                                }}
                                className="text-[10px] font-normal text-emerald-500 hover:text-emerald-400 underline transition cursor-pointer"
                                title="Editar monto abonado"
                              >
                                Editar
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-4">
                          <button
                            onClick={() => handleEditClick(student)}
                            className="p-2 bg-zinc-800/50 hover:bg-zinc-700/80 text-zinc-400 hover:text-white rounded-lg border border-zinc-700/50 transition cursor-pointer"
                            title="Editar Alumno"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`¿Seguro que deseas eliminar a ${student.name}?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg border border-red-500/25 transition cursor-pointer"
                            title="Eliminar Alumno"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* RAFFLE CONFIRMATIONS & MANAGEMENT TAB */}
      {adminTab === 'raffle-approvals' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main approvals queue */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-amber-500" />
                  Solicitudes de Rifa Pendientes de Validación
                </h3>
                <p className="text-xs text-zinc-400">Verifica que los alumnos hayan enviado correctamente su pago al alias <span className="font-bold text-white font-mono bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">aiken.box</span> antes de autorizar el número.</p>
              </div>
              
              <div className="flex bg-zinc-950 border border-zinc-800 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setPendingRaffleView('list')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition ${
                    pendingRaffleView === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Lista
                </button>
                <button
                  onClick={() => setPendingRaffleView('grid')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition ${
                    pendingRaffleView === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Grilla
                </button>
              </div>
            </div>

            {pendingRaffleList.length === 0 ? (
              <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center text-zinc-500 text-sm">
                No hay solicitudes de reserva pendientes en este momento.
              </div>
            ) : (
              <div className={pendingRaffleView === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
                {pendingRaffleList.map((rn) => (
                  <div key={rn.number} className={`bg-zinc-950 border border-zinc-800 rounded-xl p-5 ${pendingRaffleView === 'list' ? 'flex flex-col md:flex-row items-start md:items-center justify-between gap-6' : 'space-y-4'}`}>
                    
                    <div className="flex items-center gap-4 flex-1">
                      <span className="w-12 h-12 shrink-0 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center font-black text-lg">
                        #{rn.number}
                      </span>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Solicitado por</p>
                        <h4 className="text-sm font-black text-white uppercase">{rn.reservedByName}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs mt-1">
                          <span className="text-zinc-400 font-mono flex items-center gap-1"><Phone className="w-3 h-3"/> {rn.reservedByPhone}</span>
                          <span className="text-[9px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse border border-amber-500/20">
                            Pendiente
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`text-xs bg-zinc-900/60 p-3 rounded-lg border border-zinc-850 flex-1 min-w-[200px] ${pendingRaffleView === 'list' ? '' : 'w-full'}`}>
                      <p className="text-zinc-500">Ref: <span className="text-zinc-300 italic">"{rn.transferDetails}"</span></p>
                      {rn.reservedAt && <p className="text-zinc-600 mt-1">{new Date(rn.reservedAt).toLocaleString()}</p>}
                    </div>

                    <div className={`flex gap-2 ${pendingRaffleView === 'list' ? 'shrink-0' : 'w-full pt-1.5'}`}>
                      <button
                        onClick={() => onApproveRaffle(rn.number)}
                        className={`py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${pendingRaffleView === 'list' ? 'px-4' : 'flex-1'}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprobar Pago
                      </button>
                      <button
                        onClick={() => onRejectRaffle(rn.number)}
                        className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 rounded-lg text-xs flex items-center justify-center transition cursor-pointer"
                        title="Liberar Número"
                      >
                        <XCircle className="w-4 h-4" />
                        {pendingRaffleView === 'grid' && "Rechazar"}
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive full admin grid */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white">Visualizador Completo Rifa (1 - 200)</h3>
                <p className="text-xs text-zinc-400">Haz clic en cualquier número para forzar un cambio de estado, registrar una venta manual o liberar el casillero.</p>
              </div>
              
              <div className="flex flex-col sm:items-end gap-3">
                <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-zinc-950 border border-zinc-850" /> Disponible ({200 - confirmedRaffleList.length - pendingRaffleList.length})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-500/40" /> Pendiente ({pendingRaffleList.length})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-red-950/20 border border-red-900/40" /> Vendido ({confirmedRaffleList.length})
                  </span>
                </div>
                
                <button 
                  onClick={() => setShowFullRaffleGrid(!showFullRaffleGrid)}
                  className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  {showFullRaffleGrid ? (
                    <><ChevronUp className="w-4 h-4" /> Ocultar Cuadrícula</>
                  ) : (
                    <><ChevronDown className="w-4 h-4" /> Mostrar Cuadrícula</>
                  )}
                </button>
              </div>
            </div>

            {showFullRaffleGrid && (
              <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-20 gap-1 sm:gap-1.5 max-h-[400px] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin">
              {raffleNumbers.map((rn) => {
                const isPending = rn.status === 'pending';
                const isConfirmed = rn.status === 'confirmed';
                
                return (
                  <button
                    key={rn.number}
                    onClick={() => {
                      setSelectedAdminRaffle(rn.number);
                      if (isPending || isConfirmed) {
                        // Prefill values
                        setAdminRaffleName(rn.reservedByName || '');
                        setAdminRafflePhone(rn.reservedByPhone || '');
                        setAdminRaffleTransfer(rn.transferDetails || '');
                        setAdminRaffleStatus(rn.status);
                      } else {
                        setAdminRaffleName('');
                        setAdminRafflePhone('');
                        setAdminRaffleTransfer('Asignado manualmente por el Administrador');
                        setAdminRaffleStatus('confirmed');
                      }
                      
                      // Scroll to admin action form
                      setTimeout(() => {
                        document.getElementById('admin-raffle-action-box')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className={`aspect-square rounded-md sm:rounded-lg text-[9px] sm:text-[11px] font-bold flex flex-col items-center justify-center transition cursor-pointer ${
                      selectedAdminRaffle === rn.number
                        ? 'ring-2 ring-white scale-95 z-10 bg-zinc-400 text-black'
                        : isConfirmed
                        ? 'bg-red-950/25 border border-red-900/40 text-red-500 hover:border-red-500'
                        : isPending
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-500 hover:border-amber-400'
                        : 'bg-zinc-950 border border-zinc-850 text-zinc-500 hover:border-zinc-700 hover:text-white'
                    }`}
                    title={`Número ${rn.number} - ${rn.reservedByName || 'Disponible'}`}
                  >
                    {rn.number}
                  </button>
                );
              })}
            </div>
            )}

            {/* Quick action form for selected number in admin tab */}
            {selectedAdminRaffle !== null && (
              <div id="admin-raffle-action-box" className="mt-6 pt-6 border-t border-zinc-800/80 max-w-xl">
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                    <h4 className="text-sm font-black text-white uppercase">Acciones para el Número #{selectedAdminRaffle}</h4>
                    <button 
                      onClick={() => setSelectedAdminRaffle(null)}
                      className="p-1 text-zinc-500 hover:text-white text-xs"
                    >
                      Cerrar
                    </button>
                  </div>

                  <form onSubmit={handleAdminRaffleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">Nombre del Atleta *</label>
                        <input 
                          type="text" 
                          required
                          value={adminRaffleName}
                          placeholder="Ej: Marcelo Salas"
                          onChange={(e) => setAdminRaffleName(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">Teléfono móvil</label>
                        <input 
                          type="tel"
                          value={adminRafflePhone}
                          placeholder="Ej: +57 320 000"
                          onChange={(e) => setAdminRafflePhone(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold">Detalle / Notas de Pago</label>
                      <input 
                        type="text"
                        value={adminRaffleTransfer}
                        onChange={(e) => setAdminRaffleTransfer(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">Estado</label>
                        <select
                          value={adminRaffleStatus}
                          onChange={(e) => setAdminRaffleStatus(e.target.value as any)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                        >
                          <option value="pending">Pendiente (Aprobación)</option>
                          <option value="confirmed">Confirmado (Vendido)</option>
                        </select>
                      </div>

                      <div className="flex items-end gap-1.5">
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-red-600 hover:bg-red-700 transition text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Guardar Estado
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`¿Seguro que deseas liberar y resetear el número #${selectedAdminRaffle}?`)) {
                              onResetRaffleNumber(selectedAdminRaffle);
                              setSelectedAdminRaffle(null);
                            }
                          }}
                          className="p-2 bg-zinc-800 hover:bg-red-600 text-zinc-500 hover:text-white rounded-lg transition cursor-pointer"
                          title="Liberar Número / Borrar Registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* CLASS BOOKINGS MANAGEMENT TAB */}
      {adminTab === 'class-bookings' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-500" />
                Control de Reservas y Turnos de la Semana
              </h3>
              <p className="text-xs text-zinc-400">Listado de asistencias programadas por atletas. Puedes cancelar y liberar el cupo si el atleta da aviso previo.</p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
              No hay reservas registradas por alumnos todavía.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-850 text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">ID Reserva</th>
                    <th className="py-3 px-4">Alumno Atleta</th>
                    <th className="py-3 px-4">Clase / Turno</th>
                    <th className="py-3 px-4">Día / Hora</th>
                    <th className="py-3 px-4">Fecha de Solicitud</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40 text-zinc-300">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-zinc-850/20 transition-all duration-100">
                      <td className="py-3.5 px-4 font-mono text-zinc-500">#{booking.id}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-extrabold text-white uppercase">{booking.studentName}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{booking.studentPhone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded bg-zinc-950 text-zinc-300 font-semibold border border-zinc-850">
                          {booking.className}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-zinc-200">{booking.classDay}</p>
                        <p className="text-[10px] text-zinc-500">{booking.classTime}</p>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500">{booking.date}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`¿Seguro que deseas cancelar el turno de ${booking.studentName} para ${booking.className}?`)) {
                              onDeleteBooking(booking.id);
                            }
                          }}
                          className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg border border-red-500/20 transition cursor-pointer inline-flex items-center gap-1"
                          title="Cancelar Reserva"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Liberar Cupo</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
