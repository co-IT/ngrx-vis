import { Project } from 'ts-morph'
import { findActions } from './look-into-file'

const project = new Project({ tsConfigFilePath: `./ngrx-app/tsconfig.json` })
const files = project.getSourceFiles('**/*.actions.ts')

const result = files.map(file => findActions(file))
// console.log(result)
