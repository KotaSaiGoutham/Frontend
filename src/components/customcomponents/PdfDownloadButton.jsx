// PdfDownloadButton.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MuiButton } from './MuiCustomFormFields';
import logoPng from '/spaceship.png'; // Ensure this path is correct and accessible

// Chart.js + plugins (unchanged)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title as ChartTitle,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartTitle,
  ChartDataLabels,
);

export default function PdfDownloadButton({
  title,
  subtitle = '',
  headers,
  rows,
  summaryRow = null,
  filename = 'report.pdf',
  buttonLabel = 'Download PDF',
  buttonProps = {},
  reportDate = new Date(),
  companyName = 'Electron Academy',
  companyAddress = 'KPHB, Hyderabad',
  companyContact = 'electronacademy.2019@gmail.com | +91 8341482438',
  studentData = null,
  charts = [],
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleClick = async () => {
    if (!headers?.length || !rows?.length) {
      alert('No data for PDF table. Cannot generate report.');
      return;
    }

    setIsGenerating(true);

    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'landscape' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;

      let headerBottomY = 0; // track how low the header ends for table placement

      /* -------------------------------------------------- HEADER FUNCTION */
      // isCurrentPageFirst = true for the very first page rendered
      // isCurrentPageFirst = false for subsequent pages (triggered by autoTable or addPage)
      const drawHeader = (isCurrentPageFirst) => {
        let yCursor = 20; // Initial Y position for content

        // Determine if the full company header (logo, company details, main title/subtitle) should be shown
        // This should be shown if it's the first page OR if the report is NOT a 'Student_Report.pdf'
const shouldShowFullCompanyHeader = isCurrentPageFirst;

        let currentHeaderContentBottomY = yCursor; // Tracks the lowest point of drawn header elements

        // --- Company Logo and Details (Conditional) ---
        if (shouldShowFullCompanyHeader) {
          try {
            doc.addImage(logoPng, 'PNG', margin, yCursor, 100, 36); // logo size 100x36
          } catch {
            // ignore logo load failure
          }
          doc.setFontSize(9);
          doc.setTextColor(70, 70, 70);
          doc.text(companyName, margin, yCursor + 55); // Relative to logo/top
          doc.text(companyAddress, margin, yCursor + 68);
          doc.text(companyContact, margin, yCursor + 81);
          currentHeaderContentBottomY = Math.max(currentHeaderContentBottomY, yCursor + 81); // Update based on company contact
        }

        // --- Title and Subtitle (Conditional, below logo/company details or at top if skipped) ---
        if (shouldShowFullCompanyHeader) {
          doc.setFontSize(24);
          doc.setTextColor(25, 118, 210);
          doc.text(title, pageWidth / 2, yCursor + 25, { align: 'center' }); // Position relative to initial yCursor
          currentHeaderContentBottomY = Math.max(currentHeaderContentBottomY, yCursor + 25);

          if (subtitle) {
            doc.setFontSize(14);
            doc.setTextColor(70, 70, 70);
            doc.text(subtitle, pageWidth / 2, yCursor + 45, { align: 'center' });
            currentHeaderContentBottomY = Math.max(currentHeaderContentBottomY, yCursor + 45);
          }
        }

        // --- Generated On Date (Always shown, aligned right) ---
        doc.setFontSize(9);
        doc.setTextColor(70, 70, 70);
        let generatedDateY = yCursor + 25; // Default alignment for generated date (align with title if full header)
        if (!shouldShowFullCompanyHeader) {
            generatedDateY = yCursor + 15; // Move up if no logo/title/subtitle
        }
        doc.text(
          `Generated: ${new Date(reportDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}`,
          pageWidth - margin,
          generatedDateY,
          { align: 'right' },
        );
        // Ensure currentHeaderContentBottomY accounts for generatedDateY as well if it's the lowest.
        currentHeaderContentBottomY = Math.max(currentHeaderContentBottomY, generatedDateY);


        // Add some vertical space before dynamic content like studentData
        let dynY = currentHeaderContentBottomY + 25; // Padding after the highest drawn static header element

        // --- Optional Student Details Block (Always shown, below other header content) ---
        if (studentData) {
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          doc.text(`Student: ${studentData.Name || 'N/A'}`, margin, dynY);
          doc.text(`Year: ${studentData.Year || 'N/A'}`, margin + 200, dynY);
          doc.text(`Stream: ${studentData.Stream || 'N/A'}`, margin + 400, dynY);
          dynY += 15; // Move Y cursor down for the next line
        }

        // --- Horizontal Rule (Always shown, below all header content) ---
        doc.setDrawColor(220);
        doc.setLineWidth(0.5);
        // Add padding before drawing the line to separate it from student data or earlier content
        doc.line(margin, dynY + 10, pageWidth - margin, dynY + 10);

        // Update the global headerBottomY to be the true bottom of the header for table placement
        headerBottomY = dynY + 10;
      };

      /* -------------------------------------------------- FOOTER (unchanged) */
      const drawFooter = () => {
        const footerY = pageHeight - 30;
        doc.setFontSize(8);
        doc.setTextColor(70, 70, 70);
        doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth / 2, footerY, { align: 'center' });
      };

      // --- Initial Page Header & Footer ---
      drawHeader(true); // Draw header for the very first page
      drawFooter();

      /* -------------------------------------------------- TABLE */
      const tableStartY = headerBottomY + 15; // 15pt padding below the horizontal rule
      const bodyRows = summaryRow ? [summaryRow, ...rows] : rows;

      autoTable(doc, {
        head: [headers],
        body: bodyRows,
        startY: tableStartY,
        theme: 'striped',
        margin: { left: margin, right: margin },
        headStyles: {
          textColor: 255,
          fillColor: [25, 118, 210],
          fontStyle: 'bold',
          fontSize: 10,
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.5,
          lineColor: [220, 220, 220],
          cellPadding: 8,
        },
        bodyStyles: {
          textColor: [70, 70, 70],
          fontSize: 9,
          valign: 'top',
          lineWidth: 0.2,
          lineColor: [220, 220, 220],
          cellPadding: 6,
          halign: 'center',
        },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        didParseCell: ({ section, row, cell }) => {
          if (summaryRow && section === 'body' && row.index === 0) {
            Object.assign(cell.styles, {
              fillColor: [200, 200, 200],
              fontStyle: 'bold',
              textColor: [0, 0, 0],
              fontSize: 10,
              cellPadding: 8,
              halign: 'center',
            });
          }
        },
        // --- This is where headers are redrawn for subsequent pages ---
        didDrawPage: (data) => {
          // data.pageNumber is 1-indexed. If it's page 1, isCurrentPageFirst is true. Otherwise false.
          const isCurrentPageFirst = data.pageNumber === 1;
          drawHeader(isCurrentPageFirst); // Pass the correct page status
          drawFooter();
        },
      });

      /* -------------------------------------------------- CHARTS */
      if (charts.length) {
        doc.addPage();
        // For explicitly added pages, `doc.internal.getNumberOfPages()` will reflect the new page.
        // We still need to determine if this new page is the actual *first* page of the document.
        drawHeader(doc.internal.getNumberOfPages() === 1); // Pass the correct page status
        drawFooter();
      }

      const chartW = pageWidth - margin * 2;
      const chartH = 350;
      const chartX = margin;
      const chartY = headerBottomY + 40; // consistent top padding on new page for charts

      const scaleFactor = 2;

      for (let i = 0; i < charts.length; i++) {
        const cfg = charts[i];
        if (!cfg?.chartData || !cfg?.chartOptions) continue;

        const canvas = document.createElement('canvas');
        canvas.width = chartW * scaleFactor;
        canvas.height = chartH * scaleFactor;
        const ctx = canvas.getContext('2d');

        const opts = JSON.parse(JSON.stringify(cfg.chartOptions));
        const bumpFont = (objPath, fallback = 12) => {
          const parts = objPath.split('.');
          let ref = opts;
          for (const p of parts.slice(0, -1)) ref = ref?.[p] ?? {};
          const key = parts.at(-1);
          if (ref && ref[key]) ref[key] = (ref[key] || fallback) * 2;
        };
        bumpFont('plugins.title.font.size', 14);
        bumpFont('plugins.datalabels.font.size', 10);
        bumpFont('scales.x.title.font.size', 12);
        bumpFont('scales.y.title.font.size', 12);
        bumpFont('scales.x.ticks.font.size', 10);
        bumpFont('scales.y.ticks.font.size', 10);

        opts.responsive = false;
        opts.maintainAspectRatio = false;
        opts.animation = false;

        const chart = new ChartJS(ctx, {
          type: 'bar',
          data: cfg.chartData,
          options: opts,
        });

        await new Promise(r => setTimeout(r, 300));
        const img = canvas.toDataURL('image/png', 1.0);
        chart.destroy();

        doc.addImage(img, 'PNG', chartX, chartY, chartW, chartH);

        if (i !== charts.length - 1) {
          doc.addPage();
          drawHeader(doc.internal.getNumberOfPages() === 1); // Pass the correct page status
          drawFooter();
        }
      }

      /* -------------------------------------------------- SAVE */
      const safeTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
      const dateStr = new Date().toISOString().slice(0, 10);
      const finalName = filename === 'report.pdf' ? `${safeTitle}_${dateStr}.pdf` : filename;
      doc.save(finalName);
    } catch (err) {
      console.error('PDF generation error', err);
      alert('Failed to generate PDF: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MuiButton onClick={handleClick} disabled={isGenerating} {...buttonProps}>
      {isGenerating ? 'Generating PDF…' : buttonLabel}
    </MuiButton>
  );
}

PdfDownloadButton.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  headers: PropTypes.array.isRequired,
  rows: PropTypes.arrayOf(PropTypes.array).isRequired,
  summaryRow: PropTypes.array,
  filename: PropTypes.string,
  buttonLabel: PropTypes.string,
  buttonProps: PropTypes.object,
  reportDate: PropTypes.instanceOf(Date),
  companyName: PropTypes.string,
  companyAddress: PropTypes.string,
  companyContact: PropTypes.string,
  studentData: PropTypes.object,
  charts: PropTypes.arrayOf(
    PropTypes.shape({
      chartData: PropTypes.object.isRequired,
      chartOptions: PropTypes.object.isRequired,
    }),
  ),
};