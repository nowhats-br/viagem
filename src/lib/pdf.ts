import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePdfBlob = (elementId: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const input = document.getElementById(elementId);
    if (!input) {
      const errorMsg = `Element with id ${elementId} not found.`;
      console.error(errorMsg);
      return reject(new Error(errorMsg));
    }

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
      const pdf = new jsPDF('p', 'mm', [80, 150]);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const pdfBlob = pdf.output('blob');

      input.style.display = originalDisplay;
      input.style.zIndex = originalZIndex;
      input.style.position = 'static';

      resolve(pdfBlob);
    }).catch(error => {
      input.style.display = originalDisplay;
      input.style.zIndex = originalZIndex;
      input.style.position = 'static';
      reject(error);
    });
  });
};

export const downloadPdf = async (elementId: string, fileName: string): Promise<void> => {
    const blob = await generatePdfBlob(elementId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
