import axios from 'axios';

export async function selfShare(closetCookies,closetUsername){
 
    try {

        const postData = {
            closet: closetUsername,
            cookies: closetCookies
          };

        const url = '/api/self-share';
        const response = await axios.post(url,postData);
        if (response.ok) {
            return { message: response.body }
        } else {               
            return { error: 'Failed to start self-share' }
        }
    } catch (error) {
        return { error: 'Error starting self-share' }
    }
}