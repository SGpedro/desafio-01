import { Database } from "../database/database.js"
import  { randomUUID }  from "node:crypto";
const database = new Database();

export const routes = [
    {
        method: "GET",
        path: "/tasks",
        handler: (req, res) => {
            const records = database.select('tasks');
            return res.end(JSON.stringify(records));
        }
    },
    {
        method: "POST",
        path: "/tasks",
        handler: async (req, res) => {
            if(Array.isArray(req.body.tasks)){
                for(const record of req.body.tasks){
                    const task = {
                        id: randomUUID(),
                        title: record[0],
                        description: record[1],
                        completed_at: null,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };
                    database.insert('tasks', task);
                }
            } else {
                const { title, description } = req.body
                const task = {
                    id: randomUUID(),
                    title,
                    description,
                    completed_at: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                database.insert('tasks', task);
            }

            return res.writeHeader(201).end()
        }
    },
    {
        method: "PUT",
        path: "/tasks/:id",
        handler: async (req, res) => {
            const id = req.id;
            const { description, title } =  req.body
            
            const response = database.update('tasks', {id, description, title});
            return res.writeHeader(response.code).end(JSON.stringify({message: response.message}))
        }
    },
    {
        method: "DELETE",
        path: "/tasks/:id",
        handler: (req, res) => {
            const response = database.delete('tasks', req.id);
            return res.writeHeader(response.code).end(JSON.stringify({message: response.message}))
        }
    },
    {
        method: "PATCH",
        path: "/tasks/:id/complete",
        handler: (req, res) => {
            const response = database.update('tasks', {id: req.id}, true);
            return res.writeHead(response.code).end(response.message)
        }
    }
]