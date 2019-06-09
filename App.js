/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React, {Component} from 'react';
 import {Platform, StyleSheet, Text, View, Button,AsyncStorage,BackHandler, Animated,Dimensions,TouchableOpacity } from 'react-native';
 import Routes from './screens/Routes';
 import Routes1 from './screens/Routes1';
 import Login from './screens/login';
 import SignUp from './screens/signUp';
 import Follow from './screens/follow';
 import Post from './screens/posts';
 import Profile from './screens/profile';
 import Addpost from './screens/addPost';
 import Explore from './screens/explore';
 import SinglePost from './screens/singlePost';
 import UserProfile from './screens/visitProfile';
 import TabViewExample from './screens/tab';
 let {width, height} = Dimensions.get('window');
 
 


 export default class App extends Component {
   constructor(props){
     super(props)
     this.state={
       value:[],
     }
     // this.springValue = new Animated.Value(100);
   }

   // state = {
   //   backClickCount: 0
   // };


   // componentWillUnmount() {
   //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
   // }
   // _spring() {
   //   this.setState({backClickCount: 1}, () => {
   //     Animated.sequence([
   //       Animated.spring(
   //         this.springValue,
   //         {
   //           toValue: -.15 * height,
   //           friction: 5,
   //           duration: 300,
   //           useNativeDriver: true,
   //         }
   //         ),
   //       Animated.timing(
   //         this.springValue,
   //         {
   //           toValue: 100,
   //           duration: 300,
   //           useNativeDriver: true,
   //         }
   //         ),

   //       ]).start(() => {
   //         this.setState({backClickCount: 0});
   //       });
   //     });

   // }

   // handleBackButton = () => {
   //   this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();

   //   return true;
   // };

   

   componentWillMount= async()=>{
     console.log("call componant in app js ------------------------------------------------------------------------------------------");
     let value = await  AsyncStorage.getItem('curruntUser');
     console.log('curuuntuser---------------------------->',JSON.parse(value));
     let value1 = JSON.parse(value);
     if (value1.data._id !== null) {
       this.setState({value: value1.data._id});       
       console.log("appjs  ================appjss=======================",this.state.value);
     }  
     // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);


   }
   render() {
     console.log("=============================value=================",this.state.value);

     if(this.state.value==false){
       return (
        
         <Routes />
         

         );
     }else{
       return( 
         // <View style={styles.container}>

         <Routes1 />
         // <View >
         // <Animated.View style={[styles.animatedView, {transform: [{translateY: this.springValue}]}]}>
         // <Text style={styles.exitTitleText}>press back again to exit the app</Text>

         // <TouchableOpacity
         // activeOpacity={0.5}
         // onPress={() => BackHandler.exitApp()}
         // >
         // <Text style={styles.exitText}>Exit</Text>
         // </TouchableOpacity>

         // </Animated.View>
         // </View>
         // </View>

         


         )
     }
   }
 }



 const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  animatedView: {
        width,
        backgroundColor: "#4b415a",
        elevation: 2,
        position: "absolute",
        bottom: 0,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    exitTitleText: {
        textAlign: "center",
        color: "#fff",
        marginRight: 10,
    },
    exitText: {
        color: "#e5933a",
        paddingHorizontal: 10,
        paddingVertical: 3
    }
 });
