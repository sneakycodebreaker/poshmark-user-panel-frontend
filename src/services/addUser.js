import axios from 'axios';

export async function addUser(dynamicCase,username,email){
    try {
        const postData = {
            dynamicCase: dynamicCase,
            username: username,
            email: email
          };

        const url = 'http://173.230.151.165:3001/api/add-user';
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