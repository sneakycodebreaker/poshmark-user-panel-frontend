import axios from 'axios';

export async function fetchFollowBack(uid,cookie){
    try {

        const postData = {
           uid:uid,
           cookie:cookie
          };

        const url = 'http://173.230.151.165:3001/api/follow-back';
        const response = await axios.post(url,postData);
        return response.data;
      } catch (error) {  
        console.error('Error:', error);
        throw error;
      }
}