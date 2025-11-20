<<<<<<< HEAD
// // import React, { useEffect, useState } from "react";
// // import { studentInvoiceRepository } from "../../../../api/repository/tutor_invoices.repository";
// // import { toast } from "react-toastify";
// // import moment from "moment";
// // import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

// // const TutorInvoices = () => {
// //   const [invoices, setInvoices] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   // Fetch invoices
// //   const fetchInvoices = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await studentInvoiceRepository.getMyInvoices();
// //       if (res && Array.isArray(res.invoices)) {
// //         setInvoices(res.invoices);
// //       } else {
// //         toast.error("No invoices found.");
// //       }
// //     } catch (error) {
// //       toast.error("Failed to fetch invoices.");
// //       console.error(error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Handle PDF Download
// //   const handleDownload = async (paymentId) => {
// //     try {
// //       const blob = await studentInvoiceRepository.downloadInvoicePDF(paymentId);
// //       const url = window.URL.createObjectURL(blob);
// //       const link = document.createElement("a");
// //       link.href = url;
// //       link.setAttribute("download", `${paymentId}.pdf`);
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);
// //       window.URL.revokeObjectURL(url);
// //     } catch (error) {
// //       toast.error("Download failed.");
// //       console.error(error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchInvoices();
// //   }, []);

// //   return (
// //     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-8">
// //       <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
// //         {loading ? (
// //           <div className="text-center py-10 text-gray-500">Loading invoices...</div>
// //         ) : invoices.length === 0 ? (
// //           <div className="text-center py-10 text-gray-500">No invoices found.</div>
// //         ) : (
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full divide-y divide-gray-200 text-sm">
// //               <thead className="bg-blue-50 text-blue-900">
// //                 <tr>
// //                   <th className="px-4 py-3 text-left whitespace-nowrap">Plan</th>
// //                   <th className="px-4 py-3 text-left whitespace-nowrap">Amount</th>
// //                   <th className="px-4 py-3 text-left whitespace-nowrap">Date</th>
// //                   <th className="px-4 py-3 text-left whitespace-nowrap">Payment ID</th>
// //                   <th className="px-4 py-3 text-left whitespace-nowrap">Razorpay ID</th>
// //                   <th className="px-4 py-3 text-left whitespace-nowrap">Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-100">
// //                 {invoices.map((inv, idx) => (
// //                   <tr key={idx} className="hover:bg-gray-50 transition">
// //                     <td className="px-4 py-3">{inv.plan_name}</td>
// //                     <td className="px-4 py-3 text-gray-800 font-semibold">
// //                       ₹{inv.amount}
// //                     </td>
// //                     <td className="px-4 py-3">
// //                       {moment(inv.date, ["D/M/YYYY, h:mm:ss a"]).format("DD MMM YYYY")}
// //                     </td>
// //                     <td className="px-4 py-3 text-gray-600">{inv.payment_id}</td>
// //                     <td className="px-4 py-3 text-gray-600">{inv.razorpay_payment_id}</td>
// //                     <td className="px-4 py-3">
// //                       <button
// //                         onClick={() => handleDownload(inv.payment_id)}
// //                         className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition font-medium"
// //                       >
// //                         <ArrowDownTrayIcon className="w-4 h-4" />
// //                         Download
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}

// //       </div>
// //     </div>
// //   );
// // };

// // export default TutorInvoices;


//               import React, { useEffect, useState } from "react";
// import { Mail, Phone, Download } from "lucide-react";
// import Logo from "../../../../assets/img/logo.jpg";
// import { tutorInvoiceRepository } from "../../../../api/repository/tutor_invoices.repository";
// import jsPDF from "jspdf";

// const InvoicePreview = () => {
//   const [invoice, setInvoice] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchInvoices = async () => {
//       try {
//         setLoading(true);
//         const data = await tutorInvoiceRepository .getMyInvoices();
//         if (data?.invoices?.length > 0) {
//           setInvoice(data.invoices[0]); // just take first invoice
//         } else {
//           setInvoice(null); // no invoice available
//         }
//       } catch (error) {
//         console.error("Error fetching invoice:", error);
//         setError("Failed to fetch invoice data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInvoices();
//   }, []);

//   const downloadInvoice = () => {
//     if (!invoice) return;
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const margin = 20;
//     const contentWidth = pageWidth - 2 * margin;

