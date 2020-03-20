import { Project, SourceFile } from 'ts-morph'

function lookIntoFile(file: SourceFile): void {
  const actions = file.getVariableDeclarations().map(declaration => ({
    filePath: file.getFilePath(),
    name: declaration.getName(),
    type: declaration.getType().getText(),
    references: declaration
      .findReferences()
      .flatMap(referenceSymbol =>
        referenceSymbol
          .getReferences()
          .map(reference => reference.getSourceFile().getFilePath())
      )
  }))

  console.log(actions)
}

const project = new Project({ tsConfigFilePath: `./ngrx-app/tsconfig.json` })

const files = project.getSourceFiles('**/*.actions.ts')

files.forEach(file => lookIntoFile(file))
