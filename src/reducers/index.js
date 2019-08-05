import { combineReducers } from 'redux';
import architect from './architect';
import builder from './builder';
import orchestrator from './orchestrator';
import dieRoller from './dieRoller';
import massRoller from './massRoller';
import settings from './settings';

export default combineReducers({
   architect,
   builder,
   orchestrator,
   dieRoller,
   massRoller,
   settings
});