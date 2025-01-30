// src/Table.jsx
function TableHeader() {
    return (
        <thead>
            <tr>
                <th>Name</th>
                <th>Job</th>
                <th>Remove</th>
            </tr>
        </thead>
    );
}
function TableBody(props) {
    const rows = props.characterData.map((row) => {
        return (
            <tr key={row.id || Math.random()}>
                <td>{row.name}</td>
                <td>{row.job}</td>
                <td>
                    <button onClick={() => props.removeOneCharacter(row.id)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    }
    );
    return (
        <tbody>
            {rows}
        </tbody>
    );
}

//import React from "react";

function Table(props) {
    return (
        <table>
            <TableHeader />
            <TableBody
                characterData={props.characterData}
                removeOneCharacter={props.removeOneCharacter}
            />
        </table>
    );
}

export default Table;