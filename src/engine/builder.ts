import 'reflect-metadata';
import { Attribute, Description, SceneSection, Screenplay } from '../script/elements';
import { Argument, Registry } from './registry';
import { Set } from './set';

export class Builder {
    constructor(private registry: Registry, private set: Set) {

    }

    public buildCharacter(description: Description): any {
        const type = this.registry.GetTypeByName(description.type);
        const ctor = type.constructorMethod;

        const constructorArgs = new Array(ctor.args.length);

        ctor.args.forEach((arg, i) => {
            const attribute = this.GetAttribute(arg, description.attributes);
            if (attribute) {
                constructorArgs[i] = attribute.value;
            }
        })

        // ctor.args.forEach((arg, i) => {
        //     if (!constructorArgs[i]) {

        //     }
        // });

        const obj = new type.ctor(...constructorArgs);
        return obj;
    }

    // public FindReferencedObjectByPrototype(prototype, attributes: Array<Attribute>) {
    //     const t = this.registry.GetTypeByPrototype(prototype);
    // }

    public GetAllReferencedObjects(attributes: Array<Attribute>) {
        const referenced = [];
        attributes.forEach(attr => {
            attr.references.forEach(ref => {
                const element = ref.element as Description;
                const referencedType = this.registry.GetTypeByName(element.type);
                const typeDescription = referencedType.GetDescription(element.type);
                if (typeDescription.isUnique) {
                    let obj = this.set.Get(element.name);
                    if (!obj) {
                        obj = this.buildCharacter(element);
                        this.set.Add(element.name, obj);
                    }
                    referenced.push(obj);
                }
                else {
                    referenced.push(this.buildCharacter(element));
                }
            })
        });
    }

    public GetAttribute(arg: Argument, attributes: Array<Attribute>): {attribute: Attribute, pattern, match, value}|null {
        let foundAttr;
        for (let i=0; i<attributes.length; i++) {
            const attribute = attributes[i]
            const match = this.MatchAttributeToPatterns(arg, attribute);
            if (match) {
                foundAttr = {attribute: attribute, pattern: match.pattern, match: match.match, value: match.value };
            }
        }

        if (!foundAttr) {
            for (let i=0; i<attributes.length; i++) {
                const attribute = attributes[i]
                this.MatchAttributeToType(arg, attribute);
            }
        }

        return foundAttr;
    }

    public MatchAttributeToPatterns(arg: Argument, attribute: Attribute): {pattern, match, value}|null {
        for (let i=0; i<arg.patterns.length; i++) {
            const pattern = arg.patterns[i];
            const match = attribute.line.match(pattern as RegExp);
            if (match) {
                return {pattern: pattern, match: match, value: match[1]}
            }
        }
        return null;
    }

    public MatchAttributeToType(arg: Argument, attribute: Attribute) {
        const t = this.registry.GetTypeByConstructor(arg.prototype);
        for (let i=0; i<attribute.references.length; i++) {
            const reference = attribute.references[i];
            const element = reference.element as Description;
            const referencedType = this.registry.GetTypeByName(element.type);
            const proto1 = arg.prototype;
            let proto2 = referencedType.ctor;

            while (proto2) {
               const match = proto1 == proto2;
               
               console.log(match);
               if (match) {
                   break;
               }
               proto2 = proto2.__proto__;
            }
            
        }
        console.log(arg, attribute, t);
    }
}

export class Director {
    private currentLine = -1;
    private currentScene: SceneSection = null

    constructor(public readonly screenplay: Screenplay, public readonly set: Set, public readonly builder: Builder) {

    }

    public start() {
        this.currentScene = this.screenplay.GetChildren(SceneSection)[0];
        this.currentLine = -1;
        this.next();
    }

    public next(): boolean {
        this.currentLine++;

        if (this.currentLine >= this.currentScene.children.length) {
            return false;
        }

        const line = this.currentScene.children[this.currentLine];
        if (line instanceof Description) {
            const char = this.builder.buildCharacter(line);
            console.log(char);
        }
        return true;
    }
}