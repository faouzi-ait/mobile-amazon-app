import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Text, View, Button, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { setLogout } from '../../redux/slices/authSlice';
import { decrement, increment, incrementByAmount } from '../../redux/slices/counterSlice';
import { isUserLoggedIn } from '../../redux/slices/authSlice';

import { ThemeProvider, ToggleThemeButton } from '../../components'; 

export const Home = ({ navigation }) => {
    const dispatch = useDispatch();
    const auth = useSelector(isUserLoggedIn);
    const count = useSelector((state) => state?.counter?.value);
    
    const theme = useSelector((state) => state.theme.type);
    const isDark = theme === 'dark';

    const onLogout = async () => {
        dispatch(setLogout());
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
    }

    return (
        <ThemeProvider>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <View style={styles.btnContainer}>
                <Button title="+" onPress={() => dispatch(increment())} />
                <Text style={{ color: `${isDark ? 'white' : 'black'}` }}>{count}</Text>
                <Button title="-" onPress={() => dispatch(decrement())} />
                {/* <Button title="+ by 35" onPress={() => dispatch(incrementByAmount(35))} /> */}
            </View>

            <ToggleThemeButton />

            {auth  && <Button title="Go to Listing" onPress={() => navigation.navigate('Listing')} />}
            {auth  && <Button title="Go to Album" onPress={() => navigation.navigate('Album')} />}
            {auth  && <Button title="Go to Camera" onPress={() => navigation.navigate('Camera')} />}
            {!auth && <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />}
            {!auth && <Button title="Go to Registration" onPress={() => navigation.navigate('Registration')} />}
            {auth && <Button title="Logout" onPress={onLogout} />}
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default Home;
