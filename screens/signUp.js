

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View ,TextInput, Button,TouchableOpacity,Alert,ScrollView,ToastAndroid} from 'react-native';
import Config from './config';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';




let config = new Config();
export default class SignUp extends Component {
  constructor(props){
    super(props)
    this.state ={
      name:"",
      email:"",
      userName:"",
      password:"",
      visible: false, 
      ButtonStateHolder : false ,
      isVisible :true

    }
  }

  

  signUp(){
    // console.log('data=============>',data);
    this.setState({
      ButtonStateHolder : true  
    })
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(this.state.name == "" || this.state.email == "" || this.state.userName == "" || this.state.password == ""){
      // Alert.alert(
      //   '',
      //   'Enter Valid Value',
      //   [
      //   {
        //     text: 'Cancel',
        //     onPress: () => console.log('Cancel Pressed'),
        //     style: 'cancel',
        //   },
        //   {text: 'OK', onPress: () => console.log('OK Pressed')},
        //   ],
        //   {cancelable: false},
        //   );
        ToastAndroid.show('Enter Valid Value', ToastAndroid.SHORT);
        this.setState({
          ButtonStateHolder : false  
        })

      }else if(reg.test(this.state.email) === false){
        console.log("Email is Not Correct");
        //   Alert.alert(
        //     '',
        //     'Enter Valid Email',
        //     [
        //     {
          //       text: 'Cancel',
          //       onPress: () => { this.setState({
            //   ButtonStateHolder : false  
            // }),console.log('Cancel Pressed')},
            //       style: 'cancel',
            //     },
            //     {text: 'OK', onPress: () => { this.setState({
              //   ButtonStateHolder : false  
              // }),console.log('OK Pressed')}},
              //     ],
              //     {cancelable: false},
              //     );
              ToastAndroid.show('Enter Valid Email', ToastAndroid.SHORT);
              this.setState({
                ButtonStateHolder : false  
              })
              return false;

            }
            else{
              var apiBaseUrl = config.getBaseUrl() + "user/signup";
              console.log('apiBaseUrl===========>',apiBaseUrl);
              var payload ={
                "name":this.state.name,
                "email":this.state.email,
                "password":this.state.password,
                "userName":this.state.userName,
              }
              axios.post(apiBaseUrl, payload)
              .then(function (response) {
                console.log("response===============>",response.data);
                Actions.login();
                ToastAndroid.show('Registerd successfully...', ToastAndroid.SHORT);
                console.log("register successfull");
              },function(err){
                console.log("err======================>",err);
                // Alert.alert(
                //   '',
                //   'Enter Another UserName',
                //   [
                //   {
                  //     text: 'Cancel',
                  //     onPress: () => console.log('Cancel Pressed'),
                  //     style: 'cancel',
                  //   },
                  //   {text: 'OK', onPress: () => console.log('OK Pressed')},
                  //   ],
                  //   {cancelable: false},
                  //   );
                  ToastAndroid.show('Enter Another UserName', ToastAndroid.SHORT);




                })

            }
            this.setState({
              ButtonStateHolder : false  
            })


          }
          onPress = ()=>{
            this.setState({isVisible:!this.state.isVisible})
          }

          userNameHandle(value){

            this.setState({
              userName: value.replace(/\s/g, '_')
            })
            console.log("===============userName============",this.state.userName);
          }




          render() {
            const {navigate} = this.props.navigation;
            // const Toast = (props) => {
              //   if (props.visible) {
                //     ToastAndroid.showWithGravityAndOffset(
                //       props.message,
                //       ToastAndroid.LONG,
                //       ToastAndroid.BOTTOM,
                //       25,
                //       140,
                //       );
                //     return null;
                //   }
                //   return null;
                // };

                return (
                  <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
                  <View style={{flexDirection:'row'}}>
                  <View style={{flex:1}}>
                  </View>
                  <View style={{flex:6}}>
                  <View style={styles.container}>
                  <Text style={styles.titleText}>Photosharing</Text>
                  <View style={{marginTop:20}}>
                  <TextInput
                  value={this.state.name}
                  onChangeText={(name) => this.setState({name: name })}
                  placeholder={'Name'}        
                  style={styles.input}
                  />

                  <TextInput
                  value={this.state.userName}
                  onChangeText={(userName) => this.userNameHandle(userName)}
                  placeholder={'Username'}        
                  style={styles.input}
                  />

                  <TextInput
                  value={this.state.email}
                  onChangeText={(email) => this.setState({email:email})}
                  placeholder={'Email'}        
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
                  disabled={this.state.ButtonStateHolder}
                  onPress={()=>this.signUp()
                  }
                  >
                  <Text style={{textAlign:'center',marginTop:5,color:'white'}}>SignUp</Text>
                  </TouchableOpacity>


                  <View>
                  <Text style={{ marginTop: 15, color: '#837c7c', fontSize: 12,textAlign:'center'}}>By signing up, you agree to our Terms, Data Policy and Cookies Policy</Text>
                  </View>
                  </View>

                  <View style={styles.signUpView}>
                  <View style={{flexDirection:'row'}}>
                  <Text style={{color:'black',marginLeft:40}}>Have an account?</Text>
                  <TouchableOpacity
                  onPress={()=>Actions.login()}
                  >
                  <Text style={{color:'#0099e7',marginLeft:15}}>Login</Text>
                  </TouchableOpacity>
                  </View>
                  </View>
                  </View>
                  <View style={{flex:1}}>
                  </View>
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
                // width: 310,
                padding: 20,
                // marginLeft:23,
                // marginTop:40, 
                height: 'auto'
              },
              input: {
                // width: 230,
                height: 44,
                // padding: 10,
                borderBottomWidth: 1,
                borderColor: '#C0C0C0',
                marginBottom: 10,
                // marginLeft:30,
              },
              titleText:{
                fontSize:20,
                fontWeight: 'bold',
                color: '#0099e7',
                textAlign: 'center',
                // fontStyle: 'italic',

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
