
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
  Truck,
  Zap
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-2 sm:p-3 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-md">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">COMPURSATIL</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">Sistema de Gestión de Inventarios</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Nombre de usuario
            </label>
            <input
              ref={usernameInputRef}
              type="text"
              className="w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-xs sm:text-sm"
              placeholder="Usuario"
              defaultValue=""
              required
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                className="w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 sm:pr-10 md:pr-12 outline-none text-xs sm:text-sm"
                placeholder="Contraseña"
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
                className="absolute right-2 sm:right-2.5 md:right-3 top-2 sm:top-2.5 md:top-3 text-gray-400 hover:text-gray-600 pointer-events-auto"
              >
                {showPassword ? <EyeOff size={16} className="sm:w-5 sm:h-5" /> : <Eye size={16} className="sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
          
          {loginError && (
            <div className="bg-red-50 text-red-600 p-2 sm:p-3 rounded-lg text-xs sm:text-sm">
              {loginError}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 sm:py-2.5 md:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-xs sm:text-sm"
          >
            Iniciar Sesión
          </button>
        </form>
        
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
          <p className="font-semibold mb-1.5 sm:mb-2">Credenciales de Prueba:</p>
          <div className="bg-gray-50 rounded p-2 sm:p-3 space-y-1">
            <p><span className="font-medium text-blue-600 text-xs">Gerente:</span> <span className="text-xs">gerente / gerente123</span></p>
            <p><span className="font-medium text-green-600 text-xs">Admin:</span> <span className="text-xs">admin / admin123</span></p>
            <p><span className="font-medium text-orange-600 text-xs">Vendedor:</span> <span className="text-xs">vendedor / venta123</span></p>
            <p><span className="font-medium text-purple-600 text-xs">Soporte:</span> <span className="text-xs">soporte / sop123</span></p>
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
          items: (sale.detalles || []).map(detalle => ({
            id: detalle.inventario_id,
            name: `${detalle.marca} ${detalle.modelo}`,
            serial: detalle.numero_serie,
            quantity: detalle.cantidad,
            price: detalle.precio_unitario,
            subtotal: detalle.subtotal,
            igv: detalle.igv,
            total: detalle.total
          })),
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

  // Helper function to map inventory data from backend to frontend format
  const mapInventoryItem = (item) => ({
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
  });

  // CRUD Operations
  // Helper function to clean undefined values before sending to backend
  const cleanItemData = (item) => {
    const cleaned = {};
    Object.keys(item).forEach(key => {
      if (item[key] === undefined || item[key] === '') {
        cleaned[key] = null;
      } else {
        cleaned[key] = item[key];
      }
    });
    return cleaned;
  };

  const addInventoryItem = async (newItem) => {
    try {
      let itemData = {
        marca: newItem.brand,
        modelo: newItem.model,
        numero_serie: newItem.serial,
        especificaciones_ram: newItem.ram,
        especificaciones_almacenamiento: newItem.storage,
        especificaciones_procesador: newItem.processor,
        especificaciones_gpu: newItem.gpu,
        especificaciones_pantalla: newItem.screen,
        especificaciones_so: newItem.os,
        estado: newItem.status,
        proveedor_nombre: newItem.supplier,
        costo_unitario: newItem.cost ? parseFloat(newItem.cost) : 0,
        precio_venta: newItem.price ? parseFloat(newItem.price) : 0,
        stock: newItem.stock ? parseInt(newItem.stock) : 0,
        imagen: newItem.image
      };
      itemData = cleanItemData(itemData);
      
      const response = await fetch(`${API_BASE}/inventario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(itemData)
      });
      
      const result = await response.json();
      if (result.success) {
        // Reload inventory from backend
        const invRes = await fetch(`${API_BASE}/inventario`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const invData = await invRes.json();
        if (invData.success) {
          const processedInventory = (invData.data || []).map(mapInventoryItem);
          setInventory(processedInventory);
          alert('Equipo agregado exitosamente');
        }
      } else {
        alert('Error al agregar item: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
      alert('Error al agregar equipo al inventario');
    }
  };

  const updateInventoryItem = async (updatedItem) => {
    try {
      let itemData = {
        marca: updatedItem.brand,
        modelo: updatedItem.model,
        numero_serie: updatedItem.serial,
        especificaciones_ram: updatedItem.ram,
        especificaciones_almacenamiento: updatedItem.storage,
        especificaciones_procesador: updatedItem.processor,
        especificaciones_gpu: updatedItem.gpu,
        especificaciones_pantalla: updatedItem.screen,
        especificaciones_so: updatedItem.os,
        estado: updatedItem.status,
        proveedor_nombre: updatedItem.supplier,
        costo_unitario: updatedItem.cost ? parseFloat(updatedItem.cost) : 0,
        precio_venta: updatedItem.price ? parseFloat(updatedItem.price) : 0,
        stock: updatedItem.stock ? parseInt(updatedItem.stock) : 0,
        imagen: updatedItem.image
      };
      itemData = cleanItemData(itemData);
      
      const response = await fetch(`${API_BASE}/inventario/${updatedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(itemData)
      });
      
      const result = await response.json();
      if (result.success) {
        // Reload inventory from backend
        const invRes = await fetch(`${API_BASE}/inventario`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const invData = await invRes.json();
        if (invData.success) {
          const processedInventory = (invData.data || []).map(mapInventoryItem);
          setInventory(processedInventory);
          alert('Equipo actualizado exitosamente');
        }
      } else {
        alert('Error al actualizar item: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating inventory item:', error);
      alert('Error al actualizar equipo');
    }
  };

  const deleteInventoryItem = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este equipo del inventario?')) {
      try {
        const response = await fetch(`${API_BASE}/inventario/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        
        const result = await response.json();
        if (result.success) {
          // Reload inventory from backend
          const invRes = await fetch(`${API_BASE}/inventario`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
          });
          const invData = await invRes.json();
          if (invData.success) {
            const processedInventory = (invData.data || []).map(mapInventoryItem);
            setInventory(processedInventory);
            alert('Equipo eliminado exitosamente');
          }
        } else {
          alert('Error al eliminar item: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting inventory item:', error);
        alert('Error al eliminar equipo');
      }
    }
  };

  // Helper function to map customer data from backend to frontend format
  const mapCustomer = (client) => ({
    id: client.id,
    name: client.nombre,
    document: client.numero_documento,
    documentType: client.tipo_documento,
    phone: client.telefono || '',
    email: client.email || '',
    address: client.direccion || '',
    city: client.ciudad || ''
  });

  const addCustomer = async (newCustomer) => {
    try {
      const customerData = {
        nombre: newCustomer.name,
        documento: newCustomer.document || '',
        tipo_documento: newCustomer.documentType || 'DNI',
        telefono: newCustomer.phone || '',
        email: newCustomer.email || '',
        direccion: newCustomer.address || ''
      };
      
      const response = await fetch(`${API_BASE}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(customerData)
      });
      
      const result = await response.json();
      if (result.success) {
        // Reload customers from backend
        const customersRes = await fetch(`${API_BASE}/clientes`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const customersData = await customersRes.json();
        if (customersData.success) {
          const processedCustomers = (customersData.data || []).map(mapCustomer);
          setCustomers(processedCustomers);
          alert('Cliente agregado exitosamente');
        }
        // Return the created customer
        return { id: result.id, ...newCustomer };
      } else {
        alert('Error al crear cliente: ' + result.message);
        return null;
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Error al crear cliente');
      return null;
    }
  };

  const updateCustomer = async (updatedCustomer) => {
    try {
      const customerData = {
        nombre: updatedCustomer.name,
        documento: updatedCustomer.document || '',
        tipo_documento: updatedCustomer.documentType || 'DNI',
        telefono: updatedCustomer.phone || '',
        email: updatedCustomer.email || '',
        direccion: updatedCustomer.address || ''
      };
      
      const response = await fetch(`${API_BASE}/clientes/${updatedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(customerData)
      });
      
      const result = await response.json();
      if (result.success) {
        // Reload customers from backend
        const customersRes = await fetch(`${API_BASE}/clientes`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const customersData = await customersRes.json();
        if (customersData.success) {
          const processedCustomers = (customersData.data || []).map(mapCustomer);
          setCustomers(processedCustomers);
          alert('Cliente actualizado exitosamente');
        }
      } else {
        alert('Error al actualizar cliente: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Error al actualizar cliente');
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        const response = await fetch(`${API_BASE}/clientes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        
        const result = await response.json();
        if (result.success) {
          // Reload customers from backend
          const customersRes = await fetch(`${API_BASE}/clientes`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
          });
          const customersData = await customersRes.json();
          if (customersData.success) {
            const processedCustomers = (customersData.data || []).map(mapCustomer);
            setCustomers(processedCustomers);
            alert('Cliente eliminado exitosamente');
          }
        } else {
          alert('Error al eliminar cliente: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Error al eliminar cliente');
      }
    }
  };

  const calculateIGV = (price) => {
    const subtotal = price / 1.18;
    const igv = price - subtotal;
    return { subtotal: parseFloat(subtotal.toFixed(2)), igv: parseFloat(igv.toFixed(2)) };
  };

  // Helper function to format date from ISO to DD/MM/YYYY
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    // Si ya está en formato DD/MM/YYYY, devolverlo tal cual
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(isoDate)) {
      return isoDate;
    }
    // Si es ISO string (2025-12-08 o 2025-12-08T...)
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return isoDate; // Si no se puede parsear, devolver original
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

  const addSale = async (newSale) => {
    try {
      // Calculate IGV for each item
      const itemsWithIGV = newSale.items.map(item => {
        const { subtotal, igv } = calculateIGV(item.price);
        return { ...item, subtotal, igv };
      });
      
      const totalAmount = itemsWithIGV.reduce((sum, item) => sum + (item.price || 0), 0);
      const igvTotal = itemsWithIGV.reduce((sum, item) => sum + (item.igv || 0), 0);
      const subtotalAmount = totalAmount - igvTotal;
      
      // Prepare data for backend
      const saleData = {
        cliente_id: parseInt(newSale.customerId),
        vendedor_id: currentUser.id || 1,
        tipo_documento: newSale.documentType,
        numero_documento: newSale.documentNumber,
        fecha: newSale.date,
        hora: newSale.time,
        subtotal: subtotalAmount,
        igv: igvTotal,
        total: totalAmount,
        metodo_pago: newSale.payment,
        observaciones: newSale.observations || '',
        detalles: newSale.items.map(item => ({
          id: item.id,
          quantity: item.quantity || 1,
          equipmentBasePrice: item.equipmentBasePrice || item.price,
          extrasPrice: item.extrasPrice || 0,
          price: item.price,
          subtotal: item.subtotal,
          igv: item.igv,
          total: item.price,
          extras: item.extras || []
        }))
      };
      
      const response = await fetch(`${API_BASE}/ventas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(saleData)
      });
      
      const result = await response.json();
      if (result.success) {
        // Reload sales from backend
        const salesRes = await fetch(`${API_BASE}/ventas`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const salesData = await salesRes.json();
        if (salesData.success) {
          const processedSales = (salesData.data || []).map(sale => ({
            id: sale.id,
            customer: sale.cliente_nombre,
            customerId: sale.cliente_id,
            seller: sale.vendedor_nombre,
            sellerId: sale.vendedor_id,
            payment: sale.metodo_pago,
            documentType: sale.tipo_documento,
            documentNumber: sale.numero_documento,
            date: sale.fecha,
            time: sale.hora,
            observations: sale.observaciones,
            items: (sale.detalles || []).map(detalle => ({
              id: detalle.inventario_id,
              name: `${detalle.marca} ${detalle.modelo}`,
              serial: detalle.numero_serie,
              quantity: detalle.cantidad,
              price: detalle.precio_unitario,
              subtotal: detalle.subtotal,
              igv: detalle.igv,
              total: detalle.total
            })),
            total: sale.total,
            status: sale.estado
          }));
          setSales(processedSales);
          alert('Venta registrada exitosamente');
        }
      } else {
        alert('Error al guardar la venta: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding sale:', error);
      alert('Error al guardar la venta');
    }
  };

  
  const updateSale = async (updatedSale) => {
    try {
      // Validate ID exists
      if (!updatedSale.id) {
        alert('Error: No se puede actualizar sin ID de venta');
        console.error('updateSale missing ID:', updatedSale);
        return;
      }

      console.log('updateSale called with ID:', updatedSale.id);
      console.log('Items to update:', updatedSale.items);

      // Recalculate IGV for updated items
      const itemsWithIGV = updatedSale.items.map(item => {
        const { subtotal, igv } = calculateIGV(item.price);
        return { ...item, subtotal, igv };
      });
      const totalAmount = itemsWithIGV.reduce((sum, it) => sum + (it.price || 0), 0);
      const igvTotal = itemsWithIGV.reduce((sum, item) => sum + (item.igv || 0), 0);
      const subtotalAmount = totalAmount - igvTotal;
      
      // Prepare data for backend - INCLUDE ITEMS
      const saleData = {
        subtotal: subtotalAmount,
        igv: igvTotal,
        total: totalAmount,
        metodo_pago: updatedSale.payment,
        observaciones: updatedSale.observations || '',
        estado: updatedSale.status || 'Completada',
        items: itemsWithIGV  // Send items to backend
      };
      
      console.log('Sending update to backend with data:', saleData);
      
      const response = await fetch(`${API_BASE}/ventas/${updatedSale.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(saleData)
      });
      
      const result = await response.json();
      console.log('Backend response:', result);
      
      if (result.success) {
        // Recargar ventas desde el servidor para obtener datos actualizados
        console.log('Update successful, reloading sales...');
        const salesRes = await fetch(`${API_BASE}/ventas`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const salesData = await salesRes.json();
        if (salesData.success) {
          const processedSales = (salesData.data || []).map(sale => ({
            id: sale.id,
            customer: sale.cliente_nombre,
            customerId: sale.cliente_id,
            seller: sale.vendedor_nombre,
            sellerId: sale.vendedor_id,
            payment: sale.metodo_pago,
            documentType: sale.tipo_documento,
            documentNumber: sale.numero_documento,
            date: sale.fecha,
            time: sale.hora,
            observations: sale.observaciones,
            items: (sale.detalles || []).map(detalle => ({
              id: detalle.inventario_id,
              name: `${detalle.marca} ${detalle.modelo}`,
              serial: detalle.numero_serie,
              quantity: detalle.cantidad,
              price: detalle.precio_unitario,
              subtotal: detalle.subtotal,
              igv: detalle.igv,
              total: detalle.total
            })),
            total: sale.total,
            status: sale.estado
          }));
          setSales(processedSales);
          console.log('Sales reloaded successfully:', processedSales.length);
          alert('Venta actualizada exitosamente');
        }
      } else {
        alert('Error al actualizar la venta: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating sale:', error);
      alert('Error al actualizar la venta');
    }
  };


  const deleteSale = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta venta?')) {
      try {
        const response = await fetch(`${API_BASE}/ventas/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        
        const result = await response.json();
        if (result.success) {
          // Reload sales from backend
          const salesRes = await fetch(`${API_BASE}/ventas`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
          });
          const salesData = await salesRes.json();
          if (salesData.success) {
            const processedSales = (salesData.data || []).map(sale => ({
              id: sale.id,
              customer: sale.cliente_nombre,
              customerId: sale.cliente_id,
              seller: sale.vendedor_nombre,
              sellerId: sale.vendedor_id,
              payment: sale.metodo_pago,
              documentType: sale.tipo_documento,
              documentNumber: sale.numero_documento,
              date: sale.fecha,
              time: sale.hora,
              observations: sale.observaciones,
              items: (sale.detalles || []).map(detalle => ({
                id: detalle.inventario_id,
                name: `${detalle.marca} ${detalle.modelo}`,
                serial: detalle.numero_serie,
                quantity: detalle.cantidad,
                price: detalle.precio_unitario,
                subtotal: detalle.subtotal,
                igv: detalle.igv,
                total: detalle.total
              })),
              total: sale.total,
              status: sale.estado
            }));
            setSales(processedSales);
            alert('Venta eliminada exitosamente');
          }
        } else {
          alert('Error al eliminar la venta: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting sale:', error);
        alert('Error al eliminar la venta');
      }
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

  const updateTechnicalCase = async (updatedCase) => {
    try {
      const caseData = {
        cliente_id: updatedCase.customerId,
        descripcion: updatedCase.description || '',
        estado: updatedCase.status || 'En proceso',
        diagnostico: updatedCase.diagnostico || '',
        solucion: updatedCase.solucion || ''
      };
      
      const response = await fetch(`${API_BASE}/soporte/${updatedCase.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(caseData)
      });
      
      const result = await response.json();
      if (result.success) {
        // Reload technical cases from backend
        const casesRes = await fetch(`${API_BASE}/soporte`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const casesData = await casesRes.json();
        if (casesData.success) {
          setTechnicalCases(casesData.data || []);
        }
      } else {
        alert('Error al actualizar caso: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating technical case:', error);
      alert('Error al actualizar caso técnico');
    }
  };

  const deleteTechnicalCase = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este caso técnico?')) {
      try {
        const response = await fetch(`${API_BASE}/soporte/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        
        const result = await response.json();
        if (result.success) {
          // Reload technical cases from backend
          const casesRes = await fetch(`${API_BASE}/soporte`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
          });
          const casesData = await casesRes.json();
          if (casesData.success) {
            setTechnicalCases(casesData.data || []);
          }
        } else {
          alert('Error al eliminar caso: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting technical case:', error);
        alert('Error al eliminar caso técnico');
      }
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

  // Helper function to map extra component data from backend to frontend format
  const mapExtraComponent = (extra) => ({
    id: extra.id,
    name: extra.nombre,
    price: extra.precio,
    category: extra.categoria || ''
  });

  const addExtraComponent = async (newExtra) => {
    try {
      const extraData = {
        nombre: newExtra.name,
        descripcion: newExtra.description || '',
        precio: parseFloat(newExtra.price) || 0,
        categoria: newExtra.category || 'General'
      };
      
      const response = await fetch(`${API_BASE}/extras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(extraData)
      });
      
      const result = await response.json();
      if (result.success) {
        // Reload extras from backend
        const extrasRes = await fetch(`${API_BASE}/extras`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const extrasData = await extrasRes.json();
        if (extrasData.success) {
          const processedExtras = (extrasData.data || []).map(mapExtraComponent);
          setExtraComponents(processedExtras);
          alert('Componente extra agregado exitosamente');
        }
      } else {
        alert('Error al agregar componente: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding extra component:', error);
      alert('Error al agregar componente extra');
    }
  };

  const deleteExtraComponent = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este componente extra?')) {
      try {
        const response = await fetch(`${API_BASE}/extras/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        
        const result = await response.json();
        if (result.success) {
          // Reload extras from backend
          const extrasRes = await fetch(`${API_BASE}/extras`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
          });
          const extrasData = await extrasRes.json();
          if (extrasData.success) {
            const processedExtras = (extrasData.data || []).map(mapExtraComponent);
            setExtraComponents(processedExtras);
            alert('Componente extra eliminado exitosamente');
          }
        } else {
          alert('Error al eliminar componente: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting extra component:', error);
        alert('Error al eliminar componente extra');
      }
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
    <div className={`fixed left-0 top-0 h-screen bg-gray-800 text-white min-h-screen transition-all duration-300 flex flex-col z-50 ${
      sidebarCollapsed ? 'w-16 sm:w-16 md:w-16 lg:w-20' : 'w-48 sm:w-56 md:w-64 lg:w-80'
    }`}>
      <div className="p-3 sm:p-4 border-b border-gray-700 flex items-center justify-between gap-2 sm:gap-3">
        {!sidebarCollapsed && (
          <>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold truncate">COMPURSATIL</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Sistema de Gestión</p>
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-400 hover:text-white flex-shrink-0"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </>
        )}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-400 hover:text-white w-full flex justify-center"
          >
            <Menu size={20} className="sm:w-6 sm:h-6" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <nav className="p-2 sm:p-3">
          {filteredModules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg mb-1 sm:mb-2 transition-colors text-sm sm:text-base ${
                  activeModule === module.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                } ${sidebarCollapsed ? 'px-0' : ''}`}
                title={sidebarCollapsed ? module.name : ''}
              >
                <Icon size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{module.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-2 sm:p-3 border-t border-gray-700 flex-shrink-0">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2 sm:gap-3 mb-3 min-w-0">
            <div className="bg-gray-600 rounded-full p-2 flex-shrink-0">
              <User size={16} className="sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-xs sm:text-sm truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-400 truncate">{currentUser.role}</p>
            </div>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className={`flex items-center justify-center sm:justify-start gap-2 text-gray-300 hover:text-white w-full p-2 rounded transition-colors hover:bg-gray-700 text-sm sm:text-base ${sidebarCollapsed ? '' : ''}`}
          title={sidebarCollapsed ? 'Cerrar Sesión' : ''}
        >
          <LogOut size={16} className="sm:w-4 sm:h-4 flex-shrink-0" />
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
    const completionRate = sales.length > 0 ? 95 : 0; // Mock completion rate
    const recentSales = sales.slice(-5).reverse();
    const recentTechCases = technicalCases.slice(-5).reverse();
    
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
    
    // Payment method distribution
    const paymentByMethod = {};
    sales.forEach(sale => {
      const method = sale.payment || 'No especificado';
      if (!paymentByMethod[method]) {
        paymentByMethod[method] = 0;
      }
      paymentByMethod[method] += sale.total;
    });

    const paymentData = Object.entries(paymentByMethod).map(([method, total]) => ({
      method,
      total,
      percentage: ((total / totalSalesValue) * 100).toFixed(1)
    }));

    const paymentColors = {
      'Efectivo': '#10B981',
      'Tarjeta': '#3B82F6',
      'Transferencia': '#8B5CF6',
      'Cheque': '#F59E0B',
      'No especificado': '#6B7280'
    };

    // Sales status distribution
    const statusByType = {};
    sales.forEach(sale => {
      const status = sale.status || 'Completada';
      if (!statusByType[status]) {
        statusByType[status] = 0;
      }
      statusByType[status] += 1;
    });

    const statusData = Object.entries(statusByType).map(([status, count]) => ({
      status,
      count,
      percentage: ((count / totalSalesCount) * 100).toFixed(1)
    }));

    const statusColors = {
      'Completada': '#10B981',
      'Pendiente': '#F59E0B',
      'Cancelada': '#EF4444',
      'En proceso': '#3B82F6'
    };

    // Product categories distribution
    const categoryByBrand = {};
    inventory.forEach(item => {
      if (!categoryByBrand[item.brand]) {
        categoryByBrand[item.brand] = 0;
      }
      categoryByBrand[item.brand] += item.stock;
    });

    const categoryData = Object.entries(categoryByBrand)
      .map(([brand, stock]) => ({
        brand,
        stock,
        percentage: ((stock / inventory.reduce((sum, i) => sum + i.stock, 0)) * 100).toFixed(1)
      }))
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5);

    const brandColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    const topVendors = sales.reduce((acc, sale) => {
      const existing = acc.find(v => v.seller === sale.seller);
      if (existing) {
        existing.sales += 1;
        existing.total += sale.total;
      } else {
        acc.push({ seller: sale.seller, sales: 1, total: sale.total });
      }
      return acc;
    }, []).sort((a, b) => b.total - a.total).slice(0, 5);

    const topProducts = sales.reduce((acc, sale) => {
      sale.items?.forEach(item => {
        const existing = acc.find(p => p.name === item.name);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          acc.push({ name: item.name, quantity: item.quantity, revenue: item.price * item.quantity });
        }
      });
      return acc;
    }, []).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // Helper function for circular progress
    const CircularProgress = ({ percentage, label, color }) => {
      const circumference = 2 * Math.PI * 45;
      const strokeDashoffset = circumference - (percentage / 100) * circumference;
      
      return (
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="45" stroke="#E5E7EB" strokeWidth="8" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="45"
                stroke={color}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
              <span className="text-xs text-gray-600 text-center px-2">{label}</span>
            </div>
          </div>
        </div>
      );
    };

    // Helper function for donut chart
    const DonutChart = ({ data, colors, innerRadius = 55, outerRadius = 80 }) => {
      let currentAngle = -Math.PI / 2;
      const total = data.reduce((sum, item) => sum + (item.total || item.count || item.stock), 0);
      
      const segments = data.map((item, index) => {
        const value = item.total || item.count || item.stock;
        const sliceAngle = (value / total) * 2 * Math.PI;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        
        const startX = 100 + outerRadius * Math.cos(startAngle);
        const startY = 100 + outerRadius * Math.sin(startAngle);
        const endX = 100 + outerRadius * Math.cos(endAngle);
        const endY = 100 + outerRadius * Math.sin(endAngle);
        
        const innerStartX = 100 + innerRadius * Math.cos(startAngle);
        const innerStartY = 100 + innerRadius * Math.sin(startAngle);
        const innerEndX = 100 + innerRadius * Math.cos(endAngle);
        const innerEndY = 100 + innerRadius * Math.sin(endAngle);
        
        const largeArc = sliceAngle > Math.PI ? 1 : 0;
        
        const pathData = [
          `M ${startX} ${startY}`,
          `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${endX} ${endY}`,
          `L ${innerEndX} ${innerEndY}`,
          `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStartX} ${innerStartY}`,
          'Z'
        ].join(' ');
        
        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = (innerRadius + outerRadius) / 2;
        const labelX = 100 + labelRadius * Math.cos(midAngle);
        const labelY = 100 + labelRadius * Math.sin(midAngle);
        
        currentAngle = endAngle;
        
        return {
          path: pathData,
          color: colors[index % colors.length],
          labelX,
          labelY,
          label: `${item.percentage}%`,
          value: item
        };
      });
      
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {segments.map((segment, index) => (
            <g key={index}>
              <path d={segment.path} fill={segment.color} stroke="white" strokeWidth="2" />
              {parseFloat(segment.value.percentage) > 5 && (
                <text
                  x={segment.labelX}
                  y={segment.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold fill-white"
                  style={{ pointerEvents: 'none' }}
                >
                  {segment.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      );
    };
    
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-5 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Bienvenido de vuelta, {currentUser?.name}!</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">Aquí está el resumen completo de tu negocio</p>
        </div>
        
        {/* KPI Cards - Top Row */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-5 sm:mb-6 md:mb-8">
          {/* Card 1 - Inventory Value */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg sm:rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-blue-100 text-xs sm:text-xs md:text-sm font-medium">Valor Inventario</p>
                <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mt-0.5 sm:mt-1 md:mt-2 truncate">S/. {(totalInventoryValue / 1000).toFixed(1)}K</p>
              </div>
              <div className="bg-white bg-opacity-20 p-1.5 sm:p-2 md:p-3 rounded-lg flex-shrink-0 ml-2">
                <Package size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
            </div>
            <p className="text-blue-100 text-xs">{inventory.length} productos</p>
          </div>
          
          {/* Card 2 - Total Sales */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg sm:rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-green-100 text-xs sm:text-xs md:text-sm font-medium">Ventas Totales</p>
                <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mt-0.5 sm:mt-1 md:mt-2 truncate">S/. {(totalSalesValue / 1000).toFixed(1)}K</p>
              </div>
              <div className="bg-white bg-opacity-20 p-1.5 sm:p-2 md:p-3 rounded-lg flex-shrink-0 ml-2">
                <ShoppingBag size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
            </div>
            <p className="text-green-100 text-xs">{totalSalesCount} transacciones</p>
          </div>
          
          {/* Card 3 - Customers */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg sm:rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-purple-100 text-xs sm:text-xs md:text-sm font-medium">Clientes</p>
                <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mt-0.5 sm:mt-1 md:mt-2">{customers.length}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-1.5 sm:p-2 md:p-3 rounded-lg flex-shrink-0 ml-2">
                <Users size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
            </div>
            <p className="text-purple-100 text-xs">Registrados</p>
          </div>
          
          {/* Card 4 - Low Stock Alert */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg sm:rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-orange-100 text-xs sm:text-xs md:text-sm font-medium">Alertas Stock</p>
                <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold mt-0.5 sm:mt-1 md:mt-2">{lowStockItems}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-1.5 sm:p-2 md:p-3 rounded-lg flex-shrink-0 ml-2">
                <AlertTriangle size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
            </div>
            <p className="text-orange-100 text-xs">Stock bajo</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-5 sm:mb-6 md:mb-8">
          {/* Sales Chart - Spans appropriate columns */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 2xl:col-span-3 bg-white rounded-lg md:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 flex items-center gap-2">
                <BarChart2 className="text-blue-500 flex-shrink-0" size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="hidden sm:inline">Ventas por Mes</span>
                <span className="sm:hidden">Ventas</span>
              </h2>
              <button className="text-blue-500 hover:text-blue-600 text-xs sm:text-sm font-medium hidden sm:block">Ver todo →</button>
            </div>
            <div className="h-40 sm:h-48 md:h-56 lg:h-64 flex items-end justify-between gap-0.5 sm:gap-1 md:gap-2">
              {salesData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg group-hover:from-blue-600 group-hover:to-blue-400 transition-colors cursor-pointer relative" 
                    style={{height: `${(data.sales / maxSales) * 100}%`, minHeight: data.sales > 0 ? '0.375em' : '0.125em'}}
                    title={`${data.month}: S/. ${data.sales.toLocaleString('es-PE')}`}
                  >
                    {data.sales > 0 && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        S/. {(data.sales / 1000).toFixed(1)}K
                      </div>
                    )}
                  </div>
                  <span className="text-xs mt-1.5 sm:mt-2 md:mt-3 font-medium text-gray-600">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 md:pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600">Total acumulado: <span className="font-bold text-blue-600">S/. {totalSalesValue.toLocaleString('es-PE')}</span></p>
            </div>
          </div>

          {/* Métodos de Pago - Donut Chart */}
          <div className="col-span-1 bg-white rounded-lg md:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 lg:p-6">
            <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 mb-2 sm:mb-3 md:mb-6 flex items-center gap-1.5 sm:gap-2">
              <CreditCard className="text-green-500 flex-shrink-0" size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="hidden sm:inline">Métodos de Pago</span>
              <span className="sm:hidden">Pagos</span>
            </h2>
            {paymentData.length > 0 ? (
              <>
                <div className="h-28 sm:h-32 md:h-40">
                  <DonutChart data={paymentData} colors={Object.values(paymentColors)} />
                </div>
                <div className="mt-2 sm:mt-3 md:mt-4 space-y-0.5 sm:space-y-1 md:space-y-2">
                  {paymentData.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full flex-shrink-0" style={{backgroundColor: paymentColors[item.method] || '#6B7280'}}></div>
                        <span className="text-gray-700 truncate text-xs">{item.method}</span>
                      </div>
                      <span className="font-semibold text-gray-800 flex-shrink-0 ml-2">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-xs sm:text-sm">No hay datos</p>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-5 sm:mb-6 md:mb-8">
          {/* Estado de Ventas */}
          <div className="col-span-1 bg-white rounded-lg md:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 lg:p-6">
            <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 mb-2 sm:mb-3 md:mb-6 flex items-center gap-1.5 sm:gap-2">
              <FileCheck className="text-blue-500 flex-shrink-0" size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="hidden sm:inline">Estado de Ventas</span>
              <span className="sm:hidden">Estado</span>
            </h2>
            {statusData.length > 0 ? (
              <>
                <div className="h-28 sm:h-32 md:h-40">
                  <DonutChart data={statusData} colors={Object.values(statusColors)} innerRadius={45} outerRadius={70} />
                </div>
                <div className="mt-2 sm:mt-3 md:mt-4 space-y-0.5 sm:space-y-1 md:space-y-2">
                  {statusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full flex-shrink-0" style={{backgroundColor: statusColors[item.status] || '#6B7280'}}></div>
                        <span className="text-gray-700 truncate text-xs">{item.status}</span>
                      </div>
                      <span className="font-semibold text-gray-800 flex-shrink-0 ml-2">{item.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-xs sm:text-sm">No hay datos</p>
            )}
          </div>

          {/* Inventario por Marca */}
          <div className="col-span-1 bg-white rounded-lg md:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 lg:p-6">
            <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 mb-2 sm:mb-3 md:mb-6 flex items-center gap-1.5 sm:gap-2">
              <Package className="text-purple-500 flex-shrink-0" size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="hidden sm:inline">Stock por Marca</span>
              <span className="sm:hidden">Marcas</span>
            </h2>
            {categoryData.length > 0 ? (
              <>
                <div className="h-28 sm:h-32 md:h-40">
                  <DonutChart data={categoryData} colors={brandColors} innerRadius={45} outerRadius={70} />
                </div>
                <div className="mt-2 sm:mt-3 md:mt-4 space-y-0.5 sm:space-y-1 md:space-y-2">
                  {categoryData.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full flex-shrink-0" style={{backgroundColor: brandColors[index]}}></div>
                        <span className="text-gray-700 truncate text-xs">{item.brand}</span>
                      </div>
                      <span className="font-semibold text-gray-800 flex-shrink-0 ml-2">{item.stock}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-xs sm:text-sm">No hay datos</p>
            )}
          </div>

          {/* Progreso de Actividad */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 bg-white rounded-lg md:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 lg:p-6">
            <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 mb-2 sm:mb-3 md:mb-6">Finalización</h2>
            <div className="flex flex-col items-center">
              <div className="flex justify-center mb-2 sm:mb-3 md:mb-6">
                <CircularProgress percentage={completionRate} label="Completadas" color="#3B82F6" />
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-2 sm:p-3 md:p-4 rounded w-full">
                <p className="text-xs sm:text-sm font-medium text-gray-800">Próximas acciones</p>
                <ul className="mt-1 sm:mt-2 space-y-0.5 text-xs text-gray-600">
                  <li>✓ Revisar stock bajo</li>
                  <li>✓ Procesar órdenes</li>
                  <li>✓ Actualizar precios</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid - Sales and Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-5 sm:mb-6 md:mb-8">
          {/* Top Vendors */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 lg:p-6">
            <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 mb-2 sm:mb-3 md:mb-6 flex items-center gap-1.5 sm:gap-2">
              <TrendingUp className="text-green-500 flex-shrink-0" size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="hidden md:inline">Mejores Vendedores</span>
              <span className="md:hidden">Vendedores</span>
            </h2>
            <div className="space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4">
              {topVendors.map((vendor, index) => (
                <div key={index} className="flex items-center justify-between p-1.5 sm:p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-1 min-w-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                      {vendor.seller?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{vendor.seller}</p>
                      <p className="text-xs text-gray-600">{vendor.sales} ventas</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-bold text-gray-800 text-xs sm:text-sm">S/. {vendor.total.toLocaleString('es-PE').substring(0, 10)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 lg:p-6">
            <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 mb-2 sm:mb-3 md:mb-6 flex items-center gap-1.5 sm:gap-2">
              <Zap className="text-orange-500 flex-shrink-0" size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="hidden md:inline">Productos Vendidos</span>
              <span className="md:hidden">Productos</span>
            </h2>
            <div className="space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.quantity} unidades</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-bold text-gray-800 text-xs sm:text-sm">S/. {product.revenue.toLocaleString('es-PE').substring(0, 10)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 sm:p-3 md:p-4 lg:p-6">
          <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 mb-2 sm:mb-3 md:mb-6 flex items-center gap-1.5 sm:gap-2">
            <ShoppingBag className="text-green-500 flex-shrink-0" size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="hidden sm:inline">Últimas Ventas</span>
            <span className="sm:hidden">Ventas</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
            {recentSales.map(sale => (
              <div key={sale.id} className="bg-gradient-to-br from-gray-50 to-gray-100 p-1.5 sm:p-2 md:p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-1.5 sm:mb-2 md:mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{sale.customer}</p>
                    <p className="text-xs text-gray-600 truncate">{sale.documentType}: {sale.documentNumber}</p>
                  </div>
                  <div className="bg-green-100 p-1 sm:p-1.5 md:p-2 rounded-lg flex-shrink-0 ml-2">
                    <ShoppingBag size={12} className="sm:w-4 sm:h-4 text-green-600" />
                  </div>
                </div>
                <div className="bg-white p-1.5 sm:p-2 rounded mb-1.5 sm:mb-2 md:mb-3">
                  <p className="text-xs sm:text-sm font-bold text-green-600">S/. {sale.total.toLocaleString('es-PE').substring(0, 12)}</p>
                </div>
                <div className="flex items-center justify-between gap-1 text-xs">
                  <span className="text-gray-500 truncate">{formatDate(sale.date)}</span>
                  <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">Completada</span>
                </div>
              </div>
            ))}
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
      
      // Validar campos requeridos
      if (!formData.brand || !formData.model || !formData.serial || !formData.ram || 
          !formData.storage || !formData.processor || !formData.status || 
          !formData.supplier || !formData.cost || !formData.price || !formData.stock) {
        alert('Por favor completa todos los campos requeridos');
        return;
      }
      
      if (editingItem) {
        // Actualizar equipo existente
        updateInventoryItem({ ...editingItem, ...formData });
      } else {
        // Agregar nuevo equipo
        addInventoryItem(formData);
      }
      
      // Resetear formulario
      resetForm();
    };

    const resetForm = () => {
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
      setEditingItem(null);
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
      <div className="p-2 sm:p-3 md:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">Gestión de Inventario - COMPURSATIL</h2>
          {['Administrador', 'Gerente'].includes(currentUser.role) && (
            <button 
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded text-xs sm:text-sm flex items-center gap-1 hover:bg-blue-700 flex-shrink-0"
            >
              <Plus size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Nuevo Equipo</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          )}
          {currentUser.role === 'Vendedor' && (
            <span className="text-gray-500 text-xs sm:text-sm">Modo visualización</span>
          )}
        </div>

        <div className="mb-3 sm:mb-4 md:mb-6 flex flex-col sm:flex-row gap-1.5 sm:gap-2 md:gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2 sm:left-2.5 top-2 sm:top-2.5 text-gray-400 flex-shrink-0" size={16} />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-6 sm:pl-8 pr-2 sm:pr-3 py-1 sm:py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="border border-gray-300 rounded px-2 sm:px-3 py-1 sm:py-1.5 focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm flex-shrink-0"
          >
            <option value="">Todas</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-3 md:p-4">
            <div className="bg-white rounded shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-2 sm:p-3 md:p-4 lg:p-6 sticky top-0 bg-white border-b border-gray-200">
                <div className="flex justify-between items-center mb-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold">
                    {editingItem ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
                  </h3>
                  <button
                    onClick={() => resetForm()}
                    className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-2 sm:p-3 md:p-4 lg:p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <input
                    name="brand"
                    placeholder="Marca"
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="model"
                    placeholder="Modelo"
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="serial"
                    placeholder="Número de Serie"
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
                    value={formData.serial}
                    onChange={handleInputChange}
                    required
                  />
                  <select
                    name="ram"
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
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
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
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
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
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
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
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
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
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
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
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
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
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
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="cost"
                    placeholder="Costo (S/.)"
                    type="number"
                    step="0.01"
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
                    value={formData.cost}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="price"
                    placeholder="Precio venta (S/.)"
                    type="number"
                    step="0.01"
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="stock"
                    placeholder="Stock"
                    type="number"
                    className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Imagen del equipo
                    </label>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {formData.image && (
                        <img 
                          src={formData.image} 
                          alt="Equipo" 
                          className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="border p-1 rounded text-xs flex-1 min-w-0"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2 flex gap-1.5 sm:gap-2 mt-2">
                    <button type="submit" className="bg-green-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-green-700 flex-1">
                      {editingItem ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => resetForm()}
                      className="bg-gray-300 text-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-gray-400 flex-1"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Table - Responsive scrollable on mobile */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especificaciones</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precios</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                    <img 
                      src={item.image} 
                      alt={`${item.brand} ${item.model}`}
                      className="w-8 h-6 sm:w-10 sm:h-8 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/40x32/cccccc/666666?text=No+Image';
                      }}
                    />
                  </td>
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 min-w-0">
                    <div>
                      <p className="font-medium text-xs sm:text-sm truncate">{item.brand} {item.model}</p>
                      <p className="text-gray-500 text-xs truncate">S/N: {item.serial}</p>
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-500 text-xs">
                    <div className="truncate">{item.ram}</div>
                    <div className="truncate">{item.storage}</div>
                    <div className="truncate">{item.processor}</div>
                  </td>
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                    <span className={`px-1.5 py-0.5 rounded-full text-xs inline-block ${
                      item.status === 'Nuevo' ? 'bg-green-100 text-green-800' :
                      item.status === 'Reacondicionado' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 font-medium text-xs sm:text-sm">{item.stock}</td>
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs">
                    <div className="text-gray-500">C: S/. {(item.cost / 1).toFixed(0)}</div>
                    <div className="font-medium">V: S/. {(item.price / 1).toFixed(0)}</div>
                  </td>
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                    <div className="flex gap-1">
                      {['Administrador', 'Gerente'].includes(currentUser.role) && (
                        <>
                          <button 
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={12} className="sm:w-4 sm:h-4" />
                          </button>
                          <button 
                            onClick={() => deleteInventoryItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={12} className="sm:w-4 sm:h-4" />
                          </button>
                        </>
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
          // Ensure ID is preserved when updating
          const saleToUpdate = {
            id: editingSale.id,
            ...editingSale,
            ...newSale,
            customerId: parseInt(saleFormData.customerId)
          };
          console.log('Updating sale:', saleToUpdate);
          updateSale(saleToUpdate);
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
      <div className="p-2 sm:p-3 md:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">Gestión de Ventas - COMPURSATIL</h2>
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
            className="bg-green-600 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded text-xs sm:text-sm flex items-center gap-1 hover:bg-green-700 flex-shrink-0"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Nueva Venta</span>
            <span className="sm:hidden">Venta</span>
          </button>
        </div>

        <div className="mb-3 sm:mb-4 md:mb-6 flex flex-col sm:flex-row gap-1.5 sm:gap-2 md:gap-3">
          <div className="relative flex-shrink-0">
            <Calendar className="absolute left-2 sm:left-2.5 top-2 sm:top-2.5 text-gray-400 flex-shrink-0" size={16} />
            <input
              type="date"
              className="pl-6 sm:pl-8 pr-2 sm:pr-3 py-1 sm:py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2 sm:left-2.5 top-2 sm:top-2.5 text-gray-400 flex-shrink-0" size={16} />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-6 sm:pl-8 pr-2 sm:pr-3 py-1 sm:py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
              value={searchSalesTerm}
              onChange={(e) => setSearchSalesTerm(e.target.value)}
            />
          </div>
        </div>

        {showSaleForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-3 md:p-4">
            <div className="bg-white rounded shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-2 sm:p-3 md:p-4 lg:p-6 sticky top-0 bg-white border-b border-gray-200">
                <div className="flex justify-between items-center mb-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold">
                    {editingSale ? 'Editar Venta' : 'Registrar Nueva Venta'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowSaleForm(false);
                      setEditingSale(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-2 sm:p-3 md:p-4 lg:p-6">
                <form onSubmit={handleAddSale} className="space-y-2 sm:space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  <td className="px-3 py-2">{formatDate(sale.date)} {sale.time}</td>
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
      <div className="p-2 sm:p-3 md:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">Gestión de Clientes - COMPURSATIL</h2>
          <button 
            onClick={() => {
              setShowCustomerForm(true);
              setEditingCustomer(null);
              setCustomerFormData({ name: '', document: '', phone: '', email: '', documentType: 'DNI' });
            }}
            className="bg-purple-600 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded text-xs sm:text-sm flex items-center gap-1 hover:bg-purple-700 flex-shrink-0"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Nuevo Cliente</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>

        <div className="mb-3 sm:mb-4 md:mb-6 relative">
          <Search className="absolute left-2 sm:left-2.5 top-2 sm:top-2.5 text-gray-400 flex-shrink-0" size={16} />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-6 sm:pl-8 pr-2 sm:pr-3 py-1 sm:py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm"
            value={searchCustomersTerm}
            onChange={(e) => setSearchCustomersTerm(e.target.value)}
          />
        </div>

        {showCustomerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-3 md:p-4">
            <div className="bg-white rounded shadow-xl w-full max-w-md">
              <div className="p-2 sm:p-3 md:p-4 lg:p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold">
                    {editingCustomer ? 'Editar Cliente' : 'Registrar Cliente'}
                  </h3>
                  <button
                    onClick={() => setShowCustomerForm(false)}
                    className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-2 sm:p-3 md:p-4 lg:p-6">
                <form onSubmit={handleAddCustomer} className="space-y-1.5 sm:space-y-2">
                  <input
                    placeholder="Nombres y apellidos / Razón Social"
                    className="border p-1.5 sm:p-2 rounded w-full text-xs sm:text-sm"
                    value={customerFormData.name}
                    onChange={(e) => setCustomerFormData({...customerFormData, name: e.target.value})}
                    required
                  />
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <select
                      value={customerFormData.documentType}
                      onChange={(e) => setCustomerFormData({...customerFormData, documentType: e.target.value})}
                      className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
                    >
                      <option value="DNI">DNI</option>
                      <option value="RUC">RUC</option>
                    </select>
                    <input
                      placeholder={customerFormData.documentType === 'DNI' ? 'DNI' : 'RUC'}
                      className="border p-1.5 sm:p-2 rounded text-xs sm:text-sm"
                      value={customerFormData.document}
                      onChange={(e) => setCustomerFormData({...customerFormData, document: e.target.value})}
                      required
                    />
                  </div>
                  <input
                    placeholder="Teléfono"
                    className="border p-1.5 sm:p-2 rounded w-full text-xs sm:text-sm"
                    value={customerFormData.phone}
                    onChange={(e) => setCustomerFormData({...customerFormData, phone: e.target.value})}
                    required
                  />
                  <input
                    placeholder="Correo"
                    className="border p-1.5 sm:p-2 rounded w-full text-xs sm:text-sm"
                    value={customerFormData.email}
                    onChange={(e) => setCustomerFormData({...customerFormData, email: e.target.value})}
                    required
                  />
                  <div className="flex gap-1.5 sm:gap-2">
                    <button type="submit" className="bg-purple-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-purple-700 flex-1">
                      {editingCustomer ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowCustomerForm(false)}
                      className="bg-gray-300 text-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-gray-400 flex-1"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compras</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.slice((currentPageCustomers - 1) * itemsPerPageCustomers, currentPageCustomers * itemsPerPageCustomers).map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 font-medium text-xs sm:text-sm truncate">{customer.name}</td>
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                    <span className={`px-1.5 py-0.5 rounded-full text-xs inline-block ${
                      customer.documentType === 'DNI' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {customer.documentType}
                    </span>
                    <div className="text-xs mt-0.5">{customer.document}</div>
                  </td>
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Phone size={12} className="text-gray-500 flex-shrink-0" />
                      <span className="truncate">{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail size={12} className="text-gray-500 flex-shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium">
                    {sales.filter(sale => sale.customerId === customer.id).length}
                  </td>
                  <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleEditCustomer(customer)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={12} className="sm:w-4 sm:h-4" />
                      </button>
                      <button 
                        onClick={() => deleteCustomer(customer.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={12} className="sm:w-4 sm:h-4" />
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
      <div className="p-2 sm:p-3 md:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">Gestión de Garantías - COMPURSATIL</h2>
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2 sm:left-2.5 top-2 sm:top-2.5 text-gray-400 flex-shrink-0" size={16} />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-6 sm:pl-8 pr-2 sm:pr-3 py-1 sm:py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodo</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Soporte</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWarranties.slice((currentPageWarranties - 1) * itemsPerPageWarranties, currentPageWarranties * itemsPerPageWarranties).map(warranty => {
                const customer = customers.find(c => c.id === warranty.customerId);
                const technicalCase = technicalCases.find(tc => tc.serial === warranty.serial);
                return (
                  <tr key={warranty.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">S/N: {warranty.serial}</p>
                      <p className="text-gray-500 text-xs truncate">
                        {inventory.find(i => i.serial === warranty.serial)?.brand} {inventory.find(i => i.serial === warranty.serial)?.model}
                      </p>
                    </td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm truncate">{customer?.name || 'No encontrado'}</td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-500 text-xs">
                      <div>{warranty.startDate}</div>
                      <div className="text-gray-400">{warranty.endDate}</div>
                    </td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                      <span className="px-1.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800 inline-block">
                        {warranty.warrantyType}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs inline-block ${
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
      <div className="p-2 sm:p-3 md:p-4 lg:p-6">
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-3 sm:mb-4 md:mb-6">Soporte Técnico - COMPURSATIL</h2>

        {/* Quick Add Case Section */}
        <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6 border border-orange-200">
          <h3 className="text-xs sm:text-sm md:text-base font-bold mb-2 sm:mb-3">Registrar Equipo Recibido</h3>
          
          {!showQuickForm ? (
            <div className="relative">
              <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Buscar Cliente</label>
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-2 sm:top-3 text-gray-400 flex-shrink-0" size={16} />
                <input
                  type="text"
                  placeholder="Cliente o documento..."
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-6 sm:pl-10 pr-2 sm:pr-3 py-1 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-xs sm:text-sm"
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
      <div className="p-2 sm:p-3 md:p-4 lg:p-6">
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-3 sm:mb-4 md:mb-6">Seguimiento de Soporte Técnico - COMPURSATIL</h2>
        
        <div className="mb-3 sm:mb-4 md:mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2">
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
      <div className="p-2 sm:p-3 md:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold flex items-center gap-2">
            <Truck size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" /> <span className="hidden md:inline">Seguimiento de Envíos</span><span className="md:hidden">Envíos</span>
          </h2>
          <div className="flex gap-2 items-center text-xs sm:text-sm">
            <span className="text-gray-600">Total: {shipments && shipments.length ? shipments.length : 0}</span>
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
      <div className="p-2 sm:p-3 md:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">Gestión de Usuarios - COMPURSATIL</h2>
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
      <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100 text-base">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 w-full overflow-x-hidden ${sidebarCollapsed ? 'sm:ml-4 md:ml-16 lg:ml-20' : 'sm:ml-48 md:ml-64 lg:ml-80'}`}>
          {renderModule()}
        </main>
      </div>
    </>
  );
};

export default App;
