// Sidebar-Nav-Items.jsx
import { 
  Home, 
  BarChart2, 
  Settings, 
  User,
  Users,
  Container,
  ReceiptText
} from 'lucide-react'

export const NAV_ITEMS = [
  { 
    icon: Home, 
    label: 'Inicio', 
    path: 'home' 
  },
  { 
    icon: ReceiptText,       
    label: 'Facturas', 
    path: 'bills' 
  },
  { 
    icon: Users,       
    label: 'Clientes',          
    path: 'clients' 
  },
  { 
    icon: Container,       
    label: 'Envios',          
    path: 'shipments' 
  },
  { 
    icon: BarChart2, 
    label: 'Reportes', 
    path: 'reports' 
  },
  { 
    icon: Settings, 
    label: 'Configuración', 
    path: 'settings' 
  },
  { 
    icon: User, 
    label: 'Perfil', 
    path: 'profile' 
  }
]
