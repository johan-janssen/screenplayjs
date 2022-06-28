//import { Builder } from 'src/engine/builder';
import { GlobalRegistry } from '../src/engine/registry';
import { Attribute, CharacterDescription } from '../src/script/elements';
import { Man } from './romeoAndJuliet/actors';
import { Builder } from '../src/engine/builder'
import * as should from 'should';

describe("Builder builds actors and props", () => {
    GlobalRegistry.Register(Man);
    const builder = new Builder(GlobalRegistry);

    before(() => {
        
    });

    it("Builds a man", () => {
        const line = 'SAMPSON, a man, of the house of Capulet, armed with SWORD and BUCKLER'
        const description = new CharacterDescription(
            line, 
            'SAMPSON', 
            'man', 
            [new Attribute('of the house of Capulet', []), new Attribute('armed with SWORD and BUCKLER', [])]);
        const built = builder.buildCharacter(description) as Man;

        should(built).instanceof(Man)
        should(built.house).equals('Capulet')
    });
});