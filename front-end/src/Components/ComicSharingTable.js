import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';

class ComicSharingTable extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const trs = this.props.usernames.map((username, i) => {
            return <tr key={i}><td>{username}</td><td><Button className="btn-danger" onClick={(e) => this.props.handleDeleteShare(i, e)}>Delete</Button></td></tr>
        });
        return (
            <Table bordered hover className="create-comic-sharing-table">
                <tbody>
                    {trs}
                </tbody>
            </Table>
        );
    }
}

export default ComicSharingTable;