import { Project } from 'ts-morph'

const project = new Project({ tsConfigFilePath: `./ngrx-app/tsconfig.json` })

const files = project.getSourceFiles('**/*.ts')

console.log(files)
