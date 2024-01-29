//import { Builder } from 'src/engine/builder';
import { GlobalRegistry } from '../src/engine/registry';
import { Attribute, Description, Reference } from '../src/script/elements';
import { Man, C } from './romeoAndJuliet/actors';
import { Builder } from '../src/engine/builder'
import * as should from 'should';
import { Weapon } from './romeoAndJuliet/props';
import { Set } from '../src/engine/set';

describe("Builder builds actors and props", () => {
    GlobalRegistry.Register(Man);
    GlobalRegistry.Register(C);
    GlobalRegistry.Register(Weapon);
    const builder = new Builder(GlobalRegistry, new Set());

    before(() => {
        
    });

    it("Builds a man", () => {
        const line = 'SAMPSON, a man, of the house of Capulet, armed with SWORD and BUCKLER'
        const swordDescription = new Description(
            '', 
            'SWORD', 
            'sword', 
            [new Attribute('shiny', []), new Attribute('quite pointy', [])]);
        const description = new Description(
            line, 
            'SAMPSON', 
            'man', 
            [new Attribute('of the house of Capulet', []), new Attribute('armed with SWORD and BUCKLER', [new Reference(swordDescription, 0, 0)])]);
        const built = builder.buildCharacter(description) as Man;

        should(built).instanceof(Man)
        should(built.house).equals('Capulet');
        should(built.weapon).equals(Weapon);
    });

    it('builds a sword', () => {
        const description = new Description(
            '', 
            'SWORD', 
            'sword', 
            [new Attribute('shiny', []), new Attribute('quite pointy', [])]);
        const built = builder.buildCharacter(description) as Weapon;

        should(built).instanceof(Weapon)
        should(built.appearance).equals('shiny')
        should(built.sharpness).equals('pointy')
    })

    it('hands character a sword', () => {
        const swordDescription = new Description(
            '', 
            'SWORD', 
            'sword', 
            [new Attribute('shiny', []), new Attribute('quite pointy', [])]);
        const manDescription = new Description(
            '', 
            'SAMPSON', 
            'man', 
            [new Attribute('of the house of Capulet', []), new Attribute('armed with SWORD and BUCKLER', [new Reference(swordDescription, 9, 14)])]);
        
        const built = builder.buildCharacter(manDescription) as Man;
        const weapon = built.weapon as Weapon

        should(built.weapon).Object();
        should(weapon.constructor).equals(Weapon)
        should(weapon.sharpness).equals('pointy')
    })
});