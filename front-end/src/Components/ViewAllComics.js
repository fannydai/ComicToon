import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

import NavigationBar from './NavigationBar';
import './styles/ViewAllComics.css';
import pusheen from './images/pusheen.png';

class ViewAllComics extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.history.push('/view/comic');
    }

    render() {
        return (
            <div className="view-comics-container">
                <NavigationBar />
                <div className="view-comics-top">
                    <h1>My Comics</h1>
                </div>
                <div className="view-comics-bottom">
                    <Card className="view-comics-card" onClick={this.handleClick}>
                        <Card.Img variant="top" src={pusheen} />
                        <Card.Body>
                            <Card.Title>Pusheen wants a cookie</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                            <Card.Text>Series: Animals</Card.Text>
                            <Card.Text>Rate: +200</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="view-comics-card" onClick={this.handleClick}>
                        <Card.Img variant="top" src={pusheen} />
                        <Card.Body>
                            <Card.Title>Pusheen wants a cookie</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                            <Card.Text>Series: Animals</Card.Text>
                            <Card.Text>Rate: +200</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="view-comics-card" onClick={this.handleClick}>
                        <Card.Img variant="top" src={pusheen} />
                        <Card.Body>
                            <Card.Title>Pusheen wants a cookie</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                            <Card.Text>Series: Animals</Card.Text>
                            <Card.Text>Rate: +200</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="view-comics-card" onClick={this.handleClick}>
                        <Card.Img variant="top" src={pusheen} />
                        <Card.Body>
                            <Card.Title>Pusheen wants a cookie</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                            <Card.Text>Series: Animals</Card.Text>
                            <Card.Text>Rate: +200</Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="view-comics-card" onClick={this.handleClick}>
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
        );
    }
}

export default ViewAllComics;