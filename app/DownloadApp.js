import { Container, Row, Col, Button } from "react-bootstrap";
import { FaApple, FaGooglePlay, FaQrcode } from "react-icons/fa";

export default function DownloadApp() {
  return (
    <section className="py-5 bg-primary text-white">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-5 mb-lg-0">
            <h2 className="display-5 fw-bold mb-4">Download Our App Now!</h2>
            <p className="lead mb-4">
              Get the best experience with our mobile app. Order food, book bike
              taxis, track orders in real-time, and enjoy exclusive app-only
              offers.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <Button
                variant="dark"
                size="lg"
                className="d-flex align-items-center"
              >
                <FaApple className="me-2" size={24} />
                <div className="text-start">
                  <small>Download on the</small>
                  <div className="fw-bold">App Store</div>
                </div>
              </Button>

              <Button
                variant="light"
                size="lg"
                className="d-flex align-items-center text-dark"
              >
                <FaGooglePlay className="me-2" size={20} />
                <div className="text-start">
                  <small>Get it on</small>
                  <div className="fw-bold">Google Play</div>
                </div>
              </Button>
            </div>

            <div className="d-flex align-items-center">
              <FaQrcode size={40} className="me-3" />
              <div>
                <p className="mb-0 fw-medium">Scan QR Code to Download</p>
                <small className="opacity-75">
                  Point your camera at the QR code
                </small>
              </div>
            </div>
          </Col>

          <Col lg={6} className="text-center">
            <div className="position-relative">
              <div className="bg-white rounded-4 p-2 d-inline-block shadow-lg">
                <div
                  className="bg-light rounded-3 p-1"
                  style={{ width: "300px", height: "600px" }}
                >
                  {/* Mock phone screen */}
                  <div className="bg-primary rounded-top-3 p-3 text-white text-center">
                    <h5 className="mb-0">SwiftRideEats</h5>
                  </div>
                  <div className="p-3">
                    <div className="bg-white rounded shadow-sm p-4 mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="fw-bold">Food Delivery</span>
                        <span className="badge bg-success">Active</span>
                      </div>
                      <small className="text-muted">
                        Order from 1000+ restaurants
                      </small>
                    </div>
                    <div className="bg-white rounded shadow-sm p-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="fw-bold">Bike Taxi</span>
                        <span className="badge bg-warning">Nearby</span>
                      </div>
                      <small className="text-muted">5+ bikes available</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