//     // Add logo
//     try {
//       const img = new Image();
//       img.src = Logo;
//       pdf.addImage(img, "JPEG", margin, 15, 30, 30);
//     } catch (e) {
//       console.log("Could not add logo to PDF");
//     }

//     // Company Info
//     pdf.setFontSize(16);
//     pdf.setFont(undefined, "bold");
//     pdf.text("Dronacharya", margin + 35, 25);

//     pdf.setFontSize(10);
//     pdf.setFont(undefined, "normal");
//     pdf.text("123 Education Street, Tech City, TC 12345", margin + 35, 32);
//     pdf.text("GST: GST123456789 | PAN: PAN123456", margin + 35, 38);

//     // Invoice Title & Details
//     pdf.setFontSize(20);
//     pdf.setFont(undefined, "bold");
//     pdf.setTextColor(0, 102, 204); // Blue color
//     pdf.text("INVOICE", pageWidth - margin, 25, { align: "right" });

//     pdf.setFontSize(10);
//     pdf.setTextColor(0, 0, 0);
//     pdf.text(
//       `Invoice No: ${invoice.payment_id?.slice(0, 8)?.toUpperCase() || "N/A"}`,
//       pageWidth - margin,
//       32,
//       { align: "right" }
//     );
//     pdf.text(`Date: ${formatDate(invoice.date)}`, pageWidth - margin, 38, {
//       align: "right",
//     });
//     pdf.text("Payment: Online", pageWidth - margin, 44, { align: "right" });
//     pdf.text(`Ref: ${invoice.razorpay_payment_id || "N/A"}`, pageWidth - margin, 50, { align: "right" });

//     // Bill To & Service Details
//     let yPosition = 70;
//     pdf.setFontSize(12);
//     pdf.setFont(undefined, "bold");
//     pdf.text("Bill To:", margin, yPosition);
//     pdf.setFont(undefined, "normal");
//     pdf.text(invoice.user_name || "N/A", margin, yPosition + 8);

//     pdf.setFontSize(10);
//     pdf.text(`Email: ${invoice.user_email || "N/A"}`, margin, yPosition + 15);
//     pdf.text(`Phone: ${invoice.user_mobile || "N/A"}`, margin, yPosition + 21);

//     pdf.setFontSize(12);
//     pdf.setFont(undefined, "bold");
//     pdf.text("Service Details:", pageWidth / 2, yPosition);
//     pdf.setFont(undefined, "normal");
//     pdf.text(invoice.plan_name || "N/A", pageWidth / 2, yPosition + 8);
//     pdf.setFontSize(10);
//     pdf.text(`GST %: ${invoice.gst_percentage || 0}%`, pageWidth / 2, yPosition + 15);
//     pdf.text(`Invoice ID: ${invoice.payment_id || "N/A"}`, pageWidth / 2, yPosition + 21);

//     yPosition += 35;

//     // Table and Totals (same as your existing implementation)
//     const tableStartY = yPosition;
//     const rowHeight = 15;
//     const headerHeight = 15;
//     const col1Width = contentWidth * 0.4;
//     const col2Width = contentWidth * 0.15;
//     const col3Width = contentWidth * 0.225;
//     const col4Width = contentWidth * 0.225;
//     const col1X = margin;
//     const col2X = col1X + col1Width;
//     const col3X = col2X + col2Width;
//     const col4X = col3X + col3Width;

//     pdf.setDrawColor(0, 0, 0);
//     pdf.setLineWidth(0.8);
//     pdf.rect(margin, tableStartY, contentWidth, headerHeight + rowHeight, "S");
//     pdf.setFillColor(220, 220, 220);
//     pdf.rect(margin, tableStartY, contentWidth, headerHeight, "FD");
//     pdf.line(margin, tableStartY + headerHeight, margin + contentWidth, tableStartY + headerHeight);
//     pdf.line(col2X, tableStartY, col2X, tableStartY + headerHeight + rowHeight);
//     pdf.line(col3X, tableStartY, col3X, tableStartY + headerHeight + rowHeight);
//     pdf.line(col4X, tableStartY, col4X, tableStartY + headerHeight + rowHeight);

