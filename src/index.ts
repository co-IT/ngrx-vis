import { Project } from 'ts-morph'

const project = new Project({
  skipLoadingLibFiles: true,
  tsConfigFilePath: 'ngrx-app/tsconfig.json',
  useInMemoryFileSystem: true
})

const files = project.getSourceFiles('src/test/**/*.ts')

console.log(files)
