/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, ClassSlot, Student, RaffleNumber } from '../types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Crossfit',
    description: 'El núcleo de nuestro entrenamiento. Combina gimnasia de alta resistencia, levantamiento olímpico de pesas y acondicionamiento metabólico intenso.',
    intensity: 'Extrema',
    duration: '60 min',
    benefits: ['Aumento de fuerza global', 'Mejora de resistencia cardiovascular', 'Desarrollo de comunidad y compañerismo']
  },
  {
    id: '2',
    name: 'Funcional',
    description: 'Entrenamiento basado en movimientos del día a día. Mejora tu acondicionamiento físico general con rutinas dinámicas y adaptables a todos los niveles.',
    intensity: 'Alta',
    duration: '60 min',
    benefits: ['Mejora de la movilidad', 'Acondicionamiento físico', 'Quema de calorías']
  },
  {
    id: '3',
    name: 'Kids',
    description: 'Programa diseñado especialmente para los más chicos. Enseña bases de movimiento seguro, trabajo en equipo y fomenta un estilo de vida activo.',
    intensity: 'Baja',
    duration: '45 min',
    benefits: ['Desarrollo motriz', 'Trabajo en equipo', 'Diversión segura']
  },
  {
    id: '4',
    name: 'HYROX',
    description: 'Entrenamiento híbrido de alta intensidad que combina running con workouts funcionales. Ideal para poner a prueba tu resistencia.',
    intensity: 'Extrema',
    duration: '60 min',
    benefits: ['Preparación para competición', 'Resistencia híbrida', 'Fuerza funcional']
  }
];

