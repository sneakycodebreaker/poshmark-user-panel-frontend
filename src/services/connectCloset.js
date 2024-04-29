import axios from 'axios';

export async function connectCloset(closetName,closetPassword){
    try {
        const postData = {
            username: closetName,
            password: closetPassword
          };

        const url = '/api/closet-login';
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