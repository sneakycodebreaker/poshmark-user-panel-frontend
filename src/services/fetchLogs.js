import axios from 'axios';

export async function fetchLogs(userId,closetId,logsType){
    try {
        const postData = {     
            userId: userId,
            closetId: closetId,
            logsType:logsType
          };

        const url = 'http://173.230.151.165:3001/api/fetch-logs';
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