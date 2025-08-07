import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import Student_invoice_page from '../../components/ui/Student/Invoice/StudentInvoices';

const InvoiceHistory = () => {
  return (
    <Mainlayout role="student">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Invoice History
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          View and manage your invoice history
        </p>
        <Student_invoice_page />
      </div>
    </Mainlayout>
  );
};

export default InvoiceHistory;
