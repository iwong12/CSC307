// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters = [], setCharacters] = useState([]);

    function removeOneCharacter(id) {
        delUser(id)
            .then((res) => {
                if (res.status === 204) {
                    setCharacters(characters.filter((character) => character._id !== id));
                } else {
                    throw new Error("Failed to delete user");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function delUser(id) {
        const promise = fetch(`http://localhost:8000/users/${id}`, {
            method: "DELETE",
        });
        return promise;
    }


    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(person)
        });

        return promise;
    }

    function updateList(person) {
        postUser(person)
            .then((res) => {
                if (res.status === 201) {
                    return res.json();
                } else {
                    throw new Error("Failed to add user");
                }
            })
            .then((person) => {
                console.log(person);
                setCharacters([...characters, person]);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                setCharacters(json.map(user => ({ ...user, id: user._id })) || []);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="container">
            <Table
                characterData={characters}
                removeOneCharacter={removeOneCharacter}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp;