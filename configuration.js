const fs = require('fs')
const path = require('path')

let configurations = {
    getAll (configFileFullName) {
        console.log(configFileFullName)
        // if it was already loaded, then return it from memory
        if (global.configFileFullName){
            return global.configFileFullName
        }

        // if not, read the YML file and return it from there
        let configFileStream = fs.readFileSync(configFileFullName, 'utf8')
        // try loading and parsing config file
        try {
            const yaml = require('js-yaml')
            let config = yaml.safeLoad(configFileStream)

            global.configFileFullName = config
            return global.configFileFullName
        } catch (error) {
            console.error(JSON.stringify(error))
            throw 'Failed to load configuration file'
        }
    },
}

module.exports = configurations
