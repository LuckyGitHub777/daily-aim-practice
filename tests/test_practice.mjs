import assert from 'node:assert/strict';
import test from 'node:test';
import { FORMAT, initialState, update, progress, importPractice, toMarkdown, clean, validate } from '../lib/practice.mjs';
test('initial state and guided sequence',() => {
 let s=initialState();assert.equal(s.format,FORMAT);assert.equal(progress(s).step,1);
 s=update(s,{aim:'One Aim',reason:'A reason'});assert.equal(progress(s).step,2);
 s=update(s,{nextMove:'Act'});assert.equal(progress(s).step,3);
 s=update(s,{result:'done'});assert.equal(progress(s).step,4);
 s=update(s,{evidence:'Observed a result'});assert.equal(progress(s).step,5);
 assert.match(toMarkdown(s),/Observed a result/);
});
test('rejects malformed imports, extra fields and oversized content',() => {
 const s=initialState();assert.ok(validate(s));
 for(const raw of ['not json','null','[]','{}',JSON.stringify({...s,evil:true}), JSON.stringify({...s, aim:'x'.repeat(2001)})]) {
   assert.throws(()=>importPractice(raw));
 }
 assert.throws(()=>update(s,{notAllowed:'sneaky'}));
 assert.throws(()=>update(s,{result:'fantastic'}));
 assert.equal(clean(' x\r\n y '),'x\n y');
 assert.equal(clean('x'.repeat(9999)).length,2000);
});
test('export and import round-trip preserve data but not extra fields',() => {
 const s=update(initialState(),{aim:'Test aim',result:'partly',evidence:'No causal inference'});
 assert.deepEqual(importPractice(JSON.stringify(s)),s);
 assert.equal(importPractice(JSON.stringify(s)).aim,'Test aim');
 assert.ok(!JSON.stringify(s).includes('localStorage'));
});
