import { DtGenerico } from "@models/generico/dt-generico"
import { itemReporteAsistenciaTaller } from "@models/reportes/reportes-tallerista"

const dataList : itemReporteAsistenciaTaller[] = [
    {
      index: 1,
      asegurado: "Juan Perez",
      documento: "DNI",
      nroDocumento: "12345678",
      horaAsistencia: "08:00 AM",
      nuevo: true,
      cumpleAnio: false,
      idUsuario: 101,
      idUnidadOperativa: 201
    },
    {
      index: 2,
      asegurado: "Maria Gomez",
      documento: "DNI",
      nroDocumento: "87654321",
      horaAsistencia: "08:30 AM",
      nuevo: false,
      cumpleAnio: true,
      idUsuario: 102,
      idUnidadOperativa: 202
    },
    {
      index: 3,
      asegurado: "Carlos Rodriguez",
      documento: "DNI",
      nroDocumento: "11223344",
      horaAsistencia: "09:00 AM",
      nuevo: true,
      cumpleAnio: true,
      idUsuario: 103,
      idUnidadOperativa: 203
    },
    {
      index: 4,
      asegurado: "Ana Martinez",
      documento: "DNI",
      nroDocumento: "55667788",
      horaAsistencia: "09:30 AM",
      nuevo: false,
      cumpleAnio: false,
      idUsuario: 104,
      idUnidadOperativa: 204
    },
    {
      index: 5,
      asegurado: "Luis Garcia",
      documento: "DNI",
      nroDocumento: "99887766",
      horaAsistencia: "10:00 AM",
      nuevo: true,
      cumpleAnio: true,
      idUsuario: 105,
      idUnidadOperativa: 205
    },
    {
      index: 6,
      asegurado: "Carmen Sanchez",
      documento: "DNI",
      nroDocumento: "66778899",
      horaAsistencia: "10:30 AM",
      nuevo: false,
      cumpleAnio: false,
      idUsuario: 106,
      idUnidadOperativa: 206
    },
    {
      index: 7,
      asegurado: "Pedro Fernandez",
      documento: "DNI",
      nroDocumento: "33445566",
      horaAsistencia: "11:00 AM",
      nuevo: true,
      cumpleAnio: true,
      idUsuario: 107,
      idUnidadOperativa: 207
    },
    {
      index: 8,
      asegurado: "Luisa Torres",
      documento: "DNI",
      nroDocumento: "77889900",
      horaAsistencia: "11:30 AM",
      nuevo: false,
      cumpleAnio: false,
      idUsuario: 108,
      idUnidadOperativa: 208
    },
    {
      index: 9,
      asegurado: "Jorge Herrera",
      documento: "DNI",
      nroDocumento: "44556677",
      horaAsistencia: "12:00 PM",
      nuevo: true,
      cumpleAnio: true,
      idUsuario: 109,
      idUnidadOperativa: 209
    },
    {
      index: 10,
      asegurado: "Sofia Lopez",
      documento: "DNI",
      nroDocumento: "55667799",
      horaAsistencia: "12:30 PM",
      nuevo: false,
      cumpleAnio: false,
      idUsuario: 110,
      idUnidadOperativa: 210
    },
    {
      index: 11,
      asegurado: "Miguel Diaz",
      documento: "DNI",
      nroDocumento: "22334455",
      horaAsistencia: "01:00 PM",
      nuevo: true,
      cumpleAnio: true,
      idUsuario: 111,
      idUnidadOperativa: 211
    },
    {
      index: 12,
      asegurado: "Isabel Morales",
      documento: "DNI",
      nroDocumento: "66778811",
      horaAsistencia: "01:30 PM",
      nuevo: false,
      cumpleAnio: false,
      idUsuario: 112,
      idUnidadOperativa: 212
    },
    {
      index: 13,
      asegurado: "Ricardo Cruz",
      documento: "DNI",
      nroDocumento: "44556688",
      horaAsistencia: "02:00 PM",
      nuevo: true,
      cumpleAnio: true,
      idUsuario: 113,
      idUnidadOperativa: 213
    },
    {
      index: 14,
      asegurado: "Elena Ortiz",
      documento: "DNI",
      nroDocumento: "33445522",
      horaAsistencia: "02:30 PM",
      nuevo: false,
      cumpleAnio: false,
      idUsuario: 114,
      idUnidadOperativa: 214
    },
    {
      index: 15,
      asegurado: "Alejandro Ruiz",
      documento: "DNI",
      nroDocumento: "99880077",
      horaAsistencia: "03:00 PM",
      nuevo: true,
      cumpleAnio: true,
      idUsuario: 115,
      idUnidadOperativa: 215
    },
    {
      index: 16,
      asegurado: "Gabriela Chavez",
      documento: "DNI",
      nroDocumento: "22334488",
      horaAsistencia: "03:30 PM",
      nuevo: false,
      cumpleAnio: false,
      idUsuario: 116,
      idUnidadOperativa: 216
    },
    {
      index: 17,
      asegurado: "Oscar Mendoza",
      documento: "DNI",
      nroDocumento: "55667722",
      horaAsistencia: "04:00 PM",
      nuevo: true,
      cumpleAnio: true,
      idUsuario: 117,
      idUnidadOperativa: 217
    },
    {
      index: 18,
      asegurado: "Paula Flores",
      documento: "DNI",
      nroDocumento: "77889933",
      horaAsistencia: "04:30 PM",
      nuevo: false,
      cumpleAnio: false,
      idUsuario: 118,
      idUnidadOperativa: 218
    },
    {
      index: 19,
      asegurado: "Andres Guzman",
      documento: "DNI",
      nroDocumento: "33445511",
      horaAsistencia: "05:00 PM",
      nuevo: true,
      cumpleAnio: true,
      idUsuario: 119,
      idUnidadOperativa: 219
    },
    {
      index: 20,
      asegurado: "Rosa Alvarado",
      documento: "DNI",
      nroDocumento: "22334477",
      horaAsistencia: "05:30 PM",
      nuevo: false,
      cumpleAnio: false,
      idUsuario: 120,
      idUnidadOperativa: 220
    }
  ];

export let data : DtGenerico<itemReporteAsistenciaTaller> = {
  data : {
    list : dataList,
    pageNum : 1,
    pageSize : 10,
    total: 20,
},
code: 0,
message: "ok"
}