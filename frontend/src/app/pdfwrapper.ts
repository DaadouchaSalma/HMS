import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// La ligne ci-dessous est corrigée
(pdfMake as any).vfs = (pdfFonts as any).vfs;

export default pdfMake;
