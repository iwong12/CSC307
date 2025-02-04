// backend.js
import express from "express";
import cors from "cors";
import * as services from './services/user-service.js';
import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
    .connect(MONGO_CONNECTION_STRING + "users", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
      })
    .then(() => console.log("Connected to db"))
    .catch((error) => console.log(error));

const app = express();
const port = 8000;


const findUserByName = (name) => {
    return services.default.findUserByName(name);
};

const findUserByJob = (job) => {
    return services.default.findUserByJob(job);
};

const findUserById = (id) => {
    return services.default.findUserById(id);
}

const findUserByNameAndJob = (name, job) => {
    return services.default.getUsers(name, job);
};

const addUser = (user) => {
    return services.default.addUser(user);
};

const id_gen = () => {
    const new_id = Math.floor(Math.random() * 10000);
    return new_id.toString();
};

const delUserById = (id) => {
    return services.default.delUserById(id);
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    let promise;
    if (name && !job) {
        promise = findUserByName(name);
    } else if (job && !name) {
        promise = findUserByJob(job);
    } else {
        promise = findUserByNameAndJob(name, job);
    }

    promise.then((result) => {
        if (result) {
            res.send(result);
        } else {
            res.status(404).send('Not found : ${name}');
        }
    })
    .catch((error) => {
        res.status(500).send(error.name);
    });
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"];  // or req.params.id
    findUserById(id)
        .then((result) => {
            if (result) {
                res.send(result);
            } else {
                res.status(404).send('Not found : ${id}');
            }
        })
        .catch((error) => {
            res.status(500).send(error.name);
        });
});

app.post("/users", (req, res) => {
    const userToAdd = {
        id: id_gen(),
        ...req.body
    };
    addUser(userToAdd)
        .then((result) => {
            if (result) {
                res.status(201).send(userToAdd);
            } else {
                res.status(400).send('Error adding user');
            }
        })
        .catch((error) => {
            res.status(500).send(error.name);
        });
});

app.delete('/users/:id', (req, res) => {
    const userId = req.params.id; // Convert ID to number if needed
    //const userIndex = users["users_list"].findIndex(user => user.id === userId);

    //if (userIndex !== -1) {
    //    users["users_list"].splice(userIndex, 1); // Remove user
    //    res.status(204).send();
    //} else {
    //    res.status(404).send();
    //}

    delUserById(id)
        .then((result) => {
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).send('User not found : ${id}');
            }
        })
        .catch((error) => {
            res.status(500).send(error.name);
        });
});



app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});