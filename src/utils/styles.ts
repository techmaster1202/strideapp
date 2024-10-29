import {Dimensions, StyleSheet} from 'react-native';
import {MD3Theme} from 'react-native-paper';

export const createGlobalStyles = (theme: MD3Theme) => {
  const {width, height} = Dimensions.get('screen');
  const container_height = height * 0.6;
  const container_width = width * 0.85;

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 15,
      backgroundColor: theme.colors.primaryContainer,
    },
    surface: {
      justifyContent: 'flex-start',
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderRadius: 5,
      width: container_width,
      backgroundColor: theme.colors.primaryContainer, // theme-based background color
    },
    errorField: {
      width: '100%',
      height: 25,
      display: 'flex',
      justifyContent: 'flex-start',
      color: theme.colors.error,
    },
    formSection: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
    },
    primaryTitleText: {
      color: theme.colors.onPrimaryContainer,
    },
    errorText: {
      color: theme.colors.error,
    },
    textInput: {
      width: '100%',
    },
    defaultButton: {
      width: '100%',
      borderRadius: 5,
    },
    dangerButton: {
      width: '100%',
      borderRadius: 5,
      backgroundColor: theme.colors.error,
    },
    defaultModalButton: {
      borderRadius: 5,
      width: 150,
    },
    dangerModalButton: {
      borderRadius: 5,
      backgroundColor: theme.colors.error,
      width: 150,
    },
    modalContainerBack: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContainer: {
      padding: 20,
      borderRadius: 10,
      width: 350,
      height: 200,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryContainer,
    },
    modalButtonGroup: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      flexDirection: 'row',
      gap: 10,
    },
  });
};
