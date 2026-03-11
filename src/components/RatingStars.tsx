import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderEvent, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

interface Props {
  rating: number;
  size?: number;
  color?: string;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  style?: any;
}

export default function RatingStars({
  rating,
  size = 20,
  color = '#FFD700',
  readonly = true,
  onRatingChange,
  style
}: Props) {
  const starsInfo = [1, 2, 3, 4, 5];
  const marginRight = 2;
  const containerWidth = size * 5 + marginRight * 4;

  const [isDragging, setIsDragging] = useState(false);
  const scaleAnim = useRef(starsInfo.map(() => new Animated.Value(1))).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const animateStars = (active: boolean) => {
    Animated.timing(glowAnim, {
      toValue: active ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();

    starsInfo.forEach((_, index) => {
      Animated.spring(scaleAnim[index], {
        toValue: active ? 1.15 : 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleTouch = (evt: GestureResponderEvent, isStart: boolean = false) => {
    if (readonly || !onRatingChange) return;

    if (isStart) {
      setIsDragging(true);
      animateStars(true);
    }

    const locationX = evt.nativeEvent.locationX;

    // Si toca en el último 25%, forzar 5 estrellas
    if (locationX >= containerWidth * 0.75) {
      onRatingChange(5);
      return;
    }

    // otherwise calculate normally
    const posicion = Math.ceil(locationX / (containerWidth / 5));
    let nuevasEstrellas = posicion;
    if (nuevasEstrellas < 1) nuevasEstrellas = 1;
    if (nuevasEstrellas > 5) nuevasEstrellas = 5;

    onRatingChange(nuevasEstrellas);
  };

  const handleRelease = () => {
    setIsDragging(false);
    animateStars(false);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !readonly,
      onStartShouldSetPanResponderCapture: () => !readonly,
      onMoveShouldSetPanResponder: () => !readonly,
      onMoveShouldSetPanResponderCapture: () => !readonly,
      onPanResponderGrant: (evt) => handleTouch(evt, true),
      onPanResponderMove: (evt) => handleTouch(evt, false),
      onPanResponderRelease: handleRelease,
      onPanResponderTerminate: handleRelease,
    })
  ).current;

  const glowSize = size * 0.7;

  return (
    <View
      style={[styles.container, { width: containerWidth }, style]}
      {...(readonly ? {} : panResponder.panHandlers)}
      collapsable={false}
    >
      {starsInfo.map((starIndex, index) => {
        const fullStar = rating >= starIndex;
        const halfStar = !fullStar && rating >= starIndex - 0.5;
        const iconName = fullStar ? 'star' : halfStar ? 'star-half' : 'star-outline';

        return (
          <Animated.View
            key={index}
            style={[
              { width: size, height: size, marginRight: index === 4 ? 0 : 2 },
              {
                transform: [{ scale: scaleAnim[index] }],
              },
            ]}
            pointerEvents="none"
          >
            {isDragging && (fullStar || halfStar) && (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: (size - glowSize) / 2,
                  left: (size - glowSize) / 2,
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.25],
                  }),
                }}
              >
                <Ionicons
                  name="star"
                  size={glowSize}
                  color={color}
                />
              </Animated.View>
            )}
            <Ionicons
              name={iconName}
              size={size}
              color={fullStar || halfStar ? color : colors.border}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});