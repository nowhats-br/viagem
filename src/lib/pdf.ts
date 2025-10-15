import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePdf = (elementId: string, fileName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const input = document.getElementById(elementId);
    if (!input) {
      console.error(`Element with id ${elementId} not found.`);
      reject(`Element with id ${elementId} not found.`);
      return;
    }

    // Temporarily make the element visible for capture if it's hidden
    const originalDisplay = input.style.display;
    const originalZIndex = input.style.zIndex;
    input.style.display = 'block';
    input.style.zIndex = '-9999';
    input.style.position = 'absolute';
    input.style.left = '-9999px';
    input.style.top = '0px';


    html2canvas(input, { 
      scale: 2,
      useCORS: true,
      backgroundColor: null,
     }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', [80, 150]); // Custom size for ticket
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`);

      // Restore original styles
      input.style.display = originalDisplay;
      input.style.zIndex = originalZIndex;
      input.style.position = 'static';

      resolve();
    }).catch(error => {
      // Restore original styles even if there's an error
      input.style.display = originalDisplay;
      input.style.zIndex = originalZIndex;
      input.style.position = 'static';
      reject(error);
    });
  });
};
