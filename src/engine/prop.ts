export function Prop(type: string, patterns: Array<string|RegExp> = null) {
    return function(target) {
        console.log(type, patterns, target);
    }
}