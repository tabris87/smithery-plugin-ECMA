module.exports = {
    rules: require('./lib/rules'),
    parser: {
        fileEnding: "js",
        parser: require('./lib/parser')
    },
    generator: {
        fileEnding: "js",
        generator: require('./lib/generator')
    }
}