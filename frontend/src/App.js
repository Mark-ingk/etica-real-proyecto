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

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchData();
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