import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Zap {
  id: string;
  name: string;
  ownerId: number;
  trigger: {
    id: string;
    zapId: string;
    typeId: string;
    type: {
      id: string;
      name: string;
    }
  };
  actions: Array<{
    id: number;
    zapId: string;
    actionId: string;
    sortingOrder: number;
    action: {
      id: string;
      name: string;
    }
  }>;
}

export default function Dashboard() {
  const [zaps, setZaps] = useState<Zap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchZaps = async () => {
      try {
        const userId = localStorage.getItem('user');
        if (!userId) {
          navigate('/signin');
          return;
        }
        const user = JSON.parse(userId);
        const userId1 = user[0]?.id;
        const response = await axios.get(`http://localhost:3003/api/v1/zaps/${userId1}`);
        setZaps(response.data); // Changed from response.data.zaps to response.data
      } catch (err) {
        setError('Failed to fetch zaps');
        console.error('Error fetching zaps:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchZaps();
  }, [navigate]);

  const handleDelete = async (zapId: string) => {
    try {
      await axios.delete(`http://localhost:3003/api/v1/zaps/${zapId}`);
      setZaps(zaps.filter(zap => zap.id !== zapId));
    } catch (err) {
      console.error('Error deleting zap:', err);
      setError('Failed to delete zap');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Zaps</h1>
            <button
              onClick={() => navigate('/createZap')}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Create New Zap
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-indigo-600 hover:text-indigo-500"
            >
              Try again
            </button>
          </div>
        ) : zaps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">You haven't created any zaps yet</p>
            <button
              onClick={() => navigate('/createZap')}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"
            >
              Create Your First Zap
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zaps.map((zap) => (
              <div
                key={zap.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-indigo-600 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-4">{zap.name}</h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-400">Trigger:</span>
                    <span className="ml-2 text-indigo-400">
                      {zap.trigger?.type.name || "Not set"}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400">Actions:</span>
                    <ul className="mt-2 space-y-2">
                      {zap.actions.map((action, idx) => (
                        <li key={idx} className="text-indigo-400 flex items-center">
                          <span className="mr-2">{idx + 1}.</span>
                          {action.action.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button 
                      onClick={() => navigate(`/zap/${zap.id}/edit`)}
                      className="text-sm px-3 py-1 border border-gray-700 rounded-md hover:border-indigo-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(zap.id)}
                      className="text-sm px-3 py-1 border border-red-800 text-red-500 rounded-md hover:bg-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}