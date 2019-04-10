import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './styles/ViewSeries.css';
import pusheen from './images/pusheen.png';

class ViewSeries extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comicData: [],
            panels: []
        }
    }

    componentDidMount() {
        (async () => {
            const res = await fetch('http://localhost:8080/view/comic-series', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    comicSeriesName: this.props.match.params.seriesName,
                    ownerName: this.props.match.params.username
                })
            });
            let content = await res.json();
            console.log(content);
            if (!content.result === 'success') {
                alert('Could not find series.'); // No comic/no permission
            } else {
                this.setState({ comicData: content.comics });
                for (const comic of content.comics) {
                    // Get the panel for each comic in the series
                    const pan = await fetch('http://localhost:8080/view/panel', {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            id: comic.panelsList[0]
                        })
                    });
                    console.log('PANEL', pan);
                    if (pan.panel) {
                        this.setState({ panels: [...this.state.panels, pan.panel] });
                    }
                }
            }
        })();
    }

    handleClick = (event) => {
        this.props.history.push('/view/comic');
    }

    handleUpdate = (event) => {
        if (this.state.comicData.id) {
            this.props.history.push(`/update/comic/${this.state.comicData.username}/${this.state.comicData.name}`);
        }
    }

    render() {
        const cards = this.state.comicData ? this.state.comicData.map((comic, i) => {
            return (
                <Card key={i} className="view-one-series-card">
                    <Card.Img variant="top" src={this.state.panels[i]} onClick={this.handleClick} />
                    <Card.Body>
                        <Card.Title>{comic.name}</Card.Title>
                        <Card.Text>Artist: {comic.username}</Card.Text>
                        <Card.Text>Series: {this.props.match.params.seriesName}</Card.Text>
                        <Card.Text>Rate: +200</Card.Text>
                        <Card.Text><button className="btn-block" onClick={this.handleUpdate}>Update</button></Card.Text>
                    </Card.Body>
                </Card>
            );
        }) : null;
        return (
            <div className="view-one-series-container">
                <NavigationBar />
                <div className="view-one-series-heading">
                    <h1>{this.props.match.params.seriesName}</h1>
                    <h2>By: {this.props.match.params.username}</h2>
                </div>
                <div className="view-one-series-bottom">
                    <div className="view-one-series-comics">
                        {cards}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default ViewSeries;