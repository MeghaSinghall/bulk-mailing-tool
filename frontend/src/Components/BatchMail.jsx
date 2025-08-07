import React, { useState, useEffect, useRef, useMemo } from "react";
import toast, { Toaster } from 'react-hot-toast';
import JoditEditor from 'jodit-react';
import Papa from 'papaparse';

const BatchMail = () => {
  // State variables
  const editor = useRef(null);
  const [agent, setAgent] = useState('');
  const [agents, setAgents] = useState([]);
  const [subject, setSubject] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [parsedCsv, setParsedCsv] = useState([]);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');


  const config = useMemo(() => ({
      readonly: false,
      placeholder: 'Start typing your email here...',
      height: 400
    }), []);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/get_agent`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch agents');
        setAgents(data);
        if (data.length > 0) setAgent(data[0]._id);
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    };
    fetchAgents();
  }, []);

  const handleCsvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data;
          if (data.length > 0 && !data[0].hasOwnProperty('email')) {
            toast.error('CSV must have an "email" column');
            return;
          }
          setParsedCsv(data);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    const filePromises = Array.from(selectedFiles).map(async (file) => {
      const content = await file.arrayBuffer();
      return { filename: file.name, content };
    });
    const filesData = await Promise.all(filePromises);
    setAttachments((prev) => [...prev, ...filesData]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const customizeMessage = (message, recipientData) => {
    if (!message || !recipientData) return message || '';
    
    let customizedMessage = String(message);
    Object.keys(recipientData).forEach((key) => {
      if (recipientData[key] !== undefined && recipientData[key] !== null) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        customizedMessage = customizedMessage.replace(regex, recipientData[key]);
      }
    });
    return customizedMessage;
  };

  const sendSingleEmail = async (recipientData) => {
    const formData = new FormData();
    formData.append('agent_id', agent);
    formData.append('to', recipientData.email);
    formData.append('subject', customizeMessage(subject, recipientData));
    const message = editor.current.value; // Get content from Jodit editor
    formData.append('message', customizeMessage(message, recipientData));
    if (cc) formData.append('cc', cc);
    if (bcc) formData.append('bcc', bcc);
    attachments.forEach((attachment) => {
      formData.append('files', new Blob([attachment.content]), attachment.filename);
    });
    formData.append('batch_id', batchName);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/send_mail`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send email');
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agent) {
      toast.error('Please select an agent');
      return;
    }
    if (!batchName) {
      toast.error('Please enter a batch name');
      return;
    }
    if (!parsedCsv || parsedCsv.length === 0) {
      toast.error('Please upload a CSV file with recipients');
      return;
    }
    if (!subject) {
      toast.error('Subject is required');
      return;
    }

    const message = editor.current.value; // Get content from Jodit editor
    if (!message) {
      toast.error('Mail body is required');
      return;
    }
  
    if (isScheduled && !scheduledTime) {
      toast.error('Please select a scheduled time');
      return;
    }
    setIsSending(true);

    if (isScheduled) {
      const formData = new FormData();
      formData.append('agent_id', agent);
      formData.append('batch_name', batchName);
      formData.append('subject', subject);
      formData.append('message', message);
      formData.append('cc', cc);
      formData.append('bcc', bcc);
      formData.append('recipients', JSON.stringify(parsedCsv));
      formData.append('scheduled_time', new Date(scheduledTime).toISOString());
      attachments.forEach((file) => {
        formData.append('files', new Blob([file.content]), file.filename);
      });

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/schedule_batch`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to schedule batch');
        toast.success('Batch scheduled successfully');
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    } else {
      for (const recipient of parsedCsv) {
        try {
          await sendSingleEmail(recipient);
          toast.success(`Email sent to ${recipient.email}`);
        } catch (error) {
          toast.error(`Failed to send email to ${recipient.email}: ${error.message}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    setIsSending(false);
  };

  return (
    <div className="p-6 h-screen flex flex-col">
      <Toaster position="bottom-right" />
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Batch Mail</h1>
        <p className="text-gray-600 mt-1">Send personalized emails to multiple recipients</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex-grow flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/5 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter email subject (e.g., Hello {{name}})"
            />
          </div>
          <div className="flex flex-col flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <div className="flex flex-col border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 flex-grow h-full overflow-hidden">
              <JoditEditor
                ref={editor}
                config={config}
                tabIndex={1}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send Batch'}
            </button>
          </div>
        </div>
        <div className="w-full md:w-2/5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Agent</label>
            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select an agent</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>{agent.name} - {agent.email}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
            <input
              type="text"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter batch name (e.g., March2025_Campaign)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Recipients CSV</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={!parsedCsv || parsedCsv.length === 0}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg disabled:bg-gray-300 hover:bg-blue-600"
              >
                Preview
              </button>
            </div>
            {csvFile && <p className="text-sm text-gray-600 mt-1">Selected: {csvFile.name}</p>}
            <p className="text-xs text-gray-500 mt-1">
              CSV must have an <code>email</code> column; use variables like <code>name</code>, <code>company</code> in placeholders.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CC</label>
            <input
              type="text"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter CC emails, separated by commas"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">BCC</label>
            <input
              type="text"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter BCC emails, separated by commas"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="mr-2"
              />
              Schedule for later
            </label>
            {isScheduled && (
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attach Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {attachments.length > 0 && (
              <div className="mt-2 bg-gray-100 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Attached Files:</h4>
                <ul className="space-y-1 overflow-y-auto max-h-72 border border-gray-300 rounded-lg p-2">
                  {attachments.map((file, index) => (
                    <li key={index} className="flex justify-between items-center bg-white px-3 py-2 rounded-lg shadow text-gray-800">
                      {file.filename}
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
        </div>
      </form>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">CSV Preview</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            {parsedCsv.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(parsedCsv[0]).map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parsedCsv.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        {Object.values(row).map((value, i) => (
                          <td
                            key={i}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No data to display</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchMail;