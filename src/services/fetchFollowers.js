import axios from 'axios';

export async function fetchFollowers(closetUsername,closetCookies){
    try {
        const postData = {
            case: 'bulk',
            closet: closetUsername,
            cookies: closetCookies
          };

        const url = '/api/closet-followers';
        const response = await axios.post(url,postData);
        return response.data;
      } catch (error) {  
        console.error('Error:', error);
        throw error;
      }
}