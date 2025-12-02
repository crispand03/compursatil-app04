
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  FileText, 
  Shield, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  User,
  LogOut,
  Filter,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  FileCheck,
  Wrench,
  BookOpen,
  TrendingUp,
  Menu,
  X,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  MonitorSmartphone,
  Laptop,
  Tv,
  BarChart2,
  PieChart,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  MinusCircle,
  Truck
} from 'lucide-react';
import * as XLSX from 'xlsx';

// API Configuration
const API_BASE = 'http://localhost:3001/api';

// Componente Login separado y simplificado
const LoginComponent = ({ handleLogin, loginError, showPassword, setShowPassword }) => {
  const usernameInputRef = React.useRef(null);
  const passwordInputRef = React.useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    const username = usernameInputRef.current.value;
    const password = passwordInputRef.current.value;
    handleLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">COMPURSATIL</h1>
          <p className="text-gray-600">Sistema de Gestión de Inventarios</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de usuario
            </label>
            <input
              ref={usernameInputRef}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ingrese su usuario"
              defaultValue=""
              required
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 outline-none"
                placeholder="Ingrese su contraseña"
                defaultValue=""
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 pointer-events-auto"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          {loginError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {loginError}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">Credenciales de Prueba:</p>
          <div className="bg-gray-50 rounded p-3 space-y-1.5">
            <p><span className="font-medium text-blue-600">Gerente:</span> gerente / gerente123</p>
            <p><span className="font-medium text-green-600">Admin:</span> admin / admin123</p>
            <p><span className="font-medium text-orange-600">Vendedor:</span> vendedor / venta123</p>
            <p><span className="font-medium text-purple-600">Soporte:</span> soporte / sop123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState({ name: '', role: '', token: null });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [selectedSaleForReceipt, setSelectedSaleForReceipt] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loadingData, setLoadingData] = useState(true);
  
  // Verificar sesión guardada al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
        loadDataFromAPI(user.token);
      } catch (e) {
        console.error('Error al restaurar sesión:', e);
        localStorage.removeItem('currentUser');
      }
    }
    setLoadingData(false);
  }, []);
  
  // Función para traer datos de la API
  const loadDataFromAPI = async (token) => {
    try {
      setLoadingData(true);
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // Traer inventario
      const invRes = await fetch(`${API_BASE}/inventario`, { headers });
      if (invRes.ok) {
        const invData = await invRes.json();
        const processedInventory = (invData.data || []).map((item) => ({
          id: item.id,
          brand: item.marca,
          model: item.modelo,
          serial: item.numero_serie,
          ram: item.especificaciones_ram,
          storage: item.especificaciones_almacenamiento,
          processor: item.especificaciones_procesador,
          gpu: item.especificaciones_gpu || '',
          screen: item.especificaciones_pantalla || '',
          os: item.especificaciones_so || '',
          status: item.estado,
          supplier: item.proveedor_nombre || 'Desconocido',
          cost: item.costo_unitario,
          price: item.precio_venta,
          stock: item.stock,
          image: item.imagen || 'https://placehold.co/300x200/cccccc/666666?text=No+Image',
          addedDate: item.fecha_ingreso
        }));
        setInventory(processedInventory);
      }
      
      // Traer clientes
      const clientRes = await fetch(`${API_BASE}/clientes`, { headers });
      if (clientRes.ok) {
        const clientData = await clientRes.json();
        const processedClients = (clientData.data || []).map(client => ({
          id: client.id,
          name: client.nombre,
          document: client.numero_documento,
          documentType: client.tipo_documento,
          phone: client.telefono || '',
          email: client.email || '',
          address: client.direccion || '',
          city: client.ciudad || ''
        }));
        setCustomers(processedClients);
      }
      
      // Traer ventas
      const salesRes = await fetch(`${API_BASE}/ventas`, { headers });
      if (salesRes.ok) {
        const salesData = await salesRes.json();
        const processedSales = (salesData.data || []).map(sale => ({
          id: sale.id,
          date: sale.fecha,
          time: sale.hora,
          customer: sale.cliente_nombre,
          customerId: sale.cliente_id,
          items: [],
          total: sale.total,
          sellerName: sale.vendedor_nombre,
          seller: sale.vendedor_nombre,
          payment: sale.metodo_pago,
          documentType: sale.tipo_documento,
          documentNumber: sale.numero_documento,
          observations: sale.observaciones || ''
        }));
        setSales(processedSales);
      }
      
      // Traer garantías
      const warrantiesRes = await fetch(`${API_BASE}/garantias`, { headers });
      if (warrantiesRes.ok) {
        const warrantiesData = await warrantiesRes.json();
        const processedWarranties = (warrantiesData.data || []).map(warranty => ({
          id: warranty.id,
          serial: warranty.numero_serie,
          customerId: warranty.cliente_id,
          startDate: warranty.fecha_inicio,
          endDate: warranty.fecha_fin,
          status: warranty.estado,
          saleId: warranty.venta_id,
          warrantyType: warranty.tipo_garantia,
          technicalSupportId: warranty.soporte_tecnico_id || null
        }));
        setWarranties(processedWarranties);
      }
      
      // Traer casos técnicos
      const technicalRes = await fetch(`${API_BASE}/soporte`, { headers });
      if (technicalRes.ok) {
        const technicalData = await technicalRes.json();
        const processedCases = (technicalData.data || []).map(tc => ({
          id: tc.id,
          serial: tc.numero_serie,
          customerId: tc.cliente_id,
          equipmentModel: tc.modelo_equipo,
          documentNumber: tc.numero_documento,
          documentType: tc.tipo_documento,
          issue: tc.problema,
          diagnosis: tc.diagnostico,
          actions: tc.acciones_realizadas,
          status: tc.estado,
          technician: tc.tecnico,
          date: tc.fecha,
          warrantyStartDate: tc.fecha_garantia,
          supportType: tc.tipo_soporte,
          firstIntervention: tc.fecha_primera_intervencion,
          observations: tc.observaciones || ''
        }));
        setTechnicalCases(processedCases);
      }
      
      // Traer envíos
      const shipmentsRes = await fetch(`${API_BASE}/envios`, { headers });
      if (shipmentsRes.ok) {
        const shipmentsData = await shipmentsRes.json();
        console.log('Shipments API response:', shipmentsData);
        const processedShipments = (shipmentsData.data || []).map(ship => ({
          id: ship.id,
          nombre: ship.nombre_cliente || ship.nombre || '',
          documento: ship.numero_documento || '',
          telefono: ship.telefono || '',
          departamento: ship.departamento || '',
          provincia: ship.provincia || '',
          distrito: ship.distrito || '',
          agencia: ship.agencia || '',
          modalidad: ship.modalidad_envio || ship.modalidad || 'motorizado',
          costo: ship.costo_envio || ship.costo || 0,
          clave: ship.clave_seguimiento || ship.clave || '',
          razon: ship.razon_envio || ship.razon || 'envio',
          estado: ship.estado || 'Pendiente',
          fecha: ship.fecha_envio || ship.fecha || new Date().toISOString().split('T')[0]
        }));
        console.log('Processed shipments:', processedShipments);
        setShipments(processedShipments);
      } else {
        console.error('Shipments API error:', shipmentsRes.status, shipmentsRes.statusText);
      }
      
      // Traer extras
      const extrasRes = await fetch(`${API_BASE}/extras`, { headers });
      if (extrasRes.ok) {
        const extrasData = await extrasRes.json();
        const processedExtras = (extrasData.data || []).map(extra => ({
          id: extra.id,
          name: extra.nombre,
          price: extra.precio,
          category: extra.categoria || ''
        }));
        setExtraComponents(processedExtras);
      }
      
      setLoadingData(false);
    } catch (error) {
      console.error('Error cargando datos de la API:', error);
      setLoadingData(false);
    }
  };
  
  // Receipt configuration
  const [receiptConfig, setReceiptConfig] = useState({
    companyName: 'COMPURSATIL IMPORTACIONES',
    address: 'Av. Francisco Bolognesi 376 - Lima',
    phone: '987 654 321',
    ruc: '10078945612',
    logo: null
  });

  // Mock users for authentication with proper role names
  const mockUsers = [
    { username: 'gerente', password: 'gerente123', name: 'Gerente', role: 'Gerente' },
    { username: 'admin', password: 'admin123', name: 'Administrador', role: 'Administrador' },
    { username: 'vendedor', password: 'venta123', name: 'Vendedor', role: 'Vendedor' },
    { username: 'soporte', password: 'sop123', name: 'Soporte Técnico', role: 'Soporte' }
  ];

  // Categories for filtering and management
  const [categories, setCategories] = useState({
    processor: ['Intel Core i7 - 10ma Generación', 'Intel Core i5 - 14ta Generación', 'Intel Core i9 - 12va Generación', 'AMD Ryzen 7 - 5000 Serie', 'AMD Ryzen 5 - 4000 Serie'],
    ram: ['8GB DDR4', '16GB DDR4', '32GB DDR4', '64GB DDR4'],
    storage: ['256GB SSD NVMe', '512GB SSD NVMe', '1TB SSD NVMe', '2TB SSD NVMe'],
    gpu: ['Gráficos Integrados Intel', 'NVIDIA GeForce RTX 3060', 'NVIDIA GeForce RTX 4070', 'AMD Radeon RX 6700 XT'],
    screen: ['13.3 pulgadas Full HD', '14 pulgadas Full HD', '15.6 pulgadas Full HD', '17.3 pulgadas 4K'],
    os: ['Windows 11 Pro', 'Windows 10 Pro', 'Linux Ubuntu 22.04', 'Sin Sistema Operativo']
  });

  // Extra components pricing - fetched from API
  const [extraComponents, setExtraComponents] = useState([]);

  // Mock inventory data with enhanced fields and dates
  const [inventory, setInventory] = useState([]);

  // Sales data fetched from API
  const [sales, setSales] = useState([]);

  // Mock customers data
  const [customers, setCustomers] = useState([]);

  // Warranties data fetched from API
  const [warranties, setWarranties] = useState([]);

  // Technical cases data fetched from API
  const [technicalCases, setTechnicalCases] = useState([]);

  // Mock users data
  const [users, setUsers] = useState(mockUsers.map((user, index) => ({
    ...user,
    id: index + 1,
    status: 'Activo'
  })));

  // Shipments state for Shipment Tracking module - fetched from API
  const [shipments, setShipments] = useState([]);
  // Comentado: Ya no se necesita form data, modalidad es solo lectura desde API
  // const [shipmentFormData, setShipmentFormData] = useState({...});
  // const [showPasswordShipment, setShowPasswordShipment] = useState(false);
  // const [editingShipmentId, setEditingShipmentId] = useState(null);

  // Login handler - Recibe username y password como parámetros
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const userData = {
          name: data.user.nombre,
          role: data.user.role,
          username: data.user.username,
          token: data.token,
          id: data.user.id
        };
        setCurrentUser(userData);
        setIsLoggedIn(true);
        setLoginError('');
        setLoginUsername('');
        setLoginPassword('');
        localStorage.setItem('currentUser', JSON.stringify(userData));
        // Cargar datos después del login
        await loadDataFromAPI(data.token);
      } else {
        setLoginError(data.message || 'Error en la autenticación');
      }
    } catch (error) {
      setLoginError('Error de conexión: Backend en puerto 3001 no disponible');
      console.error('Login error:', error);
    }
  };

  // Fixed input handlers - Simple direct update without useCallback
  // Ahora se manejan directamente en LoginComponent con onChange inline

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser({ name: '', role: '', token: null });
    setActiveModule('dashboard');
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
    setInventory([]);
    setCustomers([]);
    setSales([]);
    setWarranties([]);
    setTechnicalCases([]);
    setShipments([]);
    setExtraComponents([]);
    localStorage.removeItem('currentUser');
  };

  // CRUD Operations
  const addInventoryItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: inventory.length + 1,
      image: newItem.image || `https://placehold.co/300x200/6366f1/white?text=${encodeURIComponent(newItem.brand + ' ' + newItem.model)}`,
      addedDate: new Date().toISOString().split('T')[0]
    };
    setInventory([...inventory, itemWithId]);
  };

  const updateInventoryItem = (updatedItem) => {
    setInventory(inventory.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const deleteInventoryItem = (id) => {
    if (window.confirm('¿Está seguro de eliminar este equipo del inventario?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const addCustomer = (newCustomer) => {
    const customerWithId = {
      ...newCustomer,
      id: customers.length + 1
    };
    setCustomers([...customers, customerWithId]);
    return customerWithId;
  };

  const updateCustomer = (updatedCustomer) => {
    setCustomers(customers.map(customer => 
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    ));
  };

  const deleteCustomer = (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      setCustomers(customers.filter(customer => customer.id !== id));
    }
  };

  const calculateIGV = (price) => {
    const subtotal = price / 1.18;
    const igv = price - subtotal;
    return { subtotal: parseFloat(subtotal.toFixed(2)), igv: parseFloat(igv.toFixed(2)) };
  };

  const generateDocumentNumber = (documentType) => {
    const prefix = documentType === 'Boleta' ? 'B001-' : 
                   documentType === 'Factura' ? 'F001-' : 
                   documentType === 'Proforma' ? 'P001-' : 'NV001-';
    
    // Find the highest existing number for this document type
    const existingNumbers = sales
      .filter(sale => sale.documentType === documentType)
      .map(sale => parseInt(sale.documentNumber.split('-')[1]))
      .filter(num => !isNaN(num));
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `${prefix}${String(nextNumber).padStart(6, '0')}`;
  };

  const validateDocumentNumber = (documentType, documentNumber, currentSaleId = null) => {
    const existing = sales.find(sale =>
      sale.documentType === documentType &&
      sale.documentNumber === documentNumber &&
      sale.id !== currentSaleId
    );
    return !existing;
  };

  const addSale = (newSale) => {
    // Calculate IGV for each item
    const itemsWithIGV = newSale.items.map(item => {
      const { subtotal, igv } = calculateIGV(item.price);
      return { ...item, subtotal, igv };
    });
    
    const saleWithId = {
      ...newSale,
      items: itemsWithIGV,
      id: sales.length + 1,
      date: newSale.date || new Date().toISOString().split('T')[0],
      time: newSale.time || new Date().toLocaleTimeString(),
      seller: currentUser.name
    };
    setSales([...sales, saleWithId]);
    
    // Update inventory stock
    const updatedInventory = inventory.map(item => {
      const soldItem = newSale.items.find(sold => sold.id === item.id);
      if (soldItem) {
        return { ...item, stock: item.stock - soldItem.quantity };
      }
      return item;
    });
    setInventory(updatedInventory);
    
    // Create warranty for each item sold
    newSale.items.forEach(item => {
      const invItem = inventory.find(i => i.id === item.id);
      if (invItem) {
        const warranty = {
          id: warranties.length + 1,
          serial: invItem.serial,
          customerId: parseInt(newSale.customerId),
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          status: 'Activa',
          saleId: saleWithId.id,
          warrantyType: 'Fabricante',
          technicalSupportId: null
        };
        setWarranties([...warranties, warranty]);
      }
    });
  };

  
  const updateSale = (updatedSale) => {
    // Recalculate IGV for updated items
    const itemsWithIGV = updatedSale.items.map(item => {
      const { subtotal, igv } = calculateIGV(item.price);
      return { ...item, subtotal, igv };
    });
    const total = itemsWithIGV.reduce((sum, it) => sum + (it.price || 0), 0);
    
    setSales(sales.map(sale => 
      sale.id === updatedSale.id ? { ...updatedSale, items: itemsWithIGV, total } : sale
    ));
  };


  const deleteSale = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta venta?')) {
      setSales(sales.filter(sale => sale.id !== id));
    }
  };

  const addTechnicalCase = (newCase) => {
    const caseWithId = {
      ...newCase,
      id: technicalCases.length + 1,
      technician: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      firstIntervention: newCase.supportType === 'Particular' ? new Date().toISOString().split('T')[0] : newCase.warrantyStartDate
    };
    setTechnicalCases([...technicalCases, caseWithId]);
  };

  const updateTechnicalCase = (updatedCase) => {
    setTechnicalCases(technicalCases.map(techCase => 
      techCase.id === updatedCase.id ? updatedCase : techCase
    ));
  };

  const deleteTechnicalCase = (id) => {
    if (window.confirm('¿Está seguro de eliminar este caso técnico?')) {
      setTechnicalCases(technicalCases.filter(techCase => techCase.id !== id));
    }
  };

  const addCategory = (categoryType, value) => {
    setCategories(prev => ({
      ...prev,
      [categoryType]: [...prev[categoryType], value]
    }));
  };

  const deleteCategory = (categoryType, value) => {
    if (window.confirm(`¿Está seguro de eliminar "${value}" de ${categoryType}?`)) {
      setCategories(prev => ({
        ...prev,
        [categoryType]: prev[categoryType].filter(item => item !== value)
      }));
    }
  };

  const addExtraComponent = (newExtra) => {
    const extraWithId = {
      ...newExtra,
      id: extraComponents.length + 1
    };
    setExtraComponents([...extraComponents, extraWithId]);
  };

  const deleteExtraComponent = (id) => {
    if (window.confirm('¿Está seguro de eliminar este componente extra?')) {
      setExtraComponents(extraComponents.filter(extra => extra.id !== id));
    }
  };

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, roles: ['Gerente', 'Administrador', 'Vendedor', 'Soporte'] },
    { id: 'inventory', name: 'Inventario', icon: Package, roles: ['Gerente', 'Administrador', 'Vendedor'] },
    { id: 'sales', name: 'Ventas', icon: ShoppingBag, roles: ['Gerente', 'Administrador', 'Vendedor'] },
    { id: 'customers', name: 'Clientes', icon: Users, roles: ['Gerente', 'Administrador', 'Vendedor'] },
    { id: 'technical', name: 'Soporte Técnico', icon: Wrench, roles: ['Gerente', 'Soporte'] },
    { id: 'shipmentTracking', name: 'Envíos', icon: Truck, roles: ['Gerente', 'Administrador', 'Vendedor'] },
    { id: 'reports', name: 'Reportes', icon: FileText, roles: ['Gerente'] },
    { id: 'users', name: 'Usuarios', icon: Shield, roles: ['Gerente'] },
    { id: 'categories', name: 'Categorías', icon: Settings, roles: ['Gerente'] },
    { id: 'receiptConfig', name: 'Config. Recibo', icon: FileText, roles: ['Gerente'] },
    { id: 'supportTracking', name: 'Seguimiento Soporte', icon: Clock, roles: ['Gerente', 'Administrador', 'Vendedor', 'Soporte'] }
  ];

  const filteredModules = modules.filter(module => 
    module.roles.includes(currentUser.role)
  );

  const Sidebar = () => (
    <div className={`bg-gray-800 text-white min-h-screen transition-all duration-300 flex flex-col fixed left-0 top-0 h-screen ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!sidebarCollapsed && (
          <>
            <div>
              <h1 className="text-xl font-bold">COMPURSATIL</h1>
              <p className="text-xs text-gray-400">Sistema de Gestión</p>
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </>
        )}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-400 hover:text-white w-full flex justify-center"
          >
            <Menu size={24} />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4">
          {filteredModules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
                  activeModule === module.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                title={sidebarCollapsed ? module.name : ''}
              >
                <Icon size={20} />
                {!sidebarCollapsed && module.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gray-600 rounded-full p-2">
              <User size={20} />
            </div>
            <div>
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-xs text-gray-400">{currentUser.role}</p>
            </div>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-2 text-gray-300 hover:text-white w-full p-2 rounded transition-colors hover:bg-gray-700 ${sidebarCollapsed ? 'justify-center' : ''}`}
          title={sidebarCollapsed ? 'Cerrar Sesión' : ''}
        >
          <LogOut size={16} />
          {!sidebarCollapsed && 'Cerrar Sesión'}
        </button>
      </div>
    </div>
  );

  const Login = () => {
    return (
      <LoginComponent
        handleLogin={handleLogin}
        loginError={loginError}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    );
  };

  const Dashboard = () => {
    const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.cost * item.stock), 0);
    const totalSalesValue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const lowStockItems = inventory.filter(item => item.stock <= 2).length;
    const totalSalesCount = sales.length;
    const recentSales = sales.slice(-3).reverse();
    const recentTechCases = technicalCases.slice(-3).reverse();
    
    // Calculate sales data from real sales
    const salesByMonth = {};
    sales.forEach(sale => {
      const date = new Date(sale.date);
      const monthIndex = date.getMonth();
      const monthName = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][monthIndex];
      
      if (!salesByMonth[monthName]) {
        salesByMonth[monthName] = 0;
      }
      salesByMonth[monthName] += sale.total;
    });
    
    // Generate complete month data with actual sales
    const allMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const salesData = allMonths.map(month => ({
      month,
      sales: salesByMonth[month] || 0
    }));
    
    const maxSales = Math.max(...salesData.map(d => d.sales), 45000);
    
    const productDistribution = inventory.reduce((acc, item) => {
      const existing = acc.find(i => i.brand === item.brand);
      if (existing) {
        existing.count += item.stock;
      } else {
        acc.push({ brand: item.brand, count: item.stock });
      }
      return acc;
    }, []);
    
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Dashboard - COMPURSATIL</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Valor Inventario</p>
                <p className="text-xl font-bold text-blue-600">S/. {totalInventoryValue.toLocaleString('es-PE')}</p>
              </div>
              <Package className="text-blue-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ventas Totales</p>
                <p className="text-xl font-bold text-green-600">S/. {totalSalesValue.toLocaleString('es-PE')}</p>
              </div>
              <ShoppingBag className="text-green-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Clientes</p>
                <p className="text-xl font-bold text-purple-600">{customers.length}</p>
              </div>
              <Users className="text-purple-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Alertas Stock</p>
                <p className="text-xl font-bold text-orange-600">{lowStockItems}</p>
              </div>
              <AlertTriangle className="text-orange-500" size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2 flex items-center gap-1">
              <BarChart2 size={16} />
              Ventas por Mes
            </h3>
            <div className="h-48 flex items-end justify-between gap-1">
              {salesData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" 
                    style={{height: `${(data.sales / maxSales) * 100}%`, minHeight: data.sales > 0 ? '4px' : '0px'}}
                    title={`${data.month}: S/. ${data.sales.toLocaleString('es-PE')}`}
                  ></div>
                  <span className="text-xs mt-1">{data.month}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">Total de ventas: S/. {totalSalesValue.toLocaleString('es-PE')}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2 flex items-center gap-1">
              <PieChart size={16} />
              Distribución de Marcas
            </h3>
            <div className="space-y-2">
              {productDistribution.map((brandData, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full" 
                      style={{width: `${(brandData.count / inventory.reduce((sum, i) => sum + i.stock, 0)) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{brandData.brand}</span>
                  <span className="text-sm text-gray-600">{brandData.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Últimas Ventas</h3>
            <div className="space-y-3">
              {recentSales.map(sale => (
                <div key={sale.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <div className="bg-green-100 p-1 rounded-full">
                    <ShoppingBag size={12} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{sale.customer}</p>
                    <p className="text-xs text-gray-600">
                      {sale.documentType}: {sale.documentNumber} • S/. {sale.total.toLocaleString('es-PE')} • {sale.date} {sale.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Casos Técnicos Recientes</h3>
            <div className="space-y-3">
              {recentTechCases.map(caseItem => (
                <div key={caseItem.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <div className="bg-orange-100 p-1 rounded-full">
                    <Wrench size={12} className="text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{caseItem.equipmentModel}</p>
                    <p className="text-xs text-gray-600">
                      {caseItem.status} • {caseItem.date} • {caseItem.technician}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InventoryModule = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
      brand: '',
      model: '',
      serial: '',
      ram: '',
      storage: '',
      processor: '',
      gpu: '',
      screen: '',
      os: '',
      status: 'Nuevo',
      supplier: '',
      cost: '',
      price: '',
      stock: '',
      image: ''
    });

    const brands = [...new Set(inventory.map(item => item.brand))];
    const filteredInventory = inventory.filter(item =>
      (!selectedBrand || item.brand === selectedBrand) &&
      (item.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (editingItem) {
        updateInventoryItem({ ...editingItem, ...formData });
        setEditingItem(null);
      } else {
        addInventoryItem(formData);
      }
      setFormData({
        brand: '',
        model: '',
        serial: '',
        ram: '',
        storage: '',
        processor: '',
        gpu: '',
        screen: '',
        os: '',
        status: 'Nuevo',
        supplier: '',
        cost: '',
        price: '',
        stock: '',
        image: ''
      });
      setShowAddForm(false);
    };

    const handleEdit = (item) => {
      setEditingItem(item);
      setFormData({
        brand: item.brand,
        model: item.model,
        serial: item.serial,
        ram: item.ram,
        storage: item.storage,
        processor: item.processor,
        gpu: item.gpu || '',
        screen: item.screen || '',
        os: item.os || '',
        status: item.status,
        supplier: item.supplier,
        cost: item.cost,
        price: item.price,
        stock: item.stock,
        image: item.image
      });
      setShowAddForm(true);
    };

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Gestión de Inventario - COMPURSATIL</h2>
          {['Administrador', 'Gerente'].includes(currentUser.role) && (
            <button 
              onClick={() => {
                setShowAddForm(true);
                setEditingItem(null);
                setFormData({
                  brand: '',
                  model: '',
                  serial: '',
                  ram: '',
                  storage: '',
                  processor: '',
                  gpu: '',
                  screen: '',
                  os: '',
                  status: 'Nuevo',
                  supplier: '',
                  cost: '',
                  price: '',
                  stock: '',
                  image: ''
                });
              }}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-blue-700"
            >
              <Plus size={14} />
              Nuevo Equipo
            </button>
          )}
          {currentUser.role === 'Vendedor' && (
            <span className="text-gray-500 text-sm">Modo visualización</span>
          )}
        </div>

        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por número de serie, marca, modelo o estado..."
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todas las marcas</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">
                    {editingItem ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
                  </h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    name="brand"
                    placeholder="Marca"
                    className="border p-1.5 rounded text-sm"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="model"
                    placeholder="Modelo"
                    className="border p-1.5 rounded text-sm"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="serial"
                    placeholder="Número de Serie"
                    className="border p-1.5 rounded text-sm"
                    value={formData.serial}
                    onChange={handleInputChange}
                    required
                  />
                  <select
                    name="ram"
                    className="border p-1.5 rounded text-sm"
                    value={formData.ram}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar RAM</option>
                    {categories.ram.map(ram => (
                      <option key={ram} value={ram}>{ram}</option>
                    ))}
                  </select>
                  <select
                    name="storage"
                    className="border p-1.5 rounded text-sm"
                    value={formData.storage}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar Almacenamiento</option>
                    {categories.storage.map(storage => (
                      <option key={storage} value={storage}>{storage}</option>
                    ))}
                  </select>
                  <select
                    name="processor"
                    className="border p-1.5 rounded text-sm"
                    value={formData.processor}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar Procesador</option>
                    {categories.processor.map(processor => (
                      <option key={processor} value={processor}>{processor}</option>
                    ))}
                  </select>
                  <select
                    name="gpu"
                    className="border p-1.5 rounded text-sm"
                    value={formData.gpu}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar Tarjeta de Video</option>
                    {categories.gpu.map(gpu => (
                      <option key={gpu} value={gpu}>{gpu}</option>
                    ))}
                  </select>
                  <select
                    name="screen"
                    className="border p-1.5 rounded text-sm"
                    value={formData.screen}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar Tamaño de Pantalla</option>
                    {categories.screen.map(screen => (
                      <option key={screen} value={screen}>{screen}</option>
                    ))}
                  </select>
                  <select
                    name="os"
                    className="border p-1.5 rounded text-sm"
                    value={formData.os}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar Sistema Operativo</option>
                    {categories.os.map(os => (
                      <option key={os} value={os}>{os}</option>
                    ))}
                  </select>
                  <select
                    name="status"
                    className="border p-1.5 rounded text-sm"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="Reacondicionado">Reacondicionado</option>
                    <option value="En diagnóstico">En diagnóstico</option>
                    <option value="En reparación">En reparación</option>
                  </select>
                  <input
                    name="supplier"
                    placeholder="Proveedor"
                    className="border p-1.5 rounded text-sm"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="cost"
                    placeholder="Costo de adquisición (S/.)"
                    type="number"
                    step="0.01"
                    className="border p-1.5 rounded text-sm"
                    value={formData.cost}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="price"
                    placeholder="Precio de venta sugerido (S/.)"
                    type="number"
                    step="0.01"
                    className="border p-1.5 rounded text-sm"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="stock"
                    placeholder="Stock disponible"
                    type="number"
                    className="border p-1.5 rounded text-sm"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Imagen del equipo
                    </label>
                    <div className="flex items-center gap-2">
                      {formData.image && (
                        <img 
                          src={formData.image} 
                          alt="Equipo" 
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="border p-1 rounded text-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 flex gap-2 mt-2">
                    <button type="submit" className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700">
                      {editingItem ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especificaciones</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precios (S/.)</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Ingreso</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <img 
                      src={item.image} 
                      alt={`${item.brand} ${item.model}`}
                      className="w-10 h-8 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/40x32/cccccc/666666?text=No+Image';
                      }}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div>
                      <p className="font-medium">{item.brand} {item.model}</p>
                      <p className="text-gray-500">S/N: {item.serial}</p>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-500">
                    <div>{item.ram}</div>
                    <div>{item.storage}</div>
                    <div>{item.processor}</div>
                    {item.gpu && <div>GPU: {item.gpu}</div>}
                    {item.screen && <div>Pantalla: {item.screen}</div>}
                    {item.os && <div>SO: {item.os}</div>}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                      item.status === 'Nuevo' ? 'bg-green-100 text-green-800' :
                      item.status === 'Reacondicionado' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium">{item.stock}</td>
                  <td className="px-3 py-2">
                    <div className="text-xs">
                      <div className="text-gray-500">Costo: S/. {item.cost.toLocaleString('es-PE')}</div>
                      <div className="font-medium">Venta: S/. {item.price.toLocaleString('es-PE')}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-500">{item.addedDate}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      {['Administrador', 'Gerente'].includes(currentUser.role) && (
                        <>
                          <button 
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Solo Administrador y Gerente pueden editar"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => deleteInventoryItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Solo Administrador y Gerente pueden eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                      {currentUser.role === 'Vendedor' && (
                        <span className="text-gray-400 text-xs">Solo lectura</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const SalesModule = () => {
    const [filterDate, setFilterDate] = useState('');
    const [searchSalesTerm, setSearchSalesTerm] = useState('');
    const [showSaleForm, setShowSaleForm] = useState(false);
    const [editingSale, setEditingSale] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [saleFormData, setSaleFormData] = useState({
      customerId: '',
      customerName: '',
      customerDocument: '',
      customerPhone: '',
      customerEmail: '',
      customerDocumentType: 'DNI',
      items: [],
      payment: 'Efectivo',
      documentType: 'Boleta',
      documentNumber: '',
      date: currentDate.toISOString().split('T')[0],
      time: currentDate.toLocaleTimeString(),
      observations: ''
    });
    const [showProductSelector, setShowProductSelector] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategoryFilters, setSelectedCategoryFilters] = useState({});
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
    const [customerFormData, setCustomerFormData] = useState({
      name: '',
      document: '',
      phone: '',
      email: '',
      documentType: 'DNI'
    });
    const [showExtraModal, setShowExtraModal] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

    const filteredSales = sales.filter(sale =>
      (!filterDate || sale.date === filterDate) &&
      (sale.customer.toLowerCase().includes(searchSalesTerm.toLowerCase()) ||
       sale.documentNumber.toLowerCase().includes(searchSalesTerm.toLowerCase()) ||
       sale.seller.toLowerCase().includes(searchSalesTerm.toLowerCase()))
    );

    const getFilteredProducts = () => {
      return inventory.filter(item => {
        if (selectedBrand && item.brand !== selectedBrand) return false;
        for (const [category, value] of Object.entries(selectedCategoryFilters)) {
          if (value && item[category] !== value) return false;
        }
        return item.stock > 0;
      });
    };

    
    const handleAddProducts = (productsParam = null) => {
      const productsToAdd = productsParam || selectedProducts;
      const newItems = productsToAdd.map(product => ({
        id: product.id,
        quantity: 1,
        price: parseFloat(product.price),
        equipmentBasePrice: parseFloat(product.price),
        extrasPrice: 0,
        subtotal: calculateIGV(parseFloat(product.price)).subtotal,
        igv: calculateIGV(parseFloat(product.price)).igv,
        extras: []
      }));
      
      setSaleFormData(prev => ({
        ...prev,
        items: [...prev.items, ...newItems]
      }));
      
      // Close selector and reset filters/selection
      setShowProductSelector(false);
      setSelectedProducts([]);
      setSelectedBrand('');
      setSelectedCategoryFilters({});
    };


    const updateItemPrice = (index, newPrice) => {
      const updatedItems = [...saleFormData.items];
      const priceValue = parseFloat(newPrice) || 0;
      updatedItems[index] = {
        ...updatedItems[index],
        price: priceValue,
        equipmentBasePrice: priceValue,
        extrasPrice: 0,
        ...calculateIGV(priceValue)
      };
      setSaleFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const removeItem = (index) => {
      const updatedItems = [...saleFormData.items];
      updatedItems.splice(index, 1);
      setSaleFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const addExtraToItem = (itemIndex, extra) => {
      const updatedItems = [...saleFormData.items];
      const currentItem = updatedItems[itemIndex];
      
      // Mantener precio base del equipo original (asegurar que es número)
      const equipmentBasePrice = parseFloat(currentItem.equipmentBasePrice) || parseFloat(currentItem.price) || 0;
      
      // Agregar extra a la lista
      const newExtras = [...(currentItem.extras || [])];
      // Verificar si el extra ya existe
      const existingExtraIndex = newExtras.findIndex(e => e.id === extra.id);
      if (existingExtraIndex >= 0) {
        newExtras[existingExtraIndex].quantity = (newExtras[existingExtraIndex].quantity || 1) + 1;
      } else {
        newExtras.push({ ...extra, quantity: 1 });
      }
      
      // Calcular precio total = equipo + sum(extras)
      const extrasTotal = newExtras.reduce((sum, e) => sum + (parseFloat(e.price) || 0) * (parseFloat(e.quantity) || 1), 0);
      const totalPrice = equipmentBasePrice + extrasTotal;
      
      const igvData = calculateIGV(totalPrice);
      
      updatedItems[itemIndex] = {
        ...currentItem,
        price: totalPrice,
        equipmentBasePrice: equipmentBasePrice,
        extrasPrice: extrasTotal,
        extras: newExtras,
        subtotal: igvData.subtotal,
        igv: igvData.igv
      };
      
      // Recalculate total
      const newTotal = updatedItems.reduce((sum, it) => sum + (parseFloat(it.price) || 0), 0);
      setSaleFormData(prev => ({ ...prev, items: updatedItems, total: newTotal }));
    };

    const removeExtraFromItem = (itemIndex, extraIndex) => {
      const updatedItems = [...saleFormData.items];
      const currentItem = updatedItems[itemIndex];
      
      // Remove extra from item
      const newExtras = currentItem.extras.filter((_, idx) => idx !== extraIndex);
      
      // Mantener el precio base del equipo (asegurar que es número)
      const equipmentBasePrice = parseFloat(currentItem.equipmentBasePrice) || parseFloat(currentItem.price) || 0;
      
      // Recalcular precio total
      const extrasTotal = newExtras.reduce((sum, e) => sum + (parseFloat(e.price) || 0) * (parseFloat(e.quantity) || 1), 0);
      const totalPrice = equipmentBasePrice + extrasTotal;
      
      const igvData = calculateIGV(totalPrice);
      
      updatedItems[itemIndex] = {
        ...currentItem,
        price: totalPrice,
        equipmentBasePrice: equipmentBasePrice,
        extrasPrice: extrasTotal,
        extras: newExtras,
        subtotal: igvData.subtotal,
        igv: igvData.igv
      };
      
      // Recalculate total
      const newTotal = updatedItems.reduce((sum, it) => sum + (parseFloat(it.price) || 0), 0);
      setSaleFormData(prev => ({ ...prev, items: updatedItems, total: newTotal }));
    };

    const handleAddCustomer = (e) => {
      e.preventDefault();
      const newCustomer = {
        name: customerFormData.name,
        document: customerFormData.document,
        phone: customerFormData.phone,
        email: customerFormData.email,
        documentType: customerFormData.documentType
      };
      
      const createdCustomer = addCustomer(newCustomer);
      setSaleFormData(prev => ({
        ...prev,
        customerId: createdCustomer.id.toString(),
        customerName: createdCustomer.name,
        customerDocument: createdCustomer.document,
        customerPhone: createdCustomer.phone,
        customerEmail: createdCustomer.email,
        customerDocumentType: createdCustomer.documentType
      }));
      
      setCustomerFormData({
        name: '',
        document: '',
        phone: '',
        email: '',
        documentType: 'DNI'
      });
      // Don't close the main form, just close the customer modal
    };

    const handleAddSale = (e) => {
      e.preventDefault();
      if (saleFormData.customerId && saleFormData.items.length > 0) {
        // Validate document number
        if (!saleFormData.documentNumber) {
          saleFormData.documentNumber = generateDocumentNumber(saleFormData.documentType);
        } else {
          const isValid = validateDocumentNumber(saleFormData.documentType, saleFormData.documentNumber, editingSale ? editingSale.id : null);
          if (!isValid) {
            alert(`El número de ${saleFormData.documentType} "${saleFormData.documentNumber}" ya existe. Por favor, ingrese un número diferente.`);
            return;
          }
        }
        
        const customer = customers.find(c => c.id === parseInt(saleFormData.customerId));
        const total = saleFormData.items.reduce((sum, item) => sum + item.price, 0);
        
        const newSale = {
          ...saleFormData,
          customer: customer.name,
          total,
          documentNumber: saleFormData.documentNumber,
          sellerName: currentUser.name,
          sellerId: currentUser.username
        };
        
        if (editingSale) {
          updateSale({
            ...editingSale,
            ...newSale
          });
        } else {
          addSale(newSale);
        }
        
        setSaleFormData({
          customerId: '',
          customerName: '',
          customerDocument: '',
          customerPhone: '',
          customerEmail: '',
          customerDocumentType: 'DNI',
          items: [],
          payment: 'Efectivo',
          documentType: 'Boleta',
          documentNumber: '',
          date: currentDate.toISOString().split('T')[0],
          time: currentDate.toLocaleTimeString(),
          observations: ''
        });
        setShowSaleForm(false);
        setEditingSale(null);
      }
    };

    const handleEditSale = (sale) => {
      setEditingSale(sale);
      setSaleFormData({
        customerId: sale.customerId?.toString() || '',
        customerName: sale.customer,
        customerDocument: customers.find(c => c.id === sale.customerId)?.document || '',
        customerPhone: customers.find(c => c.id === sale.customerId)?.phone || '',
        customerEmail: customers.find(c => c.id === sale.customerId)?.email || '',
        customerDocumentType: customers.find(c => c.id === sale.customerId)?.documentType || 'DNI',
        items: sale.items,
        payment: sale.payment,
        documentType: sale.documentType || 'Boleta',
        documentNumber: sale.documentNumber,
        date: sale.date,
        time: sale.time,
        observations: sale.observations || ''
      });
      setShowSaleForm(true);
    };

    const handleViewReceipt = (sale) => {
      setSelectedSaleForReceipt(sale);
      setShowReceiptPreview(true);
    };

    const openExtraModal = (itemIndex) => {
      setSelectedItemIndex(itemIndex);
      setShowExtraModal(true);
    };

    const ReceiptPreview = ({ sale, onClose }) => {
      const customer = customers.find(c => c.id === parseInt(sale.customerId));
      const subtotal = sale.items.reduce((sum, item) => sum + item.subtotal, 0);
      const igv = sale.items.reduce((sum, item) => sum + item.igv, 0);
      
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 receipt-modal-wrapper">
          <div className="bg-white rounded shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto flex flex-col receipt-modal-content">
            <div className="flex-1 overflow-y-auto receipt-container">
              {/* A4 Format Receipt */}
              <div className="bg-white p-8 mx-auto receipt-document" style={{ width: '210mm', maxWidth: '100%', minHeight: '297mm', fontFamily: 'Arial, sans-serif' }}>
                
                {/* Header */}
                <div className="mb-4 pb-4 border-b-4 border-gray-800">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {/* Left: Logo and Company Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Logo */}
                        <div>
                          {receiptConfig.logo && (
                            <img 
                              src={receiptConfig.logo} 
                              alt="Logo" 
                              style={{ maxHeight: '80px', maxWidth: '120px', objectFit: 'contain' }}
                            />
                          )}
                        </div>
                        
                        {/* Company Info */}
                        <div>
                          <h1 className="text-2xl font-bold text-gray-800">{receiptConfig.companyName}</h1>
                          <p className="text-xs text-gray-600">{receiptConfig.address}</p>
                          <p className="text-xs text-gray-600">Tel: {receiptConfig.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right: Document Type and RUC */}
                    <div className="text-center border-2 border-gray-800 p-3 flex-shrink-0" style={{ width: '200px' }}>
                      <p className="text-sm font-bold text-gray-800">{sale.documentType.toUpperCase()}</p>
                      <p className="text-sm font-bold text-gray-800">DE VENTA</p>
                      <p className="text-xs text-gray-600">ELECTRÓNICA</p>
                      <hr className="my-1" />
                      <p className="text-xs font-bold">RUC: {receiptConfig.ruc}</p>
                      <p className="text-sm font-bold text-gray-800 mt-1">Nº {sale.documentNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Customer and Date Info */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="mb-2">
                      <label className="text-xs font-bold text-gray-600">Cliente:</label>
                      <p className="text-sm font-semibold">{sale.customer}</p>
                    </div>
                    <div className="mb-2">
                      <label className="text-xs font-bold text-gray-600">Dirección:</label>
                      <p className="text-xs">{customer?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600">{customer?.documentType === 'RUC' ? 'RUC' : 'DNI'}:</label>
                      <p className="text-xs">{customer?.document || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      <label className="text-xs font-bold text-gray-600">Fecha de emisión:</label>
                      <p className="text-sm">{sale.date}</p>
                    </div>
                    <div className="mb-2">
                      <label className="text-xs font-bold text-gray-600">Hora:</label>
                      <p className="text-sm">{sale.time}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600">Vendedor:</label>
                      <p className="text-sm">{sale.seller}</p>
                    </div>
                  </div>
                </div>

                {/* Observaciones */}
                {sale.observations && (
                  <div className="mb-4 p-2 bg-gray-50 border border-gray-300 rounded text-xs">
                    <p><strong>Observaciones:</strong> {sale.observations}</p>
                  </div>
                )}

                {/* Items Table */}
                <div className="mb-4">
                  <table className="w-full border border-gray-400 text-xs">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-400 px-2 py-1 text-center">CANT.</th>
                        <th className="border border-gray-400 px-2 py-1 text-left">DESCRIPCIÓN</th>
                        <th className="border border-gray-400 px-2 py-1 text-right w-20">PRECIO UNIT.</th>
                        <th className="border border-gray-400 px-2 py-1 text-right w-20">EXTRAS</th>
                        <th className="border border-gray-400 px-2 py-1 text-right w-24">IMPORTE (Inc. IGV)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sale.items.map((item, index) => {
                        const invItem = inventory.find(i => i.id === item.id);
                        const equipmentPrice = parseFloat(item.equipmentBasePrice) || parseFloat(item.price) || 0;
                        const extrasPrice = parseFloat(item.extrasPrice) || 0;
                        const totalPrice = parseFloat(item.price) || 0;
                        
                        return (
                          <tr key={index} className="border-b border-gray-400">
                            <td className="border border-gray-400 px-2 py-1 text-center">{item.quantity}</td>
                            <td className="border border-gray-400 px-2 py-1">
                              <div className="font-semibold">{invItem?.brand} {invItem?.model}</div>
                              <div className="text-xs text-gray-600">{invItem?.processor}, {invItem?.ram}, {invItem?.storage}</div>
                              {item.extras && item.extras.length > 0 && (
                                <div className="text-xs text-gray-600 mt-1">
                                  <strong>Extras:</strong> {item.extras.map(e => e.name).join(', ')}
                                </div>
                              )}
                            </td>
                            <td className="border border-gray-400 px-2 py-1 text-right">S/. {equipmentPrice.toFixed(2)}</td>
                            <td className="border border-gray-400 px-2 py-1 text-right">
                              {extrasPrice > 0 ? (
                                <span className="text-blue-600 font-semibold">S/. {extrasPrice.toFixed(2)}</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="border border-gray-400 px-2 py-1 text-right font-semibold">S/. {totalPrice.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-600">Forma de pago:</p>
                      <p className="font-semibold">{sale.payment}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs font-semibold">OP. GRAVADA (S/):</span>
                        <span className="font-semibold">
                          {subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-semibold">TOTAL IGV (S/):</span>
                        <span className="font-semibold">
                          {igv.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between border-t-2 border-gray-800 pt-1 text-base">
                        <span className="font-bold">IMPORTE TOTAL (S/):</span>
                        <span className="font-bold text-lg">
                          {sale.total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-600 pt-4 border-t-2 border-gray-400">
                  <p className="mb-1">Representación impresa de <strong>{sale.documentType.toUpperCase()} DE VENTA ELECTRÓNICA</strong></p>
                  <p className="text-xs">Autorizado por Resolución de SUNAT</p>
                  <p className="mt-2 font-semibold">Gracias por su compra</p>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2 border-t sticky bottom-0">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 font-medium"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 font-medium"
              >
                Imprimir
              </button>
            </div>
          </div>
        </div>
      );
    };

    const ExtraModal = () => {
      if (selectedItemIndex === -1) return null;
      
      const item = saleFormData.items[selectedItemIndex];
      
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded shadow-xl max-w-md w-full">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Agregar Extra</h3>
                <button
                  onClick={() => setShowExtraModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {extraComponents.map(extra => (
                  <div key={extra.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="text-sm">{extra.name}</span>
                      <span className="text-sm ml-1 text-gray-600">(+S/. {extra.price})</span>
                    </div>
                    <button
                      onClick={() => {
                        addExtraToItem(selectedItemIndex, extra);
                        setShowExtraModal(false);
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <PlusCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-3">
                <button
                  onClick={() => setShowExtraModal(false)}
                  className="w-full bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-400"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Gestión de Ventas - COMPURSATIL</h2>
          <button 
            onClick={() => {
              const now = new Date();
              setShowSaleForm(true);
              setEditingSale(null);
              setSaleFormData({
                customerId: '',
                customerName: '',
                customerDocument: '',
                customerPhone: '',
                customerEmail: '',
                customerDocumentType: 'DNI',
                items: [],
                payment: 'Efectivo',
                documentType: 'Boleta',
                documentNumber: '',
                date: now.toISOString().split('T')[0],
                time: now.toLocaleTimeString('es-PE'),
                observations: ''
              });
            }}
            className="bg-green-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-green-700"
          >
            <Plus size={14} />
            Nueva Venta
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <div className="relative">
            <Calendar className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
            <input
              type="date"
              className="pl-8 pr-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent text-sm"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por cliente, documento o vendedor..."
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent text-sm"
              value={searchSalesTerm}
              onChange={(e) => setSearchSalesTerm(e.target.value)}
            />
          </div>
        </div>

        {showSaleForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">
                    {editingSale ? 'Editar Venta' : 'Registrar Nueva Venta'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowSaleForm(false);
                      setEditingSale(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleAddSale} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cliente
                      </label>
                      <div className="flex gap-1">
                        <select
                          value={saleFormData.customerId}
                          onChange={(e) => {
                            const customerId = e.target.value;
                            setSaleFormData(prev => ({
                              ...prev,
                              customerId,
                              customerName: '',
                              customerDocument: '',
                              customerPhone: '',
                              customerEmail: '',
                              customerDocumentType: 'DNI'
                            }));
                            
                            if (customerId) {
                              const customer = customers.find(c => c.id === parseInt(customerId));
                              if (customer) {
                                setSaleFormData(prev => ({
                                  ...prev,
                                  customerName: customer.name,
                                  customerDocument: customer.document,
                                  customerPhone: customer.phone,
                                  customerEmail: customer.email,
                                  customerDocumentType: customer.documentType
                                }));
                              }
                            }
                          }}
                          className="border p-1.5 rounded w-full text-sm"
                          required
                        >
                          <option value="">Seleccionar cliente</option>
                          {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddCustomerForm(true);
                            setCustomerFormData({
                              name: '',
                              document: '',
                              phone: '',
                              email: '',
                              documentType: 'DNI'
                            });
                          }}
                          className="bg-blue-600 text-white px-2 py-1.5 rounded text-sm hover:bg-blue-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Documento del Cliente
                      </label>
                      <input
                        type="text"
                        value={saleFormData.customerDocument}
                        onChange={(e) => setSaleFormData({...saleFormData, customerDocument: e.target.value})}
                        className="border p-1.5 rounded w-full text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nombre del Cliente
                      </label>
                      <input
                        type="text"
                        value={saleFormData.customerName}
                        onChange={(e) => setSaleFormData({...saleFormData, customerName: e.target.value})}
                        className="border p-1.5 rounded w-full text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        value={saleFormData.customerPhone}
                        onChange={(e) => setSaleFormData({...saleFormData, customerPhone: e.target.value})}
                        className="border p-1.5 rounded w-full text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={saleFormData.customerEmail}
                        onChange={(e) => setSaleFormData({...saleFormData, customerEmail: e.target.value})}
                        className="border p-1.5 rounded w-full text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tipo de Documento
                      </label>
                      <select
                        value={saleFormData.customerDocumentType}
                        onChange={(e) => setSaleFormData({...saleFormData, customerDocumentType: e.target.value})}
                        className="border p-1.5 rounded w-full text-sm"
                        required
                      >
                        <option value="DNI">DNI</option>
                        <option value="RUC">RUC</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="border rounded p-2">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">Productos Seleccionados</h4>
                      <button
                        type="button"
                        onClick={() => setShowProductSelector(true)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Agregar Productos
                      </button>
                    </div>
                    {saleFormData.items.length > 0 ? (
                      <div className="space-y-2">
                        {saleFormData.items.map((item, index) => {
                          const invItem = inventory.find(i => i.id === item.id);
                          const equipmentPrice = parseFloat(item.equipmentBasePrice) || parseFloat(item.price) || 0;
                          const extrasPrice = parseFloat(item.extrasPrice) || 0;
                          const totalPrice = parseFloat(item.price) || 0;
                          
                          return (
                            <div key={index} className="border rounded p-2 bg-gray-50">
                              <div className="grid grid-cols-12 gap-1 items-center">
                                <div className="col-span-3 font-medium text-sm">
                                  {invItem?.brand} {invItem?.model}
                                </div>
                                <div className="col-span-2">
                                  <input
                                    type="number"
                                    min="1"
                                    max={inventory.find(i => i.id === item.id)?.stock || 1}
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const updatedItems = [...saleFormData.items];
                                      updatedItems[index] = {
                                        ...updatedItems[index],
                                        quantity: parseInt(e.target.value) || 1
                                      };
                                      setSaleFormData(prev => ({ ...prev, items: updatedItems }));
                                    }}
                                    className="w-full border rounded p-0.5 text-xs"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <div className="text-xs space-y-1">
                                    <div>
                                      <label className="text-gray-600 text-xs block mb-0.5">Equipo</label>
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={equipmentPrice}
                                        onChange={(e) => {
                                          const updatedItems = [...saleFormData.items];
                                          const newEquipPrice = parseFloat(e.target.value) || 0;
                                          const extrasTotal = updatedItems[index].extrasPrice || 0;
                                          const totalPriceNew = newEquipPrice + extrasTotal;
                                          const igvData = calculateIGV(totalPriceNew);
                                          updatedItems[index] = {
                                            ...updatedItems[index],
                                            price: totalPriceNew,
                                            equipmentBasePrice: newEquipPrice,
                                            ...igvData
                                          };
                                          setSaleFormData(prev => ({ ...prev, items: updatedItems }));
                                        }}
                                        className="w-full border rounded p-0.5 text-xs font-medium"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-gray-600 text-xs block mb-0.5">Extras</label>
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={extrasPrice}
                                        onChange={(e) => {
                                          const updatedItems = [...saleFormData.items];
                                          const newExtrasPrice = parseFloat(e.target.value) || 0;
                                          const equipPrice = updatedItems[index].equipmentBasePrice || 0;
                                          const totalPriceNew = equipPrice + newExtrasPrice;
                                          const igvData = calculateIGV(totalPriceNew);
                                          updatedItems[index] = {
                                            ...updatedItems[index],
                                            price: totalPriceNew,
                                            extrasPrice: newExtrasPrice,
                                            ...igvData
                                          };
                                          setSaleFormData(prev => ({ ...prev, items: updatedItems }));
                                        }}
                                        className="w-full border rounded p-0.5 text-xs font-medium text-blue-600"
                                      />
                                    </div>
                                    <div className="font-medium text-blue-600 pt-0.5 border-t pt-1">Total: S/. {totalPrice.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                  </div>
                                </div>
                                <div className="col-span-2 text-right text-xs">
                                  <div>S/. {item.subtotal.toLocaleString('es-PE')}</div>
                                  <div className="text-gray-600">Subtotal</div>
                                </div>
                                <div className="col-span-2 text-right text-xs">
                                  <div>S/. {item.igv.toLocaleString('es-PE')}</div>
                                  <div className="text-gray-600">IGV</div>
                                </div>
                                <div className="col-span-1 text-right">
                                  <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Extras section */}
                              <div className="mt-1">
                                <div className="flex items-center gap-1 mb-1">
                                  <span className="text-xs font-medium">Extras:</span>
                                  <button
                                    type="button"
                                    onClick={() => openExtraModal(index)}
                                    className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs hover:bg-blue-700"
                                  >
                                    +
                                  </button>
                                </div>
                                
                                {item.extras && item.extras.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {item.extras.map((extra, extraIndex) => (
                                      <div key={extraIndex} className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                        <span>{extra.name} (S/. {parseFloat(extra.price).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>
                                        <button
                                          type="button"
                                          onClick={() => removeExtraFromItem(index, extraIndex)}
                                          className="text-blue-800 hover:text-blue-900"
                                        >
                                          <MinusCircle size={10} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs">No hay productos seleccionados</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fecha y Hora
                      </label>
                      <div className="grid grid-cols-2 gap-1">
                        <input
                          type="date"
                          value={saleFormData.date}
                          onChange={(e) => setSaleFormData({...saleFormData, date: e.target.value})}
                          className="border p-1.5 rounded text-sm"
                          required
                        />
                        <input
                          type="time"
                          value={saleFormData.time}
                          onChange={(e) => setSaleFormData({...saleFormData, time: e.target.value})}
                          className="border p-1.5 rounded text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tipo de Documento
                      </label>
                      <select
                        value={saleFormData.documentType}
                        onChange={(e) => {
                          const newType = e.target.value;
                          const newDocNumber = editingSale ? saleFormData.documentNumber : generateDocumentNumber(newType);
                          setSaleFormData(prev => ({
                            ...prev,
                            documentType: newType,
                            documentNumber: newDocNumber
                          }));
                        }}
                        className="border p-1.5 rounded w-full text-sm"
                        required
                      >
                        <option value="Boleta">Boleta</option>
                        <option value="Factura">Factura</option>
                        <option value="Proforma">Proforma</option>
                        <option value="Nota de Venta">Nota de Venta</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        N° Documento
                      </label>
                      <input
                        type="text"
                        value={saleFormData.documentNumber}
                        onChange={(e) => {
                          if (editingSale) {
                            setSaleFormData({...saleFormData, documentNumber: e.target.value});
                          }
                        }}
                        disabled={!editingSale}
                        className={`border p-1.5 rounded w-full text-sm font-semibold ${!editingSale ? 'bg-gray-50 text-gray-700 cursor-not-allowed' : 'bg-white'}`}
                        required
                      />
                      {!editingSale && (
                        <p className="text-xs text-gray-500 mt-0.5">Se genera automáticamente</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Método de Pago
                      </label>
                      <select
                        value={saleFormData.payment}
                        onChange={(e) => setSaleFormData({...saleFormData, payment: e.target.value})}
                        className="border p-1.5 rounded w-full text-sm"
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Yape">Yape</option>
                        <option value="Plin">Plin</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      value={saleFormData.observations}
                      onChange={(e) => setSaleFormData({...saleFormData, observations: e.target.value})}
                      className="border p-1.5 rounded w-full text-sm"
                      rows="2"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700">
                      {editingSale ? 'Actualizar Venta' : 'Registrar Venta'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowSaleForm(false);
                        setEditingSale(null);
                      }}
                      className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showProductSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Seleccionar Productos</h3>
                  <button
                    onClick={() => setShowProductSelector(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Marca</label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full border p-1.5 rounded text-sm"
                    >
                      <option value="">Todas las marcas</option>
                      {[...new Set(inventory.map(item => item.brand))].map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  
                  {Object.entries(categories).map(([category, options]) => (
                    <div key={category}>
                      <label className="block text-xs font-medium mb-1">
                        {category === 'processor' ? 'Procesador' :
                         category === 'ram' ? 'RAM' :
                         category === 'storage' ? 'Almacenamiento' :
                         category === 'gpu' ? 'Tarjeta de Video' :
                         category === 'screen' ? 'Pantalla' :
                         'Sistema Operativo'}
                      </label>
                      <select
                        value={selectedCategoryFilters[category] || ''}
                        onChange={(e) => setSelectedCategoryFilters({
                          ...selectedCategoryFilters,
                          [category]: e.target.value
                        })}
                        className="w-full border p-1.5 rounded text-sm"
                      >
                        <option value="">Todos</option>
                        {options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {getFilteredProducts().map(item => (
                    <div key={item.id} className="border rounded p-2 hover:shadow cursor-pointer" onClick={() => handleAddProducts([item])}>
                      <img 
                        src={item.image} 
                        alt={item.model}
                        className="w-full h-20 object-cover rounded mb-1"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/200x80/cccccc/666666?text=No+Image';
                        }}
                      />
                      <h4 className="font-medium text-sm">{item.brand} {item.model}</h4>
                      <p className="text-xs text-gray-600">S/N: {item.serial}</p>
                      <p className="text-xs text-green-600 font-medium">S/. {item.price.toLocaleString('es-PE')}</p>
                      <p className="text-xs text-gray-500">Stock: {item.stock}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="px-4 py-2 bg-gray-50 flex justify-end gap-2">
                <button
                  onClick={() => setShowProductSelector(false)}
                  className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddCustomerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded shadow-xl max-w-md w-full">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Agregar Nuevo Cliente</h3>
                  <button
                    onClick={() => setShowAddCustomerForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleAddCustomer} className="space-y-2">
                  <input
                    placeholder="Nombres y apellidos / Razón Social"
                    className="border p-1.5 rounded w-full text-sm"
                    value={customerFormData.name}
                    onChange={(e) => setCustomerFormData({...customerFormData, name: e.target.value})}
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={customerFormData.documentType}
                      onChange={(e) => setCustomerFormData({...customerFormData, documentType: e.target.value})}
                      className="border p-1.5 rounded text-sm"
                    >
                      <option value="DNI">DNI</option>
                      <option value="RUC">RUC</option>
                    </select>
                    <input
                      placeholder={customerFormData.documentType === 'DNI' ? 'Número de DNI' : 'Número de RUC'}
                      className="border p-1.5 rounded text-sm"
                      value={customerFormData.document}
                      onChange={(e) => setCustomerFormData({...customerFormData, document: e.target.value})}
                      required
                    />
                  </div>
                  <input
                    placeholder="Número de teléfono"
                    className="border p-1.5 rounded w-full text-sm"
                    value={customerFormData.phone}
                    onChange={(e) => setCustomerFormData({...customerFormData, phone: e.target.value})}
                    required
                  />
                  <input
                    placeholder="Correo electrónico"
                    className="border p-1.5 rounded w-full text-sm"
                    value={customerFormData.email}
                    onChange={(e) => setCustomerFormData({...customerFormData, email: e.target.value})}
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
                      Guardar Cliente
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowAddCustomerForm(false)}
                      className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showExtraModal && <ExtraModal />}

        {showReceiptPreview && selectedSaleForReceipt && (
          <ReceiptPreview 
            sale={selectedSaleForReceipt} 
            onClose={() => setShowReceiptPreview(false)} 
          />
        )}

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{sale.date} {sale.time}</td>
                  <td className="px-3 py-2 font-medium">{sale.customer}</td>
                  <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                      sale.documentType === 'Boleta' ? 'bg-blue-100 text-blue-800' :
                      sale.documentType === 'Factura' ? 'bg-green-100 text-green-800' :
                      sale.documentType === 'Proforma' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {sale.documentType}
                    </span>
                    <div className="text-xs text-gray-500">{sale.documentNumber}</div>
                  </td>
                  <td className="px-3 py-2 text-gray-500">
                    {sale.items.map(item => {
                      const invItem = inventory.find(i => i.id === item.id);
                      return `${invItem?.brand} ${invItem?.model} (${item.quantity})`;
                    }).join(', ')}
                  </td>
                  <td className="px-3 py-2">{sale.sellerName || sale.seller}</td>
                  <td className="px-3 py-2 font-medium text-green-600">S/. {sale.total.toLocaleString('es-PE')}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      {['Gerente', 'Administrador'].includes(currentUser.role) && (
                        <>
                          <button 
                            onClick={() => handleEditSale(sale)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Solo Administrador y Gerente pueden editar"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => deleteSale(sale.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Solo Administrador y Gerente pueden eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleViewReceipt(sale)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <FileText size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              Mostrando {filteredSales.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredSales.length)} de {filteredSales.length} registros
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <div className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded">
                Página {currentPage} de {Math.ceil(filteredSales.length / itemsPerPage) || 1}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredSales.length / itemsPerPage) || 1))}
                disabled={currentPage >= Math.ceil(filteredSales.length / itemsPerPage) || filteredSales.length === 0}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CustomersModule = () => {
    const [showCustomerForm, setShowCustomerForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [searchCustomersTerm, setSearchCustomersTerm] = useState('');
    const [currentPageCustomers, setCurrentPageCustomers] = useState(1);
    const itemsPerPageCustomers = 10;
    const [customerFormData, setCustomerFormData] = useState({
      name: '',
      document: '',
      phone: '',
      email: '',
      documentType: 'DNI'
    });

    const handleAddCustomer = (e) => {
      e.preventDefault();
      if (editingCustomer) {
        updateCustomer({ ...editingCustomer, ...customerFormData });
        setEditingCustomer(null);
      } else {
        addCustomer(customerFormData);
      }
      setCustomerFormData({ name: '', document: '', phone: '', email: '', documentType: 'DNI' });
      setShowCustomerForm(false);
    };

    const handleEditCustomer = (customer) => {
      setEditingCustomer(customer);
      setCustomerFormData({
        name: customer.name,
        document: customer.document,
        phone: customer.phone,
        email: customer.email,
        documentType: customer.documentType
      });
      setShowCustomerForm(true);
    };

    const filteredCustomers = customers.filter(customer => 
      customer.name.toLowerCase().includes(searchCustomersTerm.toLowerCase()) ||
      customer.document.includes(searchCustomersTerm) ||
      customer.phone.includes(searchCustomersTerm)
    );

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Gestión de Clientes - COMPURSATIL</h2>
          <button 
            onClick={() => {
              setShowCustomerForm(true);
              setEditingCustomer(null);
              setCustomerFormData({ name: '', document: '', phone: '', email: '', documentType: 'DNI' });
            }}
            className="bg-purple-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-purple-700"
          >
            <Plus size={14} />
            Nuevo Cliente
          </button>
        </div>

        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre, documento o teléfono..."
            className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
            value={searchCustomersTerm}
            onChange={(e) => setSearchCustomersTerm(e.target.value)}
          />
        </div>

        {showCustomerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded shadow-xl max-w-md w-full">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">
                    {editingCustomer ? 'Editar Cliente' : 'Registrar Cliente'}
                  </h3>
                  <button
                    onClick={() => setShowCustomerForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleAddCustomer} className="space-y-2">
                  <input
                    placeholder="Nombres y apellidos / Razón Social"
                    className="border p-1.5 rounded w-full text-sm"
                    value={customerFormData.name}
                    onChange={(e) => setCustomerFormData({...customerFormData, name: e.target.value})}
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={customerFormData.documentType}
                      onChange={(e) => setCustomerFormData({...customerFormData, documentType: e.target.value})}
                      className="border p-1.5 rounded text-sm"
                    >
                      <option value="DNI">DNI</option>
                      <option value="RUC">RUC</option>
                    </select>
                    <input
                      placeholder={customerFormData.documentType === 'DNI' ? 'Número de DNI' : 'Número de RUC'}
                      className="border p-1.5 rounded text-sm"
                      value={customerFormData.document}
                      onChange={(e) => setCustomerFormData({...customerFormData, document: e.target.value})}
                      required
                    />
                  </div>
                  <input
                    placeholder="Número de teléfono"
                    className="border p-1.5 rounded w-full text-sm"
                    value={customerFormData.phone}
                    onChange={(e) => setCustomerFormData({...customerFormData, phone: e.target.value})}
                    required
                  />
                  <input
                    placeholder="Correo electrónico"
                    className="border p-1.5 rounded w-full text-sm"
                    value={customerFormData.email}
                    onChange={(e) => setCustomerFormData({...customerFormData, email: e.target.value})}
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-purple-600 text-white px-3 py-1.5 rounded text-sm hover:bg-purple-700">
                      {editingCustomer ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowCustomerForm(false)}
                      className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compras</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.slice((currentPageCustomers - 1) * itemsPerPageCustomers, currentPageCustomers * itemsPerPageCustomers).map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{customer.name}</td>
                  <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                      customer.documentType === 'DNI' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {customer.documentType}
                    </span>
                    <div className="text-sm">{customer.document}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Phone size={12} className="text-gray-500" />
                      <span className="text-xs">{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail size={12} className="text-gray-500" />
                      <span className="text-xs">{customer.email}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {sales.filter(sale => sale.customerId === customer.id).length}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleEditCustomer(customer)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => deleteCustomer(customer.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              Mostrando {filteredCustomers.length === 0 ? 0 : (currentPageCustomers - 1) * itemsPerPageCustomers + 1} - {Math.min(currentPageCustomers * itemsPerPageCustomers, filteredCustomers.length)} de {filteredCustomers.length} registros
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPageCustomers(prev => Math.max(prev - 1, 1))}
                disabled={currentPageCustomers === 1}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <div className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded">
                Página {currentPageCustomers} de {Math.ceil(filteredCustomers.length / itemsPerPageCustomers) || 1}
              </div>
              <button
                onClick={() => setCurrentPageCustomers(prev => Math.min(prev + 1, Math.ceil(filteredCustomers.length / itemsPerPageCustomers) || 1))}
                disabled={currentPageCustomers >= Math.ceil(filteredCustomers.length / itemsPerPageCustomers) || filteredCustomers.length === 0}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const WarrantiesModule = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPageWarranties, setCurrentPageWarranties] = useState(1);
    const itemsPerPageWarranties = 10;

    const filteredWarranties = warranties.filter(warranty =>
      warranty.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customers.find(c => c.id === warranty.customerId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Gestión de Garantías - COMPURSATIL</h2>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por número de serie o cliente..."
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodo</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Soporte Técnico</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWarranties.slice((currentPageWarranties - 1) * itemsPerPageWarranties, currentPageWarranties * itemsPerPageWarranties).map(warranty => {
                const customer = customers.find(c => c.id === warranty.customerId);
                const technicalCase = technicalCases.find(tc => tc.serial === warranty.serial);
                return (
                  <tr key={warranty.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <p className="font-medium">S/N: {warranty.serial}</p>
                      <p className="text-gray-500">
                        {inventory.find(i => i.serial === warranty.serial)?.brand} {inventory.find(i => i.serial === warranty.serial)?.model}
                      </p>
                    </td>
                    <td className="px-3 py-2">{customer?.name || 'Cliente no encontrado'}</td>
                    <td className="px-3 py-2 text-gray-500">
                      <div>{warranty.startDate}</div>
                      <div className="text-gray-400">hasta {warranty.endDate}</div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="px-1.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                        {warranty.warrantyType}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        warranty.status === 'Activa' ? 'bg-green-100 text-green-800' :
                        warranty.status === 'Vencida' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {warranty.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {technicalCase ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <Clock size={12} className="text-gray-500" />
                            <span className="text-xs text-gray-600">{technicalCase.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                              technicalCase.status === 'Recibido' ? 'bg-blue-100 text-blue-800' :
                              technicalCase.status === 'En diagnóstico' ? 'bg-yellow-100 text-yellow-800' :
                              technicalCase.status === 'En reparación' ? 'bg-orange-100 text-orange-800' :
                              technicalCase.status === 'Reparado' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {technicalCase.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            {technicalCase.technician}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Sin soporte</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              Mostrando {filteredWarranties.length === 0 ? 0 : (currentPageWarranties - 1) * itemsPerPageWarranties + 1} - {Math.min(currentPageWarranties * itemsPerPageWarranties, filteredWarranties.length)} de {filteredWarranties.length} registros
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPageWarranties(prev => Math.max(prev - 1, 1))}
                disabled={currentPageWarranties === 1}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <div className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded">
                Página {currentPageWarranties} de {Math.ceil(filteredWarranties.length / itemsPerPageWarranties) || 1}
              </div>
              <button
                onClick={() => setCurrentPageWarranties(prev => Math.min(prev + 1, Math.ceil(filteredWarranties.length / itemsPerPageWarranties) || 1))}
                disabled={currentPageWarranties >= Math.ceil(filteredWarranties.length / itemsPerPageWarranties) || filteredWarranties.length === 0}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TechnicalModule = () => {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [showQuickForm, setShowQuickForm] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [quickFormData, setQuickFormData] = useState({
      serial: '',
      equipmentModel: '',
      issue: '',
      status: 'Recibido'
    });

    // Search functionality - busca clientes y equipos
    const handleSearch = (value) => {
      setSearchInput(value);
      if (value.length > 0) {
        // Buscar clientes
        const customerResults = customers.filter(c =>
          c.name.toLowerCase().includes(value.toLowerCase()) ||
          c.document.includes(value)
        );
        
        // Buscar equipos comprados por el cliente (desde sales)
        const equipmentResults = [];
        sales.forEach(sale => {
          if (sale.customerId && customers.find(c => c.id === sale.customerId)?.name.toLowerCase().includes(value.toLowerCase())) {
            sale.items.forEach(item => {
              const invItem = inventory.find(i => i.id === item.id);
              if (invItem) {
                equipmentResults.push({
                  type: 'equipment',
                  customerName: customers.find(c => c.id === sale.customerId)?.name,
                  customerId: sale.customerId,
                  brand: invItem.brand,
                  model: invItem.model,
                  serial: invItem.serial || `${invItem.brand}-${invItem.model}-${item.id}`,
                  purchaseDate: sale.date
                });
              }
            });
          }
        });
        
        setSearchResults([...customerResults.map(c => ({ ...c, type: 'customer' })), ...equipmentResults]);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    };

    const handleSelectCustomer = (item) => {
      if (item.type === 'equipment') {
        // Si es un equipo
        setSelectedCustomer(customers.find(c => c.id === item.customerId));
        setSearchInput(`${item.customerName} - ${item.brand} ${item.model}`);
        setQuickFormData(prev => ({
          ...prev,
          serial: item.serial,
          equipmentModel: `${item.brand} ${item.model}`
        }));
      } else {
        // Si es un cliente
        setSelectedCustomer(item);
        setSearchInput(`${item.name} (${item.document})`);
        setQuickFormData(prev => ({
          ...prev,
          serial: '',
          equipmentModel: ''
        }));
      }
      setShowResults(false);
      setShowQuickForm(true);
    };

    const handleQuickAddCase = (e) => {
      e.preventDefault();
      if (!selectedCustomer) {
        alert('Selecciona un cliente');
        return;
      }

      const newCase = {
        ...quickFormData,
        customerId: selectedCustomer.id,
        id: Math.max(...technicalCases.map(c => c.id), 0) + 1,
        date: new Date().toISOString().split('T')[0],
        technician: currentUser.name,
        diagnosis: '',
        actions: '',
        warrantyStartDate: new Date().toISOString().split('T')[0],
        supportType: 'Particular',
        documentType: 'Boleta',
        documentNumber: ''
      };

      addTechnicalCase(newCase);
      
      // Reset form
      setQuickFormData({
        serial: '',
        equipmentModel: '',
        issue: '',
        status: 'Recibido'
      });
      setShowQuickForm(false);
      setSelectedCustomer(null);
      setSearchInput('');
    };

    const handleStatusChange = (caseItem, newStatus) => {
      updateTechnicalCase({ ...caseItem, status: newStatus });
    };

    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Soporte Técnico - COMPURSATIL</h2>

        {/* Quick Add Case Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-orange-200">
          <h3 className="text-lg font-bold mb-3">Registrar Equipo Recibido</h3>
          
          {!showQuickForm ? (
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Buscar Cliente por Nombre o Documento</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez o 12345678"
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-72 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      key={`${item.type}-${item.id || item.serial}`}
                      onClick={() => handleSelectCustomer(item)}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 border-b last:border-b-0 transition"
                    >
                      {item.type === 'customer' ? (
                        <>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-600">{item.document} • {item.phone}</div>
                        </>
                      ) : (
                        <>
                          <div className="font-medium text-orange-700">📱 {item.brand} {item.model}</div>
                          <div className="text-xs text-gray-600">Cliente: {item.customerName}</div>
                          <div className="text-xs text-gray-500">S/N: {item.serial} | Compra: {item.purchaseDate}</div>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {showResults && searchResults.length === 0 && searchInput && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded p-3 text-center text-gray-500 z-10">
                  No se encontraron clientes
                </div>
              )}
            </div>
          ) : selectedCustomer && (
            <>
              <div className="bg-orange-50 rounded p-3 mb-3 border border-orange-200">
                <p className="font-medium">{selectedCustomer.name}</p>
                <p className="text-sm text-gray-600">{selectedCustomer.document} • {selectedCustomer.phone}</p>
              </div>

              <form onSubmit={handleQuickAddCase} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Número de Serie *</label>
                    <input
                      type="text"
                      value={quickFormData.serial}
                      onChange={(e) => setQuickFormData({ ...quickFormData, serial: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500"
                      placeholder="Ej: HP789012"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Modelo del Equipo *</label>
                    <input
                      type="text"
                      value={quickFormData.equipmentModel}
                      onChange={(e) => setQuickFormData({ ...quickFormData, equipmentModel: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500"
                      placeholder="Ej: HP Spectre x360 14"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Falla Reportada *</label>
                  <textarea
                    value={quickFormData.issue}
                    onChange={(e) => setQuickFormData({ ...quickFormData, issue: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500"
                    placeholder="Describe la falla o problema del equipo"
                    rows="2"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 font-medium"
                  >
                    Registrar Equipo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuickForm(false);
                      setSelectedCustomer(null);
                      setSearchInput('');
                      setQuickFormData({ serial: '', equipmentModel: '', issue: '', status: 'Recibido' });
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Equipo (S/N)</th>
                <th className="px-4 py-3 text-left font-semibold">Cliente</th>
                <th className="px-4 py-3 text-left font-semibold">Falla</th>
                <th className="px-4 py-3 text-left font-semibold">Estado</th>
                <th className="px-4 py-3 text-left font-semibold">Técnico</th>
                <th className="px-4 py-3 text-left font-semibold">Registrado</th>
                <th className="px-4 py-3 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {technicalCases.length > 0 ? (
                technicalCases.map((caseItem) => {
                  const customer = customers.find(c => c.id === caseItem.customerId);
                  return (
                    <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{caseItem.equipmentModel}</div>
                        <div className="text-xs text-gray-600">S/N: {caseItem.serial}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{customer?.name || 'No encontrado'}</div>
                        <div className="text-xs text-gray-600">{customer?.document}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{caseItem.issue}</td>
                      <td className="px-4 py-3">
                        <select
                          value={caseItem.status}
                          onChange={(e) => handleStatusChange(caseItem, e.target.value)}
                          className={`text-xs font-medium px-3 py-1 rounded border-0 cursor-pointer ${
                            caseItem.status === 'Recibido' ? 'bg-blue-100 text-blue-800' :
                            caseItem.status === 'En diagnóstico' ? 'bg-yellow-100 text-yellow-800' :
                            caseItem.status === 'En reparación' ? 'bg-orange-100 text-orange-800' :
                            caseItem.status === 'Reparado' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          <option value="Recibido">Recibido</option>
                          <option value="En diagnóstico">En diagnóstico</option>
                          <option value="En reparación">En reparación</option>
                          <option value="Reparado">Reparado</option>
                          <option value="Entregado">Entregado</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm">{caseItem.technician || currentUser.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{caseItem.date}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => deleteTechnicalCase(caseItem.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                    No hay casos técnicos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const SupportTrackingModule = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedTechnician, setSelectedTechnician] = useState('');

    const filteredCases = technicalCases.filter(caseItem => {
      const matchesSearch = 
        caseItem.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.equipmentModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.customerId && customers.find(c => c.id === caseItem.customerId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !selectedStatus || caseItem.status === selectedStatus;
      const matchesTechnician = !selectedTechnician || caseItem.technician === selectedTechnician;
      
      return matchesSearch && matchesStatus && matchesTechnician;
    });

    const technicians = [...new Set(technicalCases.map(caseItem => caseItem.technician))];

    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Seguimiento de Soporte Técnico - COMPURSATIL</h2>
        
        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por número de serie, modelo o cliente..."
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="Recibido">Recibido</option>
            <option value="En diagnóstico">En diagnóstico</option>
            <option value="En reparación">En reparación</option>
            <option value="Reparado">Reparado</option>
            <option value="Entregado">Entregado</option>
          </select>
          
          <select
            value={selectedTechnician}
            onChange={(e) => setSelectedTechnician(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todos los técnicos</option>
            {technicians.map(tech => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Falla</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnóstico</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCases.map(caseItem => {
                const customer = customers.find(c => c.id === caseItem.customerId);
                return (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <p className="font-medium">S/N: {caseItem.serial}</p>
                      <p className="text-gray-500">{caseItem.equipmentModel}</p>
                    </td>
                    <td className="px-3 py-2">{customer?.name || 'Cliente no encontrado'}</td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        caseItem.documentType === 'Boleta' ? 'bg-blue-100 text-blue-800' :
                        caseItem.documentType === 'Factura' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {caseItem.documentType}
                      </span>
                      <div className="text-xs text-gray-500">{caseItem.documentNumber}</div>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{caseItem.issue}</td>
                    <td className="px-3 py-2 text-gray-600">{caseItem.diagnosis || 'Pendiente'}</td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        caseItem.status === 'Recibido' ? 'bg-blue-100 text-blue-800' :
                        caseItem.status === 'En diagnóstico' ? 'bg-yellow-100 text-yellow-800' :
                        caseItem.status === 'En reparación' ? 'bg-orange-100 text-orange-800' :
                        caseItem.status === 'Reparado' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div>{caseItem.technician}</div>
                      <div className="text-xs text-gray-500">
                        {caseItem.supportType === 'Particular' ? 'Particular' : `Garantía desde ${caseItem.warrantyStartDate}`}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-500">{caseItem.date}</td>
                    <td className="px-3 py-2 text-gray-600">
                      {caseItem.observations?.substring(0, 30)}{caseItem.observations?.length > 30 ? '...' : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const ShipmentTrackingModule = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredShipments, setFilteredShipments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleClaves, setVisibleClaves] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    // Initialize filtered shipments
    useEffect(() => {
      console.log('ShipmentTrackingModule mounted. Shipments count:', shipments ? shipments.length : 0);
      setLoading(!shipments || shipments.length === 0);
    }, []);

    // Filter shipments
    useEffect(() => {
      console.log('Shipments updated:', shipments);
      if (!shipments || shipments.length === 0) {
        setFilteredShipments([]);
        setLoading(false);
        return;
      }
      
      setLoading(false);
      const filtered = shipments.filter(ship =>
        (ship.nombre && ship.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ship.documento && ship.documento.includes(searchTerm)) ||
        (ship.telefono && ship.telefono.includes(searchTerm))
      );
      setFilteredShipments(filtered);
      setCurrentPage(1);
    }, [searchTerm, shipments]);

    const paginatedShipments = filteredShipments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Truck size={28} /> Seguimiento de Envíos
          </h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Total: {shipments && shipments.length ? shipments.length : 0} envíos</span>
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                }, 500);
              }}
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              title="Recargar datos"
            >
              ↻
            </button>
          </div>
        </div>

        {/* Debug info - mostrar si hay datos */}
        {loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              ⏳ Cargando datos de envíos desde servidor...
            </p>
          </div>
        )}
        
        {!loading && (!shipments || shipments.length === 0) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800 text-sm">
              ℹ️ No hay envíos registrados en el sistema
            </p>
          </div>
        )}

        {/* Search bar */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre, documento o teléfono..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold">Documento</th>
                <th className="px-4 py-3 text-left font-semibold">Teléfono</th>
                <th className="px-4 py-3 text-left font-semibold">Ubicación</th>
                <th className="px-4 py-3 text-left font-semibold">Modalidad</th>
                <th className="px-4 py-3 text-left font-semibold">Costo</th>
                <th className="px-4 py-3 text-left font-semibold">Clave</th>
                <th className="px-4 py-3 text-left font-semibold">Razón</th>
                <th className="px-4 py-3 text-left font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {paginatedShipments.length > 0 ? (
                paginatedShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{shipment.nombre || '-'}</td>
                    <td className="px-4 py-3">{shipment.documento || '-'}</td>
                    <td className="px-4 py-3">{shipment.telefono || '-'}</td>
                    <td className="px-4 py-3 text-xs">
                      <div>{shipment.departamento || '-'}</div>
                      <div className="text-gray-600">{shipment.distrito || '-'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded text-xs font-medium ${
                        (shipment.modalidad || '').toLowerCase() === 'express' ? 'bg-blue-100 text-blue-800' :
                        (shipment.modalidad || '').toLowerCase() === 'standard' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {shipment.modalidad || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">S/. {shipment.costo ? parseFloat(shipment.costo).toFixed(2) : '0.00'}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => {
                          const newVisibleClaves = new Set(visibleClaves);
                          if (newVisibleClaves.has(shipment.id)) {
                            newVisibleClaves.delete(shipment.id);
                          } else {
                            newVisibleClaves.add(shipment.id);
                          }
                          setVisibleClaves(newVisibleClaves);
                        }}
                        className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-xs font-mono font-semibold text-gray-800"
                      >
                        {visibleClaves.has(shipment.id) ? (shipment.clave || '****') : '****'}
                        {visibleClaves.has(shipment.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded text-xs font-medium ${
                        (shipment.razon || '').toLowerCase() === 'envio' ? 'bg-green-100 text-green-800' :
                        (shipment.razon || '').toLowerCase() === 'devolucion' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {shipment.razon || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded text-xs font-medium ${
                        (shipment.estado || '').toLowerCase() === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        (shipment.estado || '').toLowerCase() === 'enviado' ? 'bg-blue-100 text-blue-800' :
                        (shipment.estado || '').toLowerCase() === 'en tránsito' ? 'bg-purple-100 text-purple-800' :
                        (shipment.estado || '').toLowerCase() === 'entregado' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {shipment.estado || 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
                    {loading ? 'Cargando envíos...' : 'No hay envíos registrados'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredShipments.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm">
              Página {currentPage} de {Math.ceil(filteredShipments.length / itemsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(Math.ceil(filteredShipments.length / itemsPerPage), currentPage + 1))}
              disabled={currentPage >= Math.ceil(filteredShipments.length / itemsPerPage)}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    );
  };

  const ReportsModule = () => {
    const [startDate, setStartDate] = useState('2025-10-01');
    const [endDate, setEndDate] = useState('2025-10-06');
    const [reportType, setReportType] = useState('all');

    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return saleDate >= start && saleDate <= end;
    });

    const totalSalesValue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalSalesCount = filteredSales.length;
    const productsSold = {};
    
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productsSold[item.id]) {
          productsSold[item.id] = { ...item, quantity: 0 };
        }
        productsSold[item.id].quantity += item.quantity;
      });
    });

    const topProducts = Object.values(productsSold)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const salesByDay = {};
    filteredSales.forEach(sale => {
      const date = sale.date;
      if (!salesByDay[date]) {
        salesByDay[date] = { total: 0, count: 0 };
      }
      salesByDay[date].total += sale.total;
      salesByDay[date].count++;
    });

    const salesByPayment = {};
    filteredSales.forEach(sale => {
      if (!salesByPayment[sale.payment]) {
        salesByPayment[sale.payment] = { total: 0, count: 0 };
      }
      salesByPayment[sale.payment].total += sale.total;
      salesByPayment[sale.payment].count++;
    });

    const exportReport = () => {
      // Crear workbook
      const wb = XLSX.utils.book_new();
      
      // Hoja 1: Resumen General
      const summarySheet = [
        ['COMPURSATIL IMPORTACIONES'],
        ['Reporte de Ventas'],
        [`Del ${startDate} al ${endDate}`],
        [],
        ['RESUMEN GENERAL'],
        ['Métrica', 'Valor'],
        ['Total Ventas', totalSalesCount],
        ['Valor Total (S/.)', totalSalesValue.toFixed(2)],
        ['Promedio por Venta (S/.)', (totalSalesValue / totalSalesCount).toFixed(2)],
        []
      ];
      
      // Hoja 2: Detalle de Ventas
      const salesSheet = [
        ['DETALLE DE VENTAS'],
        [],
        ['Fecha', 'Hora', 'Cliente', 'Documento', 'Tipo', 'Productos', 'Vendedor', 'Método Pago', 'Total (S/.)', 'Observaciones']
      ];
      
      filteredSales.forEach(sale => {
        const products = sale.items.map(item => {
          const invItem = inventory.find(i => i.id === item.id);
          return `${invItem?.brand} ${invItem?.model} (${item.quantity})`;
        }).join('; ');
        
        salesSheet.push([
          sale.date,
          sale.time,
          sale.customer,
          sale.documentNumber,
          sale.documentType,
          products,
          sale.seller,
          sale.payment,
          sale.total.toFixed(2),
          sale.observations || ''
        ]);
      });
      
      // Hoja 3: Top Productos
      const topProductsSheet = [
        ['PRODUCTOS MÁS VENDIDOS'],
        [],
        ['Ranking', 'Marca', 'Modelo', 'Cantidad Vendida', 'Precio Unitario (S/.)', 'Total Vendido (S/.)']
      ];
      
      topProducts.forEach((product, index) => {
        const invItem = inventory.find(i => i.id === product.id);
        topProductsSheet.push([
          index + 1,
          invItem?.brand || '',
          invItem?.model || '',
          product.quantity,
          invItem?.price.toFixed(2) || '',
          (product.quantity * (invItem?.price || 0)).toFixed(2)
        ]);
      });
      
      // Hoja 4: Ventas por Día
      const byDaySheet = [
        ['VENTAS POR DÍA'],
        [],
        ['Fecha', 'Cantidad de Ventas', 'Monto Total (S/)']
      ];
      
      Object.entries(salesByDay).forEach(([date, data]) => {
        byDaySheet.push([date, data.count, data.total.toFixed(2)]);
      });
      
      // Hoja 5: Ventas por Método de Pago
      const byPaymentSheet = [
        ['VENTAS POR MÉTODO DE PAGO'],
        [],
        ['Método de Pago', 'Cantidad de Transacciones', 'Monto Total (S/)']
      ];
      
      Object.entries(salesByPayment).forEach(([method, data]) => {
        byPaymentSheet.push([method, data.count, data.total.toFixed(2)]);
      });
      
      // Agregar hojas al workbook
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summarySheet), 'Resumen');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(salesSheet), 'Detalle Ventas');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(topProductsSheet), 'Top Productos');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(byDaySheet), 'Por Día');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(byPaymentSheet), 'Por Pago');
      
      // Descargar archivo
      XLSX.writeFile(wb, `reporte_ventas_${startDate}_a_${endDate}.xlsx`);
    };

    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Reportes - COMPURSATIL</h2>
        
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-1.5 rounded w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-1.5 rounded w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tipo de Reporte
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border p-1.5 rounded w-full text-sm"
            >
              <option value="all">Todos los datos</option>
              <option value="daily">Diario</option>
              <option value="byPayment">Por método de pago</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={exportReport}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-blue-700"
          >
            <Download size={14} />
            Exportar Reporte
          </button>
          <button
            onClick={() => {
              setStartDate('2025-10-01');
              setEndDate('2025-10-06');
              setReportType('all');
            }}
            className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-gray-400"
          >
            Limpiar Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2 flex items-center gap-1">
              <TrendingUp size={16} />
              Resumen General
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Ventas</span>
                <span className="font-medium">{totalSalesCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Valor Total</span>
                <span className="font-medium">S/. {totalSalesValue.toLocaleString('es-PE')}</span>
              </div>
              <div className="flex justify-between">
                <span>Promedio por Venta</span>
                <span className="font-medium">S/. {(totalSalesValue / totalSalesCount).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Top 5 Productos</h3>
            <div className="space-y-2">
              {topProducts.map((product, index) => {
                const invItem = inventory.find(i => i.id === product.id);
                return (
                  <div key={product.id} className="flex justify-between">
                    <span>{index + 1}. {invItem?.brand} {invItem?.model}</span>
                    <span className="font-medium">{product.quantity} unidades</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Ventas por Día</h3>
            <div className="space-y-2">
              {Object.entries(salesByDay).map(([date, data]) => (
                <div key={date} className="flex justify-between">
                  <span>{date}</span>
                  <span className="font-medium">S/. {data.total.toLocaleString('es-PE')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Ventas por Método de Pago</h3>
            <div className="space-y-2">
              {Object.entries(salesByPayment).map(([method, data]) => (
                <div key={method} className="flex justify-between">
                  <span>{method}</span>
                  <span className="font-medium">S/. {data.total.toLocaleString('es-PE')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UsersModule = () => {
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userFormData, setUserFormData] = useState({
      name: '',
      username: '',
      password: '',
      role: 'Vendedor'
    });

    const handleAddUser = (e) => {
      e.preventDefault();
      if (editingUser) {
        const updatedUsers = users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...userFormData, password: userFormData.password || user.password }
            : user
        );
        setUsers(updatedUsers);
        setEditingUser(null);
      } else {
        // Validation for new users
        if (users.some(user => user.username === userFormData.username)) {
          alert('El nombre de usuario ya existe. Por favor, elija otro.');
          return;
        }
        
        const newUser = {
          ...userFormData,
          id: users.length + 1,
          status: 'Activo'
        };
        setUsers([...users, newUser]);
      }
      setUserFormData({ name: '', username: '', password: '', role: 'Vendedor' });
      setShowUserForm(false);
    };

    const handleEditUser = (user) => {
      setEditingUser(user);
      setUserFormData({
        name: user.name,
        username: user.username,
        password: '',
        role: user.role
      });
      setShowUserForm(true);
    };

    const handleDeleteUser = (id) => {
      if (window.confirm('¿Está seguro de eliminar este usuario?')) {
        setUsers(users.filter(user => user.id !== id));
      }
    };

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Gestión de Usuarios - COMPURSATIL</h2>
          <button 
            onClick={() => {
              setShowUserForm(true);
              setEditingUser(null);
              setUserFormData({ name: '', username: '', password: '', role: 'Vendedor' });
            }}
            className="bg-red-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-red-700"
          >
            <Plus size={14} />
            Nuevo Usuario
          </button>
        </div>

        {showUserForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded shadow-xl max-w-md w-full">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">
                    {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                  </h3>
                  <button
                    onClick={() => setShowUserForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleAddUser} className="space-y-2">
                  <input
                    placeholder="Nombre completo"
                    className="border p-1.5 rounded w-full text-sm"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                    required
                  />
                  <input
                    placeholder="Nombre de usuario"
                    className="border p-1.5 rounded w-full text-sm"
                    value={userFormData.username}
                    onChange={(e) => setUserFormData({...userFormData, username: e.target.value})}
                    required
                  />
                  <input
                    placeholder={editingUser ? "Nueva contraseña (opcional)" : "Contraseña"}
                    type="password"
                    className="border p-1.5 rounded w-full text-sm"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                    required={!editingUser}
                  />
                  <select
                    className="border p-1.5 rounded w-full text-sm"
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Técnico">Técnico</option>
                  </select>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700">
                      {editingUser ? 'Actualizar' : 'Crear Usuario'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowUserForm(false)}
                      className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">@{user.username}</td>
                  <td className="px-3 py-2">{user.name}</td>
                  <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                      user.role === 'Administrador' ? 'bg-red-100 text-red-800' :
                      user.role === 'Vendedor' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                      user.status === 'Activo' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const CategoriesModule = () => {
    const [newCategory, setNewCategory] = useState({ type: 'processor', value: '' });
    const [newExtra, setNewExtra] = useState({ type: 'ram', value: '', price: 0 });

    const handleAddCategory = (e) => {
      e.preventDefault();
      if (newCategory.value.trim()) {
        addCategory(newCategory.type, newCategory.value.trim());
        setNewCategory({ type: 'processor', value: '' });
      }
    };

    const handleAddExtraComponent = (e) => {
      e.preventDefault();
      if (newExtra.value.trim() && newExtra.price >= 0) {
        const newExtraComponent = {
          name: newExtra.value,
          price: parseFloat(newExtra.price),
          category: newExtra.type
        };
        addExtraComponent(newExtraComponent);
        setNewExtra({ type: 'ram', value: '', price: 0 });
      }
    };

    const handleDeleteExtraComponent = (id) => {
      if (window.confirm('¿Está seguro de eliminar este componente extra?')) {
        setExtraComponents(extraComponents.filter(extra => extra.id !== id));
      }
    };

    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Gestión de Categorías - COMPURSATIL</h2>
        
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="font-semibold mb-2">Agregar Nueva Categoría</h3>
          <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <select
              value={newCategory.type}
              onChange={(e) => setNewCategory({...newCategory, type: e.target.value})}
              className="border p-1.5 rounded text-sm"
            >
              <option value="processor">Procesador</option>
              <option value="ram">RAM</option>
              <option value="storage">Almacenamiento</option>
              <option value="gpu">Tarjeta de Video</option>
              <option value="screen">Pantalla</option>
              <option value="os">Sistema Operativo</option>
            </select>
            <div className="flex gap-1">
              <input
                placeholder="Nuevo valor de categoría"
                className="border p-1.5 rounded flex-1 text-sm"
                value={newCategory.value}
                onChange={(e) => setNewCategory({...newCategory, value: e.target.value})}
              />
              <button 
                type="submit"
                className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
              >
                Agregar
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="font-semibold mb-2">Agregar Componente Extra</h3>
          <form onSubmit={handleAddExtraComponent} className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <select
              value={newExtra.type}
              onChange={(e) => setNewExtra({...newExtra, type: e.target.value})}
              className="border p-1.5 rounded text-sm"
            >
              <option value="ram">RAM</option>
              <option value="storage">Almacenamiento</option>
              <option value="gpu">Tarjeta de Video</option>
            </select>
            <div className="flex gap-1">
              <input
                placeholder="Nombre del componente extra"
                className="border p-1.5 rounded flex-1 text-sm"
                value={newExtra.value}
                onChange={(e) => setNewExtra({...newExtra, value: e.target.value})}
              />
              <input
                type="number"
                placeholder="Precio"
                className="border p-1.5 rounded w-20 text-sm"
                value={newExtra.price}
                onChange={(e) => setNewExtra({...newExtra, price: e.target.value})}
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
              >
                Agregar
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categories).map(([category, values]) => (
            <div key={category} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2 text-sm">
                {category === 'processor' ? 'Procesadores' :
                 category === 'ram' ? 'RAM' :
                 category === 'storage' ? 'Almacenamiento' :
                 category === 'gpu' ? 'Tarjetas de Video' :
                 category === 'screen' ? 'Pantallas' :
                 'Sistemas Operativos'}
              </h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {values.map((value, index) => (
                  <div key={index} className="flex items-center justify-between p-1 bg-gray-50 rounded">
                    <span className="text-xs">{value}</span>
                    <button
                      onClick={() => deleteCategory(category, value)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Componentes Extra</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {extraComponents.map(extra => (
              <div key={extra.id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium text-sm">{extra.name}</h4>
                  <span className="text-sm font-bold">S/. {extra.price}</span>
                </div>
                <div className="text-xs text-gray-600">Categoría: {extra.category}</div>
                <button
                  onClick={() => handleDeleteExtraComponent(extra.id)}
                  className="mt-2 text-red-600 hover:text-red-800 text-xs"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ReceiptConfigModule = () => {
    const [config, setConfig] = useState(receiptConfig);

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setConfig({...config, logo: reader.result});
        };
        reader.readAsDataURL(file);
      }
    };

    const handleRemoveLogo = () => {
      setConfig({...config, logo: null});
    };

    const handleSaveConfig = (e) => {
      e.preventDefault();
      setReceiptConfig(config);
      alert('Configuración del recibo actualizada correctamente');
    };

    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Configuración del Recibo - COMPURSATIL</h2>
        
        <div className="bg-white p-4 rounded shadow">
          <form onSubmit={handleSaveConfig} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Logo de la Empresa
              </label>
              <div className="flex items-center gap-4">
                {config.logo && (
                  <div className="flex flex-col items-center">
                    <img 
                      src={config.logo} 
                      alt="Logo" 
                      className="max-h-32 max-w-xs object-contain border border-gray-300 rounded p-2"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar Logo
                    </button>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block border border-gray-300 rounded p-2 text-sm"
                  />
                  <p className="text-xs text-gray-600 mt-1">Sube una imagen PNG, JPG o SVG (máximo 500KB)</p>
                  <p className="text-xs text-gray-600">Se recomienda una imagen cuadrada o rectangular de alta calidad</p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                value={config.companyName}
                onChange={(e) => setConfig({...config, companyName: e.target.value})}
                className="w-full border p-1.5 rounded text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={config.address}
                onChange={(e) => setConfig({...config, address: e.target.value})}
                className="w-full border p-1.5 rounded text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                value={config.phone}
                onChange={(e) => setConfig({...config, phone: e.target.value})}
                className="w-full border p-1.5 rounded text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                RUC
              </label>
              <input
                type="text"
                value={config.ruc}
                onChange={(e) => setConfig({...config, ruc: e.target.value})}
                className="w-full border p-1.5 rounded text-sm"
                required
              />
            </div>
            
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
                Guardar Configuración
              </button>
              <button 
                type="button"
                onClick={() => setConfig(receiptConfig)}
                className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <InventoryModule />;
      case 'sales': return <SalesModule />;
      case 'customers': return <CustomersModule />;
      case 'technical': return <TechnicalModule />;
      case 'shipmentTracking': return <ShipmentTrackingModule />;
      case 'reports': return <ReportsModule />;
      case 'users': return <UsersModule />;
      case 'categories': return <CategoriesModule />;
      case 'receiptConfig': return <ReceiptConfigModule />;
      case 'supportTracking': return <SupportTrackingModule />;
      default: return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 0;
            padding: 0;
          }
          div[style*="210mm"] {
            width: 210mm !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            page-break-after: always;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          td, th {
            border: 1px solid #000 !important;
            padding: 4px !important;
          }
        }
      `}</style>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {renderModule()}
        </main>
      </div>
    </>
  );
};

export default App;