#!/usr/bin/env node

import { Command } from 'commander'
import { extractActions } from './core/extract-actions'
import { NgRxVanillaInspector } from './core/ngrx-vanilla-inspector'
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

const inspector = new NgRxVanillaInspector(program.project, program.glob)
const actionContexts = inspector.inspect()

if (!actionContexts?.length) {
  console.log('📭 Sorry, no action declarations found')
  console.log(
    '   Please note that ngrx-vis is not capable of detecting actions in nested data structures, yet.'
  )
} else {
  const actionsPlain = extractActions(actionContexts)
  const network = createNetwork(actionContexts)

  createWebView(actionsPlain, network)
    .then(() => console.log('✅ Graph created successfully'))
    .catch(err => console.log(err))
}
