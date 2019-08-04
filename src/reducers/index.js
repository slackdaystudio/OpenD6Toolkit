import { combineReducers } from 'redux';
import architect from './architect';
import builder from './builder';
import combat from './combat';
import dieRoller from './dieRoller';
import massRoller from './massRoller';
import settings from './settings';

export default combineReducers({
   architect,
   builder,
   combat,
   dieRoller,
   massRoller,
   settings
});