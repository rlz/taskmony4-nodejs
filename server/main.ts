import { AUTH_API } from 'rlz-engine/dist/back/auth/controllers'
import { AuthStorage } from 'rlz-engine/dist/back/auth/storage'
import { logger } from 'rlz-engine/dist/back/logger'
import { runServer } from 'rlz-engine/dist/back/server'
import { MongoStorage } from 'rlz-engine/dist/back/storage/db'

import { TASKS_API } from './tasks/controllers'
import { TasksStorage } from './tasks/storage'

const PRODUCTION = process.env.NODE_ENV === 'production'
const DOMAIN = 'app.taskmony.ru'
const CERT_DIR = './cert'

const L = logger('init')

L.info('About to run server')

runServer({
    production: PRODUCTION,
    domain: DOMAIN,
    certDir: CERT_DIR,
    staticDir: PRODUCTION ? './web' : './client-web/dist',
    init: async (server) => {
        const mongoStorage = new MongoStorage()

        const authStorage = new AuthStorage(mongoStorage)
        await authStorage.init()

        const tasksStorage = new TasksStorage(mongoStorage)
        await tasksStorage.init()

        server.register(AUTH_API, { storage: authStorage })
        server.register(TASKS_API, { storage: tasksStorage, auth: authStorage.auth })
    }
})
    .catch((e) => {
        L.error('Error run server', { error: e })
    })
    .finally(() => {
        L.info('Runned')
    })
