import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

import NavigationBar from './NavigationBar';
import './styles/ViewSeries.css';
import pusheen from './images/pusheen.png';

class ViewSeries extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.history.push('/view/comic');
    }

    render() {
        return (
            <div className="view-one-series-container">
                <NavigationBar />
                <div className="view-one-series-bottom">
                    <div className="view-one-series-heading">
                        <h1>Animals</h1>
                        <h2>By: Pusheen</h2>
                    </div>
                    <div className="view-one-series-comics">
                        <Card className="view-one-series-card" onClick={this.handleClick}>
                            <Card.Img variant="top" src={pusheen} />
                            <Card.Body>
                                <Card.Title>Pusheen wants a cookie</Card.Title>
                                <Card.Text>Artist: Pusheen</Card.Text>
                                <Card.Text>Series: Animals</Card.Text>
                                <Card.Text>Rate: +200</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card className="view-one-series-card" onClick={this.handleClick}>
                            <Card.Img variant="top" src={pusheen} />
                            <Card.Body>
                                <Card.Title>Pusheen wants a cookie</Card.Title>
                                <Card.Text>Artist: Pusheen</Card.Text>
                                <Card.Text>Series: Animals</Card.Text>
                                <Card.Text>Rate: +200</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card className="view-one-series-card" onClick={this.handleClick}>
                            <Card.Img variant="top" src={pusheen} />
                            <Card.Body>
                                <Card.Title>Pusheen wants a cookie</Card.Title>
                                <Card.Text>Artist: Pusheen</Card.Text>
                                <Card.Text>Series: Animals</Card.Text>
                                <Card.Text>Rate: +200</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card className="view-one-series-card" onClick={this.handleClick}>
                            <Card.Img variant="top" src={pusheen} />
                            <Card.Body>
                                <Card.Title>Pusheen wants a cookie</Card.Title>
                                <Card.Text>Artist: Pusheen</Card.Text>
                                <Card.Text>Series: Animals</Card.Text>
                                <Card.Text>Rate: +200</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card className="view-one-series-card" onClick={this.handleClick}>
                            <Card.Img variant="top" src={pusheen} />
                            <Card.Body>
                                <Card.Title>Pusheen wants a cookie</Card.Title>
                                <Card.Text>Artist: Pusheen</Card.Text>
                                <Card.Text>Series: Animals</Card.Text>
                                <Card.Text>Rate: +200</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewSeries;