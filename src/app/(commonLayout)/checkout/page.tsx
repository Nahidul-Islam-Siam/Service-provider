'use client'
import { useState } from 'react';
import { Button, Card, Input, Select, Checkbox, Timeline, Typography } from 'antd';

import Edit from '@/components/icons/Edit';
import Pickup from '@/components/icons/Pickup';
import Ship from '@/components/icons/ship';
import Delivery from '@/components/icons/Delivery';

const { Title, Text } = Typography;

export default function CheckoutPage() {
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [savePaymentInfo, setSavePaymentInfo] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpirationDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 monts-font">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-[#2F394D] font-bold text-2xl sm:text-3xl">Checkout</h2>
          <Text className="text-[#572F22] text-sm sm:text-base font-normal">Review your shipment details and complete your payment</Text>
        </div>

        {/* Shipment Summary Card */}
        <Card className="relative border border-gray-200 shadow-md rounded-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-[#1F2937] text-base sm:text-xl font-semibold mb-4">Shipment Summary</h3>
            <button className="text-[#FA8800] flex gap-1 items-center">
              <Edit />
              Edit Details
            </button>
          </div>

          <div className="text-sm text-gray-700">
            <Timeline mode="left">
              <Timeline.Item color="orange">
                <div className="flex items-start space-x-3">
                  <div className='flex flex-col'>
                    <Text className="font-medium text-sm sm:text-base text-[#2F394D]">Brooklyn, New York</Text>
                    <Text className="font-normal text-sm sm:text-base text-[#6B7280]">Origin</Text>
                  </div>
                </div>
                <div className="text-right mt-2 flex flex-col">
                  <Text className="font-normal text-xs sm:text-sm text-[#6B7280]">Sender</Text>
                  <Text className="font-normal text-sm sm:text-base text-[#1F2937]">James Wilson</Text>
                  <Text className="font-normal text-xs sm:text-sm text-[#1F2937]">+1 (347) 555-1234</Text>
                </div>
              </Timeline.Item>

              <Timeline.Item color="green">
                <div className="flex items-start space-x-3">
                  <div className='flex flex-col'>
                    <Text className="font-medium text-sm sm:text-base text-[#2F394D]">Kingston, Jamaica</Text>
                    <Text className="font-normal text-sm sm:text-base text-[#6B7280]">Destination</Text>
                  </div>
                </div>
                <div className="text-right mt-2 flex flex-col">
                  <Text className="font-normal text-xs sm:text-sm text-[#6B7280]">Recipient</Text>
                  <Text className="font-normal text-sm sm:text-base text-[#1F2937]">Michelle Brown</Text>
                  <Text className="font-normal text-xs sm:text-sm text-[#1F2937]">+1 (347) 555-1234</Text>
                </div>
              </Timeline.Item>
            </Timeline>

            <div className="bg-[#FFEDC2] text-[#572F22] px-5 py-3 rounded-full sm:text-sm text-xs font-normal w-max">
              Barrel (Standard Size)
            </div>
          </div>

          {/* Service Providers */}
          <div className='mt-8 sm:mb-8 border-t'>
            <Text className="font-medium sm:text-base text-sm text-[#1F2937] mb-4">Selected Service Providers</Text>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-left flex flex-col items-center space-y-1">
                <div className="text-2xl mb-2 flex gap-1 items-center">
                  <Pickup />
                  <Text className="font-medium sm:text-base text-sm text-[#1F2937]">Pickup</Text>
                </div>
                <Text className="font-medium sm:text-sm text-xs text-[#1F2937]">Brooklyn Express</Text>
                <Text className="font-medium sm:text-sm text-xs text-[#6B7280] ">$35.00</Text>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-2xl mb-2 flex gap-1">
                  <Ship />
                  <Text className="font-medium sm:text-base text-sm text-[#1F2937]">Freight</Text>
                </div>
                <Text className="text-sm text-gray-600">Caribbean Shipping Co.</Text>
                <Text className="font-semibold text-gray-900">$120.00</Text>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-2xl mb-2 flex gap-1">
                  <Delivery />
                  <Text className="font-medium text-gray-900">Delivery</Text>
                </div>
                <Text className="text-sm text-gray-600">Island Delivery</Text>
                <Text className="font-semibold text-gray-900">$25.00</Text>
              </div>
            </div>
          </div>

          <div className='text-center'>
            <Text className="text-sm text-center text-gray-600">
              <span className="text-gray-500">Estimated delivery:</span> <span className="font-semibold text-gray-900">Oct 12 - Oct 16, 2023</span>
            </Text>
          </div>
        </Card>

        {/* Payment Information Card */}
        <Card className="bg-white border border-gray-200 shadow-sm mt-6">
          <div className="flex justify-between items-center">
            <Title level={4} className="text-lg font-medium text-gray-900">Payment Information</Title>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Text className="text-sm">Card Number</Text>
                <Input
                  value={paymentInfo.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="space-y-2">
                <Text className="text-sm">Billing Address</Text>
                <Input
                  value={paymentInfo.billingAddress}
                  onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                  placeholder="Street Address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Text className="text-sm">Expiration Date</Text>
                <Input
                  value={paymentInfo.expirationDate}
                  onChange={(e) => handleInputChange('expirationDate', formatExpirationDate(e.target.value))}
                  placeholder="MM/YY"
                />
              </div>
              <div className="space-y-2">
                <Text className="text-sm">Security Code</Text>
                <Input
                  value={paymentInfo.securityCode}
                  onChange={(e) => handleInputChange('securityCode', e.target.value.replace(/\D/g, ''))}
                  placeholder="CVV"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Text className="text-sm">Cardholder Name</Text>
              <Input
                value={paymentInfo.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                placeholder="Name as it appears on card"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Text className="text-sm">City</Text>
                <Input
                  value={paymentInfo.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Text className="text-sm">State</Text>
                <Input
                  value={paymentInfo.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Text className="text-sm">ZIP Code</Text>
                <Input
                  value={paymentInfo.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="ZIP Code"
                />
              </div>
              <div className="space-y-2">
                <Text className="text-sm">Country</Text>
                <Select value={paymentInfo.country} onChange={(value) => handleInputChange('country', value)}>
                  <Select.Option value="United States">United States</Select.Option>
                  <Select.Option value="Canada">Canada</Select.Option>
                  <Select.Option value="United Kingdom">United Kingdom</Select.Option>
                  <Select.Option value="Jamaica">Jamaica</Select.Option>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox checked={savePaymentInfo} onChange={(e) => setSavePaymentInfo(e.target.checked)} />
              <Text className="text-sm">Save payment information for future shipments</Text>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button className="px-8 py-2 bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200">Back</Button>
          <Button className="px-8 py-2 bg-orange-500 hover:bg-orange-600 text-white">Checkout</Button>
        </div>
      </div>
    </div>
  );
}
