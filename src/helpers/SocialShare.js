import {Share} from 'react-native';
import {CONSTANTS} from '.././config/constants';

export default async function shareLink(link) {
  try {
    let postFullLink = CONSTANTS.SHARE_BASE_URL_WEBSITE + link;
    const result = await Share.share({
      message: postFullLink,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    // alert(error.message);
  }
}
