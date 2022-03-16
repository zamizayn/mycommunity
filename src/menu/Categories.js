import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {Container, Content} from 'native-base';
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import BestDealIcon from '../assets/svg/BestDealIcon.svg';
import Mall_Icon from '../assets/svg/Mall_Icon.svg';
import Job_Icon from '../assets/svg/Job_Icon.svg';
import Properties_icon from '../assets/svg/Properties_icon.svg';
import Vehicle_icon from '../assets/svg/Vehicle_icon.svg';
import Services_icon from '../assets/svg/Services_icon.svg';
import Shops_icon from '../assets/svg/Shops_icon';
import Directory_icon from '../assets/svg/Directory_icon.svg';
import News_icon from '../assets/svg/News_icon.svg';
import Products_icon from '../assets/svg/products-icon.svg';
import RightArrow from '../assets/svg/right-arrow.svg';
import {AppColors} from '../Themes';
var {height, width} = Dimensions.get('window');
export default class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    return (
      <Container>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#bd1d53',
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
          <Text
            style={{
              color: 'white',
              marginStart: width / 22,
              fontSize: width / 22,
            }}>
            Categories
          </Text>
        </View>
        <Content style={{backgroundColor: AppColors.bgColorRegistration}}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.itemrow}
              onPress={() => {
                this.props.navigation.navigate('ListMyDeals');
              }}>
              <View style={styles.end}>
                <BestDealIcon height="40" width="40" />
              </View>
              <View style={styles.row}>
                <View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameTxt}>My Deals</Text>
                  </View>
                </View>
                <RightArrow height="25" width="25" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.itemrow}
              activeOpacity={0.7}
              onPress={() => {
                this.props.navigation.navigate('ListProperty');
              }}>
              <View style={styles.end}>
                <Properties_icon height="40" width="40" />
              </View>
              <View style={styles.row}>
                <View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameTxt}>Properties</Text>
                  </View>
                </View>
                <RightArrow height="25" width="25" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.itemrow}
              activeOpacity={0.7}
              onPress={() => {
                this.props.navigation.navigate('ListVehicles');
              }}>
              <View style={styles.end}>
                <Vehicle_icon height="40" width="40" />
              </View>
              <View style={styles.row}>
                <View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameTxt}>Vehicles</Text>
                  </View>
                </View>
                <RightArrow height="25" width="25" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.itemrow}
              activeOpacity={0.7}
              onPress={() => {
                this.props.navigation.navigate('ListJobs');
              }}>
              <View style={styles.end}>
                <Job_Icon height="40" width="40" />
              </View>
              <View style={styles.row}>
                <View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameTxt}>Jobs</Text>
                  </View>
                </View>
                <RightArrow height="25" width="25" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.itemrow}
              activeOpacity={0.7}
              onPress={() => {
                this.props.navigation.navigate('ListProducts');
              }}>
              <View style={styles.end}>
                <Products_icon height="40" width="40" />
              </View>
              <View style={styles.row}>
                <View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameTxt}>Products</Text>
                  </View>
                </View>
                <RightArrow style={{color: 'red'}} height="25" width="25" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.itemrow}
              activeOpacity={0.7}
              onPress={() => {
                this.props.navigation.navigate('ListServices');
              }}>
              <View style={styles.end}>
                <Services_icon height="40" width="40" />
              </View>
              <View style={styles.row}>
                <View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameTxt}>Services</Text>
                  </View>
                </View>
                <RightArrow height="25" width="25" />
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.itemrow}>
              <View style={styles.end}>
                <Shops_icon height="40" width="40" />
              </View>
              <View style={styles.row}>
                <View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameTxt}>Shops</Text>
                  </View>
                </View>
                <RightArrow height="25" width="25" />
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.itemrow}
              onPress={() => {
                this.props.navigation.navigate('ListMalls');
              }}>
              <View style={styles.end}>
                <Mall_Icon height="40" width="40" />
              </View>
              <View style={styles.row}>
                <View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameTxt}>Malls</Text>
                  </View>
                </View>
                <RightArrow height="25" width="25" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.itemrow}
              onPress={() => {
                this.props.navigation.navigate('ListNews');
              }}>
              <View style={styles.end}>
                <News_icon height="40" width="40" />
              </View>
              <View style={styles.row}>
                <View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameTxt}>News & Articles</Text>
                  </View>
                </View>
                <RightArrow height="25" width="25" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.itemrow}
              onPress={() => {
                this.props.navigation.navigate('ListDirectory');
              }}>
              <View style={styles.end}>
                <Directory_icon height="40" width="40" />
              </View>
              <View style={styles.row}>
                <View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameTxt}>My Directory</Text>
                  </View>
                </View>
                <RightArrow height="25" width="25" />
              </View>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: height / 50,
  },
  itemrow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#dcdcdc',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    paddingTop: height / 40,
    paddingBottom: height / 40,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width / 1.5,
  },
  nameTxt: {
    // marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 15,
  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  end: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: width / 20,
    paddingEnd: width / 20,
  },
  time: {
    fontWeight: '400',
    color: '#666',
    fontSize: 12,
  },
  icon: {
    height: 28,
    width: 28,
  },
});
