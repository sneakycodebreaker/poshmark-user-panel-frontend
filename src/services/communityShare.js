import axios from 'axios';

export async function communityShare_(uid,closetId,closetCookies){
 
    try {

        const postData = {
            uid : uid,
            closetId: closetId,
            cookies: closetCookies
          };

        const url = 'http://173.230.151.165:3001/api/community-share';
        const response = await axios.post(url,postData);
        if (response.ok) {
            return { message: response.body }
        } else {               
            return { error: 'Failed to start community-share' }
        }
    } catch (error) {
        return { error: 'Error starting community-share' }
    }
}