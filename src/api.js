import axios from "axios";


export async function fetchImages(searchQuery, page) {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: '37643260-361b699785f368081cbff175a',
          q: searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          page: page,
          per_page: 40,
        },
      });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  }