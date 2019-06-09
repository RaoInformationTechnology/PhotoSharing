/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React, {Component} from 'react';
 import {Platform, StyleSheet, Text, View,TextInput
   ,Button,FlatList,TouchableOpacity,Dimensions,ScrollView,RefreshControl,Alert,ToastAndroid,ActivityIndicator} from 'react-native';
   import Config from './config';
   import axios from 'axios';
   import {AsyncStorage} from 'react-native';
   import { Actions } from 'react-native-router-flux';
   import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
   import Icon from 'react-native-vector-icons/MaterialIcons';
   import { Container, Header, Content, Card, CardItem,  } from 'native-base';
   import { EventRegister } from 'react-native-event-listeners';
   import PTRView from 'react-native-pull-to-refresh';
   import _ from 'lodash'
   import differenceBy from 'lodash/differenceBy'


   // import Animated from 'react-native-reanimated';
   // import { TabViewAnimated, TabViewPage, TabBarTop } from 'react-native-tab-view';
   
   // import { Container, Header, Content, Card, CardItem, Body } from 'native-base';


   let config = new Config();
   let res;


   export default class Follow extends Component{
     constructor(props){
       super(props)
       global.curruntUserData = ""
       this.state = {
         data:[],
         friends:[],
         friends1:[],
         followers:[],
         key: '',
         searchedUser:[],
         userName: '',
         index: 0,
         routes: [
         { key: 'first', title: 'Following' },
         { key: 'second', title: 'Followers' },
         ],
         refreshing: false,
         refresh:false,
         ButtonStateHolder : false ,
         seachedUserName:[]


       };
       // this.retrieveData();
       this.handleClickFollow = this.handleClickFollow.bind(this);
       this.handleClickUnfollow = this.handleClickUnfollow.bind(this);

     }

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
       
       fetch(config.getBaseUrl() + "user/get-all-user").
       then((Response)=>Response.json()).
       then((response)=>{
         // console.log('all user===================>',response);
         this.setState(prevState => ({
           data: [...prevState.data,...response]
         }))
       },function(err){
         console.log(err);
       })

       // console.log('currunt user==================.......................============>',global.curruntUserData);  
       fetch(config.getBaseUrl()+ "user/get-my-friends/"+ global.curruntUserData.data._id).
       then((Response)=>Response.json()).
       then((response)=>{
         // console.log('currunt user Friends following==============================>',response);
         let curruntUserFriends = response;
         this.setState(prevState=>({
           friends:[...prevState.friends,...response]
         }))
       },function(err){
         console.log(err);
       })

       fetch(config.getBaseUrl()+ "user/get-my-followers/"+ global.curruntUserData.data._id).
       then((Response)=>Response.json()).
       then((response)=>{
         console.log('currunt user followers==============================>',response);
         this.setState(prevState=>({
           followers:[...prevState.followers,...response]
         }))
       },function(err){
         console.log(err);
       })
       

     } 
     componentWillMount() {
       this.listener = EventRegister.addEventListener('resp', (resp) => {
         console.log("hello======================",resp);
         this.setState(prevState =>({
           friends: [ resp]
         }))
         // this.FirstTab()
         this.setState(prevState=>({
           followers: [ resp]

         }))
         this.FirstTab()
         this.SecondTab()
       })
     }

     componentWillUnmount() {
       EventRegister.removeEventListener(this.listener)
     }


     logOut = async() => {
       console.log("logout==============");
       await AsyncStorage.setItem('curruntUser',''); 
       let curruntUser = await AsyncStorage.getItem('curruntUser');
       console.log(']]]]]]]]]]]]]]]]]]',curruntUser);    
       Actions.login();
     }



     searchUser = (key)=>{
       console.log('key=============================================>',key);
       if(key == ""){
         // alert("Enter Some UserName")
         ToastAndroid.show('Enter Any name', ToastAndroid.SHORT);
       }else{


         var apiBaseUrl = config.getBaseUrl() + "user/search";

         var payload={
           "key":key,
           "userId": global.curruntUserData.data._id 
         }
         axios.post(apiBaseUrl,payload)
         .then(response=>{
           console.log('serchedUser==============================>',response.data);
           if(response.data.length == 0){
             console.log("=======user not found==============");
             ToastAndroid.show('User Not Found', ToastAndroid.SHORT);
           }else{
             // this.setState({ searchedUser: [...this.state.searchedUser, response] })

             var myFriends = global.curruntUserData.data.friends;
             var searchUserId = response.data[0]._id
             console.log('myFriends===========>',myFriends);
             console.log("searchUserId============>0",searchUserId);
             console.log("curruntUserFriends================>",this.state.friends);
             var result = this.state.friends.filter(function(o1){
               // if match found return false
               return _.findIndex(response.data, {'id': o1.id}) !== -1 ? false : true;
             });
             const searchUsers = differenceBy(response.data, result, '_id');
             console.log('===================myDifferences======================>',searchUsers);
             this.setState(prevState=>({
               searchedUser:searchUsers
             }))

             console.log("================resulttttttttttttt=========>",response.data);

           }
         },function(err){
           console.log(err);
         })
       }
     }




     fun(a){
       console.log("in fun=============",a);
     }


     handleClickFollow =(item)=>{
       console.log("data=====================================+++++++++++=====>",item);
       var apiBaseUrl = config.getBaseUrl() + "user/follow";
       var payload={
         "requestedUser":global.curruntUserData.data._id,
         "userTobeFollowed":item._id
       }
       console.log(payload)
       if(payload.requestedUser == payload.userTobeFollowed){
         console.log("user can't follow itself")
         // alert("user can't follow itself")
         ToastAndroid.show("User Can't follow itself", ToastAndroid.SHORT);

       }else{
         axios.post(apiBaseUrl, payload)
         .then(function (response) {
           console.log("response========================>    ",response.data);
           // EventRegister.emit('resp', response.data ) 
           console.log("follow sucessfully................");
           res = item

         },function(err){
           console.log("err",err);

         })
         setTimeout(()=>{

           fetch(config.getBaseUrl()+ "user/get-my-friends/"+ global.curruntUserData.data._id).
           then((Response)=>Response.json()).
           then((response)=>{
             console.log('currunt user Friends in handleclickfollow following==============================>',response);
             let curruntUserFriends = response;
             this.setState(prevState=>({
               friends:response,
               searchedUser:[],
               refresh: true
             }))
             Actions.follow()
           },function(err){
             console.log(err);
           })
         },200)


         setTimeout(()=>{

           this.FirstTab()
         },400)

       }

     }

     handleClickUnfollow(item){
       console.log('data====================>',item);
       this.setState({
         ButtonStateHolder : true  
       })
       var apiBaseUrl = config.getBaseUrl() + "user/unfollow";
       var payload={
         "requestedUser":global.curruntUserData.data._id,
         "userTobeUnFollowed":item._id
       }
       console.log(payload)
       if(payload.requestedUser == payload.userTobeUnFollowed){
         console.log("user can't Unfollow itself")
         // alert("user can't Unfollow itself")
         ToastAndroid.show("user can't Unfollow itself", ToastAndroid.SHORT);
       }else{
         axios.post(apiBaseUrl, payload)
         .then((response)=>{
           console.log("response=====>    ",typeof response.data);
           console.log("Unfollow sucessfully................");

           fetch(config.getBaseUrl()+ "user/get-my-friends/"+ response.data._id)
           .then((Response)=>Response.json())
           .then((response)=>{
             console.log('currunt user Friends in handleclickfollow following==============================>',response);
             let curruntUserFriends = response;
             this.setState({
               friends:response,
               searchedUser:[],
               refresh: true
             })
             Actions.follow();
           },function(err){
             console.log(err);
           })
         }).catch((err)=>{
           console.log(err);
         });

       }
     }

     FirstTab = () => {

       console.log("friends in first tabbbb=================>",this.state.friends);
       console.log("state refres=============================>",this.state.refresh);
       // console.log("friends1111111111111 in first tabbbb=================>",this.state.friends1);
       // if(this.state.friendArr == true){
         if(this.state.friends.length == 0){
           return(
             <View style={[styles.container, styles.horizontal]}>

             <ActivityIndicator size="large" color="#ef6858" />
             </View>
             )

         }else{
           return(

             <View style={[styles.scene, { backgroundColor: '#fff'}]}>
             <ScrollView>
             <View style={{marginBottom:20}}>
             <FlatList
             data={this.state.friends}
             renderItem={({item}) => 

             <View style={{flexDirection: 'row'}}>
             <TouchableOpacity
             style={{flex:8}}
             onPress = {()=> Actions.userProfile({userId:item._id})}
             >
             <Text style={styles.text}>{item.userName}</Text>
             </TouchableOpacity>
             <TouchableOpacity 
             style={[styles.button1,{ backgroundColor: this.state.ButtonStateHolder ? '#607D8B' : '#0099e7'}]}
             disabled={this.state.ButtonStateHolder}
             onPress={ ()=>this.handleClickUnfollow(item)}> 
             <Text style={{textAlign:'center',marginTop:5,color:'white'}}>Unfollow</Text>
             </TouchableOpacity>
             </View>
           }
           />
           </View>
           </ScrollView>
           </View>

           )
         }

       };
       SecondTab = () => {
         console.log("followers in second tab=========================>",this.state.followers);
         return(


           <View style={[styles.scene, { backgroundColor: '#fff' ,paddingBottom:10}]} >
           <FlatList
           data={this.state.followers}
           renderItem={({item}) => 
           <View style={{flexDirection: 'row'}}>
           <TouchableOpacity
           style={{flex:8}}
           onPress = {()=> Actions.userProfile({userId:item._id})}
           >
           <Text style={styles.text}>{item.userName}</Text>
           </TouchableOpacity>
           </View>


         }
         />
         </View>


         )  
       };

       tabs = () => {
         console.log('this.state.friends=============>',this.state.friends);
         if(this.state.friends.length >0 || this.state.followers.length >0){
           return(
             <TabView
             navigationState={this.state}
             renderScene={SceneMap({
               first: this.FirstTab,
               second: this.SecondTab,
             })}
             onIndexChange={index => this.setState({ index })}
             initialLayout={{ width: Dimensions.get('window').width }}
             renderTabBar={props =>
               <TabBar
               {...props}
               tabStyle={{backgroundColor:'white', opacity: 1}}
               indicatorStyle={{backgroundColor: 'red'}}
               // style={{color:'black',zIndex:1}}
               labelStyle={{color:'#696969'}}
               // labelStyle={styles.noLabel}
               />
             }

             />
             )
         }else{
           return(
             <View style={[styles.container, styles.horizontal]}>

             <ActivityIndicator size="large" color="#ef6858" />
             </View>
             )
         }
       }

       _onRefresh = () => {
         this.setState({refreshing: true});
         fetchData().then(() => {
           this.setState({refreshing: false});
         });
       }

       render = () => { 
         console.log('friendssssssssssssssssssss====================>',this.state.friends);
         console.log('===========searched user=================',this.state.searchedUser);

         // console.log('friendsArrr=================================>',this.state.friendArr);
         // console.log('searchedUser======================>',friendsArr);
         // console.log('followers====================>',this.state.followers);
         return (
           <>


           <View style={styles.detail}>
           <View style={{flexDirection: 'row'}}>
           <TextInput
           value={this.state.key}
           onChangeText={(key) => this.setState({key: key })}
           placeholder={'Search'}        
           style={styles.input}
           />


           <TouchableOpacity

           onPress={()=>this.searchUser(this.state.key)}>

           <Icon name='search' color='black' size={25} style={{marginTop:10,opacity:0.5}}/>
           </TouchableOpacity>

           </View>

           <View style={{elevation:3}}>
           <FlatList
           data={this.state.searchedUser}
           style={{elevation:5}}
           renderItem={({item}) => 
           <View style={{flexDirection: 'row',marginBottom:10}}>
           <Text style={styles.text}>{item.userName}</Text>



           <TouchableOpacity 
           style={styles.button2}
           onPress={ ()=>this.handleClickFollow(item)}>
           <Text style={{textAlign:'center',marginTop:5,color:'white'}}>Follow</Text>
           </TouchableOpacity>




           </View>

         }
         />
         </View>
         </View>
         {
           this.tabs()
         }
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
         </View>

         </>
         );
       }
     }



     const styles = StyleSheet.create({
       container:{
         justifyContent:'center',
         alignItems:'center',
         flex:1,
         // marginTop:100
       },
       input: {
         width: 310,
         height: 35,
         padding: 10,
         borderColor: '#C0C0C0',
         borderWidth: 1,
         marginBottom: 10,
         marginLeft:10,
         borderRadius:5
       },
       button:{
         // alignItems: 'center',
         backgroundColor: '#3578E5',
         width: 100,
         marginLeft:290,
         marginTop:6,
         padding: 5,
         borderRadius:5,
         flexDirection:'column',flex:4,

       },
       text: {
         fontSize: 18,
         flexDirection:'column',
         flex:8,
         marginLeft:10,
         marginTop:14,
         color:'black'
       },
       detail: {
         marginTop:10
       },
       buttons: {
         backgroundColor:'#2196F3',
         borderRadius:2,
         width:60,
         height:40  

       },scene: {
         // flexDirction:'row',
         flex: 1,
         marginTop:5,

       },
       // MainContainer:
       // {
         //   flex: 1,
         //   alignItems: 'center',
         //   justifyContent: 'center',
         //   paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
         // },
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
         footer: {
           flexDirection:'column',flex:6,
           justifyContent: 'center', 
           alignItems: 'center',
         },
         button1: {
           // marginLeft:30,
           marginTop: 15,
           height: 33,
           padding: 0,
           width: 70,
           backgroundColor:'#0099e7',
           borderRadius: 3,
           marginRight:22,

         },
         button2:{
           marginTop: 15,
           height: 33,
           padding: 0,
           width: 70,
           backgroundColor: '#0099e7',
           borderRadius: 3,
           marginRight:22,

         },
         noLabel: {
           // display: 'none',
           height: 0,
           color:'black'
         },
         bubble: {
           // backgroundColor: 'white',
           paddingHorizontal: 18,
           paddingVertical: 12,

           opacity:0.1
           // borderRadius: 10
         },
         horizontal: {
           flexDirection: 'row',
           justifyContent: 'space-around',
           padding: 10
         },

       });
