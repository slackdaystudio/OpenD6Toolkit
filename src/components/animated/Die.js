import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {scale, verticalScale} from 'react-native-size-matters';
import {useAnimationState} from 'moti';
import {Icon} from '../Icon';
import {STATE_CRITICAL_SUCCESS} from '../../lib/DieRoller';
import {getRandomNumber} from '../../../App';
import {Animated} from './Animated';
import styles from '../../Styles';

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

const getDieIconDetails = (face, status, isWild = false, isBonus = false) => {
    let color = styles.grey.color;
    let iconName = null;

    switch (parseInt(face, 10)) {
        case 2:
            iconName = 'dice-two';
            break;
        case 3:
            iconName = 'dice-three';
            break;
        case 4:
            iconName = 'dice-four';
            break;
        case 5:
            iconName = 'dice-five';
            break;
        case 6:
            iconName = 'dice-six';
            break;
        default:
            iconName = 'dice-one';
    }

    if (isWild) {
        color = '#f57e20';
    }

    if (isBonus) {
        if (status === STATE_CRITICAL_SUCCESS) {
            color = '#61B33E';
        } else {
            color = '#B5374F';
        }
    }

    return {
        iconName,
        color,
    };
};

export const Die = memo(function Die({face, status, isWild = false, isBonus = false, isAnimationsEnabled = true}) {
    const showAnimations = useSelector(state => state.settings.animations);

    const dieIcon = getDieIconDetails(face, status, isWild, isBonus);

    const dieState = useAnimationState({
        from: {
            opacity: 0,
            translateY: verticalScale(-300),
        },
        to: {
            opacity: 1,
            translateY: 0,
        },
    });

    const getDie = () => {
        return <Icon solid size={verticalScale(20)} name={dieIcon.iconName} style={{color: dieIcon.color, paddingRight: scale(5.5)}} />;
    };

    if (showAnimations && isAnimationsEnabled) {
        return (
            <Animated
                animationProps={{
                    duration: 3000,
                    delay: getRandomNumber(0, 250, 1, false),
                    state: dieState,
                }}>
                {getDie()}
            </Animated>
        );
    }

    return getDie();
});

Die.propTypes = {
    face: PropTypes.number.isRequired,
    status: PropTypes.number.isRequired,
    isWild: PropTypes.bool,
    isBonus: PropTypes.bool,
    isAnimationsEnabled: PropTypes.bool,
};
