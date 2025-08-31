// src/utils/pdfUtils.js

// Updated getPdfTableHeaders to take columns array as a parameter
export const getPdfTableHeaders = (columns, columnVisibility, showSubjectColumn) => {
  return columns.filter((col) => {
    const isControllableAndVisible = (col.controllable === undefined || col.controllable) && columnVisibility[col.key];
    const isAlwaysIncluded = col.controllable === false;
    const isSubjectColumn = col.key === "subject";

    return (
      isAlwaysIncluded ||
      (isControllableAndVisible && (!isSubjectColumn || showSubjectColumn))
    );
  }).map((col) => col.label);
};

// Updated getPdfTableRows to take columns array as a parameter
export const getPdfTableRows = (students, columns, columnVisibility, showSubjectColumn) => {
  const filteredColumnsForPdf = columns.filter((col) => {
    const isControllableAndVisible = (col.controllable === undefined || col.controllable) && columnVisibility[col.key];
    const isAlwaysIncluded = col.controllable === false;
    const isSubjectColumn = col.key === "subject";

    return (
      isAlwaysIncluded ||
      (isControllableAndVisible && (!isSubjectColumn || showSubjectColumn))
    );
  });

  return students.map((student, index) => {
    return filteredColumnsForPdf.map((col) => {
      if (col.format) {
        return col.format(student, index);
      } else if (col.dataKey) {
        return student[col.dataKey] || "N/A";
      }
      return "N/A";
    });
  });
};