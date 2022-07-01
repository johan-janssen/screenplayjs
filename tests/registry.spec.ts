import * as should from 'should';
import { GlobalRegistry } from '../src/engine/registry';
import { Man } from './romeoAndJuliet/actors';

describe("Registry registers actors and props", () =>{
    GlobalRegistry.Register(Man);

    before(() => {
        
    });

    it("Has registered man", () =>{
        should(GlobalRegistry.GetCharacterByName('man').types).containEql('man')
        should(GlobalRegistry.GetCharacterByName('man').prototype).eql(Man.prototype)
    });

    it("Has registered actions of man", () =>{
        const man = GlobalRegistry.GetCharacterByName('man');
        should(man.methods).lengthOf(2);
        should(man.methods.map(a => a.name)).containEql('Talks');
        should(man.methods.map(a => a.name)).containEql('Dialogue');
    });
});