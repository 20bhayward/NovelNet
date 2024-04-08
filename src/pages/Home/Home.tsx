import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home: React.FC = () => {
  const [popularNovels, setPopularNovels] = useState([]);

  useEffect(() => {
    // Fetch popular novels from the API or MongoDB
    // and update the popularNovels state
    const fetchPopularNovels = async () => {
      // Replace this with your actual API call or MongoDB query
      const popularNovelsData:any = [
        { id: 1, title: 'Novel 1', description: 'Description for Novel 1' },
        { id: 2, title: 'Novel 2', description: 'Description for Novel 2' },
        { id: 3, title: 'Novel 3', description: 'Description for Novel 3' },
      ];
      setPopularNovels(popularNovelsData);
    };

    fetchPopularNovels();
  }, []);

  return (
    <Container>
      <Row className="justify-content-center my-5">
        <Col md={8}>
          <h1 className="text-center mb-4">Welcome to Lore Library</h1>
          <p className="text-center mb-5">Explore the most popular novels on our platform.</p>
          <Row>
            {popularNovels.map((novel:any) => (
              <Col md={4} key={novel.id}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>{novel.title}</Card.Title>
                    <Card.Text>{novel.description}</Card.Text>
                    <Button variant="primary">View Details</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;