//     pdf.setFontSize(12);
//     pdf.setFont(undefined, "bold");
//     pdf.text("Service", col1X + 5, tableStartY + 10);
//     pdf.text("Qty", col2X + col2Width / 2, tableStartY + 10, { align: "center" });
//     pdf.text("Price", col3X + col3Width / 2, tableStartY + 10, { align: "center" });
//     pdf.text("Amount", col4X + col4Width / 2, tableStartY + 10, { align: "center" });

//     const dataRowY = tableStartY + headerHeight;
//     pdf.setFont(undefined, "normal");
//     pdf.setFontSize(11);
//     pdf.text(invoice.plan_name || "N/A", col1X + 5, dataRowY + 10);
//     pdf.text("1", col2X + col2Width / 2, dataRowY + 10, { align: "center" });
//     pdf.text(formatCurrencyForPDF(invoice.base_amount || 0), col3X + col3Width - 5, dataRowY + 10, { align: "right" });
//     pdf.text(formatCurrencyForPDF(invoice.base_amount || 0), col4X + col4Width - 5, dataRowY + 10, { align: "right" });

//     yPosition = dataRowY + rowHeight + 15;
//     pdf.setFontSize(11);
//     pdf.text("Subtotal:", margin + contentWidth * 0.7, yPosition, { align: "right" });
//     pdf.text(formatCurrencyForPDF(invoice.base_amount || 0), margin + contentWidth - 5, yPosition, { align: "right" });
//     yPosition += 7;
//     pdf.text(`Tax (${invoice.gst_percentage || 0}%):`, margin + contentWidth * 0.7, yPosition, { align: "right" });
//     pdf.text(formatCurrencyForPDF(invoice.gst_amount || 0), margin + contentWidth - 5, yPosition, { align: "right" });
//     yPosition += 10;
//     pdf.setFont(undefined, "bold");
//     pdf.setFontSize(12);
//     pdf.text("Total:", margin + contentWidth * 0.7, yPosition, { align: "right" });
//     pdf.text(formatCurrencyForPDF(invoice.total_amount || 0), margin + contentWidth - 5, yPosition, { align: "right" });

//     // Terms
//     yPosition += 20;
//     pdf.setFontSize(11);
//     pdf.setFont(undefined, "bold");
//     pdf.text("Terms & Conditions:", margin, yPosition);
//     pdf.setFont(undefined, "normal");
//     const terms = [
//       "Payment is due within 30 days of invoice date",
//       "Late payments may incur additional charges",
//       "All services are subject to our standard terms of service",
//       "For any queries, please contact our support team",
//     ];
//     terms.forEach((term, index) => {
//       pdf.text(`• ${term}`, margin + 5, yPosition + 8 + index * 5);
//     });

//     pdf.save(`invoice-${invoice.payment_id?.slice(0, 8)?.toUpperCase() || "invoice"}.pdf`);
//   };

//   // Format helpers
//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
//     } catch {
//       return dateString;
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
//   };

//   const formatCurrencyForPDF = (amount) => {
//     if (!amount) return "Rs. 0.00";
//     return "Rs. " + new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
//   };

//   if (loading) {
//     return <div className="text-center py-10">Loading invoice...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-10 text-red-600">{error}</div>;
//   }

//   // Friendly message when no invoice exists
//   if (!invoice) {
//     return (
//       <div className="text-center py-20 space-y-4">
//         <h2 className="text-2xl font-bold text-gray-800">No Active Subscription</h2>
//         <p className="text-gray-600">
//           You currently do not have an active subscription plan. Once you purchase a plan, your invoice will appear here.
//         </p>
//         <a
//           href="/tutor_subscription_plan" // Adjust this link to your subscription page
//           className="inline-block bg-[#35BAA3] hover:bg-[#35BAA3] text-white px-6 py-3 rounded-lg transition-colors"
//         >
//           View Plans
//         </a>
//       </div>
//     );
//   }

//   // Invoice display if invoice exists
//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={downloadInvoice}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//         >
//           <Download size={18} />
//           Download Invoice
//         </button>
//       </div>
      
//       <div className="bg-white shadow-lg border rounded-2xl p-8 space-y-8">
//         {/* Header */}
//         <div className="text-center border-b pb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
//         </div>

