import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const Agents = () => {
  // State management
  const [agents, setAgents] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState({ name: '', email: '', app_password: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Custom toast styles
  const toastOptions = {
    success: {
      icon: '✅',
      duration: 3000
    },
    error: {
      icon: '❌',
      duration: 4000
    },
    style: {
      borderRadius: '4px',
      padding: '8px 12px',
    },
  };

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents();
  }, []);

  // Fetch agents function
  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get_agent`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }

      const data = await response.json();
      setAgents(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      toast.error('Unable to load agents', toastOptions.error);
    } finally {
      setIsLoading(false);
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAgent({
      ...currentAgent,
      [name]: value
    });
  };

  // Create new agent
  const handleCreateAgent = async () => {

    // mail should have domain as gyws.org
    // const email = currentAgent.email.trim();
    // const emailParts = email.split('@');
    // if (emailParts.length !== 2 || emailParts[1].toLowerCase() !== 'gyws.org') {
    //   toast.error('Email must be from gyws.org domain', toastOptions.error);
    //   return;
    // }

    // Basic validation
    if (!currentAgent.name || !currentAgent.email || !currentAgent.app_password) {
      toast.error('Please fill in all required fields', toastOptions.error);
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create_agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          name: currentAgent.name,
          email: currentAgent.email,
          app_password: currentAgent.app_password
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error( 'Email exist' ||  data.message || response.statusText);
      }

      // Refresh the agents list
      await fetchAgents();
      setShowCreateModal(false);
      setCurrentAgent({ name: '', email: '', app_password: '' });
      toast.success('Agent created successfully', toastOptions.success);
    } catch (error) {
      console.error('Failed to create agent:', error);
      toast.error(error.message || 'Failed to create agent', toastOptions.error);
    } finally {
      setActionLoading(false);
    }
  };

  // Edit agent
  const handleEditAgent = async () => {
    // Basic validation
    if (!currentAgent.name || !currentAgent.email) {
      toast.error('Please fill in all required fields', toastOptions.error);
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/update_agent/${currentAgent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(currentAgent)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || response.statusText);
      }

      // Refresh the agents list
      await fetchAgents();
      setShowEditModal(false);
      setCurrentAgent({ name: '', email: '', app_password: '' });
      toast.success('Agent updated', toastOptions.success);
    } catch (error) {
      console.error('Failed to update agent:', error);
      toast.error(error.message || 'Failed to update agent', toastOptions.error);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete agent
  const handleDeleteAgent = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/delete_agent/${currentAgent._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || response.statusText);
      }

      // Refresh the agents list
      await fetchAgents();
      setShowDeleteModal(false);
      setCurrentAgent({ name: '', email: '', app_password: '' });
      toast.success('Agent deleted', toastOptions.success);
    } catch (error) {
      console.error('Failed to delete agent:', error);
      toast.error(error.message || 'Failed to delete agent', toastOptions.error);
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (agent) => {
    setCurrentAgent({...agent});
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (agent) => {
    setCurrentAgent({...agent});
    setShowDeleteModal(true);
  };

  // Toggle password visibility
  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="p-6 h-screen flex flex-col">
      <Toaster position="bottom-right" />
      
      <div className="flex justify-between items-center mb-6 ">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-800">Email Agents</h1>
        </div>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => {
            setCurrentAgent({ name: '', email: '', app_password: '' });
            setShowCreateModal(true);
          }}
        >
          <Plus size={16} />
          Create an Agent
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 flex-grow">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium text-gray-700">Agent name</div>
            <div className="font-medium text-gray-700">Email</div>
            <div className="font-medium text-gray-700 text-right">Actions</div>
          </div>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 text-center">
            <div className="flex justify-center items-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mr-2" />
              <p className="text-gray-600">Loading agents...</p>
            </div>
          </div>
        ) : agents.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {agents.map((agent) => (
              <div key={agent._id} className="px-6 py-4 grid grid-cols-3 gap-4">
                <div className="text-gray-800">{agent.name}</div>
                <div className="text-gray-800">{agent.email}</div>
                <div className="flex justify-end gap-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    onClick={() => openEditModal(agent)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    onClick={() => openDeleteModal(agent)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No agents found. Create your first agent to get started.</p>
          </div>
        )}
      </div>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Create New Agent</h2>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowCreateModal(false)}
                disabled={actionLoading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentAgent.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter agent name"
                    disabled={actionLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={currentAgent.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter email address"
                    disabled={actionLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email App Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="app_password"
                      value={currentAgent.app_password}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter email app password"
                      disabled={actionLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                      onClick={toggleVisibility}
                      disabled={actionLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setShowCreateModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                onClick={handleCreateAgent}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Agent'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Agent Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Edit Agent</h2>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowEditModal(false)}
                disabled={actionLoading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentAgent.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={actionLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={currentAgent.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={actionLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email App Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="app_password"
                      value={currentAgent.app_password}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Leave blank to keep current password"
                      disabled={actionLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                      onClick={toggleVisibility}
                      disabled={actionLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setShowEditModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                onClick={handleEditAgent}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Agent Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Delete Agent</h2>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete the agent <span className="font-medium">{currentAgent.name}</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                onClick={handleDeleteAgent}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Agent'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;