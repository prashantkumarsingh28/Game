import React from 'react';
import { View, StyleSheet } from 'react-native';
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

export default function Board({ board, players, currentPlayerIndex, onSpacePress, centerContent }) {
  const activePlayer = players && players[currentPlayerIndex];

  return (
    <View style={styles.boardOuterShadow}>
      <View style={styles.boardWrapper}>
        <View style={styles.gridContainer}>
          {/* Render 28 Perimeter Spaces */}
          {board.map((space, index) => {
            const gridPos = PERIMETER_MAP[index] || { row: 0, col: 0 };
            const playersOnSpace = (players || []).map((p, idx) => ({
              ...p,
              isCurrentTurn: idx === currentPlayerIndex,
            })).filter((p) => p.position === space.id);

            const isCurrentTurnPlayerPos = activePlayer && activePlayer.position === space.id;

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
                  isCurrentTurnPlayerPos={isCurrentTurnPlayerPos}
                />
              </View>
            );
          })}

          {/* Center Area (Rows 1..7, Cols 1..5) */}
          <View style={styles.centerArea}>{centerContent}</View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardOuterShadow: {
    width: '100%',
    aspectRatio: 7 / 9,
    maxHeight: 460,
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.75,
    shadowRadius: 12,
    elevation: 10,
    marginVertical: 4,
  },
  boardWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#D97706', // Luxury Gold border rim
    padding: 3,
    overflow: 'hidden',
  },
  gridContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
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
    backgroundColor: 'rgba(11, 19, 43, 0.95)',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.4)', // Faint gold border
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
