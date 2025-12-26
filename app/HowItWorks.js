import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaMotorcycle,
  FaUtensils,
  FaCreditCard,
  FaSmile,
  FaCheckCircle,
} from "react-icons/fa";

export default function HowItWorks() {
  return (
    <section className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">How It Works</h2>
          <p className="lead text-muted">
            Simple steps to get your food delivered or book a bike ride
          </p>
        </div>

        <Tabs defaultActiveKey="food" className="mb-4 justify-content-center">
          <Tab eventKey="food" title="Food Delivery">
            <Row className="mt-4">
              <Col md={3} className="text-center mb-4">
                <div className="bg-white rounded-circle p-4 shadow-sm d-inline-block mb-3">
                  <FaMapMarkerAlt size={40} className="text-primary" />
                </div>
                <h4 className="fw-bold">1. Choose Location</h4>
                <p className="text-muted">
                  Enter your delivery address to find restaurants near you
                </p>
              </Col>

              <Col md={3} className="text-center mb-4">
                <div className="bg-white rounded-circle p-4 shadow-sm d-inline-block mb-3">
                  <FaUtensils size={40} className="text-success" />
                </div>
                <h4 className="fw-bold">2. Select Food</h4>
                <p className="text-muted">
                  Browse menus and add items to your cart
                </p>
              </Col>

              <Col md={3} className="text-center mb-4">
                <div className="bg-white rounded-circle p-4 shadow-sm d-inline-block mb-3">
                  <FaCreditCard size={40} className="text-warning" />
                </div>
                <h4 className="fw-bold">3. Make Payment</h4>
                <p className="text-muted">
                  Pay securely online or choose cash on delivery
                </p>
              </Col>

              <Col md={3} className="text-center mb-4">
                <div className="bg-white rounded-circle p-4 shadow-sm d-inline-block mb-3">
                  <FaSmile size={40} className="text-danger" />
                </div>
                <h4 className="fw-bold">4. Enjoy Food</h4>
                <p className="text-muted">
                  Track your order and enjoy delicious food at home
                </p>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="ride" title="Bike Taxi">
            <Row className="mt-4">
              <Col md={3} className="text-center mb-4">
                <div className="bg-white rounded-circle p-4 shadow-sm d-inline-block mb-3">
                  <FaMapMarkerAlt size={40} className="text-primary" />
                </div>
                <h4 className="fw-bold">1. Set Destination</h4>
                <p className="text-muted">
                  Enter your pickup and drop locations
                </p>
              </Col>

              <Col md={3} className="text-center mb-4">
                <div className="bg-white rounded-circle p-4 shadow-sm d-inline-block mb-3">
                  <FaMotorcycle size={40} className="text-warning" />
                </div>
                <h4 className="fw-bold">2. Choose Ride</h4>
                <p className="text-muted">
                  Select from available bike taxi partners
                </p>
              </Col>

              <Col md={3} className="text-center mb-4">
                <div className="bg-white rounded-circle p-4 shadow-sm d-inline-block mb-3">
                  <FaCheckCircle size={40} className="text-success" />
                </div>
                <h4 className="fw-bold">3. Confirm Ride</h4>
                <p className="text-muted">
                  Confirm your ride and track partner arrival
                </p>
              </Col>

              <Col md={3} className="text-center mb-4">
                <div className="bg-white rounded-circle p-4 shadow-sm d-inline-block mb-3">
                  <FaCreditCard size={40} className="text-info" />
                </div>
                <h4 className="fw-bold">4. Pay & Rate</h4>
                <p className="text-muted">
                  Pay securely and rate your experience
                </p>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Container>
    </section>
  );
}
