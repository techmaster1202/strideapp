import React, {useState} from 'react';
import {
  Button,
  Surface,
  TextInput,
  useTheme,
  Snackbar,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import {StyleSheet, Dimensions, StatusBar, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import * as Animatable from 'react-native-animatable';
import {useAppDispatch} from '../store/hook';
import * as AppConstants from '../constants/constants.ts';
import {ImageOverlay} from '../components/image-overlay.tsx';
import {login} from '../services/authService.ts';
import {Navigation} from '../types/index.ts';
import Logo from '../components/Logo.tsx';
import {Background} from '../components/Background.tsx';
import Header from '../components/Header.tsx';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {userLoggedIn} from '../store/authSlice';
import {IAuthState} from '../interfaces/IAuthentication.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY} from '../utils/constantKey.ts';

type SignInFormData = {
  emailAddress: string;
  password: string;
};

type Props = {
  navigation: Navigation;
};

export default function SignInScreen({navigation}: Props) {
  const theme = useTheme();
  const [showSnack, setShowSnack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignInFormData>();

  const onSubmit = (data: SignInFormData) => {
    handleSignIn(data.emailAddress, data.password);
  };

  const onDismissSnackBar = () => setShowSnack(false);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    await login(email, password)
      .then(response => {
        if (response.success) {
          const user: IAuthState = {
            user: response.data.user,
            token: response.data.access_token,
            sessionTimedOut: false,
            isLoggedIn: true,
            darkMode: false,
          };
          dispatch(userLoggedIn(user));
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        }
        setSnackMessage(response.message);
        setShowSnack(true);
        setLoading(false);
        return;
      })
      .catch(error => {
        setSnackMessage(
          error.message || 'Something went wrong, please try again.',
        );
        setShowSnack(true);
        setLoading(false);
      });
  };

  return (
    <Background>
      <StatusBar barStyle="light-content" />
      <Animatable.View
        style={[styles.contentContainer]}
        animation="fadeInUpBig">
        <Surface style={styles.surface} elevation={1}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Logo />
          </View>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label={AppConstants.LABEL_EmailAddress}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                placeholder="Email Address"
                textContentType="emailAddress"
                style={styles.textInput}
              />
            )}
            name="emailAddress"
          />
          <View style={styles.errorField}>
            {errors.emailAddress && (
              <Text style={{color: theme.colors.error}}>
                {AppConstants.ERROR_EmailIsRequired}
              </Text>
            )}
          </View>

          <Controller
            control={control}
            rules={{
              maxLength: 100,
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label={AppConstants.LABEL_Password}
                mode="outlined"
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                textContentType="password"
                style={styles.textInput}
              />
            )}
            name="password"
          />
          <View style={styles.errorField}>
            {errors.password && (
              <Text style={{color: theme.colors.error}}>
                {AppConstants.ERROR_PasswordIsRequired}
              </Text>
            )}
          </View>

          <Button
            mode="contained"
            compact
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            loading={loading}>
            {AppConstants.TITLE_Login}
          </Button>
          <Button
            mode="text"
            compact
            onPress={() => navigation.navigate('SignUp')}
            style={styles.button}>
            {AppConstants.LABEL_NotAUser}
          </Button>
        </Surface>
      </Animatable.View>
      <Snackbar
        visible={showSnack}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
          onPress: () => {
            onDismissSnackBar();
          },
        }}>
        {snackMessage}
      </Snackbar>
    </Background>
  );
}

const {width, height} = Dimensions.get('screen');
const container_height = height * 0.6;
const container_width = width * 0.85;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  surface: {
    justifyContent: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: container_width,
  },
  button: {
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
  },
  textInput: {
    width: '100%',
  },
  errorField: {
    width: '100%',
    height: 25,
    display: 'flex',
    justifyContent: 'flex-start',
  },
});
