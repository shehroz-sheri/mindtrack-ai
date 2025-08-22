'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { getUserJournalEntries, JournalEntry } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Download, FileText, BarChart3, TrendingUp, Calendar, Heart } from 'lucide-react';
import SupportiveChat from '@/components/SupportiveChat';

export default function Dashboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const userEntries = await getUserJournalEntries(user.uid);
        setEntries(userEntries);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user]);

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getMoodEmoji = (mood?: number) => {
    const moodMap: { [key: number]: string } = {
      1: '😢',
      2: '😔', 
      3: '😐',
      4: '😊',
      5: '😄'
    };
    return mood ? moodMap[mood] : '';
  };

  const calculateStats = () => {
    const totalEntries = entries.length;
    const entriesWithMood = entries.filter(entry => entry.mood);
    const averageMood = entriesWithMood.length > 0 
      ? (entriesWithMood.reduce((sum, entry) => sum + (entry.mood || 0), 0) / entriesWithMood.length).toFixed(1)
      : '0';
    
    // Calculate streak (consecutive days with entries)
    const sortedEntries = [...entries].sort((a, b) => {
      const dateA = a.timestamp.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
      const dateB = b.timestamp.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
      return dateB.getTime() - dateA.getTime();
    });
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = sortedEntries[i].timestamp.toDate ? 
        sortedEntries[i].timestamp.toDate() : new Date(sortedEntries[i].timestamp);
      entryDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return { totalEntries, averageMood, streak };
  };

  const prepareMoodChartData = () => {
    return entries
      .filter(entry => entry.mood)
      .slice(-14) // Last 14 entries for better readability
      .reverse()
      .map((entry) => {
        const date = entry.timestamp.toDate ? entry.timestamp.toDate() : new Date(entry.timestamp);
        return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: entry.mood,
        fullDate: formatDate(entry.timestamp)
        };
      });
  };

  const prepareMoodDistributionData = () => {
    const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const moodLabels = {
      1: 'Very Sad',
      2: 'Sad', 
      3: 'Neutral',
      4: 'Happy',
      5: 'Very Happy'
    };
    
    entries.forEach(entry => {
      if (entry.mood) {
        moodCounts[entry.mood as keyof typeof moodCounts]++;
      }
    });
    
    return Object.entries(moodCounts)
      .filter(([_, count]) => count > 0)
      .map(([mood, count]) => ({
        mood: moodLabels[parseInt(mood) as keyof typeof moodLabels],
        count,
        value: parseInt(mood)
      }));
  };

  const handleExportCSV = async () => {
    if (!user) return;
    
    setExportingCSV(true);
    try {
      const response = await fetch('/api/export/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.uid }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mindtrack-entries-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setExportingCSV(false);
    }
  };

  const handleExportPDF = async () => {
    if (!user) return;
    
    setExportingPDF(true);
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.uid }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mindtrack-summary-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setExportingPDF(false);
    }
  };

  const stats = calculateStats();
  const moodChartData = prepareMoodChartData();
  const moodDistributionData = prepareMoodDistributionData();
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-12">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Insights</h1>
                  <p className="text-lg text-gray-600">Track your mental health journey with AI-powered analysis</p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500">Loading your insights...</div>
                  </div>
                ) : (
                  <>
                    {/* Analytics Section */}
                    <div className="mb-16">
                      <div className="flex items-center mb-8">
                        <BarChart3 className="w-6 h-6 text-gray-700 mr-2" />
                        <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
                      </div>
                      
                      {/* Stats Row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.totalEntries}</div>
                            <p className="text-xs text-muted-foreground">
                              Journal entries recorded
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.streak}</div>
                            <p className="text-xs text-muted-foreground">
                              Consecutive days
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.averageMood}</div>
                            <p className="text-xs text-muted-foreground">
                              Out of 5.0
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Charts */}
                      <div className="grid md:grid-cols-2 gap-8">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Mood Over Time
                            </CardTitle>
                            <CardDescription>Your mood trends over the last 14 entries</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {moodChartData.length > 0 ? (
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={moodChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis 
                                      dataKey="date" 
                                      tick={{ fontSize: 12 }}
                                      axisLine={{ stroke: '#e0e0e0' }}
                                    />
                                    <YAxis 
                                      domain={[1, 5]}
                                      tick={{ fontSize: 12 }}
                                      axisLine={{ stroke: '#e0e0e0' }}
                                      tickFormatter={(value) => {
                                        const moodLabels = { 1: 'Very Sad', 2: 'Sad', 3: 'Neutral', 4: 'Happy', 5: 'Very Happy' };
                                        return moodLabels[value as keyof typeof moodLabels] || '';
                                      }}
                                    />
                                    <Tooltip 
                                      formatter={(value: any) => [
                                        `${getMoodEmoji(value)} ${value === 1 ? 'Very Sad' : value === 2 ? 'Sad' : value === 3 ? 'Neutral' : value === 4 ? 'Happy' : 'Very Happy'}`,
                                        'Mood'
                                      ]}
                                      labelFormatter={(label) => `${label}`}
                                    />
                                    <Line 
                                      type="monotone" 
                                      dataKey="mood" 
                                      stroke="#374151" 
                                      strokeWidth={2}
                                      dot={{ fill: '#374151', strokeWidth: 2, r: 4 }}
                                      activeDot={{ r: 6, fill: '#374151' }}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            ) : (
                              <div className="h-64 bg-gray-50 border border-gray-200 flex items-center justify-center">
                                <div className="text-center">
                                  <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                  <p className="text-gray-500 text-sm">Add mood data to see trends</p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Mood Distribution</CardTitle>
                            <CardDescription>Breakdown of your recorded moods</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {moodDistributionData.length > 0 ? (
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={moodDistributionData}
                                      cx="50%"
                                      cy="50%"
                                      labelLine={false}
                                      label={({ mood, count }) => `${mood}: ${count}`}
                                      outerRadius={80}
                                      fill="#8884d8"
                                      dataKey="count"
                                    >
                                      {moodDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.value - 1]} />
                                      ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} entries`, 'Count']} />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            ) : (
                              <div className="h-64 bg-gray-50 border border-gray-200 flex items-center justify-center">
                                <div className="text-center">
                                  <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                  <p className="text-gray-500 text-sm">Add mood data to see distribution</p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Export Section */}
                    <div className="mb-16">
                      <div className="flex items-center mb-8">
                        <Download className="w-6 h-6 text-gray-700 mr-2" />
                        <h2 className="text-2xl font-semibold text-gray-900">Export Data</h2>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Download Your Data</CardTitle>
                          <CardDescription>
                            Export your journal entries and insights for backup or external analysis
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button 
                              onClick={handleExportCSV}
                              disabled={exportingCSV || entries.length === 0}
                              variant="outline"
                              className="flex items-center"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              {exportingCSV ? 'Exporting...' : 'Export CSV'}
                            </Button>
                            
                            <Button 
                              onClick={handleExportPDF}
                              disabled={exportingPDF || entries.length === 0}
                              variant="outline"
                              className="flex items-center"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              {exportingPDF ? 'Generating...' : 'Export PDF Summary'}
                            </Button>
                          </div>
                          
                          {entries.length === 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                              No entries available to export. Start journaling to enable exports.
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Entries Section */}
                    <div className="mb-16">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-8">Recent Entries</h2>
                      
                      {entries.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-gray-500 mb-4">No journal entries yet.</div>
                          <a 
                            href="/journal" 
                            className="text-gray-900 hover:text-gray-700 font-medium transition-colors"
                          >
                            Write your first entry →
                          </a>
                        </div>
                      ) : (
                        <div className="grid gap-6">
                          {entries.map((entry) => (
                            <div key={entry.id} className="bg-white border border-gray-200 p-6">
                              <div className="flex justify-between items-start mb-3">
                                <div className="text-sm text-gray-500">
                                  {formatDate(entry.timestamp)}
                                </div>
                                {entry.mood && (
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                                    <span className="text-xs text-gray-500">
                                      {entry.mood === 1 ? 'Very Sad' : 
                                       entry.mood === 2 ? 'Sad' : 
                                       entry.mood === 3 ? 'Neutral' : 
                                       entry.mood === 4 ? 'Happy' : 'Very Happy'}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-700 leading-relaxed">
                                {truncateText(entry.text)}
                              </p>
                              {entry.aiResponse && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <div className="text-xs text-gray-500 mb-2 font-medium">AI Reflection</div>
                                  <p className="text-gray-600 text-sm leading-relaxed italic">
                                    {entry.aiResponse}
                                  </p>
                                </div>
                              )}
                              {entry.text.length > 150 && (
                                <div className="mt-4">
                                  <button className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                                    View Full Entry →
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Privacy and Disclaimer */}
                    <Card className="border-amber-200 bg-amber-50">
                      <CardHeader>
                        <CardTitle className="flex items-center text-amber-800">
                          <AlertTriangle className="w-5 h-5 mr-2" />
                          Privacy & Medical Disclaimer
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-amber-700 space-y-3">
                        <p>
                          <strong>Not Medical Advice:</strong> MindTrack AI is a wellness tool and does not provide medical advice, diagnosis, or treatment. 
                          Always consult qualified healthcare professionals for medical concerns.
                        </p>
                        <p>
                          <strong>Data Privacy:</strong> Your journal entries and mood data are stored securely and associated with your user account. 
                          We use enterprise-grade encryption and do not share your personal data with third parties.
                        </p>
                        <p>
                          <strong>Crisis Support:</strong> If you're experiencing thoughts of self-harm or suicide, please contact emergency services immediately 
                          or call the 988 Suicide & Crisis Lifeline. Our AI monitoring will provide additional resources when concerning patterns are detected.
                        </p>
                        <div className="pt-2 border-t border-amber-200">
                          <p className="font-medium">Crisis Resources:</p>
                          <div className="flex flex-wrap gap-4 mt-1">
                            <a href="tel:988" className="text-amber-800 hover:text-amber-900 underline">988 Crisis Lifeline</a>
                            <a href="sms:741741" className="text-amber-800 hover:text-amber-900 underline">Text HOME to 741741</a>
                            <a href="https://suicidepreventionlifeline.org" target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:text-amber-900 underline">
                              Online Chat Support
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              {/* Right Sidebar - Supportive Chat */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <SupportiveChat entries={entries} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}