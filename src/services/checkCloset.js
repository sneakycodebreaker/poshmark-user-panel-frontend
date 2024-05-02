import axios from 'axios';

export async function checkCloset(dynamicCase,closetName,userId){
    try {

        const postData = {
            dynamicCase: dynamicCase,
            closetNameEntered: closetName,  
            userId: userId
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