//         {/* Company Info and Invoice Details */}
//         <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
//           {/* Left Side - Company Info */}
//           <div className="flex items-start space-x-4">
//             <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
//               <img
//                 src={Logo}
//                 alt="Dronacharya Logo"
//                 className="h-16 w-auto object-contain"
//                 onError={(e) => {
//                   e.target.style.display = "none";
//                 }}
//               />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                 Dronacharya
//               </h2>
//               <div className="text-gray-600 space-y-1 text-sm">
//                 <p>123 Education Street, Tech City, TC 12345</p>
//                 <p>GST: GST123456789 | PAN: PAN123456</p>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Invoice Details */}
//           <div className="text-right">
//             <h3 className="text-2xl font-bold text-blue-600 mb-2">INVOICE</h3>
//             <div className="text-gray-600 space-y-1 text-sm">
//               <p>
//                 <span className="font-medium">Invoice No:</span>{" "}
//                 {invoice.payment_id?.slice(0, 8)?.toUpperCase() || "N/A"}
//               </p>
//               <p>
//                 <span className="font-medium">Date:</span>{" "}
//                 {formatDate(invoice.date)}
//               </p>
//               <p>
//                 <span className="font-medium">Payment:</span> Online
//               </p>
//               <p>
//                 <span className="font-medium">Ref:</span>{" "}
//                 {invoice.razorpay_payment_id || "N/A"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Bill To and Service Details */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Bill To */}
//           <div className="bg-gray-50 p-6 rounded-lg border">
//             <h4 className="font-semibold text-gray-800 mb-4">Bill To:</h4>
//             <div className="space-y-3">
//               <h5 className="font-medium text-gray-800">
//                 {invoice.user_name || "N/A"}
//               </h5>
//               <div className="flex items-center space-x-2 text-gray-600">
//                 <Mail size={16} className="flex-shrink-0" />
//                 <span className="break-all">{invoice.user_email || "N/A"}</span>
//               </div>
//               <div className="flex items-center space-x-2 text-gray-600">
//                 <Phone size={16} className="flex-shrink-0" />
//                 <span>{invoice.user_mobile || "N/A"}</span>
//               </div>
//             </div>
//           </div>

//           {/* Service Details */}
//           <div className="bg-gray-50 p-6 rounded-lg border">
//             <h4 className="font-semibold text-gray-800 mb-4">
//               Service Details:
//             </h4>
//             <div className="space-y-2">
//               <h5 className="font-medium text-gray-800">
//                 {invoice.plan_name || "N/A"}
//               </h5>
//               <p className="text-gray-600">
//                 <span className="font-medium">GST %:</span>{" "}
//                 {invoice.gst_percentage || 0}%
//               </p>
//               <p className="text-gray-600">
//                 <span className="font-medium">Invoice ID:</span>
//                 <span className="break-all ml-1">
//                   {invoice.payment_id || "N/A"}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Service Table */}
//         <div className="border border-gray-200 rounded-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-800">
//                     Service
//                   </th>
//                   <th className="text-center py-3 px-4 font-semibold text-gray-800">
//                     Qty
//                   </th>
//                   <th className="text-right py-3 px-4 font-semibold text-gray-800">
//                     Price
//                   </th>
//                   <th className="text-right py-3 px-4 font-semibold text-gray-800">
//                     Amount
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="border-t border-gray-200">
//                   <td className="py-4 px-4 text-gray-800">
//                     {invoice.plan_name || "N/A"}
//                   </td>
//                   <td className="py-4 px-4 text-center text-gray-800">1</td>
//                   <td className="py-4 px-4 text-right text-gray-800">
//                     {formatCurrency(invoice.base_amount || 0)}
//                   </td>
//                   <td className="py-4 px-4 text-right text-gray-800">
//                     {formatCurrency(invoice.base_amount || 0)}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Totals */}
//         <div className="flex justify-end">
//           <div className="w-full max-w-80 bg-gray-50 rounded-lg border p-6">
//             <div className="space-y-2">
//               <div className="flex justify-between py-2">
//                 <span className="text-gray-700">Subtotal:</span>
//                 <span className="text-gray-700">
//                   {formatCurrency(invoice.base_amount || 0)}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2">
//                 <span className="text-gray-700">
//                   Tax ({invoice.gst_percentage || 0}%):
//                 </span>
//                 <span className="text-gray-700">
//                   {formatCurrency(invoice.gst_amount || 0)}
//                 </span>
//               </div>
//               <div className="flex justify-between py-3 border-t border-gray-300">
//                 <span className="text-xl font-bold text-gray-800">Total:</span>
//                 <span className="text-xl font-bold text-gray-800">
//                   {formatCurrency(invoice.total_amount || 0)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Terms & Conditions */}
//         <div className="bg-gray-50 p-6 rounded-lg border">
//           <h4 className="font-semibold text-gray-800 mb-4">
//             Terms & Conditions:
//           </h4>
//           <ul className="space-y-2 text-gray-600 text-sm">
//             <li>• Payment is due within 30 days of invoice date</li>
//             <li>• Late payments may incur additional charges</li>
//             <li>• All services are subject to our standard terms of service</li>
//             <li>• For any queries, please contact our support team</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoicePreview;


