// Copyright (C) Slack Day Studio - All Rights Reserved
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//////////////////////////////
// ACTIONS                  //
//////////////////////////////

export const UPDATE_ROLLER = 'UPDATE_ROLLER';

//////////////////////////////
// REDUCERS                 //
//////////////////////////////

export function updateRoller(dice, pips) {
    return {
        type: UPDATE_ROLLER,
        payload: {
            dice: dice,
            pips: pips,
        },
    };
}

const dieRollerState = {
    dice: 1,
    pips: 0,
};

export default function dieRoller(state = dieRollerState, action) {
    let newState = null;

    switch (action.type) {
        case UPDATE_ROLLER:
            newState = {...state};
            newState.dice = parseInt(action.payload.dice, 10);
            newState.pips = parseInt(action.payload.pips, 10);

            return newState;
        default:
            return state;
    }
}
