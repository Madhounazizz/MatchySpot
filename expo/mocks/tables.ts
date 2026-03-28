import { Table } from '@/types';

export const mockTables: Table[] = [
  {
    id: '1',
    number: 'T01',
    capacity: 2,
    status: 'available',
    location: 'Window Side'
  },
  {
    id: '2',
    number: 'T02',
    capacity: 4,
    status: 'available',
    location: 'Main Floor'
  },
  {
    id: '3',
    number: 'T03',
    capacity: 2,
    status: 'cleaning',
    location: 'Corner'
  },
  {
    id: '4',
    number: 'T04',
    capacity: 6,
    status: 'available',
    location: 'Private Area'
  },
  {
    id: '5',
    number: 'T05',
    capacity: 4,
    status: 'reserved',
    location: 'Main Floor',
    reservationId: '4'
  },
  {
    id: '6',
    number: 'T06',
    capacity: 2,
    status: 'occupied',
    location: 'Bar Area'
  },
  {
    id: '7',
    number: 'T07',
    capacity: 8,
    status: 'available',
    location: 'Private Dining'
  },
  {
    id: '8',
    number: 'T08',
    capacity: 6,
    status: 'occupied',
    location: 'Main Floor',
    reservationId: '3'
  },
  {
    id: '9',
    number: 'T09',
    capacity: 4,
    status: 'available',
    location: 'Patio'
  },
  {
    id: '10',
    number: 'T10',
    capacity: 2,
    status: 'available',
    location: 'Window Side'
  },
  {
    id: '11',
    number: 'T11',
    capacity: 4,
    status: 'available',
    location: 'Main Floor'
  },
  {
    id: '12',
    number: 'T12',
    capacity: 4,
    status: 'reserved',
    location: 'Window Side',
    reservationId: '1'
  }
];