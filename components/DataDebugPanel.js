import { useCycle } from '../contexts/CycleContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

export default function DataDebugPanel() {
  const { symptoms, moods, loading } = useCycle();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-bold text-gray-800 mb-2">🔍 Data Debug Panel</h3>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h3 className="font-bold text-gray-800 mb-2">🔍 Data Debug Panel</h3>
      
      {/* User Status */}
      <div className="mb-4 p-3 bg-white rounded border">
        <h4 className="font-semibold text-gray-700 mb-1">User Status</h4>
        {user ? (
          <div className="text-sm text-green-600">
            ✅ Logged in as: {user.email}
          </div>
        ) : (
          <div className="text-sm text-red-600">
            ❌ Not logged in - this is why symptoms can't be saved!
            <br />
            <a href="/login" className="text-blue-600 underline">Go to login page</a>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">
            Symptoms ({symptoms.length})
          </h4>
          {symptoms.length === 0 ? (
            <p className="text-gray-600 text-sm">No symptoms logged yet</p>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {symptoms.slice(0, 5).map((symptom) => (
                <div key={symptom.id} className="text-xs bg-white p-2 rounded">
                  <strong>{symptom.type}</strong> (severity: {symptom.severity})
                  <br />
                  <span className="text-gray-500">
                    {symptom.date ? format(new Date(symptom.date), 'MMM dd, h:mm a') : 'No date'}
                  </span>
                </div>
              ))}
              {symptoms.length > 5 && (
                <p className="text-gray-500 text-xs">...and {symptoms.length - 5} more</p>
              )}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">
            Moods ({moods.length})
          </h4>
          {moods.length === 0 ? (
            <p className="text-gray-600 text-sm">No moods logged yet</p>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {moods.slice(0, 5).map((mood) => (
                <div key={mood.id} className="text-xs bg-white p-2 rounded">
                  <strong>{mood.mood}</strong> (energy: {mood.energy})
                  <br />
                  <span className="text-gray-500">
                    {mood.date ? format(new Date(mood.date), 'MMM dd, h:mm a') : 'No date'}
                  </span>
                </div>
              ))}
              {moods.length > 5 && (
                <p className="text-gray-500 text-xs">...and {moods.length - 5} more</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-600">
        This panel shows data from your database. If you add symptoms/moods and they appear here, 
        they're being saved successfully! 
      </div>
    </div>
  );
}