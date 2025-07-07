export const db = {
  trips: [
    {
      id: 1,
      vehicle: 'ABC-1234',
      driver: 'Veronica Herman',
      startLocation: 'Paris, France',
      stops: ['Lyon, France', 'Zurich, Switzerland'],
      endLocation: 'Rome, Italy',
      startTime: '2024-07-01T08:00:00',
      endTime: '2024-07-01T20:00:00',
      status: 'active',
      distanceKm: 1420,
      notes: 'Multi-stop delivery route'
    },
    {
      id: 2,
      vehicle: 'XYZ-5678',
      driver: 'Frank Jones',
      startLocation: 'Berlin, Germany',
      stops: ['Hamburg, Germany'],
      endLocation: 'Amsterdam, Netherlands',
      startTime: '2024-07-02T09:00:00',
      endTime: '2024-07-02T18:30:00',
      status: 'completed',
      distanceKm: 650,
      notes: 'Delivered on time'
    },
    {
      id: 3,
      vehicle: 'JKL-9101',
      driver: 'Helen Jacobs',
      startLocation: 'Madrid, Spain',
      stops: [],
      endLocation: 'Valencia, Spain',
      startTime: '2024-07-03T07:30:00',
      endTime: '2024-07-03T11:00:00',
      status: 'cancelled',
      distanceKm: 350,
      notes: 'Trip cancelled due to maintenance'
    },
    {
      id: 4,
      vehicle: 'MNO-2345',
      driver: 'William Miller',
      startLocation: 'Rome, Italy',
      stops: ['Naples, Italy'],
      endLocation: 'Vienna, Austria',
      startTime: '2024-07-04T10:00:00',
      endTime: '2024-07-04T22:00:00',
      status: 'active',
      distanceKm: 1120,
      notes: ''
    }
  ]
}
