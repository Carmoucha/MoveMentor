import { StyleSheet, Dimensions } from "react-native";
import {COLORS} from './constants';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 5,
    gap: 1,
  },
  filtersButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 4,
    backgroundColor: '#fff',
    alignContent: 'center',
    alignSelf: 'center',
  },
  filtersButtonsSelected: {
    backgroundColor: COLORS.primaryGreen,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#000',
  },
  buttonTextSelected: {
    color: '#fff',
  },
  videoContainer: {
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.unfocusedGray,
    padding: 10,
    borderRadius: 20,
    width: screenWidth - 20,
    marginVertical: 10,
  },
  thumbnail: {
    width: 100,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignSelf: 'center'
  },
  textContainer: {
    marginLeft: 15,
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
  },
  duration: {
    marginTop: 5,
    fontWeight: '900',
  },
  redirecttoYtbButton: {
    backgroundColor: COLORS.primaryGreen,
    height: 40,
    width: 40,
    borderRadius: 15,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  filtersSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  counterWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  counterText: {
    color: COLORS.primaryGreen,
    fontSize: 18,
    fontWeight: 'bold',
  },
  countDisplay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 0,
    padding: 4,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    zIndex: 1000,
  },
});

export default styles;