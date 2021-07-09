"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indent = exports.isStdlib = exports.hasMessage = exports.hasWarningMessage = exports.hasErrorMessage = exports.StringBuilder = exports.updateSource = exports.isMethodNamed = exports.className = exports.isEntry = exports.isUserEntry = exports.cloneNode = exports.getTypeName = exports.getName = exports.toString = exports.not = exports.isLibrary = exports.getDecorator = exports.hasDecorator = exports.isDecorator = exports.decorates = void 0;
const as_1 = require("../as");
const astBuilder_1 = require("./astBuilder");
const cloneDeep = require("lodash.clonedeep");
function decorates(node, name) {
    return node.name.text === name;
}
exports.decorates = decorates;
function isDecorator(name) {
    return (node) => decorates(node, name);
}
exports.isDecorator = isDecorator;
function hasDecorator(node, name) {
    let decl;
    if (node instanceof as_1.DeclarationStatement) {
        decl = node;
    }
    else {
        decl = node.declaration;
    }
    // because it could be undefined
    return decl.decorators?.some(isDecorator(name)) == true;
}
exports.hasDecorator = hasDecorator;
function getDecorator(node, name) {
    return node.decorators?.find(isDecorator(name));
}
exports.getDecorator = getDecorator;
function isLibrary(node) {
    return node.isLibrary || node.internalPath.startsWith("~lib/rt/");
}
exports.isLibrary = isLibrary;
function not(fn) {
    return (t) => !fn(t);
}
exports.not = not;
function toString(node) {
    return astBuilder_1.ASTBuilder.build(node);
}
exports.toString = toString;
function getName(node) {
    if (node instanceof as_1.TypeNode) {
        if (node instanceof as_1.NamedTypeNode) {
            let name = getTypeName(node.name);
            const typeParameters = node.typeArguments;
            if (typeParameters && typeParameters.length > 0) {
                name += `<${typeParameters.map(getName).join(", ")}>`;
            }
            return name;
        }
        else if (node instanceof as_1.TypeName) {
            return toString(node.identifier);
        }
        return "";
    }
    if (node instanceof as_1.ClassDeclaration || node instanceof as_1.InterfaceDeclaration || node instanceof as_1.FunctionDeclaration) {
        return className(node);
    }
    return toString(node.name);
}
exports.getName = getName;
function getTypeName(node) {
    let name = toString(node.identifier);
    if (node.next) {
        name += getTypeName(node.next);
    }
    return name;
}
exports.getTypeName = getTypeName;
function cloneNode(node) {
    return cloneDeep(node);
}
exports.cloneNode = cloneNode;
function isUserEntry(node) {
    return node.range.source.sourceKind == as_1.SourceKind.USER_ENTRY;
}
exports.isUserEntry = isUserEntry;
function isEntry(node) {
    return isUserEntry(node) || node.range.source.sourceKind == as_1.SourceKind.LIBRARY_ENTRY;
}
exports.isEntry = isEntry;
function className(_class) {
    let name = toString(_class.name);
    const typeParameters = _class.typeParameters;
    if (typeParameters) {
        name += `<${typeParameters.map(getName).join(", ")}>`;
    }
    return name;
}
exports.className = className;
function isMethodNamed(name) {
    return (stmt) => stmt.kind == as_1.NodeKind.METHODDECLARATION && toString(stmt.name) === name;
}
exports.isMethodNamed = isMethodNamed;
function updateSource(program, newSource) {
    const sources = program.sources;
    for (let i = 0, len = sources.length; i < len; i++) {
        if (sources[i].internalPath == newSource.internalPath) {
            sources[i] = newSource;
            break;
        }
    }
}
exports.updateSource = updateSource;
class StringBuilder {
    sb = [];
    push(s) {
        this.sb.push(s);
    }
    finish(separator = "\n") {
        let res = this.sb.join(separator);
        this.sb = [];
        return res;
    }
    get last() { return this.sb[this.sb.length - 1]; }
}
exports.StringBuilder = StringBuilder;
/**
 *
 * @param emitter DiagnosticEmitter
 * @returns return true if emitter have ERROR message
 */
