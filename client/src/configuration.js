const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')
const configFileFullName = path.join(__dirname, '../config.yml')

const configurations = {
    getAll() {
        // If it was already loaded, then return it from memory
        if (global.configFileFullName) {
            return global.configFileFullName
        }

        // If not, read the YML file and return it from there
        const configFileStream = fs.readFileSync(configFileFullName, 'utf8')
        // Try loading and parsing config file
        try {
            const config = yaml.safeLoad(configFileStream)
            global.configFileFullName = config
            return global.configFileFullName
        } catch (error) {
            console.error(
                `Failed to load configuration file.${JSON.stringify(error)}`
            )
            throw error
        }
    },

    saveAll(configObj) {
        try {
            const yamlStr = yaml.safeDump(configObj)
            fs.writeFileSync(configFileFullName, yamlStr, 'utf8')
            return true
        } catch (error) {
            console.error(
                `Failed to write configuration file.${JSON.stringify(error)}`
            )
            throw error
        }
    },
}
module.exports = configurations
