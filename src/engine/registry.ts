export class ArgumentPattern {
    constructor(public readonly propertyKey, public readonly argumentIndex, public readonly pattern: string|RegExp|number) {
    }
}


export class MethodPattern {

}


export class Method {
    public readonly ArgumentPatterns: Array<ArgumentPattern> = [];
    public readonly Patterns: Array<MethodPattern> = [];
    public readonly args: Array<any>;
    constructor(public readonly name: string, public readonly prototype) {
        this.args = Reflect.getMetadata('design:paramtypes', prototype, name);
    }
}


export class Actor {
    public readonly actions: Array<Action> = [];
    public readonly argumentPatterns: Array<ArgumentPattern> = [];
    public readonly methods: Array<Method> = [];
    public readonly typeNames: Array<string> = [];
    public readonly ctorArguments: Array<any>;

    constructor(public readonly prototype: any) {
        const args = Reflect.getMetadata('design:paramtypes', prototype);
        this.ctorArguments = args ? args : [];
    }

    public GetOrCreateMethod(name: string): Method {
        let methods = this.methods.filter(m => m.name == name);
        if (methods.length == 1) {
            return methods[0];
        }
        const method = new Method(name, this.prototype);
        methods.push(method);
        return method;
    }
}

export class Action {
    public readonly argumentPatterns: Array<ArgumentPattern> = [];

    constructor(public readonly pattern: string, public readonly methodName: string, public parametertypes) {

    }
}

export class Registry {
    public readonly typeCharactersMap = new Map<string, Actor>();
    public readonly objects = new Map<any, Actor>();

    // @ts-ignore
    public Register(type) {}

    public RegisterCharacter(type: string, target: any) {
        if (this.typeCharactersMap.has(type)) {
            throw `Cannot register type '${type}' twice`;
        }

        const obj = this.GetOrCreateTypeByPrototype(target.prototype);
        obj.typeNames.push(type);
        this.typeCharactersMap.set(type, obj);
    }

    public RegisterAction(pattern: string, target: any, methodName: string) {
        const obj = this.GetOrCreateTypeByPrototype(target);
        const method = obj.GetOrCreateMethod(methodName);
        method.Patterns.push(pattern);
    }

    public RegisterArgument(target: any, propertyKey: string, argumentIndex: number, patternOrIndex: string|RegExp|number) {
        const obj = this.GetOrCreateTypeByPrototype(target.prototype);
        const argumentPattern = new ArgumentPattern(propertyKey, argumentIndex, patternOrIndex);

        if (propertyKey) {
            const method = obj.GetOrCreateMethod(propertyKey);
            method.ArgumentPatterns.push(argumentPattern)
        }
        else {
            obj.argumentPatterns.push(argumentPattern);
        }
    }

    public GetCharacterByName(type: string) : Actor {
        const r = this.typeCharactersMap.get(type);
        return r;
    }

    // @ts-ignore
    public RegisterProperty(v) {
        //console.log('PROPERTY', v);
        //console.log(Reflect.getMetadataKeys(v[1], v[2]));
    }

    public GetOrCreateTypeByPrototype(prototype): Actor {
        if (prototype.prototype) {
            throw 'This is not a prototype';
        }

        let r = this.objects.get(prototype);
        if (!r) {
            r = new Actor(prototype)
            this.objects.set(prototype, r);
        }
        return r;
    }
}

export const GlobalRegistry = new Registry();