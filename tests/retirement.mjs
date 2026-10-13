/** Prevent the retired explorer from being emitted while retaining the separate Brain101 link. */
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
const html=await readFile('dist/index.html','utf8');
const destination='https://capabilitymatters.org/llm101/explorer/';
assert(html.includes('content="0;url='+destination+'"'));
assert(html.includes('rel="canonical" href="'+destination+'"'));
assert(html.includes('href="'+destination+'"'));
assert(html.includes('href="/llm101/brain101/"'));
assert(!/<script|src=|\/assets\//i.test(html));
assert.deepEqual(await readdir('dist'),['index.html']);
const workflow=await readFile('.github/workflows/deploy.yml','utf8');
assert(workflow.includes('working-directory: brain101'));
assert(workflow.includes('cp -r brain101/dist dist/brain101'));
console.log('PASS: old LLM101 runtime retired, canonical/native redirect present, Brain101 deployment retained.');
