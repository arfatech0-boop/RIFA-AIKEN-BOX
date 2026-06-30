/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  name: string;
  description: string;
  intensity: 'Baja' | 'Media' | 'Alta' | 'Extrema';
  duration: string;
  benefits: string[];
}

export interface ClassSlot {
  id: string;
  name: string; // e.g. "CrossFit WOD", "Levantamiento Olímpico"
  day: string; // "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado"
  time: string; // e.g. "08:00 AM"
  coach: string;
  maxSpots: number;
  bookedCount: number;
}

export interface Booking {
  id: string;
  studentName: string;
  studentPhone: string;
  slotId: string;
  className: string;
  classDay: string;
  classTime: string;
  date: string; // e.g. "2026-06-30"
  status: 'confirmed' | 'pending';
}

export interface RaffleNumber {
  number: number; // 1-200
  status: 'available' | 'pending' | 'confirmed';
  reservedByName?: string;
  reservedByPhone?: string;
  transferDetails?: string;
  reservedAt?: string;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  email: string;
  plan: string;
  baseFee: number;
  paymentStatus: 'paid' | 'pending';
  amountPaid: number; // in COP
  preferredDays: string[]; // ["Lunes", "Miércoles", "Viernes"]
  registrationDate: string;
  paymentMonth: string; // e.g., "Junio 2026"
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'athlete' | 'admin';
}
