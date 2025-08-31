import React, { useState } from "react";
import PropTypes from "prop-types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { MuiButton } from "./MuiCustomFormFields";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import logoPng from "/spaceship.png";

export default function PdfReportButton({
  title,
  subtitle = "",
  headers,
  rows,
  filename = "report.pdf",
  buttonLabel = "Download Report",
  buttonProps = {},
  reportDate = new Date(),
  companyName = "Electron Academy",
  companyAddress = "KPHB, Hyderabad",
  companyContact = "electronacademy.2019@gmail.com | +91 8341482438",
  studentData = null,
  disabled = false,
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleClick = async () => {
    if (!headers?.length || !rows?.length) {
      alert("No data for PDF table. Cannot generate report.");
      return;
    }

    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        unit: "pt",
        format: "a4",
        orientation: "landscape",
      });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;

      const lastColumnIndex = headers.length - 1;
      const totalSum = rows.reduce((sum, row) => {
        const value = parseFloat(row[lastColumnIndex]);
        return sum + (isNaN(value) ? 0 : value);
      }, 0);

      let headerBottomY = 0;

      const drawHeader = (isCurrentPageFirst) => {
        let yCursor = 20;
        const shouldShowFullCompanyHeader = isCurrentPageFirst;
        let currentHeaderContentBottomY = yCursor;

        if (shouldShowFullCompanyHeader) {
          try {
            doc.addImage(logoPng, "PNG", margin, yCursor, 100, 36);
          } catch {
            // ignore logo load failure
          }
          doc.setFontSize(9);
          doc.setTextColor(70, 70, 70);
          doc.text(companyName, margin, yCursor + 55);
          doc.text(companyAddress, margin, yCursor + 68);
          doc.text(companyContact, margin, yCursor + 81);
          currentHeaderContentBottomY = Math.max(
            currentHeaderContentBottomY,
            yCursor + 81
          );
        }

        if (shouldShowFullCompanyHeader) {
          doc.setFontSize(24);
          doc.setTextColor(25, 118, 210);
          doc.text(title, pageWidth / 2, yCursor + 25, { align: "center" });
          currentHeaderContentBottomY = Math.max(
            currentHeaderContentBottomY,
            yCursor + 25
          );
          if (subtitle) {
            doc.setFontSize(14);
            doc.setTextColor(70, 70, 70);
            doc.text(subtitle, pageWidth / 2, yCursor + 45, {
              align: "center",
            });
            currentHeaderContentBottomY = Math.max(
              currentHeaderContentBottomY,
              yCursor + 45
            );
          }
        }

        doc.setFontSize(9);
        doc.setTextColor(70, 70, 70);
        let generatedDateY = yCursor + 25;
        if (!shouldShowFullCompanyHeader) {
          generatedDateY = yCursor + 15;
        }
        doc.text(
          `Generated: ${new Date(reportDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}`,
          pageWidth - margin,
          generatedDateY,
          { align: "right" }
        );
        currentHeaderContentBottomY = Math.max(
          currentHeaderContentBottomY,
          generatedDateY
        );

        let dynY = currentHeaderContentBottomY + 25;

        if (studentData) {
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          doc.text(`Student: ${studentData.Name || "N/A"}`, margin, dynY);
          doc.text(`Year: ${studentData.Year || "N/A"}`, margin + 200, dynY);
          doc.text(
            `Stream: ${studentData.Stream || "N/A"}`,
            margin + 400,
            dynY
          );
          dynY += 15;
        }

        doc.setDrawColor(220);
        doc.setLineWidth(0.5);
        doc.line(margin, dynY + 10, pageWidth - margin, dynY + 10);
        headerBottomY = dynY + 10;
      };

      const drawFooter = () => {
        const footerY = pageHeight - 30;
        doc.setFontSize(8);
        doc.setTextColor(70, 70, 70);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          pageWidth / 2,
          footerY,
          { align: "center" }
        );
      };

      drawHeader(true);
      drawFooter();

      const footerRow = Array(headers.length).fill("");
      footerRow[lastColumnIndex - 1] = "Total:";
      footerRow[lastColumnIndex] = `Rs. ${totalSum.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`;

      autoTable(doc, {
        head: [headers],
        body: rows,
        foot: [footerRow],
        footStyles: {
          textColor: [255, 255, 255],
          fillColor: [25, 118, 210],
          fontStyle: "bold",
          fontSize: 10,
          halign: "center", // 🌟 FINAL CHANGE: This centers the "Total" row
        },
        startY: headerBottomY + 15,
        theme: "striped",
        margin: { left: margin, right: margin },
        headStyles: {
          textColor: 255,
          fillColor: [25, 118, 210],
          fontStyle: "bold",
          fontSize: 10,
          halign: "center",
          valign: "middle",
          lineWidth: 0.5,
          lineColor: [220, 220, 220],
          cellPadding: 8,
        },
        bodyStyles: {
          textColor: [70, 70, 70],
          fontSize: 9,
          valign: "top",
          lineWidth: 0.2,
          lineColor: [220, 220, 220],
          cellPadding: 6,
          halign: "center",
        },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        didDrawPage: (data) => {
          if (data.pageNumber !== 1) {
            drawHeader(false);
            drawFooter();
          }
        },
      });

      const safeTitle = title
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s+/g, "_");
      const dateStr = new Date().toISOString().slice(0, 10);
      const finalName =
        filename === "report.pdf" ? `${safeTitle}_${dateStr}.pdf` : filename;
      doc.save(finalName);
    } catch (err) {
      console.error("PDF generation error", err);
      alert("Failed to generate PDF: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MuiButton
      variant="contained"
      color="primary"
      onClick={handleClick}
      disabled={isGenerating || disabled}
      startIcon={<CloudDownloadIcon />}
      sx={{
        px: 3,
        py: 1.5,
        flexShrink: 0,
      }}
      {...buttonProps}
    >
      {isGenerating ? "Generating Report…" : buttonLabel}
    </MuiButton>
  );
}

PdfReportButton.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  headers: PropTypes.array.isRequired,
  rows: PropTypes.arrayOf(PropTypes.array).isRequired,
  filename: PropTypes.string,
  buttonLabel: PropTypes.string,
  buttonProps: PropTypes.object,
  reportDate: PropTypes.instanceOf(Date),
  companyName: PropTypes.string,
  companyAddress: PropTypes.string,
  companyContact: PropTypes.string,
  studentData: PropTypes.object,
  disabled: PropTypes.bool,
};
