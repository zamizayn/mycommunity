import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  Container,
  Content,
  Item,
  Input,
  Tab,
  Tabs,
  TabHeading,
  ScrollableTab,
  Icon,
} from 'native-base';
var {height, width} = Dimensions.get('window');
import {AppColors} from '../Themes';
import {CONSTANTS} from '../config/constants';
import Properties from './Properties';
import Vehicles from './Vehicles';
import Jobs from './Jobs';
import Products from './Products';
import Services from './Services';
import JobsApplications from '../individual/JobsApplications';
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import FilterSvg from '../assets/svg/Filter_icon_white.svg';
import AddSvg from '../assets/svg/Add_icon.svg';
import theme from '../config/styles.js';
import FilterResetSvg from '../assets/svg/FilterResetWhite.svg';
import {API} from '../config/api';
import {ApiHelper} from '../helpers/ApiHelper';
import AsyncStorageHelper from '../helpers/AsyncStorageHelper';

export default class UserMenuTabs extends Component {
  constructor() {
    super();
    this.state = {
      tabIndex: 0,
      initialPage: 0,
      propertyFilter: false,
      vehicleFilter: false,
      jobFilter: false,
      productFilter: false,
      serviceFilter: false,
      removePropertyFilter: false,
      removeVehicleFilter: false,
      removeJobFilter: false,
      removeProductFilter: false,
      removeServiceFilter: false,
      userRole: 0,
    };
  }

  componentDidMount() {
    this.getUserData();
    const {initialPage} = this.props.route.params;
    this.setState({
      initialPage: initialPage,
      tabIndex: initialPage,
    });
  }
  async getUserData() {
    // var user_data = await AsyncStorageHelper.getItem('USERDATA');
    // var dataLen = JSON.parse(user_data);
    // this.setState({
    //   userRole: dataLen?.userRole,
    // });
    await ApiHelper.get(API.userData).then(res => {
      var dataLen = res.data.data;
        this.setState({
          userRole: dataLen.userRole,
        });
    });
  }

  getPage() {
    switch (this.state.tabIndex) {
      case 0:
        return 'Properties';
        break;
      case 1:
        return 'Vehicles';
        break;
      case 2:
        return this.state.userRole == 2 ? 'Jobs' : 'Applied Jobs';
        break;
      case 3:
        return 'Products';
        break;
      case 4:
        return 'Services';
        break;
    }
  }

  gotoAddPage() {
    switch (this.state.tabIndex) {
      case 0:
        this.props.navigation.navigate('AddProperty');
        break;
      case 1:
        this.props.navigation.navigate('AddVehicle');
        break;
      case 2:
        this.props.navigation.navigate('AddJob');
        break;
      case 3:
        this.props.navigation.navigate('AddProduct');
        break;
      case 4:
        this.props.navigation.navigate('AddService');
        break;
    }
  }

  passFilterProp() {
    switch (this.state.tabIndex) {
      case 0:
        this.setState({propertyFilter: true});
        
        break;
      case 1:
        this.setState({vehicleFilter: true});
        break;
      case 2:
        this.setState({jobFilter: true});
        break;
      case 3:
        this.setState({productFilter: true});
        break;
      case 4:
        this.setState({serviceFilter: true});
        break;
    }
  }

  resetFilterProp() {
    switch (this.state.tabIndex) {
      case 0:
        this.setState({propertyFilter: false});
        break;
      case 1:
        this.setState({vehicleFilter: false});
        break;
      case 2:
        this.setState({jobFilter: false});
        break;
      case 3:
        this.setState({productFilter: false});
        break;
      case 4:
        this.setState({serviceFilter: false});
        break;
    }
  }

  resetFilterAppliedProp() {
    switch (this.state.tabIndex) {
      case 0:
        this.setState({removePropertyFilter: true}, () => {
          this.setState({removePropertyFilter: false});
        });
        break;
      case 1:
        this.setState({removeVehicleFilter: true}, () => {
          this.setState({removeVehicleFilter: false});
        });
        break;
      case 2:
        this.setState({removeJobFilter: true}, () => {
          this.setState({removeJobFilter: false});
        });
        break;
      case 3:
        this.setState({removeProductFilter: true}, () => {
          this.setState({removeProductFilter: false});
        });
        break;
      case 4:
        this.setState({removeServiceFilter: true}, () => {
          this.setState({removeServiceFilter: false});
        });
        break;
    }
  }

