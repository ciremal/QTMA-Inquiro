import React from "react";

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-12 md:px-20 md:py-16 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl mb-4">Inquiro Terms of Service</h1>
        <p className="text-gray-600 mb-2">Effective Date: March 2, 2025</p>

        <p className="mb-6">
          Welcome to Inquiro! These Terms of Service ("Terms") constitute a legal agreement between you ("User") and Inquiro ("Company," "we," "our," or "us"). By accessing or using Inquiro’s services, you acknowledge and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
        </p>

        <h2 className="text-xl font-semibold mt-6">1. Nature of Our Services</h2>
        <p className="mb-4">
          Inquiro is an investment research tool designed to provide data, insights, and analysis to help users make informed financial decisions. Inquiro does not provide financial, investment, tax, legal, or other professional advice. The information presented through our services is for informational purposes only and should not be construed as a recommendation, endorsement, or offer to buy or sell securities, financial instruments, or investment strategies.
        </p>

        <h3 className="text-lg font-semibold mt-4">No Financial Liability</h3>
        <ul className="list-disc list-inside mb-6">
          <li>Inquiro is not a financial advisor, broker, or investment firm.</li>
          <li>Any investment decisions made based on Inquiro’s data or analysis are solely your responsibility.</li>
          <li>We do not guarantee the accuracy, reliability, or completeness of the information provided.</li>
          <li>Past performance of any investment or strategy does not guarantee future results.</li>
          <li>You assume full responsibility for your investment choices and acknowledge that investing involves risk, including the potential loss of principal.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">2. User Responsibilities</h2>
        <p className="mb-4">By using Inquiro, you agree that:</p>
        <ul className="list-disc list-inside mb-6">
          <li>You will not rely on Inquiro as your sole source of investment decision-making.</li>
          <li>You will independently verify any data or analysis before making investment decisions.</li>
          <li>You are solely responsible for compliance with applicable laws and regulations regarding your investment activities.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">3. No Warranty & Limitation of Liability</h2>
        <h3 className="text-lg font-semibold mt-4">No Warranties</h3>
        <p className="mb-4">
          Inquiro’s services are provided "as is" and "as available" without warranties of any kind, express or implied. We disclaim all warranties, including but not limited to:
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>The accuracy, reliability, or timeliness of our data and insights.</li>
          <li>The suitability of Inquiro’s information for any particular investment purpose.</li>
          <li>The availability and uninterrupted operation of our services.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">Limitation of Liability</h3>
        <p className="mb-6">
          To the maximum extent permitted by law:
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>Inquiro shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising from your use of our services.</li>
          <li>We are not responsible for any financial losses, trading losses, missed opportunities, or damages arising from reliance on our information.</li>
          <li>If you are dissatisfied with our services, your sole remedy is to discontinue use.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">4. Third-Party Content and Links</h2>
        <p className="mb-6">Inquiro may include links to third-party websites, content, or services. We do not endorse, control, or assume responsibility for any third-party content. Your use of third-party services is at your own risk.</p>

        <h2 className="text-xl font-semibold mt-6">5. Modifications to Services and Terms</h2>
        <p className="mb-6">We reserve the right to modify, suspend, or discontinue any part of our services at any time. We may also update these Terms, and your continued use of Inquiro signifies your acceptance of any changes.</p>

        <h2 className="text-xl font-semibold mt-6">6. Governing Law & Dispute Resolution</h2>
        <p className="mb-6">These Terms shall be governed by and construed in accordance with the laws of [Insert Jurisdiction]. Any disputes arising under these Terms shall be resolved through binding arbitration, and users waive any rights to class actions or jury trials.</p>

        <h2 className="text-xl font-semibold mt-6">7. Contact Information</h2>
        <p className="mb-6">For questions about these Terms, please contact us at [Insert Contact Email].</p>

        <p className="mt-6">
          By using Inquiro, you acknowledge that you have read, understood, and agree to these Terms. Inquiro is a research tool only and is not responsible for your investment decisions.
        </p>
      </div>
    </div>
  );
};

export default TermsOfServicePage;