export const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const INITIAL_CLASS_SLOTS: ClassSlot[] = [
  // Lunes
  { id: 'lun-0700', name: 'Crossfit', day: 'Lunes', time: '07:00 AM', coach: 'Facu', maxSpots: 16, bookedCount: 12 },
  { id: 'lun-0830', name: 'Funcional', day: 'Lunes', time: '08:30 AM', coach: 'Facu', maxSpots: 16, bookedCount: 8 },
  { id: 'lun-1700', name: 'Kids', day: 'Lunes', time: '05:00 PM', coach: 'Nico', maxSpots: 10, bookedCount: 4 },
  { id: 'lun-1800', name: 'Crossfit', day: 'Lunes', time: '06:00 PM', coach: 'Nico', maxSpots: 16, bookedCount: 15 },
  { id: 'lun-1930', name: 'HYROX', day: 'Lunes', time: '07:30 PM', coach: 'Nico', maxSpots: 12, bookedCount: 12 },
  { id: 'lun-2030', name: 'Crossfit', day: 'Lunes', time: '08:30 PM', coach: 'Nico', maxSpots: 16, bookedCount: 9 },

  // Martes
  { id: 'mar-0700', name: 'Crossfit', day: 'Martes', time: '07:00 AM', coach: 'Nico', maxSpots: 16, bookedCount: 6 },
  { id: 'mar-0830', name: 'Funcional', day: 'Martes', time: '08:30 AM', coach: 'Nico', maxSpots: 16, bookedCount: 5 },
  { id: 'mar-1800', name: 'Crossfit', day: 'Martes', time: '06:00 PM', coach: 'Facu', maxSpots: 16, bookedCount: 14 },
  { id: 'mar-1930', name: 'HYROX', day: 'Martes', time: '07:30 PM', coach: 'Facu', maxSpots: 14, bookedCount: 13 },
  { id: 'mar-2030', name: 'Crossfit', day: 'Martes', time: '08:30 PM', coach: 'Facu', maxSpots: 16, bookedCount: 10 },

  // Miércoles
  { id: 'mie-0700', name: 'Crossfit', day: 'Miércoles', time: '07:00 AM', coach: 'Facu', maxSpots: 16, bookedCount: 10 },
  { id: 'mie-0830', name: 'Funcional', day: 'Miércoles', time: '08:30 AM', coach: 'Facu', maxSpots: 16, bookedCount: 7 },
  { id: 'mie-1700', name: 'Kids', day: 'Miércoles', time: '05:00 PM', coach: 'Nico', maxSpots: 10, bookedCount: 3 },
  { id: 'mie-1800', name: 'Crossfit', day: 'Miércoles', time: '06:00 PM', coach: 'Nico', maxSpots: 16, bookedCount: 16 },
  { id: 'mie-1930', name: 'HYROX', day: 'Miércoles', time: '07:30 PM', coach: 'Nico', maxSpots: 12, bookedCount: 11 },
  { id: 'mie-2030', name: 'Crossfit', day: 'Miércoles', time: '08:30 PM', coach: 'Nico', maxSpots: 16, bookedCount: 8 },

  // Jueves
  { id: 'jue-0700', name: 'Crossfit', day: 'Jueves', time: '07:00 AM', coach: 'Nico', maxSpots: 16, bookedCount: 8 },
  { id: 'jue-0830', name: 'Funcional', day: 'Jueves', time: '08:30 AM', coach: 'Nico', maxSpots: 16, bookedCount: 4 },
  { id: 'jue-1800', name: 'Crossfit', day: 'Jueves', time: '06:00 PM', coach: 'Facu', maxSpots: 16, bookedCount: 12 },
  { id: 'jue-1930', name: 'HYROX', day: 'Jueves', time: '07:30 PM', coach: 'Facu', maxSpots: 14, bookedCount: 11 },
  { id: 'jue-2030', name: 'Crossfit', day: 'Jueves', time: '08:30 PM', coach: 'Facu', maxSpots: 16, bookedCount: 7 },

  // Viernes
  { id: 'vie-0700', name: 'Crossfit', day: 'Viernes', time: '07:00 AM', coach: 'Facu', maxSpots: 16, bookedCount: 11 },
  { id: 'vie-0830', name: 'Funcional', day: 'Viernes', time: '08:30 AM', coach: 'Facu', maxSpots: 16, bookedCount: 9 },
  { id: 'vie-1700', name: 'Kids', day: 'Viernes', time: '05:00 PM', coach: 'Nico', maxSpots: 10, bookedCount: 5 },
  { id: 'vie-1800', name: 'Crossfit', day: 'Viernes', time: '06:00 PM', coach: 'Nico', maxSpots: 16, bookedCount: 15 },
  { id: 'vie-1930', name: 'HYROX', day: 'Viernes', time: '07:30 PM', coach: 'Nico', maxSpots: 12, bookedCount: 10 },
  { id: 'vie-2030', name: 'Crossfit', day: 'Viernes', time: '08:30 PM', coach: 'Nico', maxSpots: 16, bookedCount: 9 },

  // Sábado
  { id: 'sab-0900', name: 'Crossfit', day: 'Sábado', time: '09:00 AM', coach: 'Facu & Nico', maxSpots: 24, bookedCount: 22 },
  { id: 'sab-1030', name: 'HYROX', day: 'Sábado', time: '10:30 AM', coach: 'Facu & Nico', maxSpots: 24, bookedCount: 18 }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    name: 'Lautaro Gómez',
    phone: '+57 311 234 5678',
    email: 'lautaro@gmail.com',
    plan: '20 Clases (5x sem)',
    baseFee: 180000,
    paymentStatus: 'paid',
    amountPaid: 180000,
    preferredDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    registrationDate: '2026-06-01',
    paymentMonth: 'Junio 2026'
  },
  {
    id: 'stu-2',
    name: 'Valentina Restrepo',
    phone: '+57 315 456 7890',
    email: 'vale.restrepo@hotmail.com',
    plan: '12 Clases (3x sem)',
    baseFee: 130000,
    paymentStatus: 'paid',
    amountPaid: 130000,
    preferredDays: ['Lunes', 'Miércoles', 'Viernes'],
    registrationDate: '2026-06-03',
    paymentMonth: 'Junio 2026'
  },
  {
    id: 'stu-3',
    name: 'Mateo Cardona',
    phone: '+57 300 987 6543',
    email: 'mateoc@yahoo.com',
    plan: 'Pase Libre',
    baseFee: 220000,
    paymentStatus: 'pending',
    amountPaid: 0,
    preferredDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    registrationDate: '2026-06-05',
    paymentMonth: 'Junio 2026'
  },
  {
    id: 'stu-4',
    name: 'Camila Ospina',
    phone: '+57 312 777 8899',
    email: 'camilita.os@gmail.com',
    plan: '12 Clases (3x sem)',
    baseFee: 130000,
    paymentStatus: 'paid',
    amountPaid: 130000,
    preferredDays: ['Martes', 'Jueves', 'Sábado'],
    registrationDate: '2026-06-02',
    paymentMonth: 'Junio 2026'
  },
  {
    id: 'stu-5',
    name: 'Santiago Bedoya',
    phone: '+57 320 123 4567',
    email: 'santi.bedoya@gmail.com',
    plan: '20 Clases (5x sem)',
    baseFee: 180000,
    paymentStatus: 'pending',
    amountPaid: 0,
    preferredDays: ['Lunes', 'Miércoles', 'Jueves', 'Viernes'],
    registrationDate: '2026-06-08',
    paymentMonth: 'Junio 2026'
  },
  {
    id: 'stu-6',
    name: 'Mariana Duque',
    phone: '+57 318 654 3210',
    email: 'marianad@outlook.com',
    plan: 'Pase Libre',
    baseFee: 220000,
    paymentStatus: 'paid',
    amountPaid: 220000,
    preferredDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    registrationDate: '2026-06-01',
    paymentMonth: 'Junio 2026'
  },
  {
    id: 'stu-7',
    name: 'Andrés Felipe',
    phone: '+57 310 888 9911',
    email: 'andresf@gmail.com',
    plan: '12 Clases (3x sem)',
    baseFee: 130000,
    paymentStatus: 'pending',
    amountPaid: 0,
    preferredDays: ['Lunes', 'Miércoles', 'Viernes'],
    registrationDate: '2026-06-12',
    paymentMonth: 'Junio 2026'
  }
];

