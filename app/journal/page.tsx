'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { saveJournalEntry, updateJournalEntryWithAI } from '@/lib/firestore';

export default function Journal() {
  const { user } = useAuth();
  const [entry, setEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const moodEmojis = [
    { value: 1, emoji: '😢', label: 'Very Sad' },
    { value: 2, emoji: '😔', label: 'Sad' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '😊', label: 'Happy' },
    { value: 5, emoji: '😄', label: 'Very Happy' }
  ];
  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async () => {
    if (!user || !entry.trim() || selectedMood === null) return;
    
    setSaving(true);
    setSuccessMessage('');
    try {
      // Save the journal entry first
      const entryId = await saveJournalEntry(user.uid, entry.trim(), selectedMood);
      if (entryId) {
        setSuccessMessage('Entry saved successfully!');
        
        // Generate AI reflection in the background
        setGeneratingAI(true);
        try {
          const response = await fetch('/api/ai-reflection', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: entry.trim() }),
          });
          
          if (response.ok) {
            const { aiResponse } = await response.json();
            await updateJournalEntryWithAI(entryId, aiResponse);
          }
        } catch (aiError) {
          console.error('Error generating AI reflection:', aiError);
        } finally {
          setGeneratingAI(false);
        }
        
        setEntry('');
        setSelectedMood(null);
      } else {
        setSuccessMessage('Failed to save entry. Please try again.');
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      setSuccessMessage('Failed to save entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Journal</h1>
              <p className="text-lg text-gray-600">Take a moment to reflect on your thoughts and feelings</p>
            </div>
            
            <div className="bg-white border border-gray-200 p-8 max-w-3xl mx-auto">
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">Today's Date</div>
                <div className="text-lg font-medium text-gray-900">{currentDate}</div>
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How are you feeling today?
                </label>
                <div className="flex justify-center space-x-4 mb-6">
                  {moodEmojis.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setSelectedMood(mood.value)}
                      className={`p-3 text-3xl transition-all duration-200 hover:scale-110 ${
                        selectedMood === mood.value
                          ? 'bg-gray-100 border-2 border-gray-400 rounded-lg'
                          : 'hover:bg-gray-50 rounded-lg'
                      }`}
                      title={mood.label}
                    >
                      {mood.emoji}
                    </button>
                  ))}
                </div>
                
                <label htmlFor="journal-entry" className="block text-sm font-medium text-gray-700 mb-3">
                  What's on your mind?
                </label>
                <textarea
                  id="journal-entry"
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder="Write about your thoughts, feelings, experiences, or anything that comes to mind. This is your safe space for reflection..."
                  className="w-full h-80 p-4 border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                  style={{ minHeight: '320px' }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {entry.length} characters
                </div>
                <div className="flex items-center space-x-4">
                  {successMessage && (
                    <div className={`text-sm font-medium ${
                      successMessage.includes('successfully') 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {successMessage}
                    </div>
                  )}
                  {generatingAI && (
                    <div className="text-sm text-gray-500">
                      Generating AI reflection...
                    </div>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={!entry.trim() || selectedMood === null || saving || generatingAI}
                    className="bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? 'Saving...' : generatingAI ? 'Processing...' : 'Save Entry'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                Your entries and mood data are private and secure. Our AI will provide supportive reflections and insights to help with your wellness journey.
              </p>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}