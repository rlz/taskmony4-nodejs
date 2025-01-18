import { mkdir } from 'fs/promises'
import { DateTime } from 'luxon'
import { NodeSSH } from 'node-ssh'

const SSH = new NodeSSH()

console.log('Connecting...')
await SSH.connect({
    host: '195.133.48.181',
    username: 'rlz',
    privateKeyPath: '/Users/rlz/.ssh/id_rsa'
})

console.log('Dump data...')
await SSH.exec('rm', ['-rf', '/taskmony/dump'])
await SSH.exec('mongodump', ['--gzip', '-d', 'app-data'], { cwd: '/taskmony', stream: 'stderr' })

console.log('Download data...')
const DIR_NAME = `./backups/${DateTime.utc().toFormat('yyyyMMdd\'T\'HHmmss\'Z\'')}`
await mkdir(DIR_NAME, { recursive: true })
await SSH.getDirectory(DIR_NAME, '/taskmony/dump')
SSH.dispose()

console.log('Done!')
