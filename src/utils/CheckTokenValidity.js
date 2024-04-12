const baseUrl = "https://your-api-url.com/api/";

export const checkTokenValidity = async (accessToken) => {
    try {
        const response = await fetch(baseUrl + '/token/verify/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            return true; 
        } else {
            return false; 
        }
    } catch (error) {
        console.error('Error checking token validity:', error);
        return false;
    }
};