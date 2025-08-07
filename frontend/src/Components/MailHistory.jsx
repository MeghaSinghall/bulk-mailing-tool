import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import Fuse from 'fuse.js';

const MailHistory = () => {
  const [mailHistory, setMailHistory] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMailHistory = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/mail_histories?skip=${skip}&limit=${limit}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch mail history');
        }
        const data = await response.json();
        setMailHistory(data);
      } catch (error) {
        console.error('Error fetching mail history:', error);
      }
    };

    fetchMailHistory();
  }, [skip]);

  const fuse = useMemo(() => {
    const keys = [
      'subject',
      'recipient',
      'status',
      'user_id',
      'agent_id',
      'body',
      'batch_id',
      'cc',
      'bcc',
      'attachments',
      'error',
      'created_at',
      'updated_at',
    ];
    return new Fuse(mailHistory, {
      keys,
      threshold: 0.3,
      includeScore: true,
    });
  }, [mailHistory]);

  const filteredMailHistory = useMemo(() => {
    if (!searchTerm) return mailHistory;
    const result = fuse.search(searchTerm);
    return result.map((r) => r.item);
  }, [searchTerm, fuse, mailHistory]);

  const openModal = (mail) => {
    setSelectedMail(mail);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMail(null);
  };

  const handlePrevious = () => setSkip((prev) => Math.max(prev - limit, 0));
  const handleNext = () => setSkip((prev) => prev + limit);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Mail History</h1>
        <p className="text-gray-600 mt-1">View your past email activities</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search mail history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button> */}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMailHistory.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openModal(item)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{item.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.recipient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.batch_id || 'None'}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500`}>
                    <span  className={`${item.status === 'sent' ? ' bg-green-300 text-black p-1 rounded-full px-2' : 'bg-red-300 text-black p-1 rounded-full px-2'}`}
                    >

                    {item.status}
                    </span>
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* {new Date(item.created_at).toLocaleString()} */}
                    {item.created_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 sm:px-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredMailHistory.length}</span> results
          </div>
          <div className="flex-1 flex justify-end">
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePrevious}
              disabled={skip === 0}
            >
              Previous
            </button>
            <button
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={mailHistory.length < limit}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && selectedMail && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto "
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={closeModal}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              ​
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-2/3 sm:my-8 sm:align-middle sm:w-2/3 h-[900px] overflow-y-auto">
              <div className="bg-white p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6" id="modal-title">
                  Mail Details
                </h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-3/5 flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                      {selectedMail.subject}
                    </div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Body</label>
                    <div
                      className="prose prose-sm border border-gray-300 rounded-lg p-2 overflow-auto max-h-72 text-gray-900"
                      dangerouslySetInnerHTML={{ __html: selectedMail.body }}
                    />
                  </div>

                  <div className="w-full md:w-2/5 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recipient (To)</label>
                      <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                        {selectedMail.recipient}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CC</label>
                      <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                        {selectedMail.cc?.join(', ') || 'None'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">BCC</label>
                      <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                        {selectedMail.bcc?.join(', ') || 'None'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                      <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                        {selectedMail.attachments?.join(', ') || 'None'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <div className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 ${selectedMail.status === 'sent' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedMail.status}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sent Date</label>
                      <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                        {new Date(selectedMail.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                      {selectedMail.user_id}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agent ID</label>
                    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                      {selectedMail.agent_id}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID</label>
                    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                      {selectedMail.batch_id || 'None'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Error</label>
                    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                      {selectedMail.error || 'None'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
                    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                      {new Date(selectedMail.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MailHistory;