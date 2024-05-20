import { AsistenciaLista } from "@models/control/asistencia/crud-asistencia.model";

export var dataFicticia: AsistenciaLista[] = [
    {
      marcar: false,
      orden: 1,
      nombres: 'Juan Perez',
      tipDoc: 'DNI',
      numDoc: '12345678',
      horaAsis: '08:30 AM',
      estadoAsistente: 'Presente'
    },
    {
      marcar: false,
      orden: 2,
      nombres: 'Maria Lopez',
      tipDoc: 'DNI',
      numDoc: '87654321',
      horaAsis: '08:45 AM',
      estadoAsistente: 'Ausente'
    },
    {
      marcar: false,
      orden: 3,
      nombres: 'Carlos Ruiz',
      tipDoc: 'Pasaporte',
      numDoc: 'A1234567',
      horaAsis: '09:00 AM',
      estadoAsistente: 'Presente'
    },
    {
      marcar: false,
      orden: 4,
      nombres: 'Luisa Fernandez',
      tipDoc: 'DNI',
      numDoc: '11223344',
      horaAsis: '08:55 AM',
      estadoAsistente: 'Tarde'
    }
  ];