import { Modal , TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { COLORS, useThemeStore } from '@/store/themeStore';
import { BLOSSOM, FOREST, IColor, OCEAN, RETRO } from '@/constants/colors';

const themes = [FOREST, RETRO, OCEAN, BLOSSOM];

interface IThemeSelector{
  setShowThemeSelection: React.Dispatch<React.SetStateAction<boolean>>
  showThemeSelection: boolean
}

const ThemeSelector: React.FC<IThemeSelector> = ({ setShowThemeSelection, showThemeSelection }) => {
  const { setColors } = useThemeStore();

  const handleThemeChange = (theme: IColor) => {
    setColors(theme);
    setShowThemeSelection(false);
  };

  return (
    <Modal
      visible={showThemeSelection}
      transparent={true}
      onRequestClose={() => setShowThemeSelection(false)}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => setShowThemeSelection(false)}
      >
        <View style={styles.themeSelector}>
          {themes.map((theme, index) => (
            <TouchableOpacity
              key={index}
              style={styles.themeItem}
              onPress={() => handleThemeChange(theme)}
            >
              <Text style={styles.themeName}>{theme.name}</Text>
              <View style={[styles.themeColor, { backgroundColor: theme.primary }]} />
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ThemeSelector

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  themeSelector: {
    backgroundColor: COLORS.cardBackground,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    columnGap: 30
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    width: 70,
    color: COLORS.textPrimary,
  },
  themeColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
});