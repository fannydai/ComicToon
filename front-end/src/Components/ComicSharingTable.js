import React, { Component } from 'react';

class ComicSharingTable extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const trs = this.props.usernames.map((username, i) => {
            return <tr key={i}><td>{username}</td></tr>
        });
        return (
            <table className="create-comic-sharing-table">
                <tbody>
                    {trs}
                </tbody>
            </table>
        );
    }
}

export default ComicSharingTable;