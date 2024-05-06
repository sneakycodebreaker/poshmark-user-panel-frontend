import axios from 'axios';

export async function addSettings(uid,closetId,share,follow){
    try {
        const postData = {
            userId: uid,
            closetId: closetId,
            follow: follow,
            share: share
          };

        const url = 'http://173.230.151.165:3001/api/update-settings';
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