import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
const theme = {
  colors: {
    primary: '#1CE5C8',
    background: '#0B132B',
    surface: '#1a2332',
    text: '#F2F5FA',
    textSecondary: '#8B9DC3',
    border: '#2A3A4A',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  typography: {
    fontSize: {
      sm: 12,
      base: 16,
      lg: 18,
      xl: 24,
    },
    fontWeight: {
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
  },
};

// FruitScore Component
const FruitScore = ({ score, size = 'medium', showLabel = true }) => {
  const getColor = (score) => {
    if (score >= 90) return '#00FFB3';
    if (score >= 75) return '#FFD93D';
    return '#FF8C42';
  };

  const circleSize = size === 'small' ? 40 : size === 'large' ? 80 : 60;
  const textSize = size === 'small' ? 12 : size === 'large' ? 20 : 16;

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={[
          styles.fruitCircle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: getColor(score),
          },
        ]}
      >
        <Text
          style={[
            styles.fruitScore,
            {
              fontSize: textSize,
              color: '#0B132B',
              fontWeight: 'bold',
            },
          ]}
        >
          {score}
        </Text>
      </View>
      {showLabel && (
        <Text style={styles.fruitLabel}>Fruit Score</Text>
      )}
    </View>
  );
};

// Search Screen Component
const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSport, setSelectedSport] = useState('NBA');
  const [selectedPosition, setSelectedPosition] = useState('ALL');

  const positions = {
    NBA: ['ALL', 'PG', 'SG', 'SF', 'PF', 'C'],
    NFL: ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'],
  };

  const mockResults = [
    {
      id: '1',
      name: 'LeBron James',
      position: 'SF',
      team: 'LAL',
      sport: 'NBA',
      fruitScore: 94,
      latestProjection: { statType: 'Points', projection: 28.5 },
    },
    {
      id: '2',
      name: 'Giannis Antetokounmpo',
      position: 'PF',
      team: 'MIL',
      sport: 'NBA',
      fruitScore: 91,
      latestProjection: { statType: 'Points', projection: 32.1 },
    },
    {
      id: '3',
      name: 'Luka Dončić',
      position: 'PG',
      team: 'DAL',
      sport: 'NBA',
      fruitScore: 89,
      latestProjection: { statType: 'Points', projection: 31.2 },
    },
    {
      id: '4',
      name: 'Stephen Curry',
      position: 'PG',
      team: 'GSW',
      sport: 'NBA',
      fruitScore: 87,
      latestProjection: { statType: 'Points', projection: 26.8 },
    },
    {
      id: '5',
      name: 'Jayson Tatum',
      position: 'PF',
      team: 'BOS',
      sport: 'NBA',
      fruitScore: 85,
      latestProjection: { statType: 'Points', projection: 29.4 },
    },
  ];

  useEffect(() => {
    if (searchQuery.length >= 2) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedSport, selectedPosition]);

  const performSearch = async () => {
    setLoading(true);
    
    try {
      // Filter results based on search query and filters
      let filteredResults = mockResults.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        player.sport === selectedSport
      );

      if (selectedPosition !== 'ALL') {
        filteredResults = filteredResults.filter(player =>
          player.position === selectedPosition
        );
      }

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerPress = (player) => {
    navigation.navigate('PlayerDetail', { player });
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handlePlayerPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerMeta}>
          {item.position} • {item.team}
        </Text>
        {item.latestProjection && (
          <Text style={styles.projectionText}>
            {item.latestProjection.statType}: {item.latestProjection.projection}
          </Text>
        )}
      </View>
      <View style={styles.scoreContainer}>
        {item.fruitScore && (
          <FruitScore score={item.fruitScore} size="small" showLabel={false} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery.length >= 2 ? 'No players found' : 'Start typing to search'}
      </Text>
      <Text style={styles.emptySubtext}>
        Search by player name
      </Text>
    </View>
  );

  const renderPositionFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedSport === 'NBA' && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedSport('NBA')}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedSport === 'NBA' && styles.filterButtonTextActive,
          ]}
        >
          NBA
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedSport === 'NFL' && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedSport('NFL')}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedSport === 'NFL' && styles.filterButtonTextActive,
          ]}
        >
          NFL
        </Text>
      </TouchableOpacity>
      
      {positions[selectedSport].map((position) => (
        <TouchableOpacity
          key={position}
          style={[
            styles.filterButton,
            selectedPosition === position && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedPosition(position)}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedPosition === position && styles.filterButtonTextActive,
            ]}
          >
            {position}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search players..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Filters */}
      {renderPositionFilter()}

      {/* Search Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContainer,
            searchResults.length === 0 && styles.emptyListContainer,
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

// Watchlist Screen Component
const WatchlistScreen = ({ navigation }) => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [sortBy, setSortBy] = useState('fruitScore');

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const stored = await AsyncStorage.getItem('watchlist');
      if (stored) {
        setWatchlistItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    }
  };

  const handleRemoveFromWatchlist = (item) => {
    const updatedList = watchlistItems.filter(w => w.id !== item.id);
    setWatchlistItems(updatedList);
    AsyncStorage.setItem('watchlist', JSON.stringify(updatedList));
  };

  const renderPlayerCard = ({ item }) => (
    <View style={styles.playerCard}>
      <View style={styles.playerHeader}>
        <Text style={styles.playerName}>{item.player.name}</Text>
        <TouchableOpacity onPress={() => handleRemoveFromWatchlist(item)}>
          <Text style={styles.removeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.playerMeta}>
        {item.player.position} • {item.player.team}
      </Text>
      <View style={styles.cardFooter}>
        <FruitScore score={item.fruitScore} size="small" showLabel={false} />
        {item.latestProjection && (
          <Text style={styles.projectionText}>
            {item.latestProjection.statType}: {item.latestProjection.projection}
          </Text>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No players in watchlist</Text>
      <Text style={styles.emptySubtext}>
        Add players from search to track their performance
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Watchlist</Text>
        <Text style={styles.subtitle}>{watchlistItems.length} players</Text>
      </View>
      <FlatList
        data={watchlistItems}
        renderItem={renderPlayerCard}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

// Player Detail Screen Component
const PlayerDetailScreen = ({ route, navigation }) => {
  const { player } = route.params;
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    checkWatchlistStatus();
  }, []);

  const checkWatchlistStatus = async () => {
    try {
      const stored = await AsyncStorage.getItem('watchlist');
      if (stored) {
        const watchlist = JSON.parse(stored);
        const exists = watchlist.some(item => item.player.name === player.name);
        setIsInWatchlist(exists);
      }
    } catch (error) {
      console.error('Error checking watchlist:', error);
    }
  };

  const toggleWatchlist = async () => {
    try {
      const stored = await AsyncStorage.getItem('watchlist');
      let watchlist = stored ? JSON.parse(stored) : [];
      
      if (isInWatchlist) {
        watchlist = watchlist.filter(item => item.player.name !== player.name);
      } else {
        watchlist.push({
          id: Date.now().toString(),
          player: player,
          fruitScore: player.fruitScore || 88,
          latestProjection: player.latestProjection || null,
          addedDate: new Date().toISOString(),
        });
      }
      
      await AsyncStorage.setItem('watchlist', JSON.stringify(watchlist));
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Player Details</Text>
        <TouchableOpacity onPress={toggleWatchlist}>
          <Text style={styles.watchlistButton}>
            {isInWatchlist ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.playerHeader}>
          <View>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerMeta}>
              {player.position} • {player.team}
            </Text>
          </View>
          <FruitScore score={player.fruitScore} size="large" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Projection</Text>
          {player.latestProjection && (
            <View style={styles.projectionCard}>
              <Text style={styles.projectionStatType}>
                {player.latestProjection.statType}
              </Text>
              <Text style={styles.projectionValue}>
                {player.latestProjection.projection}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Performance</Text>
          <View style={styles.performanceCard}>
            <Text style={styles.performanceText}>
              Last 5 games average: 25.4 PPG
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analysis</Text>
          <View style={styles.analysisCard}>
            <Text style={styles.analysisText}>
              Strong candidate for today's slate with high fruit score rating. 
              Recent form shows consistent performance above projection averages.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Dashboard Screen Component
const DashboardScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Free Fruit</Text>
        <Text style={styles.subtitle}>Sports Intelligence Platform</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Players Tracked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>89%</Text>
            <Text style={styles.statLabel}>Avg Fruit Score</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.actionButtonText}>Search Players</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Watchlist')}
          >
            <Text style={styles.actionButtonText}>View Watchlist</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featured}>
          <Text style={styles.sectionTitle}>Featured Analysis</Text>
          <View style={styles.featuredCard}>
            <Text style={styles.featuredText}>
              NBA Top Picks for Tonight's Games
            </Text>
            <Text style={styles.featuredSubtext}>
              5 players with 90+ Fruit Scores
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Navigation Drawer
const Drawer = createDrawerNavigator();

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: theme.colors.background,
          },
          drawerActiveBackgroundColor: theme.colors.surface,
          drawerActiveTintColor: theme.colors.primary,
          drawerInactiveTintColor: theme.colors.textSecondary,
        }}
      >
        <Drawer.Screen name="Dashboard" component={DashboardScreen} />
        <Drawer.Screen name="Search" component={SearchScreen} />
        <Drawer.Screen name="Watchlist" component={WatchlistScreen} />
        <Drawer.Screen name="PlayerDetail" component={PlayerDetailScreen} options={{ drawerLabel: () => null }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  searchHeader: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  filterContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  filterContent: {
    paddingVertical: theme.spacing.xs,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  filterButtonTextActive: {
    color: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.base,
  },
  listContainer: {
    padding: theme.spacing.lg,
  },
  emptyListContainer: {
    flex: 1,
  },
  resultItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  playerMeta: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  projectionText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  playerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  removeButton: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    padding: theme.spacing.xs,
  },
  backButton: {
    fontSize: 24,
    color: theme.colors.text,
    padding: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  watchlistButton: {
    fontSize: 24,
    color: theme.colors.primary,
    padding: theme.spacing.md,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  section: {
    margin: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  projectionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  projectionStatType: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  projectionValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  performanceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  performanceText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    textAlign: 'center',
  },
  analysisCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  analysisText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.background,
  },
  featured: {
    marginBottom: theme.spacing.lg,
  },
  featuredCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  featuredText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  featuredSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  fruitCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fruitScore: {
    textAlign: 'center',
  },
  fruitLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});