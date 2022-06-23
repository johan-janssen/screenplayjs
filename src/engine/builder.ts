import 'reflect-metadata';
import { CharacterDescription, SceneDefinition, ScreenPlay } from 'src/loader';
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

    public buildCharacter(description: CharacterDescription): any {
        const character = this.registry.getCharacterByName(description.type);

        const args = new Array(character.ctorArguments.length);

        character.constructorPatterns.forEach((pattern, i) => {
            if (pattern instanceof RegExp) {
                description.properties.forEach(property => {
                    const match = property.match(pattern);
                    if (match) {
                        args[i] = match[1];
                    }
                })
            }
        });

        const obj = new character.ctor(...args);
        return obj;
    }
}

export class Director {
    private currentLine = -1;
    private currentScene: SceneDefinition = null

    constructor(public readonly screenplay: ScreenPlay, public readonly set: Set, public readonly builder: Builder) {

    }

    public start() {
        this.currentScene = this.screenplay.acts[0].scenes[0];
        this.currentLine = -1;
        this.next();
    }

    public next(): boolean {
        this.currentLine++;

        if (this.currentLine >= this.currentScene.actions.length) {
            return false;
        }

        const line = this.currentScene.actions[this.currentLine];
        if (line instanceof CharacterDescription) {
            const char = this.builder.buildCharacter(line);
            console.log(char);
        }
        return true;
    }
}