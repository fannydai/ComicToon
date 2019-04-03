import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

import NavigationBar from './NavigationBar';
import './styles/ViewAllSeries.css';
import pusheen from './images/pusheen.png';

class ViewAllSeries extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.history.push('/view/series/1');
    }
    
    render() {
        return (
            <div className="view-series-container">
                <NavigationBar />
                <div className="view-series-top">
                    <h1>Your Series</h1>
                </div>
                <div className="view-series-bottom">
                    <Card className="view-series-card" onClick={this.handleClick}>
                        <Card.Img variant="top" src={pusheen} />
                        <Card.Body>
                            <Card.Title>Animals</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="view-series-card" onClick={this.handleClick}>
                        <Card.Img variant="top" src={pusheen} />
                        <Card.Body>
                            <Card.Title>Animals</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="view-series-card" onClick={this.handleClick}>
                        <Card.Img variant="top" src={pusheen} />
                        <Card.Body>
                            <Card.Title>Animals</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="view-series-card" onClick={this.handleClick}>
                        <Card.Img variant="top" src={pusheen} />
                        <Card.Body>
                            <Card.Title>Animals</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="view-series-card" onClick={this.handleClick}>
                        <Card.Img variant="top" src={pusheen} />
                        <Card.Body>
                            <Card.Title>Animals</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
}

export default ViewAllSeries;