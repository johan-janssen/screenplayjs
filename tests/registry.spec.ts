import * as should from 'should';
import { GlobalRegistry } from '../src/engine/registry';
import { Man } from './romeoAndJuliet/actors';

describe("Registry registers actors and props", () =>{
    GlobalRegistry.Register(Man);

    before(() => {
        
    });

    it("Has registered man", () =>{
        should(GlobalRegistry.GetCharacterByName('man').typeNames).containEql('man')
        should(GlobalRegistry.GetCharacterByName('man').prototype).eql(Man.prototype)
    });

    it("Has registered actions of man", () =>{
        const man = GlobalRegistry.GetCharacterByName('man');
        should(man.actions).lengthOf(2);
        should(man.actions.map(a => a.methodName)).containEql('Talks');
        should(man.actions.map(a => a.methodName)).containEql('Dialogue');
    });
});