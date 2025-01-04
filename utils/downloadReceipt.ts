import html2canvas from 'html2canvas';

export const downloadReceipt = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found');
    return;
  }

  try {
    const canvas = await html2canvas(element);
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataURL;
    link.click();
  } catch (error) {
    console.error('Error generating receipt:', error);
  }
};

