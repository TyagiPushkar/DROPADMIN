"use client";

import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  FaMotorcycle,
  FaUtensils,
  FaSearch,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function HeroSection() {
  const [key, setKey] = useState("food");

  return (
    <section className="hero-section bg-light py-5">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-5 mb-lg-0">
            <h1 className="display-4 fw-bold mb-4">
              Get <span style={{ color: "#A1D9F1" }}>Food Delivered</span> or
              <span className="text-warning"> Ride Instantly</span>
            </h1>
            <p className="lead mb-4">
              DROP delivers happiness - Order food from your favorite
              restaurants or book a quick bike taxi ride across the city. Fast,
              reliable, and affordable.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <Button
                variant="primary"
                size="lg"
                className="d-flex align-items-center"
                style={{ backgroundColor: "#A1D9F1", borderColor: "#A1D9F1" }}
              >
                <FaUtensils className="me-2" />
                Order Food
              </Button>
              <Button
                variant="warning"
                size="lg"
                className="d-flex align-items-center"
              >
                <FaMotorcycle className="me-2" />
                Book Bike Taxi
              </Button>
            </div>

            <div className="d-flex">
              <div className="me-4">
                <h3 className="fw-bold" style={{ color: "#A1D9F1" }}>
                  10K+
                </h3>
                <p className="text-muted">Restaurants</p>
              </div>
              <div className="me-4">
                <h3 className="fw-bold text-warning">5K+</h3>
                <p className="text-muted">Bike Partners</p>
              </div>
              <div>
                <h3 className="fw-bold text-success">1M+</h3>
                <p className="text-muted">Happy Customers</p>
              </div>
            </div>
          </Col>

          <Col lg={6}>
            <div className="bg-white rounded-4 shadow-lg p-4">
              <Tabs
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-4"
                fill
              >
                <Tab
                  eventKey="food"
                  title={
                    <span className="d-flex align-items-center">
                      <FaUtensils className="me-2" />
                      Food Delivery
                    </span>
                  }
                >
                  <div className="p-3">
                    <h4 className="mb-3">Craving something delicious?</h4>
                    <Form>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>
                          <FaMapMarkerAlt />
                        </InputGroup.Text>
                        <Form.Control
                          placeholder="Enter delivery address"
                          aria-label="Delivery address"
                        />
                        <Button
                          variant="primary"
                          style={{
                            backgroundColor: "#A1D9F1",
                            borderColor: "#A1D9F1",
                          }}
                        >
                          <FaSearch />
                        </Button>
                      </InputGroup>
                      <Button variant="success" className="w-100">
                        Find Restaurants Nearby
                      </Button>
                    </Form>
                  </div>
                </Tab>

                <Tab
                  eventKey="ride"
                  title={
                    <span className="d-flex align-items-center">
                      <FaMotorcycle className="me-2" />
                      Bike Taxi
                    </span>
                  }
                >
                  <div className="p-3">
                    <h4 className="mb-3">Need a quick ride?</h4>
                    <Form>
                      <div className="mb-3">
                        <Form.Label>Pickup Location</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FaMapMarkerAlt />
                          </InputGroup.Text>
                          <Form.Control placeholder="Enter pickup location" />
                        </InputGroup>
                      </div>
                      <div className="mb-3">
                        <Form.Label>Drop Location</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FaMapMarkerAlt />
                          </InputGroup.Text>
                          <Form.Control placeholder="Enter destination" />
                        </InputGroup>
                      </div>
                      <Button variant="warning" className="w-100">
                        Find Available Rides
                      </Button>
                    </Form>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
