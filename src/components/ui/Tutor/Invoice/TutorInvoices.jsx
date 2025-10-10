          import React, { useEffect, useState } from "react";
import { Mail, Phone, Download } from "lucide-react";
import Logo from "../../../../assets/img/logo.jpg";
import { tutorInvoiceRepository } from "../../../../api/repository/tutor_invoices.repository";
import jsPDF from "jspdf";

const InvoicePreview = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const data = await tutorInvoiceRepository .getMyInvoices();
        if (data?.invoices?.length > 0) {
          setInvoice(data.invoices[0]); // just take first invoice
        } else {
          setInvoice(null); // no invoice available
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError("Failed to fetch invoice data");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const downloadInvoice = () => {
    if (!invoice) return;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Add logo
    try {
      const img = new Image();
      img.src = Logo;
      pdf.addImage(img, "JPEG", margin, 15, 30, 30);
    } catch (e) {
      console.log("Could not add logo to PDF");
    }

    // Company Info
    pdf.setFontSize(16);
    pdf.setFont(undefined, "bold");
    pdf.text("Dronacharya", margin + 35, 25);

    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    pdf.text("123 Education Street, Tech City, TC 12345", margin + 35, 32);
    pdf.text("GST: GST123456789 | PAN: PAN123456", margin + 35, 38);

    // Invoice Title & Details
    pdf.setFontSize(20);
    pdf.setFont(undefined, "bold");
    pdf.setTextColor(0, 102, 204); // Blue color
    pdf.text("INVOICE", pageWidth - margin, 25, { align: "right" });

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      `Invoice No: ${invoice.payment_id?.slice(0, 8)?.toUpperCase() || "N/A"}`,
      pageWidth - margin,
      32,
      { align: "right" }
    );
    pdf.text(`Date: ${formatDate(invoice.date)}`, pageWidth - margin, 38, {
      align: "right",
    });
    pdf.text("Payment: Online", pageWidth - margin, 44, { align: "right" });
    pdf.text(`Ref: ${invoice.razorpay_payment_id || "N/A"}`, pageWidth - margin, 50, { align: "right" });

    // Bill To & Service Details
    let yPosition = 70;
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("Bill To:", margin, yPosition);
    pdf.setFont(undefined, "normal");
    pdf.text(invoice.user_name || "N/A", margin, yPosition + 8);

    pdf.setFontSize(10);
    pdf.text(`Email: ${invoice.user_email || "N/A"}`, margin, yPosition + 15);
    pdf.text(`Phone: ${invoice.user_mobile || "N/A"}`, margin, yPosition + 21);

    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("Service Details:", pageWidth / 2, yPosition);
    pdf.setFont(undefined, "normal");
    pdf.text(invoice.plan_name || "N/A", pageWidth / 2, yPosition + 8);
    pdf.setFontSize(10);
    pdf.text(`GST %: ${invoice.gst_percentage || 0}%`, pageWidth / 2, yPosition + 15);
    pdf.text(`Invoice ID: ${invoice.payment_id || "N/A"}`, pageWidth / 2, yPosition + 21);

    yPosition += 35;

    // Table and Totals (same as your existing implementation)
    const tableStartY = yPosition;
    const rowHeight = 15;
    const headerHeight = 15;
    const col1Width = contentWidth * 0.4;
    const col2Width = contentWidth * 0.15;
    const col3Width = contentWidth * 0.225;
    const col4Width = contentWidth * 0.225;
    const col1X = margin;
    const col2X = col1X + col1Width;
    const col3X = col2X + col2Width;
    const col4X = col3X + col3Width;

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.8);
    pdf.rect(margin, tableStartY, contentWidth, headerHeight + rowHeight, "S");
    pdf.setFillColor(220, 220, 220);
    pdf.rect(margin, tableStartY, contentWidth, headerHeight, "FD");
    pdf.line(margin, tableStartY + headerHeight, margin + contentWidth, tableStartY + headerHeight);
    pdf.line(col2X, tableStartY, col2X, tableStartY + headerHeight + rowHeight);
    pdf.line(col3X, tableStartY, col3X, tableStartY + headerHeight + rowHeight);
    pdf.line(col4X, tableStartY, col4X, tableStartY + headerHeight + rowHeight);

    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("Service", col1X + 5, tableStartY + 10);
    pdf.text("Qty", col2X + col2Width / 2, tableStartY + 10, { align: "center" });
    pdf.text("Price", col3X + col3Width / 2, tableStartY + 10, { align: "center" });
    pdf.text("Amount", col4X + col4Width / 2, tableStartY + 10, { align: "center" });

    const dataRowY = tableStartY + headerHeight;
    pdf.setFont(undefined, "normal");
    pdf.setFontSize(11);
    pdf.text(invoice.plan_name || "N/A", col1X + 5, dataRowY + 10);
    pdf.text("1", col2X + col2Width / 2, dataRowY + 10, { align: "center" });
    pdf.text(formatCurrencyForPDF(invoice.base_amount || 0), col3X + col3Width - 5, dataRowY + 10, { align: "right" });
    pdf.text(formatCurrencyForPDF(invoice.base_amount || 0), col4X + col4Width - 5, dataRowY + 10, { align: "right" });

    yPosition = dataRowY + rowHeight + 15;
    pdf.setFontSize(11);
    pdf.text("Subtotal:", margin + contentWidth * 0.7, yPosition, { align: "right" });
    pdf.text(formatCurrencyForPDF(invoice.base_amount || 0), margin + contentWidth - 5, yPosition, { align: "right" });
    yPosition += 7;
    pdf.text(`Tax (${invoice.gst_percentage || 0}%):`, margin + contentWidth * 0.7, yPosition, { align: "right" });
    pdf.text(formatCurrencyForPDF(invoice.gst_amount || 0), margin + contentWidth - 5, yPosition, { align: "right" });
    yPosition += 10;
    pdf.setFont(undefined, "bold");
    pdf.setFontSize(12);
    pdf.text("Total:", margin + contentWidth * 0.7, yPosition, { align: "right" });
    pdf.text(formatCurrencyForPDF(invoice.total_amount || 0), margin + contentWidth - 5, yPosition, { align: "right" });

    // Terms
    yPosition += 20;
    pdf.setFontSize(11);
    pdf.setFont(undefined, "bold");
    pdf.text("Terms & Conditions:", margin, yPosition);
    pdf.setFont(undefined, "normal");
    const terms = [
      "Payment is due within 30 days of invoice date",
      "Late payments may incur additional charges",
      "All services are subject to our standard terms of service",
      "For any queries, please contact our support team",
    ];
    terms.forEach((term, index) => {
      pdf.text(`• ${term}`, margin + 5, yPosition + 8 + index * 5);
    });

    pdf.save(`invoice-${invoice.payment_id?.slice(0, 8)?.toUpperCase() || "invoice"}.pdf`);
  };

  // Format helpers
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  };

  const formatCurrencyForPDF = (amount) => {
    if (!amount) return "Rs. 0.00";
    return "Rs. " + new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  if (loading) {
    return <div className="text-center py-10">Loading invoice...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  // Friendly message when no invoice exists
  if (!invoice) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">No Active Subscription</h2>
        <p className="text-gray-600">
          You currently do not have an active subscription plan. Once you purchase a plan, your invoice will appear here.
        </p>
        <a
          href="/tutor_subscription_plan" // Adjust this link to your subscription page
          className="inline-block bg-[#35BAA3] hover:bg-[#35BAA3] text-white px-6 py-3 rounded-lg transition-colors"
        >
          View Plans
        </a>
      </div>
    );
  }

  // Invoice display if invoice exists
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadInvoice}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download size={18} />
          Download Invoice
        </button>
      </div>
      
      <div className="bg-white shadow-lg border rounded-2xl p-8 space-y-8">
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
        </div>

        {/* Company Info and Invoice Details */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          {/* Left Side - Company Info */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
              <img
                src={Logo}
                alt="Dronacharya Logo"
                className="h-16 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Dronacharya
              </h2>
              <div className="text-gray-600 space-y-1 text-sm">
                <p>123 Education Street, Tech City, TC 12345</p>
                <p>GST: GST123456789 | PAN: PAN123456</p>
              </div>
            </div>
          </div>

          {/* Right Side - Invoice Details */}
          <div className="text-right">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">INVOICE</h3>
            <div className="text-gray-600 space-y-1 text-sm">
              <p>
                <span className="font-medium">Invoice No:</span>{" "}
                {invoice.payment_id?.slice(0, 8)?.toUpperCase() || "N/A"}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {formatDate(invoice.date)}
              </p>
              <p>
                <span className="font-medium">Payment:</span> Online
              </p>
              <p>
                <span className="font-medium">Ref:</span>{" "}
                {invoice.razorpay_payment_id || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Bill To and Service Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bill To */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-4">Bill To:</h4>
            <div className="space-y-3">
              <h5 className="font-medium text-gray-800">
                {invoice.user_name || "N/A"}
              </h5>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail size={16} className="flex-shrink-0" />
                <span className="break-all">{invoice.user_email || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone size={16} className="flex-shrink-0" />
                <span>{invoice.user_mobile || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-4">
              Service Details:
            </h4>
            <div className="space-y-2">
              <h5 className="font-medium text-gray-800">
                {invoice.plan_name || "N/A"}
              </h5>
              <p className="text-gray-600">
                <span className="font-medium">GST %:</span>{" "}
                {invoice.gst_percentage || 0}%
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Invoice ID:</span>
                <span className="break-all ml-1">
                  {invoice.payment_id || "N/A"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Service Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">
                    Service
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800">
                    Qty
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-800">
                    Price
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-800">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="py-4 px-4 text-gray-800">
                    {invoice.plan_name || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-800">1</td>
                  <td className="py-4 px-4 text-right text-gray-800">
                    {formatCurrency(invoice.base_amount || 0)}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-800">
                    {formatCurrency(invoice.base_amount || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full max-w-80 bg-gray-50 rounded-lg border p-6">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Subtotal:</span>
                <span className="text-gray-700">
                  {formatCurrency(invoice.base_amount || 0)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-700">
                  Tax ({invoice.gst_percentage || 0}%):
                </span>
                <span className="text-gray-700">
                  {formatCurrency(invoice.gst_amount || 0)}
                </span>
              </div>
              <div className="flex justify-between py-3 border-t border-gray-300">
                <span className="text-xl font-bold text-gray-800">Total:</span>
                <span className="text-xl font-bold text-gray-800">
                  {formatCurrency(invoice.total_amount || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-4">
            Terms & Conditions:
          </h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>• Payment is due within 30 days of invoice date</li>
            <li>• Late payments may incur additional charges</li>
            <li>• All services are subject to our standard terms of service</li>
            <li>• For any queries, please contact our support team</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;