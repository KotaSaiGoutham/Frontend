// PdfDownloadButton.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MuiButton } from './MuiCustomFormFields';
import logoPng from '/spaceship.png';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title as ChartTitle
} from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components and datalabels plugin
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartTitle, ChartDataLabels);

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
  weekDate = null, // This prop will still be passed but won't be drawn
  chartData = null,
  chartOptions = null,
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleClick = async () => {
    if (!headers?.length || !rows?.length) {
      alert('No data for PDF table. Cannot generate report.');
      return;
    }

    setIsGenerating(true);

    let chartImage = null;
    let chartHeight = 0;
    const desiredChartWidthInPdf = 500;
    const desiredChartHeightInPdf = 250;

    try {
      if (chartData) {
        const canvas = document.createElement('canvas');
        canvas.width = desiredChartWidthInPdf * 3;
        canvas.height = desiredChartHeightInPdf * 3;

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error("Could not get 2D rendering context for canvas. Browser might not support canvas or context lost.");
        }

        const clonedChartOptions = JSON.parse(JSON.stringify(chartOptions || {}));

        clonedChartOptions.responsive = false;
        clonedChartOptions.maintainAspectRatio = false;
        clonedChartOptions.animation = false;
        if (clonedChartOptions.plugins?.title) {
            clonedChartOptions.plugins.title.font = {
                ...clonedChartOptions.plugins.title.font,
                size: (clonedChartOptions.plugins.title.font?.size || 16) * 1.5
            };
        }
        if (clonedChartOptions.plugins?.datalabels?.font) {
             clonedChartOptions.plugins.datalabels.font = {
                ...clonedChartOptions.plugins.datalabels.font,
                size: (clonedChartOptions.plugins.datalabels.font?.size || 12) * 1.5
            };
        }
        if (!clonedChartOptions.plugins) {
            clonedChartOptions.plugins = {};
        }
        if (!clonedChartOptions.plugins.datalabels) {
            clonedChartOptions.plugins.datalabels = { display: true };
        } else {
             clonedChartOptions.plugins.datalabels.display = true;
        }

        const chart = new ChartJS(ctx, {
          type: 'bar',
          data: chartData,
          options: clonedChartOptions,
        });

        await new Promise(resolve => setTimeout(resolve, 500));

        chartImage = canvas.toDataURL('image/png', 1.0);

        if (!chartImage || chartImage === 'data:,' || chartImage.length < 100) {
            throw new Error("Generated chart image data is empty or corrupt after canvas.toDataURL().");
        }

        chartHeight = desiredChartHeightInPdf;
        chart.destroy();
      }

      const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'landscape' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;

      let finalHeaderYAfterAllElements = 0;

      const drawHeader = () => {
        let currentMaxHeaderY = 0;

        // Company Logo
        try {
          doc.addImage(logoPng, 'PNG', margin, 20, 100, 36);
          currentMaxHeaderY = Math.max(currentMaxHeaderY, 20 + 36); // logo bottom edge
        } catch (logoError) {
          console.warn("Could not add logo to PDF:", logoError);
          doc.setFontSize(10);
          doc.setTextColor(150, 150, 150);
          doc.text(companyName, margin, 45);
          currentMaxHeaderY = Math.max(currentMaxHeaderY, 45 + 10); // rough text bottom edge
        }

        // Company Info (assuming these are fixed-height lines)
        doc.setFontSize(9);
        doc.setTextColor(70, 70, 70); // secondaryColor
        doc.text(companyName, margin, 70);
        doc.text(companyAddress, margin, 83);
        doc.text(companyContact, margin, 96);
        currentMaxHeaderY = Math.max(currentMaxHeaderY, 96 + 9); // company contact bottom edge

        // Main Title & Subtitle (centered)
        doc.setFontSize(24);
        doc.setTextColor(25, 118, 210); // primaryColor
        doc.text(title, pageWidth / 2, 45, { align: 'center' });
        currentMaxHeaderY = Math.max(currentMaxHeaderY, 45 + 24); // Title bottom edge (approx)

        if (subtitle) {
          doc.setFontSize(14);
          doc.setTextColor(70, 70, 70); // secondaryColor
          doc.text(subtitle, pageWidth / 2, 70, { align: 'center' });
          currentMaxHeaderY = Math.max(currentMaxHeaderY, 70 + 14); // Subtitle bottom edge (approx)
        }

        // Generated On Date (right-aligned)
        doc.setFontSize(9);
        doc.setTextColor(70, 70, 70); // secondaryColor
        doc.text(`Generated On: ${new Date(reportDate).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`, pageWidth - margin, 45, { align: 'right' });
        currentMaxHeaderY = Math.max(currentMaxHeaderY, 45 + 9); // Generated date bottom edge (approx)

        // Determine starting Y for dynamic content (student data)
        // Ensure student data starts comfortably below the highest fixed element.
        // Adding a fixed padding (e.g., 25pt) from the lowest existing header element.
        let dynamicContentY = currentMaxHeaderY + 25; // Adjusted spacing from previous elements

        // Student Data
        if (studentData) {
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0); // blackColor
          doc.text(`Student: ${studentData.Name || 'N/A'}`, margin, dynamicContentY);
          doc.text(`Year: ${studentData.Year || 'N/A'}`, margin + 200, dynamicContentY);
          doc.text(`Stream: ${studentData.Stream || 'N/A'}`, margin + 400, dynamicContentY);
          dynamicContentY += 15; // Move Y down for next possible line or the horizontal line
        }

        // --- Removed WeekDate handling ---
        // if (weekDate) {
        //     doc.setFontSize(10);
        //     doc.setTextColor(70, 70, 70);
        //     const formattedWeekDate = new Date(weekDate).toLocaleDateString('en-GB');
        //     doc.text(`Week Of: ${formattedWeekDate}`, margin, dynamicContentY);
        //     dynamicContentY += 15;
        // }
        // --- End Removed WeekDate handling ---

        // Horizontal line below header info, above table
        doc.setDrawColor(220, 220, 220); // borderGrey
        doc.setLineWidth(0.5);
        doc.line(margin, dynamicContentY + 5, pageWidth - margin, dynamicContentY + 5);

        // Store the final calculated Y position after all header elements and the line
        finalHeaderYAfterAllElements = dynamicContentY + 5;
      };


      const drawFooter = () => {
        const footerY = pageHeight - 30;
        doc.setFontSize(8);
        doc.setTextColor(70, 70, 70); // secondaryColor

        doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth / 2, footerY, { align: 'center' });

        doc.text(`Report Generated: ${new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}`, margin, footerY);
      };

      drawHeader();
      drawFooter();

      const bodyRows = summaryRow ? [summaryRow, ...rows] : rows;

      const tableStartY = finalHeaderYAfterAllElements + 15;

      autoTable(doc, {
        head: [headers],
        body: bodyRows,
        startY: tableStartY,
        theme: 'striped',
        margin: { top: tableStartY, bottom: margin },

        headStyles: {
          fillColor: [25, 118, 210],
          textColor: 255,
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

        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },

        didParseCell: ({ row, cell, section }) => {
          if (summaryRow && section === 'body' && row.index === 0) {
            cell.styles.fillColor = [200, 200, 200];
            cell.styles.fontStyle = 'bold';
            cell.styles.textColor = [0, 0, 0];
            cell.styles.fontSize = 10;
            cell.styles.cellPadding = 8;
            cell.styles.halign = 'center';
          }
        },

        didDrawPage: (data) => {
          drawHeader();
          drawFooter();

          if (data.pageNumber === doc.internal.getNumberOfPages() && chartImage) {
            const chartX = margin + (pageWidth - 2 * margin - desiredChartWidthInPdf) / 2;
            let chartY = data.cursor.y + 20;

            if (chartY + chartHeight + margin > pageHeight) {
                doc.addPage();
                doc.setPage(doc.internal.getNumberOfPages());
                drawHeader();
                drawFooter();
                chartY = finalHeaderYAfterAllElements + 20;
            }
            doc.addImage(chartImage, 'PNG', chartX, chartY, desiredChartWidthInPdf, desiredChartHeightInPdf);
          }
        },
      });

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-GB').replace(/\//g, '-');

      const cleanedStudentName = studentData?.Name
        ? studentData.Name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_')
        : 'UnknownStudent';
      const cleanedTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');

      const finalFilename = `${cleanedStudentName}_${formattedDate}_${cleanedTitle}.pdf`;

      doc.save(filename === 'report.pdf' ? finalFilename : filename);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MuiButton onClick={handleClick} disabled={isGenerating} {...buttonProps}>
      {isGenerating ? 'Generating PDF...' : buttonLabel}
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
  weekDate: PropTypes.instanceOf(Date), // Still included in props, but not used for drawing
  chartData: PropTypes.object,
  chartOptions: PropTypes.object,
};