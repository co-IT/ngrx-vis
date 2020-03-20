import { SourceFile } from 'ts-morph'

export function lookIntoFile(file: SourceFile): void {
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
