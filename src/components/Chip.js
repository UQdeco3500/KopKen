import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, Text } from 'react-native';
import { colors, sizes, styles } from '../data/theme';
import { getContrastColor } from '../helpers/helpers';
import { BlurView } from '@react-native-community/blur';

/**
 * A customizable chip component for React Native.
 *
 * @component
 * @param {object} props - The component's properties.
 * @param {string} props.text - The text content displayed on the chip.
 * @param {Function} [props.onPress] - A callback function to be executed when the chip is pressed (optional).
 * @param {boolean} props.isSelected - Indicates whether the chip is selected or not.
 * @param {string} [props.font] - The font style for the chip text (optional).
 * @param {string} [props.size] - The size variant for the chip (optional).
 * @param {string} [props.variant] - The style variant for the chip (optional).
 * @param {string} [props.color] - The color of the chip (optional).
 * @returns {JSX.Element} The rendered Chip component.
 */
function Chip({ text, onPress, isSelected, font, size, variant, color, isBlurred, style }) {
    /**
     * Handles the press event of the chip.
     */
    function handlePress() {
        if (onPress) {
            onPress();
        }
    }

    const innerStyle = {
        outlined: {
            borderColor: color,
            backgroundColor: 'transparent',
            borderWidth: 1
        },
        filled: {
            backgroundColor: color,
        }
    }

    return (
        <Pressable
            onPress={handlePress}
            style={{
                backgroundColor: isSelected ? colors.green : (color || colors.darkGrey),
                borderRadius: sizes.button.radius,
                paddingHorizontal: size ? sizes.button.padding[size] : sizes.button.padding.sm,
                paddingVertical: size ? sizes.button.padding[size] / 2 : sizes.button.padding.sm / 2,
                alignSelf: 'flex-start',
                ...innerStyle[variant],
                ...style
            }}
        >
            {isBlurred && (
                <BlurView
                    blurType="dark"
                    blurAmount={10}
                    reducedTransparencyFallbackColor="white"
                    style={{
                        flex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        borderRadius: sizes.radius.md,
                        zIndex: -100,

                    }} />
            )}
            <Text style={{
                ...styles.text[font],
                color: variant === 'outlined' ? color : color ? getContrastColor(color) : colors.white
            }}>{text}</Text>
        </Pressable>
    );
}

/**
 * Prop types for the Chip component.
 *
 * @typedef {object} ChipProps
 * @property {string} text - The text content displayed on the chip.
 * @property {Function} [onPress] - A callback function to be executed when the chip is pressed (optional).
 * @property {boolean} isSelected - Indicates whether the chip is selected or not.
 * @property {string} [font] - The font style for the chip text (optional).
 * @property {string} [size] - The size variant for the chip (optional).
 * @property {string} [variant] - The style variant for the chip (optional).
 * @property {string} [color] - The color of the chip (optional).
 */

/**
 * Default props for the Chip component.
 *
 * @type {ChipProps}
 */
Chip.defaultProps = {
    isSelected: false,
};

/**
 * Prop types for the Chip component.
 *
 * @type {ChipProps}
 */
Chip.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    isSelected: PropTypes.bool,
    font: PropTypes.string,
    size: PropTypes.string,
    variant: PropTypes.string,
    color: PropTypes.string,
};

export default Chip;
