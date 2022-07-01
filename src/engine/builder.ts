import 'reflect-metadata';
import { Description, SceneSection, Screenplay } from '../script/elements';
import { Registry } from './registry';
import { Set } from './set';

export interface Type<T> {
    new(...args: any[]): T;
  }

export const Injector = new class {
    // resolving instances
    resolve<T>(target: Type<any>): T {
      // tokens are required dependencies, while injections are resolved tokens from the Injector
      let tokens = Reflect.getMetadata('design:paramtypes', target) || [],
          injections = tokens.map(token => Injector.resolve<any>(token));
      
      return new target(...injections);
    }
  };

export class Builder {
    constructor(private registry: Registry) {

    }

    public buildCharacter(description: Description): any {
        const character = this.registry.GetCharacterByName(description.type);

        const args = new Array(character.ctorArguments.length);

        character.argumentPatterns.forEach((pattern) => {
            if (pattern.pattern instanceof RegExp) {
                description.attributes.forEach(property => {
                    const match = property.line.match(pattern.pattern as RegExp);
                    if (match) {
                        args[pattern.argumentIndex] = match[1];
                    }
                })
            }
        });

        const obj = new character.prototype.constructor(...args);
        return obj;
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