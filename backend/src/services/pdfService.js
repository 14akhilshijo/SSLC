const PDFDocument = require('pdfkit');

const generateMarkSheet = (result) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
          Title: `SSLC Mark Sheet - ${result.registerNumber}`,
          Author: 'Kerala SSLC Result Portal 2026',
          Subject: 'SSLC Mark Sheet',
        },
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const blue = '#1a56db';
      const darkBlue = '#1e3a5f';
      const lightGray = '#f8fafc';
      const borderGray = '#e2e8f0';

      // Header background
      doc.rect(0, 0, doc.page.width, 120).fill(darkBlue);

      // Kerala Emblem placeholder
      doc.circle(60, 60, 30).fill('#ffffff').stroke();
      doc.fillColor(darkBlue).fontSize(8).text('KERALA', 42, 53);

      // Title
      doc.fillColor('#ffffff')
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('KERALA PAREEKSHA BHAVAN', 100, 25, { align: 'center' });

      doc.fontSize(13)
        .text('Secondary School Leaving Certificate Examination 2026', 100, 50, { align: 'center' });

      doc.fontSize(11)
        .text('STATEMENT OF MARKS', 100, 75, { align: 'center' });

      // Result badge
      const resultColor = result.result === 'PASS' ? '#16a34a' : '#dc2626';
      doc.roundedRect(doc.page.width - 120, 30, 90, 35, 5).fill(resultColor);
      doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold')
        .text(result.result, doc.page.width - 120, 42, { width: 90, align: 'center' });

      // Student info section
      let y = 140;
      doc.fillColor(darkBlue).fontSize(11).font('Helvetica-Bold')
        .text('STUDENT INFORMATION', 40, y);

      y += 20;
      doc.rect(40, y, doc.page.width - 80, 80).fill(lightGray).stroke(borderGray);

      const infoItems = [
        ['Register Number', result.registerNumber],
        ['Student Name', result.studentName],
        ['School Name', result.schoolName],
        ['School Code', result.schoolCode],
        ['District', result.district],
        ['Date of Birth', result.dateOfBirth],
      ];

      let infoY = y + 10;
      infoItems.forEach((item, i) => {
        const col = i % 2 === 0 ? 50 : 310;
        const row = Math.floor(i / 2);
        doc.fillColor('#64748b').fontSize(8).font('Helvetica')
          .text(item[0] + ':', col, infoY + row * 22);
        doc.fillColor('#1e293b').fontSize(9).font('Helvetica-Bold')
          .text(item[1], col + 90, infoY + row * 22);
      });

      // Subjects table
      y += 100;
      doc.fillColor(darkBlue).fontSize(11).font('Helvetica-Bold')
        .text('SUBJECT-WISE MARKS', 40, y);

      y += 18;

      // Table header
      doc.rect(40, y, doc.page.width - 80, 22).fill(blue);
      doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold');
      doc.text('Subject', 50, y + 6);
      doc.text('Theory', 280, y + 6, { width: 60, align: 'center' });
      doc.text('Practical', 340, y + 6, { width: 60, align: 'center' });
      doc.text('Total', 400, y + 6, { width: 50, align: 'center' });
      doc.text('Grade', 450, y + 6, { width: 50, align: 'center' });

      y += 22;

      result.subjects.forEach((subject, idx) => {
        const rowBg = idx % 2 === 0 ? '#ffffff' : lightGray;
        doc.rect(40, y, doc.page.width - 80, 20).fill(rowBg).stroke(borderGray);

        const gradeColor = subject.isAPlus ? '#16a34a' : '#1e293b';
        doc.fillColor('#1e293b').fontSize(9).font('Helvetica')
          .text(subject.name, 50, y + 5);
        doc.text(subject.theory.toString(), 280, y + 5, { width: 60, align: 'center' });
        doc.text(subject.practical.toString(), 340, y + 5, { width: 60, align: 'center' });
        doc.text(subject.total.toString(), 400, y + 5, { width: 50, align: 'center' });
        doc.fillColor(gradeColor).font('Helvetica-Bold')
          .text(subject.grade, 450, y + 5, { width: 50, align: 'center' });

        y += 20;
      });

      // Total row
      doc.rect(40, y, doc.page.width - 80, 24).fill(darkBlue);
      doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold')
        .text('TOTAL', 50, y + 6)
        .text(result.totalMarks.toString(), 400, y + 6, { width: 50, align: 'center' })
        .text(result.grade, 450, y + 6, { width: 50, align: 'center' });

      y += 40;

      // Summary section
      doc.rect(40, y, doc.page.width - 80, 60).fill(lightGray).stroke(borderGray);

      const summaryItems = [
        ['Total Marks', `${result.totalMarks} / ${result.maxMarks}`],
        ['Percentage', `${result.percentage}%`],
        ['Overall Grade', result.grade],
        ['A+ Subjects', result.aPlusCount.toString()],
        ['Result', result.result],
      ];

      summaryItems.forEach((item, i) => {
        const col = 50 + (i * 100);
        doc.fillColor('#64748b').fontSize(8).font('Helvetica')
          .text(item[0], col, y + 10, { width: 90, align: 'center' });
        doc.fillColor(darkBlue).fontSize(11).font('Helvetica-Bold')
          .text(item[1], col, y + 25, { width: 90, align: 'center' });
      });

      y += 80;

      // QR Code
      if (result.qrCode) {
        try {
          const qrBuffer = Buffer.from(result.qrCode.split(',')[1], 'base64');
          doc.image(qrBuffer, doc.page.width - 120, y - 20, { width: 80, height: 80 });
          doc.fillColor('#64748b').fontSize(7)
            .text('Scan to verify', doc.page.width - 120, y + 62, { width: 80, align: 'center' });
        } catch (e) { /* ignore */ }
      }

      // Footer
      doc.rect(0, doc.page.height - 50, doc.page.width, 50).fill(darkBlue);
      doc.fillColor('#ffffff').fontSize(8).font('Helvetica')
        .text(
          'This is a computer-generated document. For official purposes, please verify at sslc.akhilshijoinnov.site',
          40, doc.page.height - 35,
          { align: 'center', width: doc.page.width - 80 }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateMarkSheet };
