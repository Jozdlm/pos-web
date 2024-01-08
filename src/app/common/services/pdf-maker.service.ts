import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF, { jsPDFOptions } from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class PdfMakerService {
  private _pdfOptions: jsPDFOptions = {
    orientation: 'p',
    unit: 'pt',
    format: 'letter',
    putOnlyUsedFonts: true,
    compress: true,
  };

  public generatePDF(element: HTMLElement, docName: string): void {
    const pdf = new jsPDF(this._pdfOptions);

    pdf.html(element, {
      callback: (pdf: jsPDF) => {
        pdf.save(docName);
      },
    });
  }
}
