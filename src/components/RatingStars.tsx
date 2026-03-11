import React, { useRef } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

interface Props {
  rating: number; // 0 to 5
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

  const handleTouch = (evt: GestureResponderEvent) => {
    if (readonly || !onRatingChange) return;
    const locationX = evt.nativeEvent.locationX;
    const starWidthUnit = size + 2;
    
    const boundedX = Math.max(0, Math.min(locationX, starWidthUnit * 5));
    const index = Math.floor(boundedX / starWidthUnit);
    const remainder = boundedX % starWidthUnit;
    
    let newRating = 0;
    if (index >= 5) {
      newRating = 5;
    } else {
      const isHalf = remainder < size / 2;
      newRating = index + (isHalf ? 0.5 : 1);
    }
    
    if (newRating !== rating) {
      onRatingChange(Math.max(0.5, newRating)); // minimum 0.5
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !readonly,
      onStartShouldSetPanResponderCapture: () => !readonly,
      onMoveShouldSetPanResponder: () => !readonly,
      onMoveShouldSetPanResponderCapture: () => !readonly,
      onPanResponderGrant: (evt) => handleTouch(evt),
      onPanResponderMove: (evt) => handleTouch(evt),
    })
  ).current;

  return (
    <View 
      style={[styles.container, style]}
      {...(readonly ? {} : panResponder.panHandlers)}
      collapsable={false}
    >
      {starsInfo.map((starIndex, index) => {
        const fullStar = rating >= starIndex;
        const halfStar = !fullStar && rating >= starIndex - 0.5;
        const iconName = fullStar ? 'star' : halfStar ? 'star-half' : 'star-outline';
        
        return (
          <View key={index} style={{ width: size, height: size, marginRight: index === 4 ? 0 : 2 }} pointerEvents="none">
            <Ionicons 
              name={iconName} 
              size={size} 
              color={fullStar || halfStar ? color : colors.border} 
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
