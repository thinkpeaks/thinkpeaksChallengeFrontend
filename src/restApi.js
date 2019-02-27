import 'whatwg-fetch';
import restful, { fetchBackend } from 'restful.js';
import {settings} from  './settings'

export const api = restful(settings.backend_url, fetchBackend(fetch));
