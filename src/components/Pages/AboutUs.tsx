"use client";
import { Card, Row, Col } from "antd";
import Image from "next/image";
import BannerImg from "@/assets/about/Rectangle 3993.png";
import cardImg1 from "@/assets/about/image 1.png";
import cardImg2 from "@/assets/about/image 8.png";
import cardImg3 from "@/assets/about/image 9.png";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* About Us Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-16">About Us</h1>

        {/* Hero Image */}
        <div className="mb-6">
          <Image
            src={BannerImg}
            alt="Delivery person standing next to delivery van with 'DELIVERY ALWAYS ON TIME' text"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Description Text */}
        <div className="text-lg text-gray-700 leading-relaxed text-justify">
          <p>
            BarrelLink was built for the Caribbean diaspora—people who send not
            just goods, but love, tradition, and care in every barrel. We
            believe the process of sending a barrel should be just as meaningful
            as what&#39;s inside.
          </p>
          <br />
          <p>
            That&#39;s why we created the first mobile app that treats you—the
            sender—as central. With BarrelLink, you can compare verified
            providers, scan and log your items with barcodes, get real-time
            customs estimates, and track your shipment every step of the
            way—from pickup in the U.S. to final delivery in the Caribbean. No
            more phone tag, no more guesswork—just clarity, confidence, and
            convenience.
          </p>
          <br />
          <p>
            Founded by a team of Caribbean-connected veterans and business
            professionals, BarrelLink blends deep cultural understanding with
            modern logistics and technology. Our platform is powered by smart
            automation, secure payments, and real-time tracking—designed to
            simplify a process that&#39;s long overdue for change.
          </p>
          <br />
          <p>
            One Platform. Every Connection. All the Way Home.
            <br />
            That&#39;s BarrelLink.
          </p>
        </div>
      </div>

      {/* Meet Our Team Section */}
      <div className="mt-16 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 text-start mb-12">
          Meet Our Team
        </h2>

        <Row gutter={24}>
          {/* Alexander Eadie */}
          <Col className="w-full sm:w-full md:w-1/3 mb-6" key="1">
            <Card
              hoverable
              cover={
                <Image
                  src={cardImg1}
                  alt="Alexander Eadie"
                  width={250}
                  height={300}
                  className="w-full h-auto rounded-lg p-2"
                />
              }
            >
              <Card.Meta
                title={
                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                    Alexander Eadie
                  </span>
                }
                description={
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl text-[#FE5B3B]">
                    CEO
                  </span>
                }
              />
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mt-2">
                Lorem ipsum dolor sit amet consectetur. Sit amet mauris felis est
                rhoncus bibendum. Ipsum mauris elit consectetur.
              </p>
            </Card>
          </Col>

          {/* Steven Glazer */}
          <Col className="w-full sm:w-full md:w-1/3 mb-6" key="2">
            <Card
              hoverable
              cover={
                <Image
                  src={cardImg2}
                  alt="Steven Glazer"
                  width={250}
                  height={300}
                  className="w-full h-auto rounded-lg p-2"
                />
              }
            >
              <Card.Meta
                title={
                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                    Steven Glazer
                  </span>
                }
                description={
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl text-[#FE5B3B]">
                    CSO
                  </span>
                }
              />
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mt-2">
                Lorem ipsum dolor sit amet consectetur. Sit amet mauris felis est
                rhoncus bibendum. Ipsum mauris elit consectetur.
              </p>
            </Card>
          </Col>

          {/* Peter Lee */}
          <Col className="w-full sm:w-full md:w-1/3 mb-6" key="3">
            <Card
              hoverable
              cover={
                <Image
                  src={cardImg3}
                  alt="Peter Lee"
                  width={250}
                  height={300}
                  className="w-full h-auto rounded-lg p-2"
                />
              }
            >
              <Card.Meta
                title={
                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                    Peter Lee
                  </span>
                }
                description={
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl text-[#FE5B3B]">
                    CFO
                  </span>
                }
              />
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mt-2">
                Lorem ipsum dolor sit amet consectetur. Sit amet mauris felis est
                rhoncus bibendum. Ipsum mauris elit consectetur.
              </p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
