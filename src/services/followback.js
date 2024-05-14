import axios from 'axios';

export async function followBack_(uid,closetId,closetCookies){
 
    try {

        const postData = {
            uid : uid,
            closetId: closetId,
            cookies: closetCookies
          };

        const url = 'http://173.230.151.165:3001/api/follow-back';
        const response = await axios.post(url,postData);
        if (response.ok) {
            return { message: response.body }
        } else {               
            return { error: 'Failed to start follow-back' }
        }
    } catch (error) {
        return { error: 'Error starting follow-back' }
    }
}