import React, { useEffect, useState } from "react";
import { Mail, Phone, Download, ChevronDown, ChevronUp, Eye } from "lucide-react";
=======
          import React, { useEffect, useState } from "react";
import { Mail, Phone, Download } from "lucide-react";
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
import Logo from "../../../../assets/img/logo.jpg";
import { tutorInvoiceRepository } from "../../../../api/repository/tutor_invoices.repository";
import jsPDF from "jspdf";

const InvoicePreview = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [expandedInvoices, setExpandedInvoices] = useState(new Set());
=======
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const data = await tutorInvoiceRepository .getMyInvoices();
        if (data?.invoices?.length > 0) {
          setInvoices(data.invoices);
          // Select the most recent invoice by default
          setSelectedInvoice(data.invoices[0]);
          // Expand the first invoice by default
          setExpandedInvoices(new Set([data.invoices[0]?.payment_id]));
        } else {
<<<<<<< HEAD
          setInvoices([]);
          setSelectedInvoice(null);
=======
          setInvoice(null); // no invoice available
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setError("Failed to fetch invoice data");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

<<<<<<< HEAD
  const toggleInvoiceExpansion = (invoiceId) => {
    const newExpanded = new Set(expandedInvoices);
    if (newExpanded.has(invoiceId)) {
      newExpanded.delete(invoiceId);
    } else {
      newExpanded.add(invoiceId);
    }
    setExpandedInvoices(newExpanded);
  };

  const selectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const downloadInvoice = (invoice = selectedInvoice) => {
=======
  const downloadInvoice = () => {
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
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

<<<<<<< HEAD
    // Table and Totals
=======
    // Table and Totals (same as your existing implementation)
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
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
<<<<<<< HEAD
 const formatDate = (dateString) => {
  try {
    // Handle the format "29/10/2025, 4:11:00 pm"
    if (dateString && dateString.includes(',')) {
      const [datePart, timePart] = dateString.split(', ');
      const [day, month, year] = datePart.split('/');
      
      // Create a proper date string that Date constructor can parse
      const properDateString = `${year}-${month}-${day} ${timePart}`;
      const date = new Date(properDateString);
      
      // Fallback if the above parsing fails
      if (isNaN(date.getTime())) {
        return datePart; // Return just the date part "29/10/2025"
      }
      
      return date.toLocaleDateString("en-IN", { 
        day: "2-digit", 
        month: "2-digit", 
        year: "numeric" 
      });
    }
    
    // Fallback for any other date format
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-IN", { 
        day: "2-digit", 
        month: "2-digit", 
        year: "numeric" 
      });
    }
    
    // Final fallback - return the original string
    return dateString;
  } catch {
    return dateString;
  }
};
=======
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return dateString;
    }
  };
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  };

  const formatCurrencyForPDF = (amount) => {
    if (!amount) return "Rs. 0.00";
    return "Rs. " + new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  if (loading) {
    return <div className="text-center py-10">Loading invoices...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

<<<<<<< HEAD
  // Friendly message when no invoices exist
  if (invoices.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">No Invoices Found</h2>
        <p className="text-gray-600">
          You currently do not have any invoices. Once you purchase a plan, your invoices will appear here.
        </p>
        <a
          href="/tutor_subscription_plan"
=======
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
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
          className="inline-block bg-[#35BAA3] hover:bg-[#35BAA3] text-white px-6 py-3 rounded-lg transition-colors"
        >
          View Plans
        </a>
      </div>
    );
  }

<<<<<<< HEAD
=======
  // Invoice display if invoice exists
>>>>>>> 3bea3b4e806b9fecfcdd44d2621a910b6e8449ed
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Selected Invoice Preview Section - MOVED TO TOP */}
      {selectedInvoice && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Invoice Preview {selectedInvoice !== invoices[0] && "(Previous Invoice)"}
            </h2>
            <button
              onClick={() => downloadInvoice(selectedInvoice)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={18} />
              Download This Invoice
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
                    {selectedInvoice.payment_id?.slice(0, 8)?.toUpperCase() || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {formatDate(selectedInvoice.date)}
                  </p>
                  <p>
                    <span className="font-medium">Payment:</span> Online
                  </p>
                  <p>
                    <span className="font-medium">Ref:</span>{" "}
                    {selectedInvoice.razorpay_payment_id || "N/A"}
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
                    {selectedInvoice.user_name || "N/A"}
                  </h5>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail size={16} className="flex-shrink-0" />
                    <span className="break-all">{selectedInvoice.user_email || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone size={16} className="flex-shrink-0" />
                    <span>{selectedInvoice.user_mobile || "N/A"}</span>
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
                    {selectedInvoice.plan_name || "N/A"}
                  </h5>
                  <p className="text-gray-600">
                    <span className="font-medium">GST %:</span>{" "}
                    {selectedInvoice.gst_percentage || 0}%
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Invoice ID:</span>
                    <span className="break-all ml-1">
                      {selectedInvoice.payment_id || "N/A"}
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
                        {selectedInvoice.plan_name || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-center text-gray-800">1</td>
                      <td className="py-4 px-4 text-right text-gray-800">
                        {formatCurrency(selectedInvoice.base_amount || 0)}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-800">
                        {formatCurrency(selectedInvoice.base_amount || 0)}
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
                      {formatCurrency(selectedInvoice.base_amount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">
                      Tax ({selectedInvoice.gst_percentage || 0}%):
                    </span>
                    <span className="text-gray-700">
                      {formatCurrency(selectedInvoice.gst_amount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-t border-gray-300">
                    <span className="text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-xl font-bold text-gray-800">
                      {formatCurrency(selectedInvoice.total_amount || 0)}
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
      )}

      {/* Invoice List Section - MOVED TO BOTTOM */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Invoices</h2>
        <div className="bg-white shadow-lg border rounded-2xl overflow-hidden">
          {invoices.map((invoice, index) => (
            <div key={invoice.payment_id || index} className="border-b last:border-b-0">
              <div 
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => toggleInvoiceExpansion(invoice.payment_id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg">
                      <span className="font-semibold">#{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {invoice.plan_name || "Subscription Plan"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(invoice.date)} • {formatCurrency(invoice.total_amount || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      index === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {index === 0 ? 'Latest' : 'Previous'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectInvoice(invoice);
                        // Scroll to top to see the preview
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadInvoice(invoice);
                      }}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Download size={16} />
                      Download
                    </button>
                    {expandedInvoices.has(invoice.payment_id) ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Expanded Details */}
              {expandedInvoices.has(invoice.payment_id) && (
                <div className="px-6 pb-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Invoice Details</h4>
                      <p><span className="font-medium">ID:</span> {invoice.payment_id || "N/A"}</p>
                      <p><span className="font-medium">Date:</span> {formatDate(invoice.date)}</p>
                      <p><span className="font-medium">Payment Ref:</span> {invoice.razorpay_payment_id || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Amount Details</h4>
                      <p><span className="font-medium">Base Amount:</span> {formatCurrency(invoice.base_amount || 0)}</p>
                      <p><span className="font-medium">GST ({invoice.gst_percentage || 0}%):</span> {formatCurrency(invoice.gst_amount || 0)}</p>
                      <p><span className="font-medium">Total:</span> {formatCurrency(invoice.total_amount || 0)}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">User Details</h4>
                      <p><span className="font-medium">Name:</span> {invoice.user_name || "N/A"}</p>
                      <p><span className="font-medium">Email:</span> {invoice.user_email || "N/A"}</p>
                      <p><span className="font-medium">Phone:</span> {invoice.user_mobile || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;