import axios from 'axios';

export async function fetchItem(closetCookies,closetUsername){
 
    try {
      const postData = {
        cookie: closetCookies,
        closet: closetUsername
      };
        const url = '/api/closet-items';
        const response = await axios.post(url,postData);
        return response.data;
      } catch (error) {  
        console.error('Error:', error);
        throw error;
      }
}