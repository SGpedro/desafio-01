import http from "node:http";
import fs from "node:fs"
import { routes } from "./routes/routes.js";
import { returnPathWithRegex } from "./routes/path-handler.js";
import { setReqAndRes } from "./middleware/set_req_and_res.js";
import { parse } from "csv-parse"

const csvPath = new URL('../csv/tasks.csv', import.meta.url);

const server = http.createServer(async (req, res) => {
    const route = routes.find(route => {
        return req.method === route.method && (req.url).match(returnPathWithRegex(route.path))
    })
    
    if(route){
        let firstLineIgnored = false;
        // Update req.body (if needed) and req.id (if needed)
        await setReqAndRes(req, res, route);

        // check if .csv file in /csv folders exist
        if(fs.existsSync(csvPath) && req.method === 'POST'){
            req.body.tasks = []
            const parser = fs.createReadStream(csvPath).pipe(parse({}));
            for await (const record of parser){
                if(!firstLineIgnored) {
                    firstLineIgnored = true
                    continue;
                }
                (req.body.tasks).push(record);
            }
        }

        return route.handler(req, res);
    }

    return res.writeHead(404).end('Route not found');
})


server.listen(2424);