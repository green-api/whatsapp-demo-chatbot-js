const yaml = require('js-yaml');
const fs = require('fs');

function loadStringsYmlData() {
    try {
        const yamlFile = fs.readFileSync("strings.yml", 'utf8');
        return yaml.load(yamlFile);
    } catch (e) {
        console.log(e);
        return null;
    }
}

module.exports = { loadStringsYmlFile: loadStringsYmlData };