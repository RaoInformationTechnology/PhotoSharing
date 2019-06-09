/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React, {Component} from 'react';
 import {Platform, StyleSheet, Text, View,TextInput
   ,Button,TouchableOpacity,Alert,ScrollView,ToastAndroid,Dimensions} from 'react-native';
   import Config from './config';
   import axios from 'axios';
   import {AsyncStorage} from 'react-native';
   import { Actions } from 'react-native-router-flux';
   import FBSDK, { LoginManager } from "react-native-fbsdk";
   import Icon from 'react-native-vector-icons/MaterialIcons';
   const {height} = Dimensions.get('screen');



   let config = new Config();

   export default class Login extends Component{
     constructor(props){
       super(props)
       this.state = {
         // isAuthenticated: false,
         // user: null,
         // token: '',
         userName: "",
         password:"",
         ButtonStateHolder : false ,
         isVisible :true


       };

     }





     onLogin =  (data) => {
       console.log('dat====================>',data);
       this.setState({
         ButtonStateHolder : true  
       })
       
       if(this.state.userName == "" || this.state.password == ""){
         console.log("===========requirefd-=============================");
         // Alert.alert(
           //   '',
           //   'Enter Username and Password',
           //   [
           //   {
             //     text: 'Cancel',
             //     onPress: () => {this.setState({
               //     ButtonStateHolder : false  
               //   }),console.log('Cancel Pressed')},
             //     style: 'cancel',
             //   },
             //   {text: 'OK', onPress: () =>{  this.setState({
               //     ButtonStateHolder : false  
               //   }), console.log('OK Pressed')}},
             //   ],
             //   {cancelable: false},
             //   );  
         ToastAndroid.show('Enter username and password', ToastAndroid.SHORT);
         this.setState({
           ButtonStateHolder : false  
         })
       }
       else{
         var payload={
           "userName":this.state.userName,
           "password":this.state.password
         }
         console.log("payload=============>",payload);
         var apiBaseUrl = config.getBaseUrl() + "user/login";
         console.log('apiBaseUrl===========>',apiBaseUrl)
         axios.post(apiBaseUrl, payload)
         .then(async function (response) {
           console.log("-------------------------------------------------------------------------------------------");
           console.log("response=================>",response.data);
           try {
             // console.log(">>>>>>>>>>>>>>>>",JSON.stringify(response.data));
             await AsyncStorage.setItem('curruntUser',JSON.stringify(response.data));             
           } catch (error) {
             console.log(error);
           }
           let curruntUser = await AsyncStorage.getItem('curruntUser');
           console.log('curuuntuser---------------------------->',JSON.parse(curruntUser));
           console.log(']]]]]]]]]]]]]]]]]]',curruntUser);
           Actions.profile();
           console.log("login successfull");
         },function(err){
  console.log("err=============>",err);
  ToastAndroid.show('invalid username or password', ToastAndroid.SHORT);

})
this.setState({
  ButtonStateHolder : false  
})
}



}

facebookLogin(){
  LoginManager.logInWithReadPermissions(["public_profile"]).then(
    function(result) {
      console.log('result============================>',result)
      if (result.isCancelled) {
        console.log("Login cancelled");
      } else {
        console.log(
          "Login success with permissions: " +
          result.grantedPermissions.toString()
          );
      }
    },
    function(error) {
      console.log("Login fail with error: " + error);
    }
    );
}
onPress = ()=>{
  this.setState({isVisible:!this.state.isVisible})
}




render() {

  const {navigate} = this.props.navigation;
  return (

    <View style={{
      // backgroundColor:'red',     
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>



    <View style={{flexDirection:'row'}} >
    <View style={{flex:1}} />
    <View style={{flex: 6}} >
    <View >
    <View style={styles.container}>
    <Text style={styles.titleText}>Photosharing</Text>
    <View style={{marginTop:20}}>
    <TextInput
    value={this.state.userName}
    onChangeText={(userName) => this.setState({userName: userName })}
    placeholder={'Username'}        
    style={styles.input}
    />

    

    <TextInput
    value={this.state.password}
    onChangeText={(password) => this.setState({ password:password })}
    placeholder={'Password'}
    secureTextEntry={this.state.isVisible}
    style={styles.input}
    />
    <Icon name={this.state.isVisible ? "visibility-off" : "visibility"}
    style={{position: 'absolute',bottom:20, right: 0}}
    size={20}
    onPress={this.onPress}/>



    </View>

    <TouchableOpacity
    style={[styles.button,{ backgroundColor: this.state.ButtonStateHolder ? '#607D8B' : '#0099e7'}]}
    onPress={()=>this.onLogin(this.state)}
    disabled={this.state.ButtonStateHolder}
    >
    <Text style={{textAlign:'center',marginTop:5,color:'white'}}>Login</Text>
    </TouchableOpacity>

    <View style={{marginTop:10}}>
    <Text style={{color:'#aca5a5',textAlign:'center'}}>OR</Text>
    </View>


    <TouchableOpacity onPress={()=>this.facebookLogin()}>
    <Text style={{textAlign:'center',marginTop:5,color:'#385185'}}>Login with Facebook</Text>
    </TouchableOpacity>
    </View>

    <View style={styles.signUpView}>
    <View style={{flexDirection:'row'}}>
    <Text style={{color:'black'}}>Don't have an account?</Text>
    <TouchableOpacity
    onPress={()=>Actions.signup()}
    >
    <Text style={{color:'#0099e7',marginLeft:15}}>SignUp</Text>
    </TouchableOpacity>
    </View>
    </View>
    </View>
    </View>
    <View style={{ flex:1}} />
    </View>






    </View>


    );
}
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e0e0',
    borderRadius: 10,
    // width: 260,
    padding: 20,
    // marginLeft:30,
    // marginTop:90, 
    height: 'auto',

  },
  titleText:{
    fontSize:20,
    fontWeight: 'bold',
    color: '#0099e7',
    textAlign: 'center',
    // fontStyle: 'italic',

  },
  input: {
    // width: 230,
    height: 44,
    // padding: 10,
    borderBottomWidth: 1,
    borderColor: '#C0C0C0',
    marginBottom: 10,
    // marginLeft:5,


  },
  button: {
    // marginLeft:30,
    marginTop: 10,
    height: 33,
    padding: 0,
    width: 230,
    backgroundColor:'#0099e7',
    borderRadius: 3,

  },
  signUpView:{
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e0e0',
    borderRadius: 10,
    // width: 310,
    padding: 20,
    // marginLeft:23,
    marginTop:15, 
    height: 'auto'
  }


});
