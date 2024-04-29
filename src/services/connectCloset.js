import axios from 'axios';

export async function connectCloset(closetName,closetPassword){
    try {
        // const postData = {
        //     username: closetName,
        //     password: closetPassword
        //   };

        // const url = 'http://173.230.151.165:3001/api/closet-login';
        // const response = await axios.post(url,postData);
        // return response.data;

        const postData = {
          username: closetName,
          password: closetPassword
        };
        
        const url = 'http://173.230.151.165:3001/api/closet-login';
        
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        };
        
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        return data;
      } catch (error) {  
        console.error('Error:', error);
        throw error;
      }
}