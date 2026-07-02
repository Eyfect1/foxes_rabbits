import type { Observation } from '../types'

export const initialObservations: Observation[] = [
  {
    id: 'obs_001',
    fox_id: 'fox_001',
    location: 'Северная поляна',
    color: 'рыжая',
    has_prey: true,
    suspicion_level: 8,
    time: '08:20',
  },
  {
    id: 'obs_002',
    fox_id: 'fox_002',
    location: 'Туманная тропа',
    color: 'черная',
    has_prey: false,
    suspicion_level: 5,
    time: '09:05',
  },
  {
    id: 'obs_003',
    fox_id: 'fox_001',
    location: 'Северная поляна',
    color: 'рыжая',
    has_prey: false,
    suspicion_level: 9,
    time: '10:40',
  },
]
