import {
  LiteralKind,
  StringLiteralExpression,
  Program,
  Transform,
  DeclaredElement,
} from "../../as";
import { getDecorator, hasDecorator, isLibrary, isUserEntry } from "../utils";

function getName(element: DeclaredElement): string {
  let decorator = getDecorator(element.declaration, "exportAs");
  if (decorator.args == null) {
    throw Error("exportAs expects a string argument but got null.");
  }
  if (decorator.args.length != 1) {
    throw Error(`exportAs expects 1 argument but got ${decorator.args.length}`);
  }
  if (!decorator.args[0].isLiteralKind(LiteralKind.STRING)) {
    throw Error("exportAs expects a string argument");
  }
  return (<StringLiteralExpression>decorator.args[0]).value;
}

class Transformer extends Transform {
  afterInitialize(program: Program): void {
    let files = Array.from(program.filesByName.values()).filter(
      (file) => isUserEntry(file.source) && !isLibrary(file.source)
    );
    for (let file of files) {
      for (let _export of file.exports?.values() || []) {
        if (_export != null && hasDecorator(_export, "exportAs")) {
          let newName = getName(_export);
            file.exports?.delete(_export.name);
            file.exports?.set(newName, _export);
        }
      }
    }
  }
}

export = Transformer;
