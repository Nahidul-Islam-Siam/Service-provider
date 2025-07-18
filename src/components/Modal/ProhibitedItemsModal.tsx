"use client";

import React, { useState } from 'react';
import { Modal, Button, Checkbox } from 'antd';

interface ProhibitedItemsModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ProhibitedItemsModal: React.FC<ProhibitedItemsModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button
          key="submit"
          type="primary"
          className="w-full bg-[#FA8800] text-white font-semibold"
          onClick={onConfirm}
          disabled={!agreed}
        >
          Continue to Next Step
        </Button>,
      ]}
      centered
      bodyStyle={{
        padding: '1rem',
        maxHeight: '70vh',
        overflowY: 'auto',
      }}
    >
      <div className="text-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-red-600">
          Prohibited Items for Shipping
        </h2>
        <p className="text-sm md:text-base mt-2 text-gray-700">
          Prohibited items cannot be shipped with our services. Please verify that your shipment does not contain any of these items:
        </p>
      </div>

      <ul className="list-disc pl-6 text-sm md:text-base text-gray-800 space-y-1">
        <li>Hazardous materials</li>
        <li>Firearms and ammunition</li>
        <li>Perishable goods</li>
        <li>Live animals</li>
        <li>Illegal substances</li>
        <li>Cash or valuables</li>
      </ul>

      <div className="mt-4">
        <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)}>
          I agree not to ship prohibited items.
        </Checkbox>
      </div>
    </Modal>
  );
};

export default ProhibitedItemsModal;
