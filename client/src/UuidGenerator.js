const uuid = require('uuid/v4')
const UuidEncoder = require('uuid-encoder')
const encoder = new UuidEncoder('base58')

class UuidGenerator {
    constructor(name) {
        this.name = name
    }

    /**
     * Generates a new uuid
     * @returns {uuid}
     */
    static generate() {
        return uuid()
    }

    /**
     * Converts uuid to s a short id (currently base58)
     * @param {string} uuidString
     * @returns {string}
     */
    static toShortId(uuidString) {
        if (!uuidString) throw Error('uuid parameter is required')

        return encoder.encode(uuidString)
    }

    /**
     * Converts shortId to uuid
     * @param shortId
     */
    static fromShortId(shortId) {
        if (!shortId) throw Error('uuid parameter is required')

        return encoder.decode(shortId)
    }
}

module.exports = UuidGenerator
