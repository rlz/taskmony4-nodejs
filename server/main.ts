import { AUTH_ENDPOINTS } from 'rlz-engine/dist/server/auth/auth'
import { AuthStorage } from 'rlz-engine/dist/server/auth/storage'
import { MongoStorage } from 'rlz-engine/dist/server/mongo/db'
import { runServer } from 'rlz-engine/dist/server/server'

const PRODUCTION = process.env.NODE_ENV === 'production'
const DOMAIN = 'app.taskmony.ru'
const CERT_DIR = './cert'

void runServer({
    production: PRODUCTION,
    domain: DOMAIN,
    certDir: CERT_DIR,
    staticDir: PRODUCTION ? './web' : './client-web/dist',
    init: async (server) => {
        const mongoStorage = new MongoStorage()

        const authStorage = new AuthStorage(mongoStorage)
        await authStorage.init()

        server.register(AUTH_ENDPOINTS, { storage: authStorage })

        server.get('/', async () => {
            return { hello: 'world' }
        })
    }
})
