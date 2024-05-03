import axios from 'axios';

export async function fetchCloset(userId){
    try {
        const postData = {     
            userId: userId,    
          };

        const url = 'http://173.230.151.165:3001/api/fetch-closet';
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