import React from 'react';
import { HiOutlineMail } from 'react-icons/hi';

export default function Partner() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800 text-center">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Partner with Us</h1>

      <p className="text-lg mb-4">
        Routico is seeking collaboration with local delivery providers, fleet managers, and logistics tech innovators.
      </p>

      <p className="text-lg mb-8">
        We believe the future of logistics in the Philippines depends on smart, scalable partnerships. Let's bring digital transformation to the last mile—together.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-900">🚚 Ideal Partners</h2>
      <ul className="text-lg space-y-2 mb-8">
        <li>• Independent Truck Operators</li>
        <li>• SME Courier Businesses</li>
        <li>• Barangay-Based Delivery Services</li>
        <li>• Tech Innovators in Fleet & Logistics</li>
      </ul>

      <div className="flex items-center justify-center mt-6">
        <HiOutlineMail className="text-xl mr-2 text-blue-600" />
        <p className="text-md font-medium text-gray-800">
          <span className="font-semibold">Partnership Inquiries:</span>{' '}
          <a href="mailto:partners@routico.app" className="text-blue-600 underline">
            partners@routico.app
          </a>
        </p>
      </div>
    </div>
  );
}