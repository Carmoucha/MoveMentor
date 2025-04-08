import { StyleSheet, Dimensions } from 'react-native';
import COLORS from './constants'

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 100,
    backgroundColor: COLORS.unfocusedGray,
    borderRadius: 40,
    flexDirection: 'row',
    borderTopWidth: 0,
    elevation: 3,
    overflow: 'hidden',
    width: windowWidth - 20, 
    marginLeft: 10, // Center the tab bar
    alignContent: 'center',
  },
  tabBarItemStyle: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', 
    paddingTop: 15, 
  },
  activeTab: {
    position: 'absolute',
    left:2,
    right: 0,
    height: 80, 
    paddingTop: 10, 
    top: -4, 
    backgroundColor: COLORS.lightGreen,
    borderRadius: 30,
    zIndex: -1, // Ensure it stays behind the icon and label
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    width: 100,
    textAlign: 'center',
    bottom: -25,
  },
});
export default styles;