export const getInitialRaffleNumbers = (): RaffleNumber[] => {
  const list: RaffleNumber[] = [];
  for (let i = 1; i <= 200; i++) {
    // Let's seed a few reservations
    if (i === 12) {
      list.push({
        number: i,
        status: 'confirmed',
        reservedByName: 'Lautaro Gómez',
        reservedByPhone: '+57 311 234 5678',
        transferDetails: 'Alias aiken.box, ID Transf: #9921',
        reservedAt: '2026-06-25T14:32:00'
      });
    } else if (i === 45) {
      list.push({
        number: i,
        status: 'confirmed',
        reservedByName: 'Valentina Restrepo',
        reservedByPhone: '+57 315 456 7890',
        transferDetails: 'Transferencia Bancolombia exitosa',
        reservedAt: '2026-06-26T09:15:00'
      });
    } else if (i === 77) {
      list.push({
        number: i,
        status: 'pending',
        reservedByName: 'Mateo Cardona',
        reservedByPhone: '+57 300 987 6543',
        transferDetails: 'Pago pendiente de verificación - Ref #8812',
        reservedAt: '2026-06-29T10:00:00'
      });
    } else if (i === 150) {
      list.push({
        number: i,
        status: 'pending',
        reservedByName: 'Camila Ospina',
        reservedByPhone: '+57 312 777 8899',
        transferDetails: 'Transferido de Nequi a alias aiken.box',
        reservedAt: '2026-06-29T15:20:00'
      });
    } else {
      list.push({
        number: i,
        status: 'available'
      });
    }
  }
  return list;
};
