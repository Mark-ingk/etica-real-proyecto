import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'clients', label: 'Clientes', icon: '👥' },
    { id: 'cases', label: 'Casos', icon: '📁' },
    { id: 'appointments', label: 'Citas', icon: '📅' },
    { id: 'documents', label: 'Documentos', icon: '📄' }
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400">LegalAdmin</h1>
        <p className="text-gray-400 text-sm">Sistema de Gestión Legal</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="mt-8 pt-8 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          <p>© 2025 LegalAdmin</p>
          <p>Gestión Profesional</p>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ stats, clients, cases, appointments }) => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1662104935883-e9dd0619eaba" 
            alt="Legal Professional" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Dashboard Legal</h1>
          <p className="text-xl opacity-90">Gestión integral de clientes y casos</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total_clients || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Casos Activos</p>
              <p className="text-3xl font-bold text-green-600">{stats.active_cases || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-2xl">📁</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-600">Próximas Citas</p>
            <p className="text-3xl font-bold text-purple-600">{stats.upcoming_appointments || 0}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <span className="text-2xl">📅</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documentos</p>
              <p className="text-3xl font-bold text-orange-600">{stats.total_documents || 0}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <span className="text-2xl">📄</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clientes Recientes</h3>
          <div className="space-y-3">
            {clients.slice(0, 5).map(client => (
              <div key={client.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {client.first_name?.charAt(0)}{client.last_name?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {client.first_name} {client.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {client.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Cases */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Casos Recientes</h3>
          <div className="space-y-3">
            {cases.slice(0, 5).map(case_ => (
              <div key={case_.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{case_.title}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    case_.status === 'active' ? 'bg-green-100 text-green-800' :
                    case_.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {case_.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{case_.case_number}</p>
                <p className="text-xs text-gray-400">{case_.case_type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Client Management Component
const ClientManagement = ({ clients, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    date_of_birth: '',
    occupation: '',
    emergency_contact: '',
    emergency_phone: '',
    status: 'active',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      date_of_birth: '',
      occupation: '',
      emergency_contact: '',
      emergency_phone: '',
      status: 'active',
      notes: ''
    });
    setEditingClient(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await axios.put(`${API}/clients/${editingClient.id}`, formData);
      } else {
        await axios.post(`${API}/clients`, formData);
      }
      resetForm();
      onRefresh();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleEdit = (client) => {
    setFormData({ ...client });
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await axios.delete(`${API}/clients/${clientId}`);
        onRefresh();
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = !searchTerm || 
      client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    
    const matchesStatus = !filterStatus || client.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button
            onClick={resetForm}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Volver
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                    <input
                      type="text"
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ocupación</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Contact & Address Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Información de Contacto</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
                  <input
                    type="text"
                    required
                    value={formData.postal_code}
                    onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contacto de Emergencia</label>
                  <input
                    type="text"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Emergencia</label>
                  <input
                    type="tel"
                    value={formData.emergency_phone}
                    onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="potential">Potencial</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Información adicional sobre el cliente..."
              ></textarea>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingClient ? 'Actualizar Cliente' : 'Crear Cliente'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="potential">Potencial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center">
            <img 
              src="https://images.unsplash.com/photo-1662104935762-707db0439ecd" 
              alt="No clients" 
              className="mx-auto w-48 h-32 object-cover rounded-lg opacity-50 mb-4"
            />
            <p className="text-gray-500 text-lg">No se encontraron clientes</p>
            <p className="text-gray-400">Comience agregando su primer cliente</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {client.first_name?.charAt(0)}{client.last_name?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.first_name} {client.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {client.occupation || 'No especificado'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.city}, {client.state}</div>
                      <div className="text-sm text-gray-500">{client.postal_code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.status === 'active' ? 'bg-green-100 text-green-800' :
                        client.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {client.status === 'active' ? 'Activo' :
                         client.status === 'inactive' ? 'Inactivo' : 'Potencial'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Case Management Component  
const CaseManagement = ({ cases, clients, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    case_number: '',
    case_type: 'civil',
    status: 'active',
    description: '',
    start_date: '',
    end_date: '',
    next_hearing: '',
    court_name: '',
    judge_name: '',
    opposing_party: '',
    case_value: '',
    hourly_rate: '',
    total_hours: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      client_id: '',
      title: '',
      case_number: '',
      case_type: 'civil',
      status: 'active',
      description: '',
      start_date: '',
      end_date: '',
      next_hearing: '',
      court_name: '',
      judge_name: '',
      opposing_party: '',
      case_value: '',
      hourly_rate: '',
      total_hours: '',
      notes: ''
    });
    setEditingCase(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      // Convert numeric fields
      if (submitData.case_value) submitData.case_value = parseFloat(submitData.case_value);
      if (submitData.hourly_rate) submitData.hourly_rate = parseFloat(submitData.hourly_rate);
      if (submitData.total_hours) submitData.total_hours = parseFloat(submitData.total_hours);
      
      if (editingCase) {
        await axios.put(`${API}/cases/${editingCase.id}`, submitData);
      } else {
        await axios.post(`${API}/cases`, submitData);
      }
      resetForm();
      onRefresh();
    } catch (error) {
      console.error('Error saving case:', error);
    }
  };

  const handleEdit = (case_) => {
    setFormData({ ...case_ });
    setEditingCase(case_);
    setShowForm(true);
  };

  const handleDelete = async (caseId) => {
    if (window.confirm('¿Está seguro de eliminar este caso?')) {
      try {
        await axios.delete(`${API}/cases/${caseId}`);
        onRefresh();
      } catch (error) {
        console.error('Error deleting case:', error);
      }
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.first_name} ${client.last_name}` : 'Cliente no encontrado';
  };

  const filteredCases = cases.filter(case_ => {
    const matchesStatus = !filterStatus || case_.status === filterStatus;
    const matchesClient = !filterClient || case_.client_id === filterClient;
    return matchesStatus && matchesClient;
  });

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingCase ? 'Editar Caso' : 'Nuevo Caso'}
          </h2>
          <button
            onClick={resetForm}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Volver
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Case Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                  <select
                    required
                    value={formData.client_id}
                    onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.first_name} {client.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título del Caso *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Caso *</label>
                  <input
                    type="text"
                    required
                    value={formData.case_number}
                    onChange={(e) => setFormData({...formData, case_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Caso</label>
                    <select
                      value={formData.case_type}
                      onChange={(e) => setFormData({...formData, case_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="civil">Civil</option>
                      <option value="criminal">Criminal</option>
                      <option value="family">Familia</option>
                      <option value="corporate">Corporativo</option>
                      <option value="real_estate">Inmobiliario</option>
                      <option value="immigration">Inmigración</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Activo</option>
                      <option value="pending">Pendiente</option>
                      <option value="closed">Cerrado</option>
                      <option value="on_hold">En espera</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>

              {/* Dates and Court Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Fechas y Tribunal</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Finalización</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Próxima Audiencia</label>
                  <input
                    type="date"
                    value={formData.next_hearing}
                    onChange={(e) => setFormData({...formData, next_hearing: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Tribunal</label>
                  <input
                    type="text"
                    value={formData.court_name}
                    onChange={(e) => setFormData({...formData, court_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Juez</label>
                  <input
                    type="text"
                    value={formData.judge_name}
                    onChange={(e) => setFormData({...formData, judge_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parte Contraria</label>
                  <input
                    type="text"
                    value={formData.opposing_party}
                    onChange={(e) => setFormData({...formData, opposing_party: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Financial Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Información Financiera</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor del Caso</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.case_value}
                    onChange={(e) => setFormData({...formData, case_value: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarifa por Hora</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horas Totales</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.total_hours}
                    onChange={(e) => setFormData({...formData, total_hours: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingCase ? 'Actualizar Caso' : 'Crear Caso'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Casos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nuevo Caso
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="pending">Pendiente</option>
              <option value="closed">Cerrado</option>
              <option value="on_hold">En espera</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Cliente</label>
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los clientes</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.first_name} {client.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center">
            <img 
              src="https://images.unsplash.com/photo-1613155961736-d0782a58f170" 
              alt="No cases" 
              className="mx-auto w-48 h-32 object-cover rounded-lg opacity-50 mb-4"
            />
            <p className="text-gray-500 text-lg">No se encontraron casos</p>
            <p className="text-gray-400">Comience agregando su primer caso</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Caso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCases.map(case_ => (
                  <tr key={case_.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {case_.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {case_.case_number}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getClientName(case_.client_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {case_.case_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        case_.status === 'active' ? 'bg-green-100 text-green-800' :
                        case_.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        case_.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {case_.status === 'active' ? 'Activo' :
                         case_.status === 'pending' ? 'Pendiente' :
                         case_.status === 'closed' ? 'Cerrado' : 'En espera'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Inicio: {case_.start_date}</div>
                      {case_.next_hearing && (
                        <div>Audiencia: {case_.next_hearing}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(case_)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(case_.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Document Management Component
const DocumentManagement = ({ clients, documents, onRefresh }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [filterClient, setFilterClient] = useState('');

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedClientId || !uploadFile) {
      alert('Por favor seleccione un cliente y un archivo');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('client_id', selectedClientId);
      formData.append('file', uploadFile);
      formData.append('description', uploadDescription);
      formData.append('category', uploadCategory);

      await axios.post(`${API}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Reset form
      setSelectedClientId('');
      setUploadFile(null);
      setUploadDescription('');
      setUploadCategory('');
      e.target.reset();
      
      onRefresh();
      alert('Documento subido exitosamente');
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error al subir el documento');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('¿Está seguro de eliminar este documento?')) {
      try {
        await axios.delete(`${API}/documents/${documentId}`);
        onRefresh();
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.first_name} ${client.last_name}` : 'Cliente no encontrado';
  };

  const filteredDocuments = documents.filter(doc => 
    !filterClient || doc.client_id === filterClient
  );

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Gestión de Documentos</h2>

      {/* Upload Form */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Subir Nuevo Documento</h3>
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
              <select
                required
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.first_name} {client.last_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <input
                type="text"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                placeholder="ej. Contratos, Identificación, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              placeholder="Descripción del documento"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Archivo *</label>
            <input
              type="file"
              required
              onChange={(e) => setUploadFile(e.target.files[0])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={isUploading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isUploading ? 'Subiendo...' : 'Subir Documento'}
          </button>
        </form>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Cliente</label>
          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los clientes</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.first_name} {client.last_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center">
            <img 
              src="https://images.unsplash.com/photo-1629280301895-a098bd9c4a67" 
              alt="No documents" 
              className="mx-auto w-48 h-32 object-cover rounded-lg opacity-50 mb-4"
            />
            <p className="text-gray-500 text-lg">No se encontraron documentos</p>
            <p className="text-gray-400">Comience subiendo el primer documento</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamaño
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map(document => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">📄</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {document.original_filename}
                          </div>
                          <div className="text-sm text-gray-500">
                            {document.description || 'Sin descripción'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getClientName(document.client_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {document.category || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(document.file_size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(document.uploaded_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a
                        href={`${BACKEND_URL}/uploads/${document.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Ver
                      </a>
                      <button
                        onClick={() => handleDeleteDocument(document.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Appointment Management Component
const AppointmentManagement = ({ appointments, clients, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [filterUpcoming, setFilterUpcoming] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    description: '',
    appointment_date: '',
    appointment_time: '',
    duration_minutes: 60,
    location: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      client_id: '',
      title: '',
      description: '',
      appointment_date: '',
      appointment_time: '',
      duration_minutes: 60,
      location: '',
      notes: ''
    });
    setEditingAppointment(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await axios.put(`${API}/appointments/${editingAppointment.id}`, formData);
      } else {
        await axios.post(`${API}/appointments`, formData);
      }
      resetForm();
      onRefresh();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleEdit = (appointment) => {
    setFormData({ ...appointment });
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleComplete = async (appointmentId) => {
    const notes = prompt('Notas de la cita completada (opcional):');
    try {
      await axios.put(`${API}/appointments/${appointmentId}/complete`, { notes });
      onRefresh();
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('¿Está seguro de eliminar esta cita?')) {
      try {
        await axios.delete(`${API}/appointments/${appointmentId}`);
        onRefresh();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.first_name} ${client.last_name}` : 'Cliente no encontrado';
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filterUpcoming) {
      const today = new Date().toISOString().split('T')[0];
      return appointment.appointment_date >= today && !appointment.is_completed;
    }
    return true;
  });

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingAppointment ? 'Editar Cita' : 'Nueva Cita'}
          </h2>
          <button
            onClick={resetForm}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Volver
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select
                  required
                  value={formData.client_id}
                  onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.first_name} {client.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                <input
                  type="date"
                  required
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora *</label>
                <input
                  type="time"
                  required
                  value={formData.appointment_time}
                  onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duración (minutos)</label>
                <input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Oficina, videoconferencia, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <textarea
                rows="2"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingAppointment ? 'Actualizar Cita' : 'Crear Cita'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Citas</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nueva Cita
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filterUpcoming}
              onChange={(e) => setFilterUpcoming(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Mostrar solo próximas citas</span>
          </label>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-500 text-lg">No se encontraron citas</p>
            <p className="text-gray-400">Comience programando su primera cita</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map(appointment => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.description || 'Sin descripción'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getClientName(appointment.client_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{appointment.appointment_date}</div>
                      <div className="text-gray-500">{appointment.appointment_time}</div>
                      <div className="text-xs text-gray-400">{appointment.duration_minutes} min</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.location || 'No especificada'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        appointment.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.is_completed ? 'Completada' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!appointment.is_completed && (
                        <button
                          onClick={() => handleComplete(appointment.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Completar
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Client Portal Login Component
const ClientLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/client/login`, { email, phone });
      onLogin(response.data);
    } catch (error) {
      setError('Credenciales inválidas. Verifique su email y teléfono.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <img 
            src="https://images.unsplash.com/photo-1662104935883-e9dd0619eaba" 
            alt="Legal Services" 
            className="mx-auto w-20 h-20 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900">Portal del Cliente</h2>
          <p className="text-gray-600">Accede para ver el estado de tus casos</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="su-email@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+34-91-123-4567"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Accediendo...' : 'Acceder'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Use su email registrado y número de teléfono</p>
        </div>
      </div>
    </div>
  );
};

// Client Dashboard Component
const ClientDashboard = ({ clientData, onLogout }) => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseTimeline, setCaseTimeline] = useState(null);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  const loadCaseTimeline = async (caseId) => {
    setLoadingTimeline(true);
    try {
      const response = await axios.get(`${API}/client/${clientData.client_info.id}/case-timeline/${caseId}`);
      setCaseTimeline(response.data);
      setSelectedCase(caseId);
    } catch (error) {
      console.error('Error loading case timeline:', error);
    } finally {
      setLoadingTimeline(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getUpdateTypeIcon = (type) => {
    switch (type) {
      case 'progress': return '📈';
      case 'hearing': return '⚖️';
      case 'document': return '📄';
      case 'status_change': return '🔄';
      default: return '📝';
    }
  };

  if (selectedCase && caseTimeline) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="text-blue-600 hover:text-blue-800 mb-2"
                >
                  ← Volver al Dashboard
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {caseTimeline.case.title}
                </h1>
                <p className="text-gray-600">Caso #{caseTimeline.case.case_number}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseTimeline.case.status)}`}>
                {caseTimeline.case.status === 'active' ? 'Activo' : 
                 caseTimeline.case.status === 'pending' ? 'Pendiente' : 'Cerrado'}
              </span>
            </div>
          </div>

          {/* Case Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Información del Caso</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Tipo:</span> {caseTimeline.case.case_type}</p>
                <p><span className="font-medium">Fecha Inicio:</span> {formatDate(caseTimeline.case.start_date)}</p>
                {caseTimeline.case.next_hearing && (
                  <p><span className="font-medium">Próxima Audiencia:</span> {formatDate(caseTimeline.case.next_hearing)}</p>
                )}
                {caseTimeline.case.court_name && (
                  <p><span className="font-medium">Tribunal:</span> {caseTimeline.case.court_name}</p>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Próximas Citas</h3>
              {caseTimeline.appointments.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay citas programadas</p>
              ) : (
                <div className="space-y-2">
                  {caseTimeline.appointments.slice(0, 3).map(appointment => (
                    <div key={appointment.id} className="text-sm">
                      <p className="font-medium">{appointment.title}</p>
                      <p className="text-gray-600">{appointment.appointment_date} - {appointment.appointment_time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Documentos</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">{caseTimeline.documents.length}</p>
              <p className="text-gray-600 text-sm">documentos disponibles</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Historial y Avances del Caso</h3>
            
            {loadingTimeline ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {caseTimeline.updates.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay actualizaciones disponibles</p>
                ) : (
                  caseTimeline.updates.map(update => (
                    <div key={update.id} className="flex space-x-4 border-l-2 border-blue-200 pl-6 pb-6 relative">
                      <div className="absolute -left-2 bg-blue-600 w-4 h-4 rounded-full"></div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getUpdateTypeIcon(update.update_type)}</span>
                            <h4 className="font-medium text-gray-900">{update.title}</h4>
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(update.created_at)}</span>
                        </div>
                        <p className="text-gray-700">{update.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-8 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Bienvenido, {clientData.client_info.first_name}
              </h1>
              <p className="text-blue-200">Panel de seguimiento de casos legales</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{clientData.active_cases.length}</div>
            <div className="text-gray-600">Casos Activos</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{clientData.recent_updates.length}</div>
            <div className="text-gray-600">Actualizaciones</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{clientData.upcoming_appointments.length}</div>
            <div className="text-gray-600">Citas Próximas</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{clientData.total_documents}</div>
            <div className="text-gray-600">Documentos</div>
          </div>
        </div>

        {/* Active Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mis Casos Activos</h2>
            {clientData.active_cases.length === 0 ? (
              <p className="text-gray-500">No tienes casos activos</p>
            ) : (
              <div className="space-y-4">
                {clientData.active_cases.map(case_ => (
                  <div key={case_.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{case_.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                        {case_.status === 'active' ? 'Activo' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Caso #{case_.case_number}</p>
                    <p className="text-sm text-gray-700 mb-3">{case_.description}</p>
                    {case_.next_hearing && (
                      <p className="text-sm text-blue-600 mb-3">
                        Próxima audiencia: {formatDate(case_.next_hearing)}
                      </p>
                    )}
                    <button
                      onClick={() => loadCaseTimeline(case_.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Ver Detalles y Avances
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Updates */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Actualizaciones Recientes</h2>
            {clientData.recent_updates.length === 0 ? (
              <p className="text-gray-500">No hay actualizaciones recientes</p>
            ) : (
              <div className="space-y-4">
                {clientData.recent_updates.slice(0, 5).map(update => (
                  <div key={update.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span>{getUpdateTypeIcon(update.update_type)}</span>
                      <h4 className="font-medium text-gray-900 text-sm">{update.title}</h4>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{update.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(update.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Próximas Citas</h2>
          {clientData.upcoming_appointments.length === 0 ? (
            <p className="text-gray-500">No tienes citas programadas</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientData.upcoming_appointments.map(appointment => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{appointment.title}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📅 {formatDate(appointment.appointment_date)}</p>
                    <p>🕐 {appointment.appointment_time}</p>
                    <p>⏱️ {appointment.duration_minutes} minutos</p>
                    {appointment.location && <p>📍 {appointment.location}</p>}
                  </div>
                  {appointment.description && (
                    <p className="text-sm text-gray-700 mt-2">{appointment.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Case Update Management for Lawyer
const CaseUpdateManagement = ({ cases, clients, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCase, setSelectedCase] = useState('');
  const [formData, setFormData] = useState({
    case_id: '',
    title: '',
    description: '',
    update_type: 'general',
    is_visible_to_client: true
  });

  const resetForm = () => {
    setFormData({
      case_id: '',
      title: '',
      description: '',
      update_type: 'general',
      is_visible_to_client: true
    });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/case-updates`, formData);
      resetForm();
      onRefresh();
      alert('Actualización creada exitosamente');
    } catch (error) {
      console.error('Error creating update:', error);
      alert('Error al crear la actualización');
    }
  };

  const getCaseName = (caseId) => {
    const case_ = cases.find(c => c.id === caseId);
    return case_ ? case_.title : 'Caso no encontrado';
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.first_name} ${client.last_name}` : 'Cliente no encontrado';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Actualizaciones de Casos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nueva Actualización
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Actualización de Caso</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caso *</label>
                <select
                  required
                  value={formData.case_id}
                  onChange={(e) => setFormData({...formData, case_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar caso</option>
                  {cases.map(case_ => (
                    <option key={case_.id} value={case_.id}>
                      {case_.title} - {getClientName(case_.client_id)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Actualización</label>
                <select
                  value={formData.update_type}
                  onChange={(e) => setFormData({...formData, update_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General</option>
                  <option value="progress">Progreso</option>
                  <option value="hearing">Audiencia</option>
                  <option value="document">Documento</option>
                  <option value="status_change">Cambio de Estado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ej. Audiencia programada, Documentos recibidos..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea
                rows="3"
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descripción detallada de la actualización..."
              ></textarea>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="visible_to_client"
                checked={formData.is_visible_to_client}
                onChange={(e) => setFormData({...formData, is_visible_to_client: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="visible_to_client" className="ml-2 text-sm text-gray-700">
                Visible para el cliente
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Actualización
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Portal del Cliente</h3>
        <p className="text-gray-600 mb-4">
          Los clientes pueden acceder a su portal usando su email y teléfono registrados en:
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="font-mono text-blue-800">
            {window.location.origin}/client
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Los clientes verán sus casos, actualizaciones y próximas citas
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Client Portal State
  const [isClientPortal, setIsClientPortal] = useState(false);
  const [clientSession, setClientSession] = useState(null);
  const [clientDashboardData, setClientDashboardData] = useState(null);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, clientsRes, casesRes, documentsRes, appointmentsRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`),
        axios.get(`${API}/clients`),
        axios.get(`${API}/cases`),
        axios.get(`${API}/documents`),
        axios.get(`${API}/appointments`)
      ]);
      
      setStats(statsRes.data);
      setClients(clientsRes.data);
      setCases(casesRes.data);
      setDocuments(documentsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Client Portal Functions
  const handleClientLogin = async (loginData) => {
    try {
      setClientSession(loginData);
      
      // Fetch client dashboard data
      const response = await axios.get(`${API}/client/dashboard/${loginData.client_id}`);
      setClientDashboardData(response.data);
      setIsClientPortal(true);
    } catch (error) {
      console.error('Error loading client dashboard:', error);
    }
  };

  const handleClientLogout = () => {
    setClientSession(null);
    setClientDashboardData(null);
    setIsClientPortal(false);
  };

  useEffect(() => {
    // Check if URL contains /client to show client portal
    if (window.location.pathname.includes('/client')) {
      setIsClientPortal(true);
      setLoading(false);
    } else {
      fetchData();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando sistema...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard stats={stats} clients={clients} cases={cases} appointments={appointments} />;
      case 'clients':
        return <ClientManagement clients={clients} onRefresh={fetchData} />;
      case 'cases':
        return <CaseManagement cases={cases} clients={clients} onRefresh={fetchData} />;
      case 'documents':
        return <DocumentManagement clients={clients} documents={documents} onRefresh={fetchData} />;
      case 'appointments':
        return <AppointmentManagement appointments={appointments} clients={clients} onRefresh={fetchData} />;
      default:
        return <Dashboard stats={stats} clients={clients} cases={cases} appointments={appointments} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;