import 'reflect-metadata';
import { GlobalRegistry } from './registry';


export function Character(type: string, patterns: Array<string|RegExp> = null) {
    return function(target) {
        Reflect.defineMetadata('Character', 'x', target);
        GlobalRegistry.RegisterCharacter(type, patterns, target);
    }
}

export function Action(pattern: string=null) {
    return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        GlobalRegistry.RegisterAction(pattern, target, propertyKey);
        return descriptor
    }
}

export function Property(type: string) {
    return function(target: any, propertyKey: string) {
        GlobalRegistry.RegisterProperty([type, target, propertyKey]);
    }
}