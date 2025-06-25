import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-4xl font-bold text-center mb-2">Routico Terms and Conditions</h1>
      <p className="text-center text-sm text-gray-500 mb-10">Effective Date: June 2025</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing Routico, you agree to abide by these terms. If you disagree with any part of these terms, please do not use the platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Provide accurate registration information</li>
          <li>Use the platform lawfully</li>
          <li>Maintain account security</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Account Termination</h2>
        <p>
          Routico reserves the right to suspend or terminate accounts in cases of misuse, fraud, or violation of these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
        <p>
          All Routico content, features, and source code are the property of Routico developers. Reuse or redistribution is strictly prohibited without prior permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Changes and Contact</h2>
        <p>
          We may revise these terms and will notify you of significant changes. For questions or legal concerns, contact us at <a href="mailto:admin@routico.app" className="text-blue-600 underline">admin@routico.app</a>.
        </p>
      </section>

      <section className="mt-12 text-center">
        <p className="text-sm">
          By using Routico, you also agree to our{' '}
          <Link to="/privacy" className="text-blue-600 underline">
            Privacy Policy
          </Link>.
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;