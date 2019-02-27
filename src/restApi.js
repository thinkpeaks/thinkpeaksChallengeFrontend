import 'whatwg-fetch';
import restful, { fetchBackend } from 'restful.js';


export const api = restful('http://challenge.symfony.test/api', fetchBackend(fetch));
