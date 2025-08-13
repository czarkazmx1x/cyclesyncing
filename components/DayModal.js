import { useState } from 'react';
import { format } from 'date-fns';
import { 
  FiX, 
  FiPlus, 
  FiDroplet, 
  FiSun, 
  FiStar, 
  FiMoon,
  FiEdit2,
  FiTrash2,
  FiSave
} from 'react-icons/fi';

export default function DayModal({ 
  isOpen, 
  onClose, 
  selectedDate, 
  phase, 
  events,
  onAddSymptom,
  onAddMood,
  onAddNote,
  onDeleteEvent
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [newSymptom, setNewSymptom] = useState('');
  const [newMood, setNewMood] = useState('');
  const [newNote, setNewNote] = useState('');
  const [symptomIntensity, setSymptomIntensity] = useState(3);

  if (!isOpen || !selectedDate) return null;

  const phaseColors = {
    menstrual: 'bg-red-100 text-red-800 border-red-200',
    follicular: 'bg-blue-100 text-blue-800 border-blue-200',
    ovulatory: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    luteal: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  const phaseIcons = {
    menstrual: FiDroplet,
    follicular: FiSun,
    ovulatory: FiStar,
    luteal: FiMoon
  };

  const PhaseIcon = phaseIcons[phase];

  const commonSymptoms = [
    'Cramps', 'Headache', 'Bloating', 'Fatigue', 'Nausea', 
    'Back Pain', 'Breast Tenderness', 'Acne', 'Food Cravings', 'Irritability'
  ];

  const moodOptions = [
    'Happy', 'Sad', 'Anxious', 'Energetic', 'Tired', 
    'Irritable', 'Calm', 'Stressed', 'Confident', 'Emotional'
  ];

  const handleAddSymptom = () => {
    if (newSymptom.trim()) {
      onAddSymptom({
        date: selectedDate,
        symptom: newSymptom,
        intensity: symptomIntensity,
        timestamp: new Date()
      });
      setNewSymptom('');
      setSymptomIntensity(3);
    }
  };

  const handleAddMood = () => {
    if (newMood.trim()) {
      onAddMood({
        date: selectedDate,
        mood: newMood,
        timestamp: new Date()
      });
      setNewMood('');
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote({
        date: selectedDate,
        note: newNote,
        timestamp: new Date()
      });
      setNewNote('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <PhaseIcon className="w-6 h-6 text-gray-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h2>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${phaseColors[phase]}`}>
                  {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'symptoms', label: 'Symptoms' },
              { id: 'mood', label: 'Mood' },
              { id: 'notes', label: 'Notes' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Day Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Symptoms</div>
                      <div className="text-lg font-medium">
                        {events.symptoms?.length || 0} logged
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Mood</div>
                      <div className="text-lg font-medium">
                        {events.moods?.length > 0 ? events.moods[0].mood : 'Not logged'}
                      </div>
                    </div>
                  </div>
                </div>

                {events.symptoms?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Today's Symptoms</h4>
                    <div className="space-y-2">
                      {events.symptoms.map((symptom, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{symptom.symptom}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              Intensity: {symptom.intensity}/5
                            </span>
                            <button
                              onClick={() => onDeleteEvent('symptom', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {events.notes?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <div className="space-y-2">
                      {events.notes.map((note, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">{note.note}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(note.timestamp), 'h:mm a')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'symptoms' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Add Symptom</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select or type symptom
                      </label>
                      <input
                        type="text"
                        value={newSymptom}
                        onChange={(e) => setNewSymptom(e.target.value)}
                        placeholder="Enter symptom..."
                        className="w-full p-2 border border-gray-300 rounded-md"
                        list="symptoms"
                      />
                      <datalist id="symptoms">
                        {commonSymptoms.map(symptom => (
                          <option key={symptom} value={symptom} />
                        ))}
                      </datalist>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Intensity (1-5)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={symptomIntensity}
                          onChange={(e) => setSymptomIntensity(parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="w-8 text-center font-medium">{symptomIntensity}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleAddSymptom}
                      className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Symptom</span>
                    </button>
                  </div>
                </div>

                {events.symptoms?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Logged Symptoms</h4>
                    <div className="space-y-2">
                      {events.symptoms.map((symptom, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{symptom.symptom}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {symptom.intensity}/5
                            </span>
                            <button
                              onClick={() => onDeleteEvent('symptom', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'mood' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Log Mood</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select or type mood
                      </label>
                      <input
                        type="text"
                        value={newMood}
                        onChange={(e) => setNewMood(e.target.value)}
                        placeholder="How are you feeling?"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        list="moods"
                      />
                      <datalist id="moods">
                        {moodOptions.map(mood => (
                          <option key={mood} value={mood} />
                        ))}
                      </datalist>
                    </div>
                    
                    <button
                      onClick={handleAddMood}
                      className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Log Mood</span>
                    </button>
                  </div>
                </div>

                {events.moods?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Mood History</h4>
                    <div className="space-y-2">
                      {events.moods.map((mood, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{mood.mood}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {format(new Date(mood.timestamp), 'h:mm a')}
                            </span>
                            <button
                              onClick={() => onDeleteEvent('mood', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Add Note</h3>
                  <div className="space-y-3">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="What's on your mind today?"
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    
                    <button
                      onClick={handleAddNote}
                      className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                      <FiSave className="w-4 h-4" />
                      <span>Save Note</span>
                    </button>
                  </div>
                </div>

                {events.notes?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Your Notes</h4>
                    <div className="space-y-2">
                      {events.notes.map((note, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <p className="text-sm flex-1">{note.note}</p>
                            <button
                              onClick={() => onDeleteEvent('note', index)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(note.timestamp), 'h:mm a')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}