/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React, {Component} from 'react';
 import {Platform, StyleSheet, Text, View,TextInput
   ,Button,FlatList,Image,ScrollView,TouchableOpacity,AsyncStorage,ActivityIndicator,Modal,TouchableHighlight,Dimensions,Alert,ToastAndroid} from 'react-native';
   import Config from './config';
   import axios from 'axios';
   import { Actions } from 'react-native-router-flux';
   import Icon from 'react-native-vector-icons/MaterialIcons';
   import Popover from 'react-native-popover-view';
   import { EventRegister } from 'react-native-event-listeners';
   var {width} = Dimensions.get('window');




   let config = new Config();


   export default class SinglePost extends Component{
     constructor(props){
       super(props)
       global.curruntUserData = ""
       this.state= {
         like:[],
         comment:'',
         post:[],
         isVisible: false,
         popoverAnchor: { x: 340, y: 40, width: 80, height: 60 },
         modalVisible: false,
         useName:'',
         content:'',
         ButtonStateHolder : false ,



       }
       
     };

     componentDidMount = async ()=>{
       try {
         const curruntUser = await AsyncStorage.getItem('curruntUser');
         if (curruntUser !== null) {
           // return curruntUser;
           // We have data!!
           // console.log("value==============================>",curruntUser);
           data = JSON.parse(curruntUser);
           global.curruntUserData = data
           console.log("value===+++++++++++++++++++++===========================>",global.curruntUserData.data._id);
         }
       } catch (error) {
         // Error retrieving data
       }
       



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
         // EventRegister.emit('resp', response.data ) 

         console.log("like successfull");
       },function(err){
         console.log(err);

       })
       setTimeout(()=>{
         fetch(config.getBaseUrl() + "post/get-post-by-post-id/" + postId).
         then((Response)=>Response.json()).
         then((response)=>{
           console.log('find post===================>',response);
           this.setState(prevState => ({
             post: response
           }))
         },function(err){
           console.log(err);
         })
       },300)
     }

     comment = async (postId) =>{
       console.log('data=============================>',postId);
       if(this.state.comment== ""){
         // Alert.alert(
         //   '',
         //   'Enter comment',
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
           ToastAndroid.show('Enter any comment', ToastAndroid.SHORT);

         }else{
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
             // EventRegister.emit('resp', response ) 

             console.log("comment successfull");
           },function(err){
             console.log(err);

           })
           this.setState(prevState => ({
             comment: ''
           }))
           setTimeout(()=>{
             fetch(config.getBaseUrl() + "post/get-post-by-post-id/" + postId).
             then((Response)=>Response.json()).
             then((response)=>{
               console.log('find post===================>',response);
               this.setState(prevState => ({
                 post: response
               }))
             },function(err){
               console.log(err);
             })
           },300)
         }
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
           ToastAndroid.show('Post Deleted Successfully....', ToastAndroid.SHORT);
           Actions.profile();
           // EventRegister.emit('resp', response.data ) 

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

       editPost(data,postId,Data){
         console.log('data====================>',data,postId,Data);
         this.setState({
           ButtonStateHolder : true  
         })
         var apiBaseUrl = config.getBaseUrl() + "post/updatepost/" + postId;
         if(data== ''){
           var payload ={
             "content":Data,
           }
           axios.put(apiBaseUrl, payload)
           .then( function (response) {  
             console.log("response=================>",response.data);
             console.log("edit post successfull");
             // EventRegister.emit('resp', response.data ) ;
             // Actions.profile();
           },function(err){
             console.log(err);
             this.setState({ ButtonStateHolder : false});

           })
           this.setState({modalVisible: false, ButtonStateHolder : false});
           setTimeout(()=>{
             fetch(config.getBaseUrl() + "post/get-post-by-post-id/" + postId).
             then((Response)=>Response.json()).
             then((response)=>{
               console.log('find post===================>',response);
               this.setState(prevState => ({
                 post:response
               }))
             },function(err){
               console.log(err);            
             })
           },300)

           // Actions.post()


         }else{

           var payload ={
             "content":data,

           }
           axios.put(apiBaseUrl, payload)
           .then( function (response) {  
             console.log("response=================>",response.data);
             console.log("edit post successfull");
             // EventRegister.emit('resp', response.data ) 


           },function(err){
             console.log(err);
             this.setState({ ButtonStateHolder : false});

           })
           this.setState({modalVisible: false,ButtonStateHolder : false});
           setTimeout(()=>{
             fetch(config.getBaseUrl() + "post/get-post-by-post-id/" + postId).
             then((Response)=>Response.json()).
             then((response)=>{
               console.log('find post===================>',response);
               this.setState(prevState => ({
                 post:response
               }))
             },function(err){
               console.log(err);            
             })
           },300)
           // Actions.post()


         }
         // var apiBaseUrl = config.getBaseUrl() + "post/delete-post-by-id/" + postId;



       }
       profilePic = (item)=>{
         if(!item.userId.profilePhoto){
           return(
             <Image resizeMode = 'cover'style={styles.profile}
             source={require('../images/profile.png')}
             />
             )
         }else{
           return(
             <Image resizeMode = 'cover'style={styles.profile} source={{uri:config.getMediaUrl()+item.userId.profilePhoto}}/>
             )}

         }


         displayComment = (item)=>{
           return(
             item.comment.map((comment) =>{
               console.log('comment ======================>',comment);
               var count = Object.keys(comment).length;
               console.log("=]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]count=============>",count);
               if(comment && count > 0){
                 console.log("========================in If=======================",count);
                 return(
                   <View>
                   <View  style={{flexDirection:'row'}}>
                   {this.profilePic(comment)}
                   <View style={{marginTop:5,marginLeft:15}}>
                   <TouchableOpacity
                   onPress = {()=> Actions.userProfile({userId:comment.userId._id})}
                   >
                   <Text style={{fontWeight:'bold',color:'black',marginLeft:10}}>{comment.userId.userName}</Text>
                   </TouchableOpacity>
                   <Text style={styles.text}>{comment.comment}</Text>
                   </View>
                   </View>
                   </View>

                   )
               }else{
                 console.log("========================in else=======================",count);
                 return(
                   null
                   )
               }      


             }).reverse()
             )
         }

         displayCommentCount = (item) =>{
           console.log("item.comment============>",item.comment[0])
           var count = Object.keys(item.comment[0]).length;
           console.log('count=======in count=============>',count);
           if(count != 0){
             return(

               <Text style={{marginLeft:10}}>All comments</Text> 
               )

           }else{
             return(
               null
               )
           }

         }
         editPostIcon =   (id)=>{
           console.log("=============calling editeicon============");
           console.log('curruntuserId========================>',global.curruntUserData.data._id,id);
           if(global.curruntUserData.data._id == id){
             console.log("==========true============");
             return(
               <TouchableOpacity 
               onPress={()=>this.setState({isVisible: true})}>

               <Icon
               name='more-vert'          
               color='#696969'
               size = {30}
               style={{marginTop:10}}
               />
               </TouchableOpacity>
               )
           }else{
             return(
               null
               )
           }

         }



         render() {
           console.log("posttttttttt=============>",this.state.post)
           if(this.state.post.length == 0){
             return(
               <View style={[styles.container, styles.horizontal]}>

               <ActivityIndicator size="large" color="#ef6858" />
               </View>
               )

           }else{
             return(
               <>
               <View>
               <ScrollView>
               <Modal
               animationType="slide"
               transparent={false}
               visible={this.state.modalVisible}
               onRequestClose={() => {
                 // Alert.alert('Modal has been closed.');
                 this.setState({  modalVisible: false})
               }}
               >
               <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
               <View>
               {this.state.post.map((item)=>
                 <ScrollView>

                 <View style={[styles.card,{marginTop:50,elevation:5}]}>
                 <View style={{flexDirection: 'column'}}>
                 <Text style={styles.userName}>{item.userId.userName}</Text>
                 <Text style={{marginLeft:20,color:'black'}}>Caption</Text>
                 <TextInput
                 value={this.state.content}
                 onChangeText={(content) => this.setState({content: content })}
                 placeholder={item.content}        
                 style={[styles.input,{marginLeft:20}]}
                 />
                 <Image resizeMode = 'cover' style={styles.img} source={{uri:config.getMediaUrl()+item.images}}/>

                 </View>

                 <TouchableOpacity style={{borderWidth: 1,marginTop:20,borderColor:this.state.ButtonStateHolder?'gray' :'black',padding:8,width:100,marginLeft:15,marginBottom:15,borderRadius:5}}
                 disabled={this.state.ButtonStateHolder}
                 onPress={() => {
                   this.editPost(this.state.content,item._id,item.content);
                 }}>
                 <Text style={{textAlign:'center'}}>Edit Post</Text>
                 </TouchableOpacity>
                 </View>
                 </ScrollView>
                 )}
               </View>
               </View>
               </Modal>
               </ScrollView>
               </View>



               <View style={{backgroundColor:'white'}}>
               <View style={{marginBottom:58}}>
               <ScrollView> 
               {this.state.post.map((item)=>
                 <View style={styles.card}>
                 <View>
                 <View style={{flexDirection: 'column'}}>
                 <View style={{flexDirection: 'row'}}>
                 <View style={{flex:10}}>
                 <View style={{flexDirection:'row'}}>
                 <View>
                 {this.profilePic(item)}

                 </View>
                 <View>
                 <Text  style={styles.userName}>{item.userId.userName}</Text>
                 </View>
                 </View>
                 </View>
                 <View style={{flex:1}}>
                 {this.editPostIcon(item.userId._id)}

                 </View>
                 <Popover
                 isVisible={this.state.isVisible}      
                 popoverStyle={{height: 70, width: 100}}
                 onRequestClose={() => {
                   this.setState({isVisible:false}) }}
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
                   <Image resizeMode = 'cover'style={styles.img} source={{uri:config.getMediaUrl()+item.images}}/>
                   </View>
                   </View>


                   <View style={{flexDirection:'row',marginTop:10}}>
                   <View>
                   {item.isLiked?( <Icon name= "favorite"
                   size = {25}
                   onPress={()=>this.like(item._id)}
                   style={{ marginLeft:10,color:'#cd1d1f'}}
                   />):( <Icon name= "favorite-border"
                   size = {25}
                   onPress={()=>this.like(item._id)}
                   style={styles.like}
                   />)}
                  
                   </View>
                   <View>
                   <Text style={styles.likeText}>{item.like.length} Likes</Text>
                   </View>

                   </View>
                   <View style={{marginBottom:10}}>

                   <TextInput
                   value={this.state.comment}
                   onChangeText={(comment) => this.setState({comment: comment })}
                   placeholder={'Comment here....'}       
                   style={styles.input}
                   />
                   <TouchableOpacity style={styles.button}
                   onPress={()=>this.comment(item._id)}>
                   <Icon
                   name= "send"
                   size = {25}
                   style={{color:'black',opacity:0.5}}
                   />
                   </TouchableOpacity>
                   </View>  


                   <View>
                   <View style={{flexDirection:'row',marginBottom:10}}>
                   <Text style={{fontWeight:'bold',color:'black',marginLeft:10}}>{item.userId.userName}</Text>
                   <Text style={styles.text}>{item.content}</Text>
                   </View>
                   {this.displayCommentCount(item)}
                   {this.displayComment(item)}



                   </View>
                   </View>
                   )}

               </ScrollView>
               </View>
               </View>

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
               color={'#0099e7'}
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


               </>




               );
}
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
    backgroundColor:'white',
    borderBottomColor:'#ddd',
    borderBottomWidth: 2,
  },
  img: {
    height: 325,
    width: width * 1,
    marginTop:10
  },
  buttons: {
    backgroundColor: 'white',
    height: 30,
    width: 80, 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    
  },
  buttonText:{
    fontSize: 20, 
    color: 'black'
  },
  input: {
    width: 300,
    borderBottomWidth: 1,
    borderColor: '#C0C0C0',   
    padding:0,
    marginLeft:10, 
  },
  userName:{
    color:'black',
    fontSize:20,
    marginLeft:20,
    marginTop:10,
    fontWeight:'bold'
  },
  like:{
    color:'#696969',
    marginLeft:10,

  },
  likeText:{
    color:'black',
    marginLeft:10,
    marginTop:3
  },
  button:{
    marginTop: 3,
    position:'absolute',
    right:10
  },
  text:{
    color:'gray',
    fontSize:15,
    marginLeft:10
  },
  profile:{
    borderRadius:50,
    height:40,
    width:40,
    marginTop:5,
    left:10,
    borderColor:'#ad177d',
    borderWidth:3,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
});






// {item.comment.map((comment)=>
//                {this.displayComment(comment)}