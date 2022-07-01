import 'reflect-metadata';
import { GlobalRegistry } from './registry';


export function Character(type: string) {
    return function(target) {
        Reflect.defineMetadata('Character', 'x', target);
        GlobalRegistry.RegisterCharacter(type, target);
    }
}

export function Pattern(patternOrIndex: string|RegExp|number) {
    return function(target: any, propertyKey: string, argumentIndex: number) {
        GlobalRegistry.RegisterArgument(target, propertyKey, argumentIndex, patternOrIndex);
        console.log(patternOrIndex, target, propertyKey, argumentIndex)
    }
}

export function Perform(pattern: string=null) {
    return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        GlobalRegistry.RegisterMethod(pattern, target, propertyKey);
        return descriptor
    }
}

export function Property(type: string) {
    return function(target: any, propertyKey: string) {
        GlobalRegistry.RegisterProperty([type, target, propertyKey]);
    }
}