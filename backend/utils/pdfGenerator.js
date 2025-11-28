const PDFDocument = require('pdfkit');

function generateInvoicePDF(invoice, patient, res) {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice._id}.pdf`);
  doc.pipe(res);
  doc.fontSize(20).text('HEALTHTECH - Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Patient: ${patient.user.name}`);
  doc.text(`Invoice ID: ${invoice._id}`);
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`);
  doc.moveDown();
  invoice.items.forEach((it, i) => {
    doc.text(`${i + 1}. ${it.description} - ${it.qty} x ${it.amount}`);
  });
  doc.moveDown();
  doc.text(`Doctor Charge: ${invoice.doctorCharge}`);
  doc.text(`Room Charge: ${invoice.roomCharge}`);
  doc.text(`Other Charge: ${invoice.otherCharge}`);
  doc.moveDown();
  doc.text(`Total: ${invoice.total}`, { underline: true });
  doc.end();
}

module.exports = { generateInvoicePDF };
