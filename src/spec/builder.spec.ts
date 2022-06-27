import { Builder } from 'src/engine/builder';
import { GlobalRegistry } from 'src/engine/registry';
import { CharacterDescription } from 'src/script/elements';
import { Man } from './romeoAndJuliet/actors';

describe("Builder builds actors and props", () =>{
    GlobalRegistry.Register(Man);
    const builder = new Builder(GlobalRegistry);

    beforeAll(() => {
        
    });

    it("Builds a man", () =>{
        const line = 'SAMPSON, a man, of the house of Capulet, armed with SWORD and BUCKLER'
        const description = new CharacterDescription(
            line, 
            'SAMPSON', 
            'man', 
            ['of the house of Capulet', 'armed with SWORD and BUCKLER']);
        const built = builder.buildCharacter(description);
        expect(built).toBeInstanceOf(Man)
        expect(built.house).toBe('Capulet');
    });
});