function hasErrorMessage(emitter) {
    return hasMessage(emitter, as_1.DiagnosticCategory.ERROR);
}
exports.hasErrorMessage = hasErrorMessage;
/**
*
* @param emitter DiagnosticEmitter
* @returns return true if emitter have WARNING message
*/
function hasWarningMessage(emitter) {
    return hasMessage(emitter, as_1.DiagnosticCategory.WARNING);
}
exports.hasWarningMessage = hasWarningMessage;
/**
*
* @param emitter DiagnosticEmitter
* @returns return true if emitter have `category` message
*/
function hasMessage(emitter, category) {
    const diagnostics = emitter.diagnostics ? emitter.diagnostics : [];
    for (const msg of diagnostics) {
        if (msg.category === category) {
            return true;
        }
    }
    return false;
}
exports.hasMessage = hasMessage;
let isStdlibRegex = /\~lib\/(?:array|arraybuffer|atomics|builtins|crypto|console|compat|dataview|date|diagnostics|error|function|iterator|map|math|number|object|process|reference|regexp|set|staticarray|string|symbol|table|typedarray|vector|rt\/?|bindings\/|shared\/typeinfo)|util\/|uri|polyfills|memory/;
function isStdlib(s) {
    let source = s instanceof as_1.Source ? s : s.range.source;
    return isStdlibRegex.test(source.internalPath);
}
exports.isStdlib = isStdlib;
exports.indent = as_1.util.indent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOEJBbUJlO0FBQ2YsNkNBQTBDO0FBRTFDLE1BQU0sU0FBUyxHQUFtQixPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUU5RCxTQUFnQixTQUFTLENBQUMsSUFBbUIsRUFBRSxJQUFZO0lBQ3pELE9BQThCLElBQUksQ0FBQyxJQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztBQUN6RCxDQUFDO0FBRkQsOEJBRUM7QUFFRCxTQUFnQixXQUFXLENBQUMsSUFBWTtJQUN0QyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFGRCxrQ0FFQztBQUdELFNBQWdCLFlBQVksQ0FDMUIsSUFBZ0UsRUFDaEUsSUFBWTtJQUVaLElBQUksSUFBSSxDQUFDO0lBQ1QsSUFBSSxJQUFJLFlBQVkseUJBQW9CLEVBQUU7UUFDeEMsSUFBSSxHQUFHLElBQUksQ0FBQztLQUNiO1NBQU07UUFDTCxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztLQUN6QjtJQUNELGdDQUFnQztJQUNoQyxPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUMxRCxDQUFDO0FBWkQsb0NBWUM7QUFFRCxTQUFnQixZQUFZLENBQzFCLElBQTBCLEVBQzFCLElBQVk7SUFFWixPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBRSxDQUFDO0FBQ25ELENBQUM7QUFMRCxvQ0FLQztBQUVELFNBQWdCLFNBQVMsQ0FBQyxJQUFZO0lBQ3BDLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwRSxDQUFDO0FBRkQsOEJBRUM7QUFFRCxTQUFnQixHQUFHLENBQUksRUFBcUI7SUFDMUMsT0FBTyxDQUFDLENBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUZELGtCQUVDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLElBQVU7SUFDakMsT0FBTyx1QkFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRkQsNEJBRUM7QUFPRCxTQUFnQixPQUFPLENBQUMsSUFBNkI7SUFDbkQsSUFBSSxJQUFJLFlBQVksYUFBUSxFQUFFO1FBQzVCLElBQUksSUFBSSxZQUFZLGtCQUFhLEVBQUU7WUFDakMsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNqQyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1lBQzFDLElBQUksY0FBYyxJQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUMvQyxJQUFJLElBQUksSUFBSSxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2FBQ3ZEO1lBQ0QsT0FBTyxJQUFJLENBQUE7U0FDWjthQUFNLElBQUksSUFBSSxZQUFZLGFBQVEsRUFBRTtZQUNuQyxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7U0FDakM7UUFDRCxPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsSUFBSSxJQUFJLFlBQVkscUJBQWdCLElBQUksSUFBSSxZQUFZLHlCQUFvQixJQUFJLElBQUksWUFBWSx3QkFBbUIsRUFBRTtRQUNuSCxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4QjtJQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBbEJELDBCQWtCQztBQUdELFNBQWdCLFdBQVcsQ0FBQyxJQUFjO0lBQ3hDLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ2IsSUFBSSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEM7SUFDRCxPQUFPLElBQUksQ0FBQztBQUVkLENBQUM7QUFQRCxrQ0FPQztBQUVELFNBQWdCLFNBQVMsQ0FBaUIsSUFBTztJQUMvQyxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRkQsOEJBRUM7QUFFRCxTQUFnQixXQUFXLENBQUMsSUFBVTtJQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxlQUFVLENBQUMsVUFBVSxDQUFDO0FBQy9ELENBQUM7QUFGRCxrQ0FFQztBQUVELFNBQWdCLE9BQU8sQ0FBQyxJQUFVO0lBQ2hDLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxlQUFVLENBQUMsYUFBYSxDQUFDO0FBQ3ZGLENBQUM7QUFGRCwwQkFFQztBQUVELFNBQWdCLFNBQVMsQ0FBQyxNQUFzRTtJQUM5RixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ2hDLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7SUFDN0MsSUFBSSxjQUFjLEVBQUU7UUFDbEIsSUFBSSxJQUFJLElBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUN2RDtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVBELDhCQU9DO0FBRUQsU0FBZ0IsYUFBYSxDQUFDLElBQVk7SUFDeEMsT0FBTyxDQUFDLElBQTBCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksYUFBUSxDQUFDLGlCQUFpQixJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDO0FBQ2pILENBQUM7QUFGRCxzQ0FFQztBQUVELFNBQWdCLFlBQVksQ0FBQyxPQUFnQixFQUFFLFNBQWlCO0lBQzlELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNoRCxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLElBQUksU0FBUyxDQUFDLFlBQVksRUFBRTtZQUNuRCxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO1lBQ3ZCLE1BQU07U0FDVDtLQUNKO0FBQ0gsQ0FBQztBQVJELG9DQVFDO0FBRUQsTUFBYSxhQUFhO0lBQ2hCLEVBQUUsR0FBYSxFQUFFLENBQUM7SUFFMUIsSUFBSSxDQUFDLENBQVM7UUFDWixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJO1FBQ3JCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQsSUFBSyxJQUFJLEtBQWEsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFFLENBQUMsQ0FBQyxDQUFBLENBQUEsQ0FBQztDQUN6RDtBQWRELHNDQWNDO0FBRUQ7Ozs7R0FJRztBQUNGLFNBQWdCLGVBQWUsQ0FBQyxPQUEwQjtJQUN6RCxPQUFPLFVBQVUsQ0FBQyxPQUFPLEVBQUUsdUJBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkQsQ0FBQztBQUZBLDBDQUVBO0FBRUQ7Ozs7RUFJRTtBQUNGLFNBQWdCLGlCQUFpQixDQUFDLE9BQTBCO0lBQzFELE9BQU8sVUFBVSxDQUFDLE9BQU8sRUFBRSx1QkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBRkQsOENBRUM7QUFFRDs7OztFQUlFO0FBQ0YsU0FBZ0IsVUFBVSxDQUN4QixPQUEwQixFQUMxQixRQUE0QjtJQUU1QixNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDbkUsS0FBSyxNQUFNLEdBQUcsSUFBSSxXQUFXLEVBQUU7UUFDM0IsSUFBSSxHQUFHLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQztTQUNmO0tBQ0o7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFYRCxnQ0FXQztBQUdELElBQUksYUFBYSxHQUNmLDJSQUEyUixDQUFDO0FBRTlSLFNBQWdCLFFBQVEsQ0FBQyxDQUE0QjtJQUNuRCxJQUFJLE1BQU0sR0FBRyxDQUFDLFlBQVksV0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ3RELE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUhELDRCQUdDO0FBRVksUUFBQSxNQUFNLEdBQUcsU0FBSSxDQUFDLE1BQU0sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERlY29yYXRvck5vZGUsXG4gIElkZW50aWZpZXJFeHByZXNzaW9uLFxuICBEZWNsYXJhdGlvblN0YXRlbWVudCxcbiAgU291cmNlLFxuICBOb2RlLFxuICBTb3VyY2VLaW5kLFxuICBQcm9ncmFtLFxuICBDbGFzc0RlY2xhcmF0aW9uLFxuICBUeXBlTm9kZSxcbiAgTm9kZUtpbmQsXG4gIEludGVyZmFjZURlY2xhcmF0aW9uLFxuICBGdW5jdGlvbkRlY2xhcmF0aW9uLFxuICBUeXBlTmFtZSxcbiAgRGlhZ25vc3RpY0NhdGVnb3J5LFxuICBEaWFnbm9zdGljRW1pdHRlcixcbiAgTmFtZWRUeXBlTm9kZSxcbiAgUmFuZ2UsXG4gIHV0aWwsXG59IGZyb20gXCIuLi9hc1wiO1xuaW1wb3J0IHsgQVNUQnVpbGRlciB9IGZyb20gXCIuL2FzdEJ1aWxkZXJcIjtcblxuY29uc3QgY2xvbmVEZWVwOiA8VD4odDogVCkgPT4gVCA9IHJlcXVpcmUoXCJsb2Rhc2guY2xvbmVkZWVwXCIpO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVjb3JhdGVzKG5vZGU6IERlY29yYXRvck5vZGUsIG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKDxJZGVudGlmaWVyRXhwcmVzc2lvbj5ub2RlLm5hbWUpLnRleHQgPT09IG5hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlY29yYXRvcihuYW1lOiBzdHJpbmcpOiAobm9kZTogRGVjb3JhdG9yTm9kZSkgPT4gYm9vbGVhbiB7XG4gIHJldHVybiAobm9kZSkgPT4gZGVjb3JhdGVzKG5vZGUsIG5hbWUpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNEZWNvcmF0b3IoXG4gIG5vZGU6IERlY2xhcmF0aW9uU3RhdGVtZW50IHwge2RlY2xhcmF0aW9uOiBEZWNsYXJhdGlvblN0YXRlbWVudH0sXG4gIG5hbWU6IHN0cmluZ1xuKTogYm9vbGVhbiB7XG4gIGxldCBkZWNsO1xuICBpZiAobm9kZSBpbnN0YW5jZW9mIERlY2xhcmF0aW9uU3RhdGVtZW50KSB7XG4gICAgZGVjbCA9IG5vZGU7XG4gIH0gZWxzZSB7XG4gICAgZGVjbCA9IG5vZGUuZGVjbGFyYXRpb247IFxuICB9IFxuICAvLyBiZWNhdXNlIGl0IGNvdWxkIGJlIHVuZGVmaW5lZFxuICByZXR1cm4gZGVjbC5kZWNvcmF0b3JzPy5zb21lKGlzRGVjb3JhdG9yKG5hbWUpKSA9PSB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVjb3JhdG9yKFxuICBub2RlOiBEZWNsYXJhdGlvblN0YXRlbWVudCxcbiAgbmFtZTogc3RyaW5nXG4pOiBEZWNvcmF0b3JOb2RlIHtcbiAgcmV0dXJuIG5vZGUuZGVjb3JhdG9ycz8uZmluZChpc0RlY29yYXRvcihuYW1lKSkhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNMaWJyYXJ5KG5vZGU6IFNvdXJjZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gbm9kZS5pc0xpYnJhcnkgfHwgbm9kZS5pbnRlcm5hbFBhdGguc3RhcnRzV2l0aChcIn5saWIvcnQvXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm90PFQ+KGZuOiAodDogVCkgPT4gYm9vbGVhbik6ICh0OiBUKSA9PiBib29sZWFuIHtcbiAgcmV0dXJuICh0OiBUKSA9PiAhZm4odCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1N0cmluZyhub2RlOiBOb2RlKTogc3RyaW5nIHtcbiAgcmV0dXJuIEFTVEJ1aWxkZXIuYnVpbGQobm9kZSk7XG59XG5cbmludGVyZmFjZSBOYW1lZCB7XG4gIG5hbWU6IElkZW50aWZpZXJFeHByZXNzaW9uO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKG5vZGU6IE5vZGUgJiBOYW1lZCB8IFR5cGVOb2RlKTogc3RyaW5nIHtcbiAgaWYgKG5vZGUgaW5zdGFuY2VvZiBUeXBlTm9kZSkge1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgTmFtZWRUeXBlTm9kZSkge1xuICAgICAgbGV0IG5hbWUgPSBnZXRUeXBlTmFtZShub2RlLm5hbWUpXG4gICAgICBjb25zdCB0eXBlUGFyYW1ldGVycyA9IG5vZGUudHlwZUFyZ3VtZW50cztcbiAgICAgIGlmICh0eXBlUGFyYW1ldGVycyAmJiB0eXBlUGFyYW1ldGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIG5hbWUgKz0gYDwke3R5cGVQYXJhbWV0ZXJzLm1hcChnZXROYW1lKS5qb2luKFwiLCBcIil9PmA7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmFtZVxuICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIFR5cGVOYW1lKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcobm9kZS5pZGVudGlmaWVyKVxuICAgIH1cbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBpZiAobm9kZSBpbnN0YW5jZW9mIENsYXNzRGVjbGFyYXRpb24gfHwgbm9kZSBpbnN0YW5jZW9mIEludGVyZmFjZURlY2xhcmF0aW9uIHx8IG5vZGUgaW5zdGFuY2VvZiBGdW5jdGlvbkRlY2xhcmF0aW9uKSB7XG4gICAgcmV0dXJuIGNsYXNzTmFtZShub2RlKTtcbiAgfSBcbiAgcmV0dXJuIHRvU3RyaW5nKG5vZGUubmFtZSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVOYW1lKG5vZGU6IFR5cGVOYW1lKTogc3RyaW5nIHtcbiAgbGV0IG5hbWUgPSB0b1N0cmluZyhub2RlLmlkZW50aWZpZXIpO1xuICBpZiAobm9kZS5uZXh0KSB7XG4gICAgbmFtZSArPSBnZXRUeXBlTmFtZShub2RlLm5leHQpO1xuICB9XG4gIHJldHVybiBuYW1lO1xuICBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lTm9kZTxUIGV4dGVuZHMgTm9kZT4obm9kZTogVCk6IFQge1xuICByZXR1cm4gY2xvbmVEZWVwKG5vZGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNVc2VyRW50cnkobm9kZTogTm9kZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gbm9kZS5yYW5nZS5zb3VyY2Uuc291cmNlS2luZCA9PSBTb3VyY2VLaW5kLlVTRVJfRU5UUlk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VudHJ5KG5vZGU6IE5vZGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzVXNlckVudHJ5KG5vZGUpIHx8IG5vZGUucmFuZ2Uuc291cmNlLnNvdXJjZUtpbmQgPT0gU291cmNlS2luZC5MSUJSQVJZX0VOVFJZO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NOYW1lKF9jbGFzczogQ2xhc3NEZWNsYXJhdGlvbiB8ICBJbnRlcmZhY2VEZWNsYXJhdGlvbiB8IEZ1bmN0aW9uRGVjbGFyYXRpb24pOiBzdHJpbmcge1xuICBsZXQgbmFtZSA9IHRvU3RyaW5nKF9jbGFzcy5uYW1lKVxuICBjb25zdCB0eXBlUGFyYW1ldGVycyA9IF9jbGFzcy50eXBlUGFyYW1ldGVycztcbiAgaWYgKHR5cGVQYXJhbWV0ZXJzKSB7XG4gICAgbmFtZSArPSBgPCR7dHlwZVBhcmFtZXRlcnMubWFwKGdldE5hbWUpLmpvaW4oXCIsIFwiKX0+YDtcbiAgfVxuICByZXR1cm4gbmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTWV0aG9kTmFtZWQobmFtZTogc3RyaW5nKTogKF86IERlY2xhcmF0aW9uU3RhdGVtZW50KSA9PiBib29sZWFuIHtcbiAgcmV0dXJuIChzdG10OiBEZWNsYXJhdGlvblN0YXRlbWVudCkgPT4gc3RtdC5raW5kID09IE5vZGVLaW5kLk1FVEhPRERFQ0xBUkFUSU9OICYmIHRvU3RyaW5nKHN0bXQubmFtZSkgPT09IG5hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVTb3VyY2UocHJvZ3JhbTogUHJvZ3JhbSwgbmV3U291cmNlOiBTb3VyY2UpIHtcbiAgY29uc3Qgc291cmNlcyA9IHByb2dyYW0uc291cmNlcztcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHNvdXJjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmIChzb3VyY2VzW2ldLmludGVybmFsUGF0aCA9PSBuZXdTb3VyY2UuaW50ZXJuYWxQYXRoKSB7XG4gICAgICAgICAgc291cmNlc1tpXSA9IG5ld1NvdXJjZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3RyaW5nQnVpbGRlciB7XG4gIHByaXZhdGUgc2I6IHN0cmluZ1tdID0gW107XG5cbiAgcHVzaChzOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnNiLnB1c2gocyk7XG4gIH1cblxuICBmaW5pc2goc2VwYXJhdG9yID0gXCJcXG5cIik6IHN0cmluZyB7XG4gICAgbGV0IHJlcyA9IHRoaXMuc2Iuam9pbihzZXBhcmF0b3IpO1xuICAgIHRoaXMuc2IgPSBbXTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgZ2V0ICBsYXN0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnNiW3RoaXMuc2IubGVuZ3RoIC0xXX1cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGVtaXR0ZXIgRGlhZ25vc3RpY0VtaXR0ZXJcbiAqIEByZXR1cm5zIHJldHVybiB0cnVlIGlmIGVtaXR0ZXIgaGF2ZSBFUlJPUiBtZXNzYWdlXG4gKi9cbiBleHBvcnQgZnVuY3Rpb24gaGFzRXJyb3JNZXNzYWdlKGVtaXR0ZXI6IERpYWdub3N0aWNFbWl0dGVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBoYXNNZXNzYWdlKGVtaXR0ZXIsIERpYWdub3N0aWNDYXRlZ29yeS5FUlJPUik7XG59XG5cbi8qKlxuKlxuKiBAcGFyYW0gZW1pdHRlciBEaWFnbm9zdGljRW1pdHRlclxuKiBAcmV0dXJucyByZXR1cm4gdHJ1ZSBpZiBlbWl0dGVyIGhhdmUgV0FSTklORyBtZXNzYWdlXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc1dhcm5pbmdNZXNzYWdlKGVtaXR0ZXI6IERpYWdub3N0aWNFbWl0dGVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBoYXNNZXNzYWdlKGVtaXR0ZXIsIERpYWdub3N0aWNDYXRlZ29yeS5XQVJOSU5HKTtcbn1cblxuLyoqXG4qXG4qIEBwYXJhbSBlbWl0dGVyIERpYWdub3N0aWNFbWl0dGVyXG4qIEByZXR1cm5zIHJldHVybiB0cnVlIGlmIGVtaXR0ZXIgaGF2ZSBgY2F0ZWdvcnlgIG1lc3NhZ2VcbiovXG5leHBvcnQgZnVuY3Rpb24gaGFzTWVzc2FnZShcbiAgZW1pdHRlcjogRGlhZ25vc3RpY0VtaXR0ZXIsXG4gIGNhdGVnb3J5OiBEaWFnbm9zdGljQ2F0ZWdvcnlcbik6IGJvb2xlYW4ge1xuICBjb25zdCBkaWFnbm9zdGljcyA9IGVtaXR0ZXIuZGlhZ25vc3RpY3MgPyBlbWl0dGVyLmRpYWdub3N0aWNzIDogW107XG4gIGZvciAoY29uc3QgbXNnIG9mIGRpYWdub3N0aWNzKSB7XG4gICAgICBpZiAobXNnLmNhdGVnb3J5ID09PSBjYXRlZ29yeSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuXG5sZXQgaXNTdGRsaWJSZWdleCA9XG4gIC9cXH5saWJcXC8oPzphcnJheXxhcnJheWJ1ZmZlcnxhdG9taWNzfGJ1aWx0aW5zfGNyeXB0b3xjb25zb2xlfGNvbXBhdHxkYXRhdmlld3xkYXRlfGRpYWdub3N0aWNzfGVycm9yfGZ1bmN0aW9ufGl0ZXJhdG9yfG1hcHxtYXRofG51bWJlcnxvYmplY3R8cHJvY2Vzc3xyZWZlcmVuY2V8cmVnZXhwfHNldHxzdGF0aWNhcnJheXxzdHJpbmd8c3ltYm9sfHRhYmxlfHR5cGVkYXJyYXl8dmVjdG9yfHJ0XFwvP3xiaW5kaW5nc1xcL3xzaGFyZWRcXC90eXBlaW5mbyl8dXRpbFxcL3x1cml8cG9seWZpbGxzfG1lbW9yeS87XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0ZGxpYihzOiBTb3VyY2UgfCB7IHJhbmdlOiBSYW5nZSB9KTogYm9vbGVhbiB7XG4gIGxldCBzb3VyY2UgPSBzIGluc3RhbmNlb2YgU291cmNlID8gcyA6IHMucmFuZ2Uuc291cmNlO1xuICByZXR1cm4gaXNTdGRsaWJSZWdleC50ZXN0KHNvdXJjZS5pbnRlcm5hbFBhdGgpO1xufVxuXG5leHBvcnQgY29uc3QgaW5kZW50ID0gdXRpbC5pbmRlbnQ7Il19