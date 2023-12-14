import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { setLogout } from '../../redux/slices/authSlice';
import { decrement, increment, incrementByAmount } from '../../redux/slices/counterSlice';

import { isUserLoggedIn } from '../../redux/slices/authSlice'

export const Home = ({ navigation }) => {
    const dispatch = useDispatch();
    const auth = useSelector(isUserLoggedIn);
    const count = useSelector((state) => state?.counter?.value);

    const onLogout = async () => {
        dispatch(setLogout());
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
    }

    return (
        <View style={styles.container}>
            <View style={styles.btnContainer}>
                <Button title="+" onPress={() => dispatch(increment())} />
                <Text>{count}</Text>
                <Button title="-" onPress={() => dispatch(decrement())} />
                {/* <Button title="+ by 35" onPress={() => dispatch(incrementByAmount(35))} /> */}
            </View>

            {auth  && <Button title="Go to Listing" onPress={() => navigation.navigate('Listing')} />}
            {auth  && <Button title="Go to Album" onPress={() => navigation.navigate('Album')} />}
            {auth  && <Button title="Go to Camera" onPress={() => navigation.navigate('Camera')} />}
            {!auth && <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />}
            {!auth && <Button title="Go to Registration" onPress={() => navigation.navigate('Registration')} />}
            {auth && <Button title="Logout" onPress={onLogout} />}
        </View>
    );
}

export default Home;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center'
      }
});