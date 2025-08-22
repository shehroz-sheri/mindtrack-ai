import { NextRequest, NextResponse } from 'next/server';
import { getUserJournalEntries } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const entries = await getUserJournalEntries(userId);
    
    if (entries.length === 0) {
      return NextResponse.json(
        { error: 'No entries found' },
        { status: 404 }
      );
    }

    // Calculate stats
    const totalEntries = entries.length;
    const entriesWithMood = entries.filter(entry => entry.mood);
    const averageMood = entriesWithMood.length > 0 
      ? (entriesWithMood.reduce((sum, entry) => sum + (entry.mood || 0), 0) / entriesWithMood.length).toFixed(1)
      : '0';

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

    const formatDate = (timestamp: any) => {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Get latest 20 entries
    const recentEntries = entries.slice(0, 20);

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>MindTrack AI - Journal Summary</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #374151;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #111827;
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .header p {
              color: #6b7280;
              margin: 0;
              font-size: 16px;
            }
            .stats {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-bottom: 40px;
            }
            .stat-card {
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              border: 1px solid #e5e7eb;
            }
            .stat-number {
              font-size: 24px;
              font-weight: bold;
              color: #111827;
              margin-bottom: 5px;
            }
            .stat-label {
              font-size: 14px;
              color: #6b7280;
            }
            .entries-section h2 {
              color: #111827;
              margin-bottom: 20px;
              font-size: 20px;
            }
            .entry {
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            .entry-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #f3f4f6;
            }
            .entry-date {
              font-size: 14px;
              color: #6b7280;
            }
            .entry-mood {
              font-size: 18px;
            }
            .entry-text {
              color: #374151;
              margin-bottom: 15px;
              line-height: 1.7;
            }
            .ai-response {
              background: #f8fafc;
              border-left: 3px solid #e5e7eb;
              padding: 15px;
              font-style: italic;
              color: #4b5563;
              font-size: 14px;
            }
            .ai-label {
              font-weight: 600;
              color: #374151;
              margin-bottom: 8px;
              font-style: normal;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 12px;
              color: #9ca3af;
            }
            @media print {
              body { margin: 0; padding: 20px; }
              .entry { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MindTrack AI</h1>
            <p>Journal Summary Report - Generated on ${new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long', 
              day: 'numeric'
            })}</p>
          </div>

          <div class="stats">
            <div class="stat-card">
              <div class="stat-number">${totalEntries}</div>
              <div class="stat-label">Total Entries</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${averageMood}</div>
              <div class="stat-label">Average Mood</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${entriesWithMood.length}</div>
              <div class="stat-label">Entries with Mood</div>
            </div>
          </div>

          <div class="entries-section">
            <h2>Recent Entries (Latest 20)</h2>
            ${recentEntries.map(entry => `
              <div class="entry">
                <div class="entry-header">
                  <div class="entry-date">${formatDate(entry.timestamp)}</div>
                  ${entry.mood ? `<div class="entry-mood">${getMoodEmoji(entry.mood)}</div>` : ''}
                </div>
                <div class="entry-text">${entry.text}</div>
                ${entry.aiResponse ? `
                  <div class="ai-response">
                    <div class="ai-label">AI Reflection:</div>
                    ${entry.aiResponse}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>This report was generated by MindTrack AI. For questions about your mental health, please consult a qualified healthcare professional.</p>
          </div>
        </body>
      </html>
    `;

    // For a simple implementation, we'll return the HTML and let the client handle PDF generation
    // In a production environment, you might want to use a server-side PDF generation library
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="mindtrack-summary-${new Date().toISOString().split('T')[0]}.html"`,
      },
    });
  } catch (error) {
    console.error('Error exporting PDF:', error);
    return NextResponse.json(
      { error: 'Failed to export PDF' },
      { status: 500 }
    );
  }
}