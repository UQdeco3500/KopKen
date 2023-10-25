import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, Text } from 'react-native';
import { sizes } from '../data/theme';
import { getContrastColor } from '../helpers/helpers';

/**
 * A primary button component.
 *
 * @component
 * @param {object} props - The component's properties.
 * @param {Function} props.onPress - The function to call when the button is pressed.
 * @param {string} props.text - The text to display on the button.
 * @param {string} props.color - The background color of the button.
 * @param {boolean} props.disabled - The button is disabled or not
 * @returns {JSX.Element} The rendered PrimaryButton component.
 */
function PrimaryButton({ variant, onPress, text, color, disabled }) {

    const textColor = getContrastColor(color)

    const style = {
        primary: {
            backgroundColor: color,
            padding: sizes.button.padding.sm,
            borderRadius: sizes.button.radius,
        }
    }

    return (
        <Pressable
            disabled={disabled}
            onPress={onPress}
            style={{
                backgroundColor: color,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                padding: sizes.button.padding.sm,
                borderRadius: sizes.button.radius,
                opacity: disabled ? .35 : 1
            }}
        >
            <Text style={{
                color: textColor,
                fontWeight: 'bold'
            }}>
                {text}
            </Text>
        </Pressable>
    );
}

/**
 * Prop types for the PrimaryButton component.
 *
 * @typedef {object} PrimaryButtonProps
 * @property {Function} onPress - The function to call when the button is pressed.
 * @property {string} text - The text to display on the button.
 * @property {string} color - The background color of the button.
 * @property {boolean} disabled - The button is disabled or not
 */

/**
 * Prop types for the PrimaryButton component.
 *
 * @type {PrimaryButtonProps}
 */
PrimaryButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};

export default PrimaryButton;
