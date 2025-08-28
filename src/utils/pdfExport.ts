import jsPDF from 'jspdf';
import { PlanCard } from '@/types/mentor';

export const generatePDF = (card: PlanCard) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set fonts and colors
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    
    // Title
    doc.text(card.title, 20, 30);
    
    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('MoneyQuest AI Mentor Plan', 20, 40);
    
    // Date
    const today = new Date().toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
    doc.text(`Generated: ${today}`, 20, 50);
    
    // Steps
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Your Action Plan:', 20, 70);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    let yPosition = 85;
    
    card.steps.forEach((step, index) => {
      const stepText = `${index + 1}. ${step}`;
      
      // Handle text wrapping
      const lines = doc.splitTextToSize(stepText, 170);
      lines.forEach((line: string) => {
        if (yPosition > 270) { // Start new page if needed
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 6;
      });
      yPosition += 3; // Extra space between steps
    });
    
    // Summary if available
    if (card.summary) {
      yPosition += 10;
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Summary:', 20, yPosition);
      yPosition += 8;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const summaryLines = doc.splitTextToSize(card.summary, 170);
      summaryLines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 6;
      });
    }
    
    // Footer
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('MoneyQuest - Your Financial Learning Journey', 20, 285);
      doc.text(`Page ${i} of ${pageCount}`, 170, 285);
    }
    
    // Generate filename
    const filename = `${card.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    console.log('PDF generated successfully:', filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};