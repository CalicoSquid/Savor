import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
//import { useRef } from 'react';


export default async function downloadPdf(downloadProps) {

    const {pdfRef, setOpen, name, setImgToDownload, setErrorMessage} = downloadProps

    const input = pdfRef.current;

        setOpen(false)
        
        try {
            const canvas = await html2canvas(input);
            const dataImg = canvas.toDataURL();

        
            let imageType = 'png'; // Default to PNG

            if (dataImg.startsWith('data:image/jpeg')) {
                imageType = 'jpeg';
            } else if (dataImg.startsWith('data:image/gif')) {
                imageType = 'gif';
            }
    
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
            const pdfHeight = pdf.internal.pageSize.getHeight() - 20;
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
            const borderPadding = 10; 
            const imgX = borderPadding;
            const imgY = borderPadding;
    
            pdf.addImage(dataImg, imageType.toUpperCase(), imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`${name}.pdf`);
            setImgToDownload("")

        } catch (error) {
            console.error('PDF generation failed:', error);
            setErrorMessage(prevError => ({
                ...prevError,
                homeError: {message: "PDF generation failed", err: error.message}
            }))
        }
    
}