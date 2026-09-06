import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import WelcomeScreen from './src/screens/WelcomeScreen';
import PlayerSetupScreen from './src/screens/PlayerSetupScreen';
import StartingMoneyScreen from './src/screens/StartingMoneyScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import { GAME_COLORS } from './src/styles/theme';

export default function App() {
  const [screen, setScreen] = useState('WELCOME');
  const [players, setPlayers] = useState([]);
  const [gameOverData, setGameOverData] = useState(null);

  const handleStartSetup = () => {
    setScreen('SETUP_PLAYERS');
  };

  const handlePlayersConfigured = (configuredPlayers) => {
    setPlayers(configuredPlayers);
    setScreen('SETUP_MONEY');
  };

  const handleStartingMoneySelected = (finalPlayers) => {
    setPlayers(finalPlayers);
    setScreen('GAME');
  };

  const handleGameOver = (finalPlayers, finalBoard) => {
    setGameOverData({ players: finalPlayers, board: finalBoard });
    setScreen('GAME_OVER');
  };

  const handlePlayAgain = () => {
    setPlayers([]);
    setGameOverData(null);
    setScreen('WELCOME');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />

      {screen === 'WELCOME' && (
        <WelcomeScreen onStart={handleStartSetup} />
      )}

      {screen === 'SETUP_PLAYERS' && (
        <PlayerSetupScreen onNext={handlePlayersConfigured} />
      )}

      {screen === 'SETUP_MONEY' && (
        <StartingMoneyScreen
          players={players}
          onStartGame={handleStartingMoneySelected}
        />
      )}

      {screen === 'GAME' && (
        <GameScreen
          initialPlayers={players}
          onGameOver={handleGameOver}
        />
      )}

      {screen === 'GAME_OVER' && gameOverData && (
        <GameOverScreen
          players={gameOverData.players}
          board={gameOverData.board}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GAME_COLORS.background,
  },
});
