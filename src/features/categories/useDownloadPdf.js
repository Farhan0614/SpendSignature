import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { getAllCategoryExpensesForExport } from "../../services/apiExpense";

export function useDownloadPdf() {
  const [isDownloading, setIsDownloading] = useState(false);

  // --- SAFE PDF CURRENCY FORMATTER ---
  // Uses "PKR", "USD", etc. instead of symbols like "₨" or "$"
  // This prevents the PDF font from breaking and pushing text out of cells.
  const formatPdfCurrency = (value, currencyCode) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "code",
    }).format(value);
  };

  async function downloadPdf({
    user_id,
    categoryName,
    view,
    month,
    year,
    sortBy,
    currency,
    viewTotal,
    globalTotal,
  }) {
    try {
      setIsDownloading(true);

      // 1. FETCH ALL DATA (No pagination)
      const data = await getAllCategoryExpensesForExport({
        user_id,
        categoryName,
        view,
        month,
        year,
        sortBy,
      });

      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      // 2. SETUP PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // --- 3. DYNAMIC LABELS & META DATA ---
      const reportDate =
        view === "monthly"
          ? format(new Date(`${month}-01`), "MMMM yyyy")
          : year;

      const sortLabels = {
        "date-desc": "Date (Newest First)",
        "date-asc": "Date (Oldest First)",
        "amount-desc": "Amount (Highest First)",
        "amount-asc": "Amount (Lowest First)",
      };
      const appliedSort = sortLabels[sortBy] || "Newest First";
      const generatedOn = format(new Date(), "MMM dd, yyyy - hh:mm a");

      // --- 4. DRAW HEADER ---
      // App Branding
      doc.setFontSize(10);
      doc.setTextColor(99, 102, 241); // Indigo-500
      doc.text("SPENDSIGNATURE", 14, 15);

      // Main Title
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42); // Slate-900
      doc.text(`${categoryName} Expenses`, 14, 25);

      // Right-Aligned Meta Data
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`Generated: ${generatedOn}`, pageWidth - 14, 15, {
        align: "right",
      });
      doc.text(`Sorted By: ${appliedSort}`, pageWidth - 14, 20, {
        align: "right",
      });
      doc.text(
        `View: ${view === "monthly" ? "Monthly" : "Yearly"}`,
        pageWidth - 14,
        25,
        { align: "right" },
      );

      // Separator Line
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.setLineWidth(0.5);
      doc.line(14, 30, pageWidth - 14, 30);

      // --- 5. DRAW STATS BOX ---
      doc.setFillColor(248, 250, 252); // Slate-50
      doc.roundedRect(14, 35, pageWidth - 28, 20, 2, 2, "F");

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate-500

      // Box Left: Spent this period
      doc.text(`Spent in ${reportDate}:`, 20, 44);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42); // Slate-900
      doc.text(formatPdfCurrency(viewTotal, currency), 20, 50);

      // Box Middle: Total All Time
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text("Total Spent (All Time):", 100, 44);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(formatPdfCurrency(globalTotal, currency), 100, 50);

      // Box Right: Total Records (NEW)
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text("Total Records:", pageWidth - 20, 44, { align: "right" });
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42); // Slate-900
      doc.text(`${data.length}`, pageWidth - 20, 50, { align: "right" });

      // --- 6. PREPARE TABLE DATA ---
      const tableColumn = ["Date", "Description", "Amount"];
      const tableRows = [];

      data.forEach((exp) => {
        tableRows.push([
          format(new Date(exp.date), "MMM dd, yyyy"),
          exp.title,
          formatPdfCurrency(exp.amount, currency),
        ]);
      });

      // --- 7. DRAW TABLE ---
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 62,
        theme: "grid",
        headStyles: {
          fillColor: [79, 70, 229], // Indigo 600
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // Slate 50
        },
        styles: {
          font: "helvetica",
          fontSize: 10,
          textColor: [51, 65, 85], // Slate 700
          cellPadding: 4, // More breathing room
        },
        columnStyles: {
          0: { cellWidth: 40 }, // Fixed width for Date
          1: { cellWidth: "auto" }, // Description takes remaining space
          2: { cellWidth: 45, halign: "right", fontStyle: "bold" }, // Amount fixed width & right aligned
        },
      });

      // --- 8. DRAW FOOTER (Page Numbers) ---
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // Slate 400
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" },
        );
      }

      // 9. SAVE FILE
      const fileName = `${categoryName}_${reportDate.replace(" ", "_")}.pdf`;
      doc.save(fileName);
      toast.success("PDF Downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Could not generate PDF");
    } finally {
      setIsDownloading(false);
    }
  }

  return { downloadPdf, isDownloading };
}
