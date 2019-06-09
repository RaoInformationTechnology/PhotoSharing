/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React, {Component} from 'react';
 import {Platform, StyleSheet, Text, View,TextInput
   ,Button,FlatList,Image,ScrollView,TouchableOpacity,AsyncStorage,Modal,TouchableHighlight,Alert} from 'react-native';
   import Config from './config';
   import axios from 'axios';
   import { Actions } from 'react-native-router-flux';
   import Icon from 'react-native-vector-icons/MaterialIcons';
   import Popover from 'react-native-popover-view';
   import { EventRegister } from 'react-native-event-listeners';




   let config = new Config();


   export default class EditProfile extends Component{
     constructor(props){
       super(props)
       this.state= {
         like:[],
         comment:'',
         post:[],
         isVisible: false,
         popoverAnchor: { x: 340, y: 25, width: 80, height: 60 },
         modalVisible: false,
         name:'',
         content:''



       }
       
     };

     componentDidMount = async ()=>{
       var postId =this.props.id;
       console.log("postid==================>",postId);

       fetch(config.getBaseUrl() + "post/get-post-by-post-id/" + postId).
       then((Response)=>Response.json()).
       then((response)=>{
         console.log('find post===================>',response);
         this.setState(prevState => ({
           post: [...prevState.post,...response]
         }))
       },function(err){
         console.log(err);
       })
     }
     componentWillMount() {
       this.listener = EventRegister.addEventListener('resp', (resp) => {
         console.log("hello======================",resp);
         this.setState(prevState =>({
           post: [resp]
         }))
       })
     }

     componentWillUnmount() {
       EventRegister.removeEventListener(this.listener)
     }

     like = async (postId) =>{
       var userId;
       let curruntUser = await AsyncStorage.getItem('curruntUser');
       userId = JSON.parse(curruntUser);
       console.log('userId======================>',userId.data._id);
       console.log('postId============================>',postId);
       var apiBaseUrl = config.getBaseUrl() + "post/like";
       console.log('apiBaseUrl===========>',apiBaseUrl);
       var payload ={
         "postId":postId,
         "userId":userId.data._id
       }
       axios.post(apiBaseUrl, payload)
       .then( function (response) {
         console.log("-------------------------------------------------------------------------------------------");
         console.log("response=================>",response.data);
         EventRegister.emit('resp', response.data ) 

         console.log("like successfull");
       },function(err){
         console.log(err);

       })
     }

     comment = async (postId) =>{
       console.log('data=============================>',postId);
       var userId;
       let curruntUser = await AsyncStorage.getItem('curruntUser');
       userId = JSON.parse(curruntUser);
       console.log('userId======================>',userId.data._id);
       console.log('postId============================>',postId);
       var apiBaseUrl = config.getBaseUrl() + "comment/addcomment";
       console.log('apiBaseUrl===========>',apiBaseUrl);
       var payload ={
         "postId":postId,
         "userId":userId.data._id,
         "comment":this.state.comment
       }
       axios.post(apiBaseUrl,payload)
       .then( function (response) {
         console.log("response=================>",response);
         EventRegister.emit('resp', response ) 

         console.log("comment successfull");
       },function(err){
         console.log(err);

       })
     }

     deletePost= (postId)=>{

       console.log('postid=====================>',postId);
       var apiBaseUrl = config.getBaseUrl() + "post/delete-post-by-id/" + postId;
       var payload ={
         "postId":postId,

       }
       console.log('payload==============>',payload)
       axios.delete(apiBaseUrl, payload)
       .then( function (response) {  
         console.log("response=================>",response.data);
         EventRegister.emit('resp', response.data ) 
         ss
       },function(err){
         console.log(err);

       })
     }

     setModalVisible(visible) {
       this.setState({modalVisible: visible});
     }


     openModal(){
       this.setState({modalVisible: true});
     }

     editPost(data,postId){
       console.log('data====================>',data,postId);

       var apiBaseUrl = config.getBaseUrl() + "post/updatepost/" + postId;
       var payload ={
         "content":data,

       }
       axios.put(apiBaseUrl, payload)
       .then( function (response) {  
         console.log("response=================>",response.data);
         console.log("edit post successfull");
         EventRegister.emit('resp', response.data ) 


       },function(err){
         console.log(err);

       })
       this.setState({modalVisible: false});



       // var apiBaseUrl = config.getBaseUrl() + "post/delete-post-by-id/" + postId;



     }
     











     render() {
       console.log("posttttttttt=============>",this.state.post)
       return(
         <>


         <View style={{marginTop: 22}}>
         <Modal
         animationType="slide"
         transparent={false}
         visible={this.state.modalVisible}
         onRequestClose={() => {
           Alert.alert('Modal has been closed.');
         }}>
         <View style={{marginTop: 22}}>
         <View>
         {this.state.post.map((item)=>
           <ScrollView>
           
           <View style={styles.card}>
           <View style={{flexDirection: 'column'}}>
           <Text>{item.userId.name}</Text>
           <Text style={styles.text}>{item.content}</Text>
           <TextInput
           value={this.state.content}
           onChangeText={(content) => this.setState({content: content })}
           placeholder={item.content}        
           style={styles.input}
           />
           <Image style={styles.img} source={{uri:config.getMediaUrl()+item.images}}/>

           </View>
           </View>

           <TouchableOpacity style={{  backgroundColor: "gray",padding:8,width:'50%',alignItem:'center',marginLeft:10}}
           onPress={() => {
             this.editPost(this.state.content,item._id);
           }}>
           <Text>Edit Post</Text>
           </TouchableOpacity>
           </ScrollView>
           )}
         </View>
         </View>
         </Modal>
         </View>




         <View style={{marginBottom:25}}>
         <ScrollView> 
         {this.state.post.map((item)=>
           <View style={styles.card}>
           <View>
           <View style={{flexDirection: 'column'}}>
           <View style={{flexDirection: 'row'}}>
           <View style={{flex:10}}>
           <Text>{item.userId.name}</Text>
           </View>
           <View style={{flex:1}}>
           <TouchableOpacity 
           onPress={()=>this.setState({isVisible: true})}>
           <Icon
           name='more-vert'          
           color='black'
           size = {30}
           />

           </TouchableOpacity>
           </View>
           <Popover
           isVisible={this.state.isVisible}      
           popoverStyle={{height: 70, width: 100}}

           placement='bottom'
           fromRect={this.state.popoverAnchor}      
           >
           <View>
           <TouchableOpacity onPress={()=>{this.setState({isVisible:false}),this.openModal(item._id)}}>
           <View style={styles.buttons}>
           <Text style={styles.buttonText}>Edit</Text>
           </View>
           </TouchableOpacity>
           <TouchableOpacity onPress={()=>{this.setState({isVisible:false}),this.deletePost(item._id)}}>
           <View style={styles.buttons}>
           <Text style={styles.buttonText}>Delete</Text>
           </View>
           </TouchableOpacity>


           </View>      
           </Popover>
           </View>
           <Text style={styles.text}>{item.content}</Text>
           <Image style={styles.img} source={{uri:config.getMediaUrl()+item.images}}/>


           </View>
           </View>
           <View style={{flexDirection:'row'}}>
           <View>
           <Icon name= "favorite"
           size = {35}
           onPress={()=>this.like(item._id)}
           />
           <Text>{item.like.length}</Text>
           </View>

           <View>

           <TextInput
           value={this.state.comment}
           onChangeText={(comment) => this.setState({comment: comment })}
           placeholder={'Comment here....'}       
           style={styles.input}
           />
           </View>
           <TouchableOpacity style={{  backgroundColor: "gray",padding:8,width:'20%',marginLeft:10}}
           onPress={()=>this.comment(item._id)}>
           <Text style={{textAlign:'center',color:'white'}}>Post</Text>
           </TouchableOpacity>

           </View>
           <View>
           {item.comment.map((comment)=>
             <View>
             <Text>{comment.comment}</Text>
             </View>

             )}

           </View>
           </View>
           )}


         </ScrollView>
         </View>










         <View style={styles.MainContainer}>
         <View style={ styles.bottomView} >         
         <View style={{flexDirection:'row'}}>
         <View style={styles.footer}>
         <Icon name= "home"
         size = {35}
         onPress={()=>Actions.posts()}
         />
         </View>
         <View style={styles.footer}>
         <Icon name= "search"
         size = {35}
         onPress={()=>Actions.explore()}

         />
         </View>

         <View style={styles.footer}>
         <Icon name= "add-box"
         size = {35}
         onPress={()=>Actions.addPost()}
         />
         </View>

         <View style={styles.footer}>
         <Icon name= "favorite-border"
         size = {35}
         onPress={()=>Actions.follow()}
         />
         </View>
         
         <View style={styles.footer}>
         <Icon name= "perm-identity"
         size = {35}
         onPress={()=>Actions.profile()}

         />
         </View>

         </View>
         </View>
         </View>
         </>




         );
}

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  footer: {
    flexDirection:'column',flex:6,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  img: {
    height: 140,
    width: 140,
    margin:10
  },
  GridViewContainer: {
    flex:1,
    height: 150,
    margin: 5,

  },
  MainContainer:
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
  },
  bottomView:{
    width: '100%', 
    height: 50, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 0
  },
  card:{

    elevation:5,
    color:'white',
    marginLeft:5,
    marginRight:5, 
    backgroundColor:'#ddd',
    borderBottomColor:'#ddd',
    borderBottomWidth: 2,
    marginBottom:20
  },
  img: {
    height: 325,
    width: 325,
    margin:10
  },
  buttons: {
    backgroundColor: 'white',
    height: 30,
    width: 80, 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  buttonText:{
    fontSize: 20, 
    color: 'black'
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
});
