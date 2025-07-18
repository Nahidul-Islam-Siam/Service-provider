
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useRef } from "react";
import {
  Input,
  Select,
  DatePicker,
  Button,
  Form,
} from "antd";
import { useRouter } from "next/navigation";

// ✅ Correct mapbox-gl import with type casting
import mapboxgl from "mapbox-gl";


import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import dayjs from "dayjs";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZHNpbmhhLWFsdGlvcmEiLCJhIjoiY21jbWY3c2k2MGpjNDJrcjB2YXJhMDFwOSJ9.AJqhwJ-GRx-KcO53_np44w";

const { Option } = Select;

interface FormValues {
  pickupLocation: string;
  destination: string;
  pickupDate?: dayjs.Dayjs;
  itemType: string;
  barrelSize?: string;
  dimensions?: string;
  weight?: number;
}

interface MapboxGeocoderInputProps {
  placeholder: string;
  value?: string;
  onChange: (val: string) => void;
  id: string;
}

const MapboxGeocoderInput: React.FC<MapboxGeocoderInputProps> = ({
  placeholder,
  value,
  onChange,
  id,
}) => {
  const geocoderRef = useRef<HTMLDivElement>(null);
  const geocoderInstanceRef = useRef<MapboxGeocoder | null>(null);

  useEffect(() => {
    if (!geocoderRef.current) return;

    geocoderRef.current.innerHTML = "";

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken || "",
      placeholder,
      marker: false,
      mapboxgl: mapboxgl as any, // ✅ Correct type now
    });

    geocoder.addTo(`#${id}`);
    const handleResult = (e: any) => {
      const place = e.result.place_name;
      onChange(place);
    };
    geocoder.on("result", handleResult);

    geocoderInstanceRef.current = geocoder;

    return () => {
      if (geocoderInstanceRef.current) {
        geocoderInstanceRef.current.off("result", handleResult);
        geocoderInstanceRef.current.clear();
      }
      if (geocoderRef.current) {
        geocoderRef.current.innerHTML = "";
      }
    };
  }, [placeholder, onChange, id]);

  return (
    <div className="relative">
      <div
        id={id}
        ref={geocoderRef}
        className="ant-input px-3 py-[5px] flex items-center rounded-md border border-[#d9d9d9] hover:border-[#4096ff] focus-within:!border-[#4096ff] shadow-sm"
      />
      {value && (
        <div className="mt-1 text-xs text-gray-600">
          Selected: <strong>{value}</strong>
        </div>
      )}
    </div>
  );
};

const HeroForm = () => {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();

  const handleSubmit = (values: FormValues) => {
    const formattedData = {
      pickupLocation: values.pickupLocation,
      destination: values.destination,
      pickupDate: values.pickupDate?.format("YYYY-MM-DD") || "",
      itemType: values.itemType,
      barrelSize: values.barrelSize,
      dimensions: values.dimensions,
      weight: values.weight?.toString(),
    };

    const params = new URLSearchParams();
    for (const key in formattedData) {
      const val = formattedData[key as keyof typeof formattedData];
      if (val) {
        params.append(key, val);
      }
    }

    router.push(`/shipping-providers?${params.toString()}`);
  };

  return (
    <div className="lg:w-1/2 w-full max-w-2xl">
      <div className="bg-white px-4 py-2 md:px-4 md:py-4 rounded-xl shadow-lg">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Origin */}
          <Form.Item
            label="Origin"
            name="pickupLocation"
            rules={[{ required: true, message: "Please enter origin" }]}
            style={{ marginBottom: 32 }}
          >
            <MapboxGeocoderInput
              id="geocoder-origin"
              placeholder="Enter pickup location"
              value={form.getFieldValue("pickupLocation")}
              onChange={(val) => form.setFieldsValue({ pickupLocation: val })}
            />
          </Form.Item>

          {/* Destination */}
          <Form.Item
            label="Destination"
            name="destination"
            rules={[{ required: true, message: "Please enter destination" }]}
            style={{ marginBottom: 32 }}
          >
            <MapboxGeocoderInput
              id="geocoder-destination"
              placeholder="Enter destination location"
              value={form.getFieldValue("destination")}
              onChange={(val) => form.setFieldsValue({ destination: val })}
            />
          </Form.Item>

          {/* Pickup Date */}
          <Form.Item
            label="Pick-up Date"
            name="pickupDate"
            rules={[{ required: true, message: "Please select pick-up date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* Item Type */}
          <Form.Item
            label="Item Type"
            name="itemType"
            rules={[{ required: true, message: "Please select item type" }]}
          >
            <Select placeholder="What are you shipping?">
              <Option value="Barrel">Barrel</Option>
              <Option value="Furniture">Furniture</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          {/* Conditional Fields */}
          <Form.Item shouldUpdate={(prev, curr) => prev.itemType !== curr.itemType}>
            {({ getFieldValue }) => {
              const itemType = getFieldValue("itemType");

              if (itemType === "Barrel") {
                return (
                  <Form.Item
                    name="barrelSize"
                    label="Barrel Size"
                    rules={[{ required: true, message: "Select barrel size" }]}
                  >
                    <Select placeholder="Select barrel size">
                      <Option value="15">15 Gallon</Option>
                      <Option value="55">55 Gallon</Option>
                      <Option value="75">75 Gallon</Option>
                    </Select>
                  </Form.Item>
                );
              }

              if (itemType === "Furniture" || itemType === "Other") {
                return (
                  <>
                    <Form.Item
                      name="dimensions"
                      label="Dimensions (L x W x H)"
                      rules={[{ required: true, message: "Enter dimensions" }]}
                    >
                      <Input placeholder="e.g. 40x30x20" />
                    </Form.Item>
                    <Form.Item
                      name="weight"
                      label="Weight (kg)"
                      rules={[{ required: true, message: "Enter weight" }]}
                    >
                      <Input type="number" placeholder="e.g. 25" />
                    </Form.Item>
                  </>
                );
              }

              return null;
            }}
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                backgroundColor: "#FA8800",
                borderColor: "#FA8800",
              }}
              className="hover:!bg-[#cc6e00] py-5 px-4 text-white font-semibold rounded-md transition duration-300"
            >
              Search Shipping Providers
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default HeroForm;
