import axios from 'axios';

export async function addCloset(dynamicCase,userId,closetNameEntered,closetName,country,closetImage,cookie){
    try {
        const postData = {
            dynamicCase: dynamicCase,
            userId: userId,
            closetNameEntered: closetNameEntered,
            closetName: closetName,
            country:country,
            closetImage:closetImage,
            cookie:cookie
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