async function handleUserRequest(user, req) {
    switch (user) {
        case 'user':
            try {
                const searchQuery = 'SELECT * FROM users WHERE username = ? AND email = ?';
                const searchResults = await executeQuery(searchQuery, [req.query.username, req.query.email]);
                if (searchResults.length === 0) {
                    const insertQuery = 'INSERT INTO users SET username = ?, email = ?, signup_platform = ?';
                    const insertResults = await executeQuery(insertQuery, [req.query.username, req.query.email, req.query.provider]);
                    // Log successful insertion
                    console.log('User inserted:', insertResults);
                }
                return { message: 'Case User executed successfully.' };
            } catch (error) {
                console.error('Error in case User:', error);
                return { error: 'Internal server error' };
            }
    
        case 'poshmark':
            try {
                const searchQuery = 'SELECT * FROM poshmark_details WHERE user_id = ?';
                const searchResults = await executeQuery(searchQuery, [req.query.uid]);
                if (searchResults.length === 0) {
                    const insertQuery = 'INSERT INTO poshmark_details SET user_id = ?, closetname = ?, country = ?, closet_img = ?, cookie = ?';
                    const insertResults = await executeQuery(insertQuery, [req.query.uid, req.query.closetName, req.query.country, req.query.closetImage, req.query.cookie]);
                    // Log successful insertion
                    console.log('Poshmark details inserted:', insertResults);
                    return 'success';
                }
                return 'failed';
            } catch (error) {
                console.error('Error in case Poshmark:', error);
                return { error: 'Internal server error' };
            }
    
        default:
            return;
    }
}