  render() {
    const {initialPage} = this.props.route.params;
    return (
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
              //  this.props.navigation.openDrawer()
              this.props.navigation.goBack(null);
            }}>
            <BackBtn_white height="22" width="20" />
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              flex: 1,
            }}>
            <Text
              style={{
                color: 'white',
                marginStart: width / 22,
                fontSize: width / 22,
              }}>
              {this.getPage()}
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{marginRight: width / 20}}
                onPress={() => {
                  this.resetFilterAppliedProp();
                }}>
                <FilterResetSvg width={22} height={22} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginRight: width / 20}}
                onPress={() => {
                  console.log("Clickedd");
                  this.passFilterProp();
                }}>
                <FilterSvg width={22} height={22} />
              </TouchableOpacity>
              {this.state.userRole == 1 &&
              (this.state.tabIndex == 4 ||
                this.state.tabIndex == 3 ||
                this.state.tabIndex == 1 ||
                this.state.tabIndex == 0) ? (
                <TouchableOpacity
                  style={{marginRight: width / 25}}
                  activeOpacity={0.8}
                  onPress={() => {
                    this.gotoAddPage();
                  }}>
                  <AddSvg width={22} height={22} />
                </TouchableOpacity>
              ) : null}
              {this.state.userRole == 2 ? (
                <TouchableOpacity
                  style={{marginRight: width / 25}}
                  activeOpacity={0.8}
                  onPress={() => {
                    this.gotoAddPage();
                  }}>
                  <AddSvg width={22} height={22} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
        <Tabs
          renderTabBar={() => (
            <ScrollableTab
              underlineStyle={{backgroundColor: '#BC1D54', height: 2.6}}
            />
          )}
          onChangeTab={({i}) => {
            this.setState({
              tabIndex: i,
            });
          }}
          initialPage={initialPage}>
          <Tab
            style={{backgroundColor: '#EEECEE'}}
            heading={
              <TabHeading style={{backgroundColor: '#fff'}}>
                <Text
                  style={[
                    this.state.tabIndex == 0
                      ? theme.fontBold
                      : theme.fontRegular,
                    {fontSize: width / 29},
                  ]}>
                  Properties
                </Text>
              </TabHeading>
            }>
            <Properties
              navigation={this.props.navigation}
              tabIndex={this.state.tabIndex}
              filter={this.state.propertyFilter}
              resetFilterProp={() => this.resetFilterProp()}
              removeFilter={this.state.removePropertyFilter}
            />
          </Tab>
          <Tab
            style={{backgroundColor: '#EEECEE'}}
            heading={
              <TabHeading style={{backgroundColor: '#fff'}}>
                <Text
                  style={[
                    this.state.tabIndex == 1
                      ? theme.fontBold
                      : theme.fontRegular,
                    {fontSize: width / 29},
                  ]}>
                  Vehicles
                </Text>
              </TabHeading>
            }>
            <Vehicles
              navigation={this.props.navigation}
              tabIndex={this.state.tabIndex}
              filter={this.state.vehicleFilter}
              resetFilterProp={() => this.resetFilterProp()}
              removeFilter={this.state.removeVehicleFilter}
            />
          </Tab>

          <Tab
            style={{backgroundColor: '#EEECEE'}}
            heading={
              <TabHeading style={{backgroundColor: '#fff'}}>
                <Text
                  style={[
                    this.state.tabIndex == 2
                      ? theme.fontBold
                      : theme.fontRegular,
                    {fontSize: width / 29},
                  ]}>
                  {this.state.userRole == 2 ? 'Jobs' : 'Applied Jobs'}
                </Text>
              </TabHeading>
            }>
            {this.state.userRole == 1 ? (
              <JobsApplications
                navigation={this.props.navigation}
                tabIndex={this.state.tabIndex}
                filter={this.state.jobFilter}
                resetFilterProp={() => this.resetFilterProp()}
                removeFilter={this.state.removeJobFilter}
              />
            ) : null}
            {this.state.userRole == 2 ? (
              <Jobs
                navigation={this.props.navigation}
                tabIndex={this.state.tabIndex}
                filter={this.state.jobFilter}
                resetFilterProp={() => this.resetFilterProp()}
                removeFilter={this.state.removeJobFilter}
              />
            ) : null}
          </Tab>

          <Tab
            style={{backgroundColor: '#EEECEE'}}
            heading={
              <TabHeading style={{backgroundColor: '#fff'}}>
                <Text
                  style={[
                    this.state.tabIndex == 3
                      ? theme.fontBold
                      : theme.fontRegular,
                    {fontSize: width / 29},
                  ]}>
                  Products
                </Text>
              </TabHeading>
            }>
            <Products
              navigation={this.props.navigation}
              tabIndex={this.state.tabIndex}
              filter={this.state.productFilter}
              resetFilterProp={() => this.resetFilterProp()}
              removeFilter={this.state.removeProductFilter}
            />
          </Tab>
          <Tab
            style={{backgroundColor: '#EEECEE'}}
            heading={
              <TabHeading style={{backgroundColor: '#fff'}}>
                <Text
                  style={[
                    this.state.tabIndex == 4
                      ? theme.fontBold
                      : theme.fontRegular,
                    {fontSize: width / 29},
                  ]}>
                  Services
                </Text>
              </TabHeading>
            }>
            <Services
              navigation={this.props.navigation}
              tabIndex={this.state.tabIndex}
              filter={this.state.serviceFilter}
              resetFilterProp={() => this.resetFilterProp()}
              removeFilter={this.state.removeServiceFilter}
            />
          </Tab>
        </Tabs>
        {this.state.userRole == 1 &&
        (this.state.tabIndex == 4 ||
          this.state.tabIndex == 3 ||
          this.state.tabIndex == 1 ||
          this.state.tabIndex == 0) ? (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              width: 70,
              position: 'absolute',
              bottom: 30,
              right: 20,
              height: 70,
              backgroundColor: AppColors.primaryColor,
              borderRadius: 100,
            }}
            onPress={() => {
              this.gotoAddPage();
            }}>
            <AddSvg width={22} height={22} />
          </TouchableOpacity>
        ) : null}
        {this.state.userRole == 2 ? (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              width: 70,
              position: 'absolute',
              bottom: 30,
              right: 20,
              height: 70,
              backgroundColor: AppColors.primaryColor,
              borderRadius: 100,
            }}
            onPress={() => {
              this.gotoAddPage();
            }}>
            <AddSvg width={22} height={22} />
          </TouchableOpacity>
        ) : null}
      </Container>
    );
  }
}

const styles = StyleSheet.create({});
