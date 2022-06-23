import { GlobalRegistry } from 'src/engine/registry';
import { Man } from './romeoAndJuliet/actors';

describe("Registry registers actors and props", () =>{
    GlobalRegistry.Register(Man);

    beforeAll(() => {
        
    });

    it("Has registered man", () =>{
        expect(GlobalRegistry.getCharactersByPrototype(Man).length).toBe(1)
        expect(GlobalRegistry.getCharactersByPrototype(Man)[0].type).toBe('man')
    });
});