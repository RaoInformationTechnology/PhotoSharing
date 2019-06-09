<View style={{ flex:4}} />
               <View style={{flexDirection:'row',height:'auto'}} >
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
               <View style={{flexDirection :'row'}}>

               <TextInput
               value={this.state.password}
               onChangeText={(password) => this.setState({ password:password })}
               placeholder={'Password'}
               secureTextEntry={this.state.isVisible}
               style={styles.input}
               />
               <Icon name={this.state.isVisible ? "visibility-off" : "visibility"}
               style={{position: 'absolute',top:20, right: 0}}
               size={20}
               onPress={this.onPress}/>
               </View>
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
               <View style={{flex:4}} />