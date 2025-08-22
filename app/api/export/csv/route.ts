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

    // Create CSV content
    const headers = ['id', 'timestamp', 'mood', 'text', 'aiResponse'];
    const csvRows = [headers.join(',')];
    
    entries.forEach(entry => {
      const timestamp = entry.timestamp.toDate ? 
        entry.timestamp.toDate().toISOString() : 
        new Date(entry.timestamp).toISOString();
      
      const row = [
        entry.id || '',
        timestamp,
        entry.mood || '',
        `"${(entry.text || '').replace(/"/g, '""')}"`, // Escape quotes in text
        `"${(entry.aiResponse || '').replace(/"/g, '""')}"` // Escape quotes in AI response
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="mindtrack-entries-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json(
      { error: 'Failed to export CSV' },
      { status: 500 }
    );
  }
}