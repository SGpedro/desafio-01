import { returnPathWithRegex } from "../routes/path-handler.js";

// Responsible for setting up req.body and req.id
export async function setReqAndRes(req, res, route){
    let chunks = [];
    for await (let chunk of req){
        chunks.push(chunk)
    }

    try{
        req.body = JSON.parse(Buffer.concat(chunks).toString())
    } catch{
        req.body = null
    }

    // Extract Id from the url
    const matchUrl = (req.url).match(returnPathWithRegex(route.path))
    if(matchUrl?.groups?.id) req.id = matchUrl?.groups?.id
    
    res.setHeader('Content-type', 'application/json')
}