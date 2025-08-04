import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import Coupons from '../../components/ui/admin/Coupons_Offers/Coupons';

const AdminCouponOffers = () => {
  return (
    <Mainlayout role="admin">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Manage Coupons and Offers
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Welcome back! Here's what's happening with your tutoring business.
        </p>
        <Coupons />
      </div>
    </Mainlayout>
  );
};

export default AdminCouponOffers;
