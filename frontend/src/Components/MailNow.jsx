import React, { useState, useEffect, useRef, useMemo } from "react";
import toast, { Toaster } from 'react-hot-toast';
import JoditEditor from 'jodit-react';

const MailNow = () => {
  // State management
  const editor = useRef(null);
  const [agent, setAgent] = useState("");
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [files, setFiles] = useState([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Start typing your email here...',
    height: 400
  }), []);

  useEffect(() => {
    fetchAgents();
  }, []);

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
      if (data.length > 0) {
        setAgent(data[0]._id);
      }
      return data;
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      toast.error(`Failed to load agents: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const validateEmailForm = () => {
    if (!agent) {
      throw new Error("Please select an agent");
    }
    if (!to) {
      throw new Error("Recipient email is required");
    }
    if (!subject) {
      throw new Error("Subject is required");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const toEmails = to.split(',').map(email => email.trim());
    const invalidEmails = toEmails.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      throw new Error(`Invalid recipient email(s): ${invalidEmails.join(', ')}`);
    }
    
    if (cc) {
      const ccEmails = cc.split(',').map(email => email.trim());
      const invalidCCEmails = ccEmails.filter(email => !emailRegex.test(email));
      if (invalidCCEmails.length > 0) {
        throw new Error(`Invalid CC email(s): ${invalidCCEmails.join(', ')}`);
      }
    }
    
    if (bcc) {
      const bccEmails = bcc.split(',').map(email => email.trim());
      const invalidBCCEmails = bccEmails.filter(email => !emailRegex.test(email));
      if (invalidBCCEmails.length > 0) {
        throw new Error(`Invalid BCC email(s): ${invalidBCCEmails.join(', ')}`);
      }
    }
    if (isScheduled) {
      if (!scheduledTime) {
        throw new Error('Please select a scheduled time');
      }
      const selectedTime = new Date(scheduledTime);
      const now = new Date();
      if (selectedTime <= now) {
        throw new Error('Scheduled time must be in the future');
      }
    }
  };

  const sendMail = () => {
    toast.promise(
      (async () => {
        try {
          validateEmailForm();
          const message = editor.current.value;
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = message;
          if (tempDiv.textContent.trim() === '') {
            throw new Error("Email body is required");
          }
          setIsLoading(true);
          const formData = new FormData();
          formData.append('agent_id', agent);
          formData.append('to', to);
          formData.append('subject', subject);
          formData.append('cc', cc);
          formData.append('bcc', bcc);
          formData.append('message', message);
          if (isScheduled) {
            formData.append('scheduled_time', new Date(scheduledTime).toISOString());
          }
          files.forEach((file) => {
            formData.append('files', file);
          });

          const url = isScheduled
            ? `${import.meta.env.VITE_API_URL}/schedule_mail`
            : `${import.meta.env.VITE_API_URL}/send_mail`;

          console.log("Sending Email With Data:", Object.fromEntries(formData.entries()));

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: formData,
          });

          let responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
          } else {
            const text = await response.text();
            responseData = { message: text };
          }

          if (!response.ok) {
            throw new Error(responseData.message || `Error ${response.status}`);
          }

          return responseData;
        } catch (error) {
          console.error('Failed to send email:', error);
          throw error;
        } finally {
          setIsLoading(false);
        }
      })(),
      {
        loading: 'Processing...',
        success: (data) => isScheduled ? 'Email scheduled successfully' : `Email sent${data.attachments?.length ? ` with ${data.attachments.length} attachment(s)` : ''}`,
        error: (err) => err.message || 'Failed to process',
      },
      {
        success: { duration: 3000, icon: '✅' },
        error: { duration: 3000, icon: '❌' },
        style: { borderRadius: '4px', padding: '8px 12px' },
      }
    );
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="p-6 h-screen flex flex-col">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800">MailNow</h1>
          <p className="text-gray-600 mt-1">Send immediate or scheduled emails to your recipients</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex-grow flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col flex-grow h-full">
            <div className="flex flex-col md:flex-row gap-6 flex-grow h-full">
              {/* Left Side - Mail Content & Send Button */}
              <div className="w-full md:w-3/5 flex flex-col flex-grow h-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <div className="flex flex-col border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 flex-grow  ">
                  <JoditEditor
                    ref={editor}
                    config={config}
                    tabIndex={1}
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                    onClick={sendMail}
                  >
                    {isScheduled ? 'Schedule' : 'Send Now'}
                  </button>
                </div>
              </div>
              {/* Right Side - Email Options */}
              <div className="w-full md:w-2/5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Agent
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={agent}
                    onChange={(e) => setAgent(e.target.value)}
                  >
                    <option value="">Select an agent</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name} - {agent.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipients (To)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter recipient email addresses"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CC
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter CC email addresses"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BCC
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter BCC email addresses"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
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
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attach Files
                  </label>
                  <input
                    type="file"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
                {files.length > 0 && (
                  <div className="mt-2 bg-gray-100 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Attached Files:
                    </h4>
                    <ul className="space-y-1 overflow-y-auto max-h-72 border border-gray-300 rounded-lg p-2">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center bg-white px-3 py-2 rounded-lg shadow text-gray-800"
                        >
                          {file.name}
                          <button
                            onClick={() => removeFile(index)}
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
        </div>
      </div>
    </>
  );
};

export default MailNow;