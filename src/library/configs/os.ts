import { join } from 'path'

function getOsEnv(key: string | number): string {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`Environment variable ${key} is not set.`)
    }

    return process.env[key] || ''
}

function getOsEnvOptional(key: string | number) {
    return process.env[key]
}

function getPath(path: string) {
    return process.env.NODE_ENV === 'production'
        ? join(process.cwd(), path?.replace('src/', 'dist/').slice(0, -3) + '.ts')
        : join(process.cwd(), path || '')
}

function getPaths(paths: string[]) {
    return paths.map((p: string) => getPath(p))
}

function getOsPath(key: string | number) {
    return getPath(getOsEnv(key) || '')
}

function getOsPaths(key: string) {
    return getPaths(getOsEnvArray(key))
}

function getOsEnvArray(key: string | number, delimiter = ',') {
    return (process.env[key] && process.env[key]?.split(delimiter)) || []
}

function toNumber(value: string) {
    return parseInt(value, 10)
}

function toBool(value: string) {
    return value === 'true'
}

function normalizePort(port: string) {
    const parsedPort = parseInt(port, 10)
    if (isNaN(parsedPort)) {
        // named pipe
        return port
    }
    if (parsedPort >= 0) {
        // port number
        return parsedPort
    }
    return false
}

export {
    getOsEnv,
    getOsEnvOptional,
    getPath,
    getPaths,
    getOsPath,
    getOsPaths,
    getOsEnvArray,
    toNumber,
    toBool,
    normalizePort,
}
