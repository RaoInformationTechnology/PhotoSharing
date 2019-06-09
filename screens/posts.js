/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React, {Component} from 'react';
 import {Platform, StyleSheet, Text, View,TextInput
   ,Button,FlatList,Image,ScrollView,TouchableOpacity,Dimensions, ActivityIndicator,Alert,ToastAndroid} from 'react-native';
   import Config from './config';
   import axios from 'axios';
   import { PermissionsAndroid } from 'react-native';
   import {AsyncStorage} from 'react-native';
   import { Actions } from 'react-native-router-flux';
   import Icon from 'react-native-vector-icons/MaterialIcons';
   import Icons from 'react-native-vector-icons/FontAwesome';
   import Popover from 'react-native-popover-view';
   import RNFetchBlob from "rn-fetch-blob";
   import RNFS from 'react-native-fs';
   import { EventRegister } from 'react-native-event-listeners';
   var {width} = Dimensions.get('window');
   import {TabNavigator} from 'react-navigation';
   





   let config = new Config();

   export default class Post extends Component{
     constructor(props){
       super(props)
       global.curruntUserId = ""
       this.state = {
         post:[],
         like:[],
         comment:'',
         isVisible: false,
         popoverAnchor: { x: 90, y: 200, width: 80, height: 60 },
         likeCount: 0,
         visible: false,
         ButtonStateHolder : false ,


       };

     }
     componentDidMount = async ()=>{
       let userId;
       try {
         const curruntUser = await AsyncStorage.getItem('curruntUser');
         if (curruntUser !== null) {
           userId = JSON.parse(curruntUser);          
           console.log("value===+++++++++++++++++++++===========================>",userId.data._id);
           global.curruntUserId = userId.data._id
         }
       } catch (error) {
         // Error retrieving data
       }
       fetch(config.getBaseUrl() + "post/get-my-friends-post/" + userId.data._id).
       then((Response)=>Response.json()).
       then((response)=>{
         console.log('all friends postttttttttttttttttttttttttttt===================>',response);
         for(let i = 0;i<response.friendsPost.length;i++){
           console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{")
            for(let j=0;j<response.friendsPost[i].like.length;j++){
              if(userId.data._id == response.friendsPost[i].like[j]){
                console.log("=================liked=====================")
                response.friendsPost[i].isLiked = true
              }else{
                console.log("===================un liked=====================")
                response.friendsPost[i].isLiked = false
              }
            }
          }
          this.setState(prevState => ({
            post: response
          }))
        },function(err){
          console.log(err);
        })
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
         console.log("response of  like=================>",response.data);
         // EventRegister.emit('resp', response.data ) 

         console.log("like successfull");
       },function(err){
         console.log(err);

       })
       setTimeout(()=>{
         fetch(config.getBaseUrl() + "post/get-my-friends-post/" + userId.data._id).
         then((Response)=>Response.json()).
         then((response)=>{

           console.log('all friends post===================>',response);
           this.setState(prevState => ({
             post: response
           }))
         },function(err){
           console.log(err);
         })
       },200)
     }
     comment = async (postId) =>{
       console.log('data=============================>',postId);
       this.setState({
         ButtonStateHolder : true  
       })
       if(this.state.comment == ""){
         // alert("Enter Any Comment");
         ToastAndroid.show('Enter any comment', ToastAndroid.SHORT);

         this.setState({
           ButtonStateHolder : false  
         })

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
         axios.post(apiBaseUrl, payload)
         .then( function (response) {
           console.log("-------------------------------------------------------------------------------------------");
           // console.log("response=================>",response.data);
           // EventRegister.emit('resp', response.data ) 

           console.log("comment successfull");
         },function(err){
           console.log(err);

         })

         this.setState(prevState => ({
           comment: '',
           ButtonStateHolder : false  
         }))
         setTimeout(()=>{
           fetch(config.getBaseUrl() + "post/get-my-friends-post/" + userId.data._id).
           then((Response)=>Response.json()).
           then((response)=>{
             console.log('all friends post===================>',response);
             this.setState(prevState => ({
               post: response

             }))
           },function(err){
             console.log(err);
           })
         },200)

       }
     }
     savePostImage = (data) => {
       console.log("=====================",data);

       this.setState(
       {
         visible: true,
         ButtonStateHolder : true  
       },
       () => {
         this.hideToast();
       },
       );


       PermissionsAndroid.request(
         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
         {
           'title': 'Storage',
           'message': 'This app would like to store some files on your phone'
         }
         ).then(() => {
           let dirs = RNFetchBlob.fs.dirs.DownloadDir;
           RNFetchBlob
           .config({
             // response data will be saved to this path if it has access right.
             fileCache : true,
             addAndroidDownloads : {
               title : data,
               path:dirs+'/'+data,
               ext:"jpg",
               useDownloadManager : true,
               description : "fileName",
               notification : true,
             }
           })
           .fetch('GET', config.getMediaUrl()+data, {
           })
           .then((res) => {          
             console.log('The file saved to ', res)
           })
         })

         setTimeout(()=>{
           this.setState({ ButtonStateHolder : false})

         },700)



       }

       hideToast = () => {
         this.setState({
           visible: false,
         });
       };
       profilePic = (item)=>{
         // console.log("profile pic===========================>",item.userId.profilePhoto);
         if(!item.userId.profilePhoto){
           return(
             <Image resizeMode = 'cover'style={styles.profile}
             source={require('../images/profile.png')}
             />
             )
         }else{
           return(
             <Image  resizeMode = 'cover'style={styles.profile} source={{uri:config.getMediaUrl()+item.userId.profilePhoto}}/>
             )}

         }

         commentProfile = (comment)=>{
           if(!comment.userId.profilePhoto){
             return(
               <Image resizeMode = 'cover'style={styles.profile}
               source={require('../images/profile.png')}
               />
               )
           }else{
             return(
               <Image resizeMode = 'cover'style={styles.profile} source={{uri:config.getMediaUrl()+comment.userId.profilePhoto}}/>
               )}

           }
           displayComment = (item)=>{
             if(item.comment.length >3){
               console.log("=======moe than 3 comments===========");
               return(
                 item.comment.slice(-3).map((comment) =>{
                   console.log('comment ======================>',comment);
                   var count = Object.keys(comment).length;
                   console.log("=]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]count=============>",count);
                   if(comment && count > 0){
                     console.log("========================in If=======================",count);
                     return(
                       <View>
                       <View  style={{flexDirection:'row'}}>
                       {this.commentProfile(comment)}

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

             }else{
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
                       {this.commentProfile(comment)}
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
           }

           displayCommentCount = (item) =>{
             console.log("item.comment============>",item.comment[0])
             var count = Object.keys(item.comment[0]).length;
             console.log('count=======in count=============>',count);
             if(count != 0){
               return(
                 <TouchableOpacity
                 onPress={()=>Actions.post({id:item._id})}>
                 <Text style={{marginLeft:10}}>All {item.comment.length} comments</Text> 
                 </TouchableOpacity>
                 )

             }else{
               return(
                 null
                 )
             }

           }






           render() {
             const Toast = (props) => {
               if (props.visible) {
                 ToastAndroid.showWithGravityAndOffset(
                   props.message,
                   ToastAndroid.LONG,
                   ToastAndroid.BOTTOM,
                   25,
                   140,
                   );
                 return null;
               }
               return null;
             };



             console.log("postttttttttttttttttttttt================================>",this.state.post);
             console.log("post=================friend===============>",this.state.post.friendsPost);
             // console.log("comment================================>",this.state.comment);
             var friendpostarr =this.state.post.friendsPost;
             if(!friendpostarr){
               return(
                 <>
                 <View style={[styles.container, styles.horizontal]}>

                 <ActivityIndicator size="large" color="#ef6858" />
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

                 )

             }
             else if(friendpostarr[0].comment.length > 0 &&  Object.keys(friendpostarr[0].comment[0]).length != 0 && Object.keys(friendpostarr[0].comment[0]).length > 1){


               return( 
                 <>
                 <View style={{backgroundColor:'white'}}>
                 <View style={{marginBottom:48}}>
                 <ScrollView> 
                 {friendpostarr.map((item)=>
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
                   <TouchableOpacity
                   onPress = {()=> Actions.userProfile({userId:item.userId._id})}
                   >
                   <Text style={styles.userName}>{item.userId.userName}</Text>
                   </TouchableOpacity>
                   </View>
                   </View>
                   </View>
                   <View style={{flex:1}}>
                   <Icon onPress={()=>{this.savePostImage(item.images)}}
                   name= "save"
                   size = {30}
                   color={this.state.ButtonStateHolder ? '#C0C0C0' :'#696969'}
                   disabled={this.state.ButtonStateHolder}
                   style={{marginTop:10,marginRight:5}}
                   />
                   <Toast visible={this.state.visible} message="Downloading..." />

                   </View>

                   </View>

                   <Image  resizeMode = 'cover'style={styles.img} source={{uri:config.getMediaUrl()+item.images}}/>


                   </View>
                   </View>
                   <View style={{flexDirection:'column'}}>
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
                     </View>
                     <Text style={styles.likeText}>{item.like.length} Likes</Text>
                     </View>



                     </View>


                     <View style={{marginBottom:10}}>
                     <View style={{flexDirection:'row',marginBottom:10}}>
                     <TouchableOpacity
                     onPress = {()=> Actions.userProfile({userId:item.userId._id})}
                     >
                     <Text style={{fontWeight:'bold',color:'black',marginLeft:10,textTransform:'capitalize'}}>{item.userId.userName}</Text>
                     </TouchableOpacity>
                     <Text style={styles.text}>{item.content}</Text>
                     </View>

                     <View style={{marginBottom:10}}>

                     <TextInput
                     value={this.state.comment}
                     onChangeText={(comment) => this.setState({comment: comment })}
                     placeholder={'Comment here....'}       
                     style={styles.input}
                     />
                     <TouchableOpacity  style={styles.button}
                     onPress={()=>this.comment(item._id)}
                     disabled={this.state.ButtonStateHolder}>

                     <Icon 
                     name= "send"
                     size = {25}
                     color={this.state.ButtonStateHolder ? '#C0C0C0' :'#696969'}

                     />

                     </TouchableOpacity>
                     </View>
                     <TouchableOpacity
                     onPress ={()=>Actions.post({id: item._id})}
                     >
                     </TouchableOpacity>
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
}else{
  return (
    <>
    <View style={{alignItems:'center',justifyContent: 'center',flex:1}}>
    <Text >No post yet</Text></View>
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


    )
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
  input: {
    width: 300,
    // height: 35,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#C0C0C0',
    // marginBottom: 10,
    padding:0,
    borderRadius: 5,
    marginLeft:10,
    // marginTop:0
  },
  button: {       
    marginTop: 5,
    // height: 25, 
    // width: 70,         
    // borderRadius: 3,
    // borderWidth: 1,       
    // borderColor: 'black',
    // padding:5,
    position:'absolute',
    right:10
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
    bottom: 0,
    elevation:8
  },

  textStyle:{

    color: '#fff',
    fontSize:22
  },
  footer: {
    flexDirection:'column',flex:6,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  card:{

    elevation:5,
    color:'white',
    // marginLeft:5,
    // marginRight:5, 
    backgroundColor:'white',
    borderBottomColor:'#ddd',
    borderBottomWidth: 2,
    // marginBottom:10
  },
  img: {
    height: 325,
    // width: 325,
    // margin:10,
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
    // borderBottomWidth: 1,
    // borderBottomColor: 'black'
  },
  buttonText:{
    fontSize: 20, 
    color: 'black'
  },
  userName:{
    color:'black',
    fontSize:18,
    marginLeft:20,
    marginTop:13,
    fontWeight:'bold',
    textTransform:'capitalize'
  },
  text:{
    color:'gray',
    fontSize:15,
    marginLeft:10
  },
  like:{
    color:'#696969',
    marginLeft:10,

  },
  likeText:{
    color:'black',
    marginLeft:10,
    marginTop:5
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  profile:{
    borderRadius:50,
    height:40,
    width:40,
    marginTop:5,
    left:10,
    borderColor:'#ad177d',
    borderWidth:3,
  }
});
