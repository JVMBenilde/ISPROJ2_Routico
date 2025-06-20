import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-4xl font-bold text-center mb-2">Routico Privacy Policy</h1>
      <p className="text-center italic text-sm text-gray-500 mb-10">
        Compliant with Republic Act No. 10173 – The Data Privacy Act of 2012
      </p>

      {/* Section 1 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Scope and Purpose of Data Collection</h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            <strong>Personal Information:</strong> Full Name, Email Address, Contact Number
          </li>
          <li>
            <strong>Location Data:</strong> GPS coordinates, pickup & delivery addresses
          </li>
          <li>
            <strong>Delivery/Vehicle Info:</strong> Order details, truck specs, route data
          </li>
          <li>
            <strong>System Logs:</strong> Login timestamps, activity, IP & device information
          </li>
          <li>
            <strong>Communication:</strong> Notification logs, issue reports, and attachments
          </li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. Purpose of Data Use</h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>To enable delivery scheduling & route optimization</li>
          <li>To support customer service and issue resolution</li>
          <li>To assign drivers accurately and manage logistics</li>
          <li>To monitor system usage and ensure secure performance</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Data Sharing and Third-Party Access</h2>
        <p>
          Routico does not sell or rent your personal data. Select third-party services (e.g., Firebase, Google Maps)
          are used solely to enable core features, under data-sharing agreements compliant with applicable laws.
        </p>
      </section>

      {/* Section 4 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Data Retention and Deletion</h2>
        <p>
          Your data is securely stored on verified cloud infrastructure. Users may request deletion of personal data,
          and Routico will erase user records and backups within 30 days unless retention is legally or operationally
          required.
        </p>
      </section>

      {/* Section 5 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
        <p>
          Under Philippine law, you may access, correct, object to, or request deletion of your personal information.
          Routico respects your rights and will respond to requests in a timely and transparent manner.
        </p>
      </section>

      {/* Contact */}
      <section className="text-center mt-10 text-sm text-gray-600">
        <p>
          Contact our Data Protection Officer (DPO) at:{' '}
          <a href="mailto:admin@routico.app" className="text-blue-600 underline">
            admin@routico.app
          </a>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;