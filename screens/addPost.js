/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React, {Component} from 'react';
 import {Platform, StyleSheet, Text, View,TextInput
   ,Button,TouchableOpacity,Image,Alert,ScrollView,ToastAndroid} from 'react-native';
   import Config from './config';
   import axios from 'axios';
   import {AsyncStorage} from 'react-native';
   import { Actions } from 'react-native-router-flux';
   import Icon from 'react-native-vector-icons/MaterialIcons';
   import ImagePicker from 'react-native-image-picker';
   import RNFetchBlob from 'react-native-fetch-blob';
   



   let config = new Config();

   export default class Addpost extends Component{
     constructor(props){
       super(props)
       this.state = {
         content:"",
         file: "",
         imageName:"",
          // ButtonStateHolder : false ,


       };

     }
     pickImage =  () => {
       console.log("function call=========>");
       const options = {
         allowsEditing: true,
         base64: false
       };
       ImagePicker.launchImageLibrary(options, (response) => {

         if (response.didCancel) {
           console.log('User cancelled image picker');
         } else if (response.error) {
           console.log('ImagePicker Error: ', response.error);
         } else if (response.customButton) {
           console.log('User tapped custom button: ', response.customButton);
         } 
         else {
           console.log("this images===========",response);
           const source = { uri: response.uri }
           console.log("source=============================>",source);
           this.setState({ file: response.uri, imageName : response.fileName });
         }
       })
     };
     addPost = async (data) =>{
       let userId;
       console.log("function calling==============>",data);
      //  this.setState({
      //   ButtonStateHolder : true  
      // })
       if(this.state.imageName == ""){
         // Alert.alert(
         //   '',
         //   'Select Image',
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
         ToastAndroid.show('Select Image', ToastAndroid.SHORT);
       }else{
         try {
           const curruntUser = await  AsyncStorage.getItem('curruntUser');
           if (curruntUser !== null) {
             userId = JSON.parse(curruntUser)

             console.log("value===+++++++++++++++++++++===========================>",userId.data._id);
           }
         } catch (error) {
           console.log("==============");
         }

         RNFetchBlob.fetch('POST', config.getBaseUrl()+'post/addpost', {
           'Content-Type' : 'multipart/form-data',
         },
         [

         {
           name : 'content',
           data: this.state.content
         },
         {
           name : 'userId',
           data: userId.data._id

         },
         {
           name : 'images',
           filename :this.state.imageName,
           data: RNFetchBlob.wrap(this.state.file)
         },

         ]).then((res) => {

           console.log('response====================>',res.data);
           

         })
         .catch((err) => {
           console.log(err);
         })

          Actions.profile()
       }
     }





     render() {
       console.log('this.state========================>',this.state);
       if(this.state.file != ""){
         return(
           <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
           <View style={[styles.container,{marginTop:70}]}>  
           <Text style={styles.titleText}>Add Post</Text>
           <Icon name= "photo-library"
           size = {70}
           onPress={this.pickImage}
           style={{textAlign:'center',marginTop:40}}
           />
           <TextInput
           value={this.state.content}
           onChangeText={(content) => this.setState({content: content })}
           placeholder={'Caption'}        
           style={styles.input}
           />
           <View style={{flexDirection:'row'}}>
           <View style={{flex:3}}>
           </View>
           <View style={{flex:4}}>
           <Image source={{uri:this.state.file}} style={styles.preview}/>
           </View>
           <View style={{flex:3}}>
           </View>
           </View>

           <TouchableOpacity  
           style={styles.button}
           onPress={()=>this.addPost(this.state)}>
           <Text style={{textAlign:'center',marginTop:5,color:'white'}}> Post</Text>
           </TouchableOpacity>

           </View>
           </View>
           )
       }else{
         return(
           <ScrollView>
           <View style={styles.container}>  
           <Text style={styles.titleText}>Add Post</Text>
           <Icon name= "photo-library"
           size = {70}
           onPress={this.pickImage}
           style={{textAlign:'center',marginTop:40}}
           />
           <TextInput
           value={this.state.content}
           onChangeText={(content) => this.setState({content: content })}
           placeholder={'Caption'}        
           style={styles.input}
           />

           <TouchableOpacity  
           style={[styles.button]}
             // ,{ backgroundColor: this.state.ButtonStateHolder ? '#607D8B' : '#0099e7'}
           onPress={()=>this.addPost(this.state)}
            // disabled={this.state.ButtonStateHolder}
            >
           <Text style={{textAlign:'center',marginTop:5,color:'white'}}> Post</Text>
           </TouchableOpacity>

           </View>
           </ScrollView>
           );
       }s
     }
   }


   const styles = StyleSheet.create({
     container: {
       backgroundColor: 'white',
       borderWidth: 1,
       borderColor: '#e1e0e0',
       borderRadius: 10,
       width: 310,
       padding: 20,
       marginLeft:23,
       height: 'auto',
       marginTop:130
     },
     input: {
       width: 200,
       height: 44,
       padding: 10,
       borderBottomWidth: 1,
       borderColor: 'black',
       marginBottom: 10,
       marginLeft:30,
     },
     titleText:{
       fontSize:20,
       fontWeight: 'bold',
       color: 'black',
       textAlign: 'center',
       // fontStyle: 'italic',

     },
     button: {
       marginLeft:30,
       marginTop: 20,
       height: 33,
       padding: 0,
       width: 210,
       backgroundColor:'#0099e7',
       borderRadius: 3,

     },
     preview:{
       height:120,
       width:120,
       borderRadius:3,
       marginTop:5
     }

   });



   <TouchableOpacity  
   style={styles.button}
   onPress={this.pickImage}>
   <Text style={{textAlign:'center',color:'white',marginTop:5}}>Add image </Text>
   </TouchableOpacity>