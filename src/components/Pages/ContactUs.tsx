'use client';
import Head from 'next/head';
import Message from '@/components/icons/message';
import { usePostContactMutation } from '@/redux/features/contactApi';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [postContact] = usePostContactMutation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const contactData = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      message: formData.message,
    };

    try {
    const res =  await postContact(contactData).unwrap();
  
    
    toast.success(res?.message || 'Message sent successfully!');
      setFormData({ name: '', email: '', phoneNumber: '', message: '' }); // Reset form
    } catch {
   
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Contact Us | SAR Digital</title>
        <meta name="description" content="Get in touch with SAR Digital" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Contact us
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Section - Email Info */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Have Questions? Reach Out to Us
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 border p-2 bg-[#F9EEE4]">
                    <Message />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-700">Send E-Mail</h3>
                    <a
                      href="mailto:info@sardigital.com"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      info@sardigital.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="w-full md:w-1/2 bg-[#FBF3ED] shadow rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-[#FB923C] mb-6">Get in touch</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write about your message"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-[#FB923C] text-white py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
