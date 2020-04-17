/*
 * Convert the clients Set into array for JSON serialization
 * https://stackoverflow.com/questions/35440290/es6-set-does-not-serialize-to-array
 */

const toArray = Symbol('toArray')
Object.defineProperty(Set.prototype, toArray, {
    enumerable: false,
    value() {
        return [...this]
    },
})

module.exports = toArray
