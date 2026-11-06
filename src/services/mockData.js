export const INITIAL_SOLICITUDES = [
  {
    id: 'SOL-1041',
    title: 'Mantenimiento Correctivo Servidor Web',
    category: 'Infraestructura TI',
    client: 'Financiera del Norte',
    dateCreated: '2026-11-06 08:30',
    currentStatus: 'FINALIZADA',
    assignedTech: 'Ing. Carlos Mendoza',
    department: 'Soporte de Infraestructura y Redes',
    history: [
      { status: 'REGISTRADA', timestamp: '2026-11-06 08:30', message: 'Solicitud registrada mediante portal cliente.' },
      { status: 'RECIBIDA', timestamp: '2026-11-06 08:45', message: 'Asignada al Ing. Carlos Mendoza.' },
      { status: 'EN_PROCESO', timestamp: '2026-11-06 09:15', message: 'Reemplazo de fuente de poder redundante.' },
      { status: 'FINALIZADA', timestamp: '2026-11-06 10:40', message: 'Servicio concluido y pruebas de estrés validadas.' }
    ]
  },
  {
    id: 'SOL-1042',
    title: 'Instalación de Enlace Fibra Óptica',
    category: 'Telecomunicaciones',
    client: 'Corporativo Santa Fe',
    dateCreated: '2026-11-06 09:00',
    currentStatus: 'EN_PROCESO',
    assignedTech: 'Tec. Sofía Alarcón',
    department: 'Planta Externa y Conectividad',
    history: [
      { status: 'REGISTRADA', timestamp: '2026-11-06 09:00', message: 'Solicitud registrada por el cliente.' },
      { status: 'RECIBIDA', timestamp: '2026-11-06 09:30', message: 'Validada por mesa de control y asignada a cuadrilla.' },
      { status: 'EN_PROCESO', timestamp: '2026-11-06 10:15', message: 'Tendido de cableado estructurado en sitio.' }
    ]
  },
  {
    id: 'SOL-1043',
    title: 'Configuración de Firewall Perimetral',
    category: 'Ciberseguridad',
    client: 'Hospital San José',
    dateCreated: '2026-11-06 10:20',
    currentStatus: 'RECIBIDA',
    assignedTech: 'Lic. Roberto Garza',
    department: 'Seguridad Informática y SOC',
    history: [
      { status: 'REGISTRADA', timestamp: '2026-11-06 10:20', message: 'Solicitud ingresada con prioridad alta.' },
      { status: 'RECIBIDA', timestamp: '2026-11-06 10:35', message: 'Recibida por Ing. de Guardia en turno matutino.' }
    ]
  },
  {
    id: 'SOL-1044',
    title: 'Auditoría de Respaldo en la Nube',
    category: 'Cloud Services',
    client: 'Logística Continental',
    dateCreated: '2026-11-06 11:00',
    currentStatus: 'REGISTRADA',
    assignedTech: 'Por Asignar',
    department: 'Mesa de Ayuda TI',
    history: [
      { status: 'REGISTRADA', timestamp: '2026-11-06 11:00', message: 'Solicitud en cola general pendiente de asignación.' }
    ]
  }
];

export const STATUS_CONFIG = {
  REGISTRADA: {
    label: 'Solicitud Registrada',
    step: 1,
    color: '#2563EB', // Blue
    bgColor: '#EFF6FF',
    borderColor: '#93C5FD',
    icon: 'document-text-outline',
    defaultMessage: 'Tu solicitud ha sido registrada en el sistema con éxito.'
  },
  RECIBIDA: {
    label: 'Recibida por Personal',
    step: 2,
    color: '#D97706', // Amber/Yellow
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    icon: 'person-circle-outline',
    defaultMessage: 'Un técnico responsable ha recibido y validado tu solicitud.'
  },
  EN_PROCESO: {
    label: 'En Proceso',
    step: 3,
    color: '#EA580C', // Orange
    bgColor: '#FFF7ED',
    borderColor: '#FDBA74',
    icon: 'construct-outline',
    defaultMessage: 'El equipo técnico se encuentra trabajando en la solución de tu caso.'
  },
  FINALIZADA: {
    label: 'Solicitud Finalizada',
    step: 4,
    color: '#16A34A', // Green
    bgColor: '#F0FDF4',
    borderColor: '#86EFAC',
    icon: 'checkmark-circle-outline',
    defaultMessage: 'El servicio ha sido completado satisfactoriamente. ¡Gracias!'
  }
};
