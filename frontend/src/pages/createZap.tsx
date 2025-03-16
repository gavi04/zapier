import axios from 'axios';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define interfaces for trigger and action objects
interface Trigger {
  id: string;
  name: string;
}

interface Action {
  id: string;
  name: string;
}


const ZapCreationPage = () => {
  // State with TypeScript types
  const [zapName, setZapName] = useState<string>('');
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  
  // State for API data
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
   const navigate = useNavigate();

  // Fetch triggers and actions from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch available triggers
        const triggersResponse = await fetch('http://localhost:3003/api/v1/availabletriggers');
        if (!triggersResponse.ok) throw new Error('Failed to fetch triggers');
        const triggersData: Trigger[] = await triggersResponse.json();
        
        // Fetch available actions
        const actionsResponse = await fetch('http://localhost:3003/api/v1/availableactions');
        if (!actionsResponse.ok) throw new Error('Failed to fetch actions');
        const actionsData: Action[] = await actionsResponse.json();
        
        setTriggers(triggersData);
        setActions(actionsData);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateZap = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedTrigger || !selectedAction) {
      alert('Please select both a trigger and an action');
      return;
    }
    const userId = localStorage.getItem('user');
        if (!userId) {
          navigate('/signin');
          return;
        }
        const user = JSON.parse(userId);
        const userId1 = user[0]?.id;
    const zapResponse = await axios.post('http://localhost:3003/api/v1/createzap', {
      name: zapName,
      triggerId: selectedTrigger.id,
      triggerName: selectedTrigger.name,
      actionId: selectedAction.id,
      actionName: selectedAction.name,
      ownerId:userId1
    })
    // Here you would send the zap data to your backend
    console.log('Zap created:', zapResponse.data);
    
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10V3L4 14H11V21L20 10H13Z" fill="currentColor" />
                </svg>
                <span className="ml-2 text-xl font-bold">ZapCreator</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a href="#" className="border-b-2 border-white px-1 pt-1 text-sm font-medium">
                  Dashboard
                </a>
                <a href="#" className="border-b-2 border-transparent px-1 pt-1 text-sm font-medium hover:border-gray-300">
                  My Zaps
                </a>
                <a href="#" className="border-b-2 border-transparent px-1 pt-1 text-sm font-medium hover:border-gray-300">
                  Templates
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium">
                Help
              </button>
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  <div>
                    <button className="max-w-xs bg-blue-600 rounded-full flex items-center text-sm focus:outline-none">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                        US
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="pb-5 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Create a New Zap</h3>
              <p className="mt-2 max-w-4xl text-sm text-gray-500">
                Connect your favorite apps to automate repetitive tasks.
              </p>
            </div>

            {isLoading ? (
              <div className="py-12 flex justify-center">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : error ? (
              <div className="py-8 text-center text-red-600">
                <p>Error loading data: {error}</p>
                <button 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateZap} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="zap-name" className="block text-sm font-medium text-gray-700">
                    Zap Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="zap-name"
                      id="zap-name"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="My Awesome Zap"
                      value={zapName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZapName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select a Trigger
                  </label>
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {triggers.map((trigger: Trigger) => (
                      <div 
                        key={trigger.id}
                        className={`relative rounded-lg border p-4 flex flex-col cursor-pointer hover:border-blue-500 ${
                          selectedTrigger?.id === trigger.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'
                        }`}
                        onClick={() => setSelectedTrigger(trigger)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">{trigger.name}</p>
                            </div>
                          </div>
                          {selectedTrigger?.id === trigger.id && (
                            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select an Action
                  </label>
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {actions.map((action: Action) => (
                      <div 
                        key={action.id}
                        className={`relative rounded-lg border p-4 flex flex-col cursor-pointer hover:border-blue-500 ${
                          selectedAction?.id === action.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'
                        }`}
                        onClick={() => setSelectedAction(action)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">{action.name}</p>
                            </div>
                          </div>
                          {selectedAction?.id === action.id && (
                            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create Zap
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Zap Created Successfully!
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your new zap connecting {selectedTrigger?.name} to {selectedAction?.name} has been created and is now active.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZapCreationPage;