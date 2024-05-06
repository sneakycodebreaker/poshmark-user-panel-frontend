import axios from 'axios';

export async function fetchSettings(userId,closetId){
    try {
        const postData = {     
            userId: userId,
            closetId: closetId
          };

        const url = 'http://173.230.151.165:3001/api/fetch-settings';
        const response = await axios.post(url,postData,{
          headers: {
            'Content-Security-Policy': 'upgrade-insecure-requests'
          }
        });
        return response.data;

      } catch (error) {  
        console.error('Error:', error);
        throw error;
      }
}