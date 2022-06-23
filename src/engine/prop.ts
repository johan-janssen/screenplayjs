export function Prop(type: string, patterns: Object=null) {
    return function(target) {
        console.log(type, patterns, target);
    }
}