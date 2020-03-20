import { Project } from 'ts-morph'
import { lookIntoFile } from './look-into-file'

const project = new Project({ tsConfigFilePath: `./ngrx-app/tsconfig.json` })
const files = project.getSourceFiles('**/*.actions.ts')

files.forEach(file => lookIntoFile(file))
