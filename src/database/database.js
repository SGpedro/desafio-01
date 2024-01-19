import fs from "fs/promises"

const databasePath = new URL('../db.json', import.meta.url)


export class Database{
    #database = {}

    constructor(){
        fs.readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data);
        }).catch(() => {
            this.#persist()
        })
    }

    async #persist(){
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table){
        return this.#database[table];
    }

    insert(table, data){
        if(Array.isArray(this.#database[table])) this.#database[table].push(data)
        else this.#database[table] = [data];
        this.#persist();
    }

    update(table, data, completed = false){
        const { id, description, title } = data;

        if(!id){
            return {
                code: 400,
                message: "Id is mandatory"
            }
        }

        const indexOfId = this.#database[table].findIndex(task => {
            return id == task.id
        });

        if(indexOfId > -1){
            const originalData = this.#database[table][indexOfId];
            this.#database[table][indexOfId] = {
                id,
                title: title ? title : originalData.title,
                description: description ? description : originalData.description,
                completed_at: completed ? new Date().toISOString() : originalData.completed_at,
                created_at: originalData.created_at,
                updated_at: new Date().toISOString()
            }
            this.#persist();
            return {
                code: 201,
                message: `${id} updated`
            }
        } else{
            return {
                code: 404,
                message: "Entry not found"
            }
        }
    }

    delete(table, id){
        if(!id){
            return {
                code: 400,
                message: "Id is mandatory"
            }
        }

        const indexOfId = this.#database[table].findIndex(task => {
            return id == task.id
        });

        if(indexOfId > -1){
            this.#database[table].splice(indexOfId,1);
            this.#persist()

            return {
                code: 204
            }
        } else {
            return {
                code: 404,
                message: 'Entry not found'
            }
        }
    }
}