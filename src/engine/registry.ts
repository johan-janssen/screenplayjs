export class MethodPattern {

}


export class Argument {
    public readonly patterns: Array<string|RegExp|number> = [];
    constructor(public readonly prototype: any) {

    }
}

export class Method {
    public readonly patterns: Array<MethodPattern> = [];
    constructor(public readonly name: string, public readonly args: Array<Argument>) {
    }
}


export interface ITypeDescription {
    name: string,
    isUnique: boolean
}


export class Type {
    public readonly methods: Array<Method> = [];
    public readonly types: Array<ITypeDescription> = [];
    public constructorMethod: Method;

    constructor(public readonly ctor: any) {
    }

    public GetDescription(name: string): ITypeDescription {
        return this.types.filter(t => t.name==name)[0];
    }

    public GetOrCreateMethod(name: string, args: Array<Argument>): Method {
        let existingMethod = this.methods.filter(m => m.name == name);
        if (existingMethod.length == 1) {
            return existingMethod[0];
        }
        const method = new Method(name, args);
        this.methods.push(method);

        if (!name) {
            this.constructorMethod = method;
        }

        return method;
    }
}

export class Registry {
    public readonly nameToTypeMap = new Map<string, Type>();
    public readonly objects = new Map<any, Type>();

    // @ts-ignore, trick to make js load the type and call the attributes
    public Register(type) {}

    public RegisterType(name: string, isUnique: boolean, target: any) {
        if (this.nameToTypeMap.has(name)) {
            throw `Cannot register type '${name}' twice`;
        }

        const obj = this.GetOrCreateTypeByConstructor(target.prototype.constructor);
        let args = Reflect.getMetadata('design:paramtypes', target);
        args = args? args : []
        obj.GetOrCreateMethod(null, args.map(arg => new Argument(arg)));
        obj.types.push({name: name, isUnique: isUnique});
        this.nameToTypeMap.set(name, obj);
    }

    public RegisterMethod(pattern: string, target: any, methodName: string) {
        const obj = this.GetOrCreateTypeByConstructor(target.constructor);
        let args = Reflect.getMetadata('design:paramtypes', target, methodName);
        args = args? args : []
        const method = obj.GetOrCreateMethod(methodName, args.map(arg => new Argument(arg)));
        method.patterns.push(pattern);
    }

    public RegisterArgument(target: any, methodName: string, argumentIndex: number, patternOrIndex: string|RegExp|number) {
        const obj = this.GetOrCreateTypeByConstructor(target.prototype.constructor);
        let args = Reflect.getMetadata('design:paramtypes', target, methodName);
        args = args? args : []
        const method = obj.GetOrCreateMethod(methodName, args.map(arg => new Argument(arg)));
        method.args[argumentIndex].patterns.push(patternOrIndex);
    }

    public GetTypeByName(type: string) : Type {
        const r = this.nameToTypeMap.get(type);
        return r;
    }

    // @ts-ignore
    public RegisterProperty(v) {
        //console.log('PROPERTY', v);
        //console.log(Reflect.getMetadataKeys(v[1], v[2]));
    }

    public GetTypeByConstructor(prototype): Type {
        return this.objects.get(prototype);
    }

    public GetOrCreateTypeByConstructor(prototype): Type {
        let r = this.GetTypeByConstructor(prototype);
        if (!r) {
            r = new Type(prototype)
            this.objects.set(prototype, r);
        }
        return r;
    }
}

export const GlobalRegistry = new Registry();