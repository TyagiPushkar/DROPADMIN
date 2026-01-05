import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <Container>
        <Row>
          <Col lg={4} className="mb-4">
            <h3 className="fw-bold mb-3">
              <span className="text-primary">Swift</span>
              <span className="text-warning">Ride</span>
              <span className="text-success">Eats</span>
            </h3>
            <p className="text-light mb-4">
              Your one-stop solution for food delivery and bike taxi services.
              Fast, reliable, and convenient services across the city.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white fs-5">
                <FaFacebook />
              </a>
              <a href="#" className="text-white fs-5">
                <FaTwitter />
              </a>
              <a href="#" className="text-white fs-5">
                <FaInstagram />
              </a>
              <a href="#" className="text-white fs-5">
                <FaLinkedin />
              </a>
              <a href="#" className="text-white fs-5">
                <FaYoutube />
              </a>
            </div>
          </Col>

          <Col lg={2} md={4} className="mb-4">
            <h5 className="fw-bold mb-3">Services</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a
                  href="/food-delivery"
                  className="text-light text-decoration-none"
                >
                  Food Delivery
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/bike-taxi"
                  className="text-light text-decoration-none"
                >
                  Bike Taxi
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/corporate"
                  className="text-light text-decoration-none"
                >
                  Corporate Services
                </a>
              </li>
              <li className="mb-2">
                <a href="/catering" className="text-light text-decoration-none">
                  Catering
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={2} md={4} className="mb-4">
            <h5 className="fw-bold mb-3">Company</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/about" className="text-light text-decoration-none">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="/careers" className="text-light text-decoration-none">
                  Careers
                </a>
              </li>
              <li className="mb-2">
                <a href="/partner" className="text-light text-decoration-none">
                  Become a Partner
                </a>
              </li>
              <li className="mb-2">
                <a href="/blog" className="text-light text-decoration-none">
                  Blog
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={4} md={4} className="mb-4">
            <h5 className="fw-bold mb-3">Contact Us</h5>
            <ul className="list-unstyled text-light">
              <li className="mb-3 d-flex align-items-start">
                <FaMapMarkerAlt className="me-2 mt-1" />
                <span>123 Street, City, Country</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhone className="me-2" />
                <span>+1 234 567 8900</span>
              </li>
              <li className="mb-4 d-flex align-items-center">
                <FaEnvelope className="me-2" />
                <span>support@swiftrideeats.com</span>
              </li>
            </ul>

            <Form className="mt-4">
              <Form.Label>Subscribe to our newsletter</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  className="me-2"
                />
                <Button variant="primary">Subscribe</Button>
              </div>
            </Form>
          </Col>
        </Row>

        <hr className="bg-light my-4" />

        <Row className="align-items-center">
          <Col md={6} className="mb-3 mb-md-0">
            <p className="mb-0">
              &copy; {currentYear} SwiftRideEats. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <a href="/privacy" className="text-light text-decoration-none me-3">
              Privacy Policy
            </a>
            <a href="/terms" className="text-light text-decoration-none me-3">
              Terms of Service
            </a>
            <a href="/cookies" className="text-light text-decoration-none">
              Cookie Policy
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
