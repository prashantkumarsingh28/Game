import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getRandomInt } from '../utils/currency';

export default function Dice({ onRoll, disabled, value }) {
  const [isRolling, setIsRolling] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handleRoll = () => {
    if (disabled || isRolling) return;

    setIsRolling(true);

    // Animate rotation & scale
    spinValue.setValue(0);
    scaleValue.setValue(1);

    Animated.parallel([
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.25,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setIsRolling(false);
      const diceResult = getRandomInt(1, 6);
      if (onRoll) onRoll(diceResult);
    });
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const getDiceDotPattern = (val) => {
    // Return dots for 1-6 standard die
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

  const dots = getDiceDotPattern(value || 1);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.diceBox,
          {
            transform: [{ rotate: spin }, { scale: scaleValue }],
          },
        ]}
      >
        <View style={styles.diceFace}>
          {dots.includes('top-left') && <View style={[styles.dot, styles.tl]} />}
          {dots.includes('top-right') && <View style={[styles.dot, styles.tr]} />}
          {dots.includes('middle-left') && <View style={[styles.dot, styles.ml]} />}
          {dots.includes('center') && <View style={[styles.dot, styles.c]} />}
          {dots.includes('middle-right') && <View style={[styles.dot, styles.mr]} />}
          {dots.includes('bottom-left') && <View style={[styles.dot, styles.bl]} />}
          {dots.includes('bottom-right') && <View style={[styles.dot, styles.br]} />}
        </View>
      </Animated.View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleRoll}
        disabled={disabled || isRolling}
        style={[
          styles.rollButton,
          (disabled || isRolling) && styles.disabledButton,
        ]}
      >
        <FontAwesome5 name="dice" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
        <Text style={styles.rollButtonText}>
          {isRolling ? 'ROLLING...' : 'ROLL DICE'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  diceBox: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    marginBottom: 8,
  },
  diceFace: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0F172A',
    position: 'absolute',
  },
  tl: { top: 3, left: 3 },
  tr: { top: 3, right: 3 },
  ml: { top: 16, left: 3 },
  c: { top: 16, left: 16 },
  mr: { top: 16, right: 3 },
  bl: { bottom: 3, left: 3 },
  br: { bottom: 3, right: 3 },
  rollButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  disabledButton: {
    backgroundColor: '#475569',
    opacity: 0.7,
  },
  rollButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
