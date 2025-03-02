import React from "react";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-12 md:px-20 md:py-16 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Inquiro Privacy Policy</h1>
        <p className="text-gray-600 mb-2">Effective Date: March 2, 2025</p>

        <p className="mb-6">
          Inquiro (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and maintaining transparency about how we collect, use, and share information. By using Inquiro&apos;s services, you agree to the terms outlined in this Privacy Policy.
        </p>

        <h2 className="text-xl font-semibold mt-6">1. Overview</h2>
        <p className="mb-4">This Privacy Policy explains:</p>
        <ul className="list-disc list-inside mb-6">
          <li>The types of information we collect from users.</li>
          <li>How we use and share this information, including our data-sharing practices with financial institutions.</li>
          <li>Your rights and choices regarding your personal data.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">2. Information We Collect</h2>
        <h3 className="text-lg font-semibold mt-4">A. Information You Provide Directly</h3>
        <ul className="list-disc list-inside mb-6">
          <li><strong>Registration Data:</strong> When you create an account, we collect your name, email address, and other contact details.</li>
          <li><strong>User Preferences:</strong> Any preferences or settings you configure within Inquiro.</li>
        </ul>
        
        <h3 className="text-lg font-semibold mt-4">B. Information We Collect Automatically</h3>
        <ul className="list-disc list-inside mb-6">
          <li><strong>Usage Data:</strong> We track your interactions with Inquiro, including the equities, companies, and financial instruments you research.</li>
          <li><strong>Device and Technical Information:</strong> This includes IP addresses, browser type, operating system, and session duration.</li>
        </ul>
        
        <h3 className="text-lg font-semibold mt-4">C. Information from Third Parties</h3>
        <p className="mb-6">We may collect additional data from financial institutions, analytics providers, or advertising partners to improve our services.</p>

        <h2 className="text-xl font-semibold mt-6">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside mb-6">
          <li>Provide, personalize, and improve Inquiro&apos;s research tools.</li>
          <li>Analyze user trends to enhance our platform&apos;s features and performance.</li>
          <li>Send service-related updates and marketing communications (you can opt out at any time).</li>
          <li>Sell aggregated and anonymized consumer research data to financial institutions, such as banks, to help them understand market trends.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">4. Data Sharing & Disclosure</h2>
        <h3 className="text-lg font-semibold mt-4">A. With Financial Institutions</h3>
        <ul className="list-disc list-inside mb-6">
          <li><strong>Aggregated Data Sales:</strong> We may sell non-personally identifiable data regarding equities and investment trends to banks, hedge funds, and institutional investors.</li>
          <li><strong>Usage Insights:</strong> Financial institutions may use this data to analyze investor sentiment but will not receive personally identifiable information.</li>
        </ul>
        
        <h3 className="text-lg font-semibold mt-4">B. With Service Providers</h3>
        <p className="mb-6">We may work with third-party vendors for analytics, cloud storage, and customer support.</p>
        
        <h3 className="text-lg font-semibold mt-4">C. For Legal and Compliance Reasons</h3>
        <p className="mb-6">If required by law, regulation, or legal process, we may disclose your data to comply with government requests.</p>

        <h2 className="text-xl font-semibold mt-6">5. Data Security & Retention</h2>
        <p className="mb-6">We implement appropriate security measures to protect user data. However, no online service is 100% secure, and we cannot guarantee absolute security. We retain collected data for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, or resolve disputes.</p>

        <h2 className="text-xl font-semibold mt-6">6. Your Rights & Choices</h2>
        <h3 className="text-lg font-semibold mt-4">A. Opt-Out Options</h3>
        <ul className="list-disc list-inside mb-6">
          <li>You may opt out of marketing communications by following the &quot;unsubscribe&quot; link in our emails.</li>
          <li>If you do not want your anonymized data included in aggregated sales, you can contact us at [Insert Contact Email] to request exclusion.</li>
        </ul>
        
        <h3 className="text-lg font-semibold mt-4">B. Account Deletion</h3>
        <p className="mb-6">You can request account deletion at any time, and we will remove personally identifiable data, except where legally required to retain it.</p>

        <h2 className="text-xl font-semibold mt-6">7. Changes to This Policy</h2>
        <p className="mb-6">We may update this Privacy Policy periodically. The &quot;Effective Date&quot; will reflect the latest changes. Continued use of Inquiro signifies acceptance of these updates.</p>

        <h2 className="text-xl font-semibold mt-6">8. Contact Us</h2>
        <p className="mb-6">For questions regarding this Privacy Policy, please contact us at hello@inquiro.app.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
