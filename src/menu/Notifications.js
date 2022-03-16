import React, { Component, useState, useEffect } from 'react';
import {
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity, } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Right,
    Button,
    Badge,
    Title,
    List,
    ListItem,
    Thumbnail,
    } from 'native-base';
    import {ApiHelper} from '../helpers/ApiHelper';
    import {API} from '../config/api';
    import BackBtn_white from '../assets/svg/BackBtn_white.svg';
    import theme from '../config/styles.js';
    import {AppColors} from '../Themes';
    import moment from 'moment';
import { maxHeight } from 'styled-system';
    var {height, width} = Dimensions.get('window');

    const notifiDummyData = {
      "status": 1,
      "message": "Operation Success.",
      "totalCount": 2,
      "pageno": 1,
      "limit": 10,
      "totalUnread": 1,
      "data": [  
          {
              "_id": "5f9af1c0da5a6c1f949fe0c5",
              "title": "Splyr Message",
              "message": "content Lorem ipsum dolor sit amet, conse ctetur adipi scing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              "type": "1",
              "typeString": "Splyr Message",
              "redirectKey": "5fa54359296afc161b7c0782",
              "readStatus": 0,
              "createdAt": "2021-09-13T16:45:52.728Z"
          },
          {
          "_id": "5f9af1c0da5a6c1f949fe0c6",
          "title": "Test Mesg123",
          "message": "Ut enim ad minim veniam, quis nostrud exercitation ullamco ",
          "type": "1",
          "typeString": "heioooi Message",
          "redirectKey": "5fa54359296afc161b7c0782",
          "readStatus": 0,
          "createdAt": "2020-10-29T16:45:52.728Z"
          },
          {
            "_id": "5f9af1c0da5a6c1f949fe0c7",
            "title": "Mega Offer",
            "message": "Last day to avail the offer Message",
            "type": "1",
            "typeString": "Last day to avail the offer Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1f949fe022c8",
            "title": "Test Mesg9",
            "message": "Lorem ipsum dolor sit amet, con sectetur adipi scing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictum varius duis at consectetur lorem donec massa.",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1f949fe0c80",
            "title": "Test Title",
            "message": "Lorem ipsum dolor sit amet, consec tetur adipisc ing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictum varius duis at consectetur lorem donec massa.",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1f949fe0c855",
            "title": "Test Mesg9",
            "message": "Lorem ipsum dolor sit amet, co sfdgd nsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictum varius duis at consectetur lorem donec massa.",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1f949fe0c844",
            "title": "Notification 12",
            "message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictum varius duis at consectetur lorem donec massa.",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1f949fe560c8",
            "title": "Test Mesg9",
            "message": "content",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1f949fkle0c8",
            "title": "Test Mesg9",
            "message": "content",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a61111f949fe0c8",
            "title": "Test Mesg9",
            "message": "content",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1f949fe0mn8",
            "title": "Test Mesg9",
            "message": "content",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1f9ds9fe0c8",
            "title": "Test Mesg9",
            "message": "content",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1f949cdfe0c8",
            "title": "Test Mesg9",
            "message": "content",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1f949fb0c8",
            "title": "Test Mesg9",
            "message": "content",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1f949ghe0c8",
            "title": "Test Mesg9 Mesg9",
            "message": "content",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1fe0c8",
            "title": "Test Mesg9 5fa54359296afc161b7c0782  5fa54359296afc161b7c0782  5fa54359296afc161b7c0782",
            "message": "content Mesg9 Mesg9 ",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1f95fr9fe0c8",
            "title": "Test Mesg9",
            "message": "content Coopie MessagCoopie MessagCoopie Messag g  vjsgdsj 5f9af1c0da5a6c1f949fe0tc8",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          },{
            "_id": "5f9af1c0da5a6c1f9459fe0c8",
            "title": "Test Mesg9",
            "message": "content",
            "type": "1",
            "typeString": "Coopie Message",
            "redirectKey": "5fa54359296afc161b7c0782",
            "readStatus": 0,
            "createdAt": "2020-10-29T16:45:52.728Z"
          }
  ]}
  export default class ListProperty extends Component {
    constructor() {
      super();
      this.state = {
        notificationsArr: [],
        loader: false,
        totalCount: 0,
        pageNo: 1,
        limit: 10,
        readStatus:0,
        dateFrom:'',
        dateTo:'',
        loading: false,
        paginationLoading: false,
        filterData:false
      };
    }
  componentDidMount() {
    this.setState({loader: true});
    this.getNotifications();
  }

  async getNotifications() {
    let url = `?pageNo=${this.state.pageNo}&limit=${this.state.limit}`;
    if (this.state.readStatus !== '') {
      url = url + `&readStatus=${this.state.readStatus}`;
    }
    if (this.state.dateFrom !== '') {
      url = url + `&dateFrom=${this.state.dateFrom}`;
    }
    if (this.state.dateTo !== '') {
      url = url + `&dateTo=${this.state.dateTo}`;
    }

    // needed for actual api call
    await ApiHelper.get(API.notification+url).then(res => {
      if ('data' in res.data && res.data.data) {
        console.log('\n\n\nNotifications', res.data);
        var notifyData = res.data.data;
        // console.log('Notifications Dummy', notifiDummyData);
        // notifyData = notifiDummyData.data;   
          this.setState({
            notificationsArr:
              this.state.pageNo == 1
                ? notifyData
                : [...this.state.notificationsArr,...notifyData],
            totalCount:
              this.state.pageNo == 1
                ? res.data.totalCount
                : notifyData.length > 0
                ? res.data.totalCount
                : this.state.totalCount,
          });
        }
    })
    .catch(err => {
      console.log(err);
    });
    this.setState({
      loader: false,
      paginationLoading: false,
    });
  }
  
  handleEnd = () => {
    this.state.totalCount > 0
      ? this.setState(
          {
            pageNo: this.state.pageNo + 1,
            loading: true,
            paginationLoading: true,
          },
          () => this.getNotifications(),
        )
      : null;
  };
  ListEmptyView = () => {

    return (
      <View style={{}}>
        <Text style={{textAlign: 'center',fontSize:15, }}>Notifications will appear here</Text>
      </View>

    );
  }

  render(){
    return(
      <Container>
        <View
         style={{
          flexDirection: 'row',
          backgroundColor: AppColors.primaryColor,
          height: height / 12,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
          <TouchableOpacity
              style={{
                paddingStart: width / 20,
              }}
              onPress={() => {
                this.props.navigation.goBack(null);
              }}>
              <BackBtn_white height="22" width="20" />
          </TouchableOpacity>
          <Text 
            style={{
              color: 'white',
              marginStart: width / 22,
              fontSize: width / 22,
            }}> Notifications</Text>
        </View>
        <View>
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.notificationsArr}
            keyExtractor={(x, i) => i}
            onEndReached={() => this.handleEnd()}
            ListEmptyComponent={this.ListEmptyView}
            style={{
              marginTop: 5,
              paddingBottom: 5,
            }}
            onEndReachedThreshold={0.5}
              renderItem={({item})=> (
                <ListItem
                thumbnail
                  noBorder
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 3,
                    borderColor: '#f0eced',
                    marginStart: width / 15,
                    marginEnd: width / 15,
                }}>
                  <Body>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}>
                        <Text
                          style={[
                            theme.fontBold,
                            {fontSize: width / 25, color: '#000'},
                          ]}
                          numberOfLines={1}>
                          {item.title}
                        </Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                          }}>
                        <Text
                          style={[
                            theme.fontMedium,
                            {fontSize: width / 27, color: '#747474'},
                          ]}>
                          {item.message}
                        </Text>
                    </View>
                    <View
                        style={{
                          position: 'absolute',
                          bottom: 5,
                          right: 10,
                        }}>
                        <Text
                          style={[
                            theme.fontMedium,
                            {
                              fontSize: width / 32,
                              color: '#747474',
                            },
                          ]}>
                          {moment(item.createdAt).format('DD MMMM, YYYY')}
                        </Text>
                      </View>
                  </Body>
                </ListItem>
              )}
          />
         {this.state.paginationLoading &&
              this.state.notificationsArr.length > 0 ? (
                <View
                  style={{
                    position: 'absolute',
                    paddingVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: width,
                    bottom: 1,
                  }}>
                  <ActivityIndicator
                    size="large"
                    animating
                    color={AppColors.primaryColor}
                  />
                </View>
              ) : null}
        </View>
      </Container>
    )
  }
}
