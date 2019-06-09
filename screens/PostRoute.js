
import React from 'react';
import { Router, Scene } from 'react-native-router-flux';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import SinglePost from './singlePost';
import Profile from './profile';

const MainNavigator = createStackNavigator({

	Profile: {
		screen: Profile,
		
	},
	SinglePost: {
		screen: SinglePost,
		
	},

	


});

const PostRoutes = createAppContainer(MainNavigator);
export default PostRoutes;