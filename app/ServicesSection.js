import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaBiking,
  FaClock,
  FaShieldAlt,
  FaPercent,
  FaStar,
  FaHeadset,
} from "react-icons/fa";

export default function ServicesSection() {
  const services = [
    {
      icon: <FaBiking size={40} />,
      title: "Fast Bike Taxi",
      description:
        "Get instant bike taxi rides across the city at affordable rates",
      color: "warning",
      link: "/bike-taxi",
    },
    {
      icon: <FaClock size={40} />,
      title: "Quick Food Delivery",
      description: "Food delivered to your doorstep in 30 minutes or less",
      color: "success",
      link: "/food-delivery",
    },
    {
      icon: <FaShieldAlt size={40} />,
      title: "Safe & Secure",
      description: "Verified partners, live tracking, and SOS features",
      color: "primary",
      link: "/safety",
    },
    {
      icon: <FaPercent size={40} />,
      title: "Best Offers",
      description: "Daily discounts and cashback on rides and food orders",
      color: "danger",
      link: "/offers",
    },
    {
      icon: <FaStar size={40} />,
      title: "Premium Service",
      description: "Top-rated restaurants and premium bike taxi partners",
      color: "info",
      link: "/premium",
    },
    {
      icon: <FaHeadset size={40} />,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all services",
      color: "secondary",
      link: "/support",
    },
  ];

  return (
    <section className="py-5 bg-white">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">Why Choose Us?</h2>
          <p className="lead text-muted">
            We provide the best services for both food delivery and bike taxi
            rides
          </p>
        </div>

        <Row>
          {services.map((service, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                <Card.Body className="text-center p-4">
                  <div className={`text-${service.color} mb-3`}>
                    {service.icon}
                  </div>
                  <Card.Title className="fw-bold mb-3">
                    {service.title}
                  </Card.Title>
                  <Card.Text className="text-muted">
                    {service.description}
                  </Card.Text>
                  <a
                    href={service.link}
                    className={`text-${service.color} fw-medium text-decoration-none`}
                  >
                    Learn more →
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
