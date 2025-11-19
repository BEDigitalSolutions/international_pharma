export interface User {
  id: number
  name: string
  email: string
  group: string
}

export const users: User[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@grifols.com',
    group: 'Data Entry Managers',
  },
  {
    id: 2,
    name: 'Maria Garcia',
    email: 'maria.garcia@grifols.com',
    group: 'Data Entry Managers',
  },
  {
    id: 3,
    name: 'Pierre Dubois',
    email: 'pierre.dubois@grifols.com',
    group: 'Country Users',
  },
  {
    id: 4,
    name: 'Anna Müller',
    email: 'anna.muller@grifols.com',
    group: 'Country Users',
  },
  {
    id: 5,
    name: 'David Johnson',
    email: 'david.johnson@grifols.com',
    group: 'Supervisors',
  },
]

export const groups = ['Data Entry Managers', 'Country Users', 'Supervisors', 'Read-Only Users']

export const groupFunctions: Record<string, string[]> = {
  'Data Entry Managers': ['Reports', 'Data Entry'],
  'Country Users': ['Reports', 'Data Entry', 'MasterData'],
  'Supervisors': ['Reports', 'Data Entry', 'MasterData', 'Users', 'Supervisor'],
  'Read-Only Users': ['Reports'],
}

