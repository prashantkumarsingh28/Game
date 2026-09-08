import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getRandomInt } from '../utils/currency';
import { SoundManager } from '../utils/soundManager';

export default function Dice({ onRoll, disabled, value }) {
  const [isRolling, setIsRolling] = useState(false);
  const [displayVal, setDisplayVal] = useState(value || 1);
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const shakeValue = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleRoll = () => {
    if (disabled || isRolling) return;

    SoundManager.unlockAudio();
    SoundManager.playButtonClick();
    SoundManager.playDiceRoll();

    setIsRolling(true);

    // Rapid value flicker during roll animation for physical feel
    const flickerInterval = setInterval(() => {
      setDisplayVal(getRandomInt(1, 6));
    }, 60);

    // Reset animated values
    spinValue.setValue(0);
    scaleValue.setValue(1);
    shakeValue.setValue(0);

    Animated.parallel([
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(shakeValue, { toValue: 10, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: -10, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: 6, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.25,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 230,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      clearInterval(flickerInterval);
      const diceResult = getRandomInt(1, 6);
      setDisplayVal(diceResult);
      setIsRolling(false);
      SoundManager.playDiceLanding();

      if (onRoll) onRoll(diceResult);
    });
  };

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '540deg'],
  });

  const getDiceDotPattern = (val) => {
    switch (val) {
      case 1:
        return ['center'];
      case 2:
        return ['top-left', 'bottom-right'];
      case 3:
        return ['top-left', 'center', 'bottom-right'];
      case 4:
        return ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      case 5:
        return ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'];
      case 6:
        return [
          'top-left',
          'top-right',
          'middle-left',
          'middle-right',
          'bottom-left',
          'bottom-right',
        ];
      default:
        return ['center'];
    }
  };

  const dots = getDiceDotPattern(isRolling ? displayVal : value || displayVal);

  return (
    <View style={styles.container}>
      {/* Physical 3D Dice Box */}
      <View style={styles.diceShadowContainer}>
        <Animated.View
          style={[
            styles.diceBox,
            {
              transform: [
                { rotate: spin },
                { scale: scaleValue },
                { translateX: shakeValue },
              ],
            },
          ]}
        >
          {/* Top Bevel Highlight */}
          <View style={styles.diceBevel} />

          <View style={styles.diceFace}>
            {dots.includes('top-left') && <View style={[styles.dot, styles.tl]} />}
            {dots.includes('top-right') && <View style={[styles.dot, styles.tr]} />}
            {dots.includes('middle-left') && <View style={[styles.dot, styles.ml]} />}
            {dots.includes('center') && (
              <View style={[styles.dot, styles.c, dots.length === 1 && styles.redCenterDot]} />
            )}
            {dots.includes('middle-right') && <View style={[styles.dot, styles.mr]} />}
            {dots.includes('bottom-left') && <View style={[styles.dot, styles.bl]} />}
            {dots.includes('bottom-right') && <View style={[styles.dot, styles.br]} />}
          </View>
        </Animated.View>
      </View>

      {/* Roll Button with Micro-Interaction */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={handleRoll}
          disabled={disabled || isRolling}
          style={[
            styles.rollButton,
            (disabled || isRolling) && styles.disabledButton,
          ]}
        >
          <FontAwesome5 name="dice-five" size={15} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.rollButtonText}>
            {isRolling ? 'ROLLING...' : 'ROLL DICE'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  diceShadowContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 8,
  },
  diceBox: {
    width: 52,
    height: 52,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F59E0B', // Gold border trim
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  diceBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  diceFace: {
    width: 44,
    height: 44,
    position: 'relative',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0F172A',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  redCenterDot: {
    backgroundColor: '#EF4444',
  },
  tl: { top: 4, left: 4 },
  tr: { top: 4, right: 4 },
  ml: { top: 18, left: 4 },
  c: { top: 18, left: 18 },
  mr: { top: 18, right: 4 },
  bl: { bottom: 4, left: 4 },
  br: { bottom: 4, right: 4 },
  rollButton: {
    backgroundColor: '#D97706',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    elevation: 6,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#334155',
    borderColor: '#475569',
    opacity: 0.6,
  },
  rollButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
