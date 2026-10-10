import { spawn } from 'node:child_process'
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.APP_PORT || 3000
process.env.PORT = port

console.log(Menjalankan Nuxt preview pada port ...)

const child = spawn('npx', ['nuxt', 'preview', '--port', port.toString()], {
  stdio: 'inherit',
  shell: true,
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})