import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

import './styles/ViewAllSeries.css';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import pusheen from './images/pusheen.png';

class ViewAllSeries extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentWillMount(){
        //todo
    }

    handleClick() {
        this.props.history.push('/view/series/1');
    }

    handleUpdate() {
        this.props.history.push('/update/series');
    }
    
    render() {
        return (
            <div className="view-series-container">
                <NavigationBar />
                <div className="view-series-top">
                    <h1>Your Series</h1>
                </div>
                <div className="view-series-bottom">
                    <Card className="view-series-card">
                        <Card.Img variant="top" src={pusheen} onClick={this.handleClick} />
                        <Card.Body>
                            <Card.Title>Animals</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                            <Card.Text><button className="btn-block" onClick={this.handleUpdate}>Update</button></Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="view-series-card">
                        <Card.Img variant="top" src={pusheen} onClick={this.handleClick} />
                        <Card.Body>
                            <Card.Title>Animals</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                            <Card.Text><button className="btn-block" onClick={this.handleUpdate}>Update</button></Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="view-series-card">
                        <Card.Img variant="top" src={pusheen} onClick={this.handleClick} />
                        <Card.Body>
                            <Card.Title>Animals</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                            <Card.Text><button className="btn-block" onClick={this.handleUpdate}>Update</button></Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="view-series-card">
                        <Card.Img variant="top" src={pusheen} onClick={this.handleClick} />
                        <Card.Body>
                            <Card.Title>Animals</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                            <Card.Text><button className="btn-block" onClick={this.handleUpdate}>Update</button></Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="view-series-card">
                        <Card.Img variant="top" src={pusheen} onClick={this.handleClick} />
                        <Card.Body>
                            <Card.Title>Animals</Card.Title>
                            <Card.Text>Artist: Pusheen</Card.Text>
                            <Card.Text><button className="btn-block" onClick={this.handleUpdate}>Update</button></Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }
}

export default ViewAllSeries;