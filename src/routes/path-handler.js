export function returnPathWithRegex(path){
    const regex = /:[0-9a-zA-Z]+/g;
    return new RegExp(path.replaceAll(regex, '(?<id>[0-9a-zA-Z-]+)'))
}