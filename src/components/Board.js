import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import BoardSpace from './BoardSpace';

const PERIMETER_MAP = [
  { row: 0, col: 0 }, // 0: ORIGIN
  { row: 0, col: 1 }, // 1
  { row: 0, col: 2 }, // 2
  { row: 0, col: 3 }, // 3
  { row: 0, col: 4 }, // 4
  { row: 0, col: 5 }, // 5
  { row: 0, col: 6 }, // 6: SAFE 1
  { row: 1, col: 6 }, // 7
  { row: 2, col: 6 }, // 8
  { row: 3, col: 6 }, // 9
  { row: 4, col: 6 }, // 10
  { row: 5, col: 6 }, // 11
  { row: 6, col: 6 }, // 12
  { row: 7, col: 6 }, // 13
  { row: 8, col: 6 }, // 14: SAFE 2
  { row: 8, col: 5 }, // 15
  { row: 8, col: 4 }, // 16
  { row: 8, col: 3 }, // 17
  { row: 8, col: 2 }, // 18
  { row: 8, col: 1 }, // 19
  { row: 8, col: 0 }, // 20: SAFE 3
  { row: 7, col: 0 }, // 21
  { row: 6, col: 0 }, // 22
  { row: 5, col: 0 }, // 23
  { row: 4, col: 0 }, // 24
  { row: 3, col: 0 }, // 25
  { row: 2, col: 0 }, // 26
  { row: 1, col: 0 }, // 27
];

export default function Board({ board, players, onSpacePress, centerContent }) {
  return (
    <View style={styles.boardWrapper}>
      <View style={styles.gridContainer}>
        {/* Render 28 Perimeter Spaces */}
        {board.map((space, index) => {
          const gridPos = PERIMETER_MAP[index] || { row: 0, col: 0 };
          const playersOnSpace = players.filter(
            (p) => p.position === space.id
          );

          return (
            <View
              key={space.id}
              style={[
                styles.gridCell,
                {
                  left: `${(gridPos.col / 7) * 100}%`,
                  top: `${(gridPos.row / 9) * 100}%`,
                  width: `${(1 / 7) * 100}%`,
                  height: `${(1 / 9) * 100}%`,
                },
              ]}
            >
              <BoardSpace
                space={space}
                playersOnSpace={playersOnSpace}
                players={players}
                onPress={onSpacePress}
              />
            </View>
          );
        })}

        {/* Center Area (Rows 1..7, Cols 1..5) */}
        <View style={styles.centerArea}>{centerContent}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardWrapper: {
    width: '100%',
    aspectRatio: 7 / 9,
    maxHeight: 460,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#334155',
    padding: 2,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  gridContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  gridCell: {
    position: 'absolute',
  },
  centerArea: {
    position: 'absolute',
    left: `${(1 / 7) * 100}%`,
    top: `${(1 / 9) * 100}%`,
    width: `${(5 / 7) * 100}%`,
    height: `${(7 / 9) * 100}%`,
    backgroundColor: '#0B132B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
