// import React, { useEffect, useState } from "react";
// import { studentInvoiceRepository } from "../../../../api/repository/student_invoices.repository";
// import { toast } from "react-toastify";
// import moment from "moment";
// import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

// const StudentInvoices = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchInvoices = async () => {
//     setLoading(true);
//     try {
//       const res = await studentInvoiceRepository.getMyInvoices();
//       if (res && Array.isArray(res.invoices)) {
//         setInvoices(res.invoices);
//       } else {
//         toast.error("No invoices found.");
//       }
//     } catch (error) {
//       toast.error("Failed to fetch invoices.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async (paymentId) => {
//     try {
//       const blob = await studentInvoiceRepository.downloadInvoicePDF(paymentId);
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");

//       link.href = url;
//       link.setAttribute("download", `${paymentId}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       toast.error("Download failed.");
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* <h1 className="text-2xl mb-4 text-gray-800">My Invoices</h1> */}
//       <div className="bg-white rounded shadow border border-gray-200 p-4">
//         {loading ? (
//           <div className="text-center py-6">Loading...</div>
//         ) : invoices.length === 0 ? (
//           <div className="text-center text-gray-500 py-6">No invoices available</div>
//         ) : (
//           <table className="w-full table-auto">
//             <thead>
//               <tr className="bg-gray-100 text-left text-sm text-gray-700">
//                 <th className="px-4 py-2">Plan</th>
//                 <th className="px-4 py-2">Amount</th>
//                 <th className="px-4 py-2">Date</th>
//                 <th className="px-4 py-2">Payment ID</th>
//                 <th className="px-4 py-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {invoices.map((inv, idx) => (
//                 <tr key={idx} className="border-t text-sm">
//                   <td className="px-4 py-2">{inv.plan_name}</td>
//                   <td className="px-4 py-2">₹{inv.amount}</td>
//                   <td className="px-4 py-2">
//                     {moment(inv.date, ["D/M/YYYY, h:mm:ss a"]).format("DD/MM/YYYY")}
//                   </td>
//                   <td className="px-4 py-2">{inv.razorpay_payment_id}</td>
//                   <td className="px-4 py-2">
//                     <button
//                       onClick={() => handleDownload(inv.payment_id)}
//                       className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
//                     >
//                       <ArrowDownTrayIcon className="w-4 h-4" />
//                       <span>Download</span>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentInvoices;

import React, { useEffect, useState } from "react";
import { studentInvoiceRepository } from "../../../../api/repository/student_invoices.repository";
import { toast } from "react-toastify";
import moment from "moment";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import "jspdf-autotable";

const StudentInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await studentInvoiceRepository.getMyInvoices();
      if (res && Array.isArray(res.invoices)) {
        setInvoices(res.invoices);
      } else {
        toast.error("No invoices found.");
      }
    } catch (error) {
      toast.error("Failed to fetch invoices.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoicePDF = (invoice) => {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add company logo (replace with actual logo URL or base64 encoded image)
    // doc.addImage(logo, 'PNG', 15, 10, 30, 30);
    
    // Company information
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text("DRONACHARYA", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text("123 Education Street", 105, 30, { align: "center" });
    doc.text("Gurgaon, Haryana 122001", 105, 37, { align: "center" });
    doc.text("Phone: +91 1234567890 | Email: info@dronacharya.com", 105, 44, { align: "center" });
    
    // Invoice title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("INVOICE", 105, 60, { align: "center" });
    
    // Horizontal line
    doc.line(15, 65, 195, 65);
    
    // Invoice details
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Invoice Number: ${invoice.razorpay_payment_id}`, 15, 75);
    doc.text(`Invoice Date: ${moment(invoice.date, ["D/M/YYYY, h:mm:ss a"]).format("DD/MM/YYYY")}`, 15, 82);
    
    // Student information (you might want to fetch this from user profile)
    doc.text("Bill To:", 15, 95);
    doc.setFont(undefined, 'bold');
    doc.text("Student Name", 15, 102); // Replace with actual student name
    doc.setFont(undefined, 'normal');
    doc.text("Student Address", 15, 109); // Replace with actual student address
    doc.text("student@email.com", 15, 116); // Replace with actual student email
    
    // Invoice items table
    const tableColumn = ["Description", "Amount"];
    const tableRows = [
      [invoice.plan_name, `₹${invoice.amount}`],
      ["", ""],
      ["", ""],
      ["Total", `₹${invoice.amount}`]
    ];
    
    doc.autoTable({
      startY: 130,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 12 },
      headStyles: { fillColor: [41, 128, 185] },
      foot: [['Total', `₹${invoice.amount}`]],
      footStyles: { fillColor: [41, 128, 185] },
    });
    
    // Payment information
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("Payment Information:", 15, finalY);
    doc.setFont(undefined, 'normal');
    doc.text(`Payment ID: ${invoice.razorpay_payment_id}`, 15, finalY + 7);
    doc.text(`Payment Date: ${moment(invoice.date, ["D/M/YYYY, h:mm:ss a"]).format("DD/MM/YYYY")}`, 15, finalY + 14);
    
    // Terms and conditions
    doc.setFontSize(10);
    doc.text("Terms & Conditions:", 15, finalY + 30);
    doc.text("1. Payment is due within 30 days of invoice date.", 15, finalY + 37);
    doc.text("2. Late payment may result in suspension of services.", 15, finalY + 44);
    
    // Thank you message
    doc.setFontSize(12);
    doc.setFont(undefined, 'italic');
    doc.text("Thank you for your business!", 105, finalY + 60, { align: "center" });
    
    // Save the PDF
    doc.save(`invoice-${invoice.razorpay_payment_id}.pdf`);
  };

  const handleDownload = async (paymentId) => {
    try {
      const invoice = invoices.find(inv => inv.payment_id === paymentId);
      if (invoice) {
        generateInvoicePDF(invoice);
        toast.success("Invoice downloaded successfully!");
      } else {
        toast.error("Invoice not found.");
      }
    } catch (error) {
      toast.error("Download failed.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded shadow border border-gray-200 p-4">
        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No invoices available</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-700">
                <th className="px-4 py-2">Plan</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Payment ID</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr key={idx} className="border-t text-sm">
                  <td className="px-4 py-2">{inv.plan_name}</td>
                  <td className="px-4 py-2">₹{inv.amount}</td>
                  <td className="px-4 py-2">
                    {moment(inv.date, ["D/M/YYYY, h:mm:ss a"]).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-2">{inv.razorpay_payment_id}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDownload(inv.payment_id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentInvoices;