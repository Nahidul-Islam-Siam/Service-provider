// pages/help-support.tsx
import Payment from '@/components/icons/payment';
import Rocket from '@/components/icons/rocket';
import Search from '@/components/icons/search';
import Ship from '@/components/icons/ship';
import Support from '@/components/icons/Support';
import Tracking from '@/components/icons/tracking';
import Zero from '@/components/icons/zero';
import Head from 'next/head';

export default function HelpSupport() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Help & Support | Shipping Service</title>
        <meta name="description" content="Get help and support for your shipping needs" />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Help & Support
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Find answers to your questions and get the support you need to ship with confidence.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto bg-white p-5 rounded-xl shadow-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help topics..."
              className="w-full px-6 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3   p-2 bg-[#FB923C] m-2 rounded-xl">
              <Search/>
            </div>
          </div>
        </div>

        {/* Support Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6"> 
            Support Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category 1 */}
            <div className="p-6 border-gray-100   rounded-[12px] border-0 bg-white shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex gap-3 items-center"> <Rocket/>  Getting Started</h3>
              <ul className="space-y-2">
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Creating an account</a></li>
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Your first shipment</a></li>
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Understanding our services</a></li>
              </ul>
            </div>

            {/* Category 2 */}
           <div className="p-6 border-gray-100   rounded-[12px] border-0 bg-white shadow-sm">
               <h3 className="text-lg font-medium text-gray-900 mb-3 flex gap-3 items-center"><Ship/> Creating Shipments</h3>
              <ul className="space-y-2">
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Selecting a provider</a></li>
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Package dimensions</a></li>
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Scheduling pickups</a></li>
              </ul>
            </div>

            {/* Category 3 */}
           <div className="p-6 border-gray-100   rounded-[12px] border-0 bg-white shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex gap-3 items-center"> <Tracking/> Tracking Shipments</h3>
              <ul className="space-y-2">
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Using tracking numbers</a></li>
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Status updates</a></li>
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Delivery notifications</a></li>
              </ul>
            </div>

            {/* Category 4 */}
          <div className="p-6 border-gray-100   rounded-[12px] border-0 bg-white shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex gap-3 items-center"> <Payment/> Payments and Billing</h3>
              <ul className="space-y-2">
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Payment methods</a></li>
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Invoices and receipts</a></li>
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Refund policy</a></li>
              </ul>
            </div>

            {/* Category 5 */}
          <div className="p-6 border-gray-100   rounded-[12px] border-0 bg-white shadow-sm">
               <h3 className="text-lg font-medium text-gray-900 mb-3 flex gap-3 items-center"><Zero/> Prohibited Items</h3>
              <ul className="space-y-2">
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Restricted goods list</a></li>
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Country-specific regulations</a></li>
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Customs guidelines</a></li>
              </ul>
            </div>

            {/* Category 6 */}
           <div className="p-6 border-gray-100   rounded-[12px] border-0 bg-white shadow-sm">
             <h3 className="text-lg font-medium text-gray-900 mb-3 flex gap-3 items-center"><Support/> Technical Support</h3>
              <ul className="space-y-2">
                <li className="text-gray-600 hover:text-blue-600"><a href="#">App troubleshooting</a></li>
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Account access</a></li>
                <li className="text-gray-600 hover:text-blue-600"><a href="#">Browser compatibility</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}