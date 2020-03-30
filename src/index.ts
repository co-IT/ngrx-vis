#!/usr/bin/env node

import { Command } from 'commander'
import { NgRxActionInspector } from './core/ngrx-action-inspector'
import { createNetwork } from './vis-js/create-network'
import { createWebView } from './web-view/create-web-view'

const program = new Command()

program.version(process.env.npm_package_version || 'unknown')
program.option(
  '-g, --glob <**/*.actions.ts>',
  'Glob for files containing actions',
  '**/*.actions.ts'
)

program.requiredOption('-p, --project <path>', 'Specify path to tsconfig')

program.on('--help', () => {
  console.log('')
  console.log('Example call:')
  console.log('  $ ngrx-vis --project ./src/tsconfig.app.json')
})

program.parse(process.argv)

const inspector = new NgRxActionInspector(program.project, program.glob)
const network = createNetwork(inspector.inspect())

createWebView(network)
  .then(() => console.log('✅ Graph created successfully'))
  .catch(err => console.log(err))
