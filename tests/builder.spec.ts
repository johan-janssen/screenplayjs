//import { Builder } from 'src/engine/builder';
import { GlobalRegistry } from '../src/engine/registry';
import { Attribute, Description } from '../src/script/elements';
import { Man } from './romeoAndJuliet/actors';
import { Builder } from '../src/engine/builder'
import * as should from 'should';
import { Weapon } from './romeoAndJuliet/props';

describe("Builder builds actors and props", () => {
    GlobalRegistry.Register(Man);
    GlobalRegistry.Register(Weapon);
    const builder = new Builder(GlobalRegistry);

    before(() => {
        
    });

    it("Builds a man", () => {
        const line = 'SAMPSON, a man, of the house of Capulet, armed with SWORD and BUCKLER'
        const description = new Description(
            line, 
            'SAMPSON', 
            'man', 
            [new Attribute('of the house of Capulet', []), new Attribute('armed with SWORD and BUCKLER', [])]);
        const built = builder.buildCharacter(description) as Man;

        should(built).instanceof(Man)
        should(built.house).equals('Capulet')
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
});