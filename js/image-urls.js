// Image URL Generator for Demo Purposes
// This script generates placeholder image URLs that match the sample data

const sampleImages = {
  'images/moonscape-01.jpg': 'https://picsum.photos/1024/1024?random=1&blur=1',
  'images/cyberpunk-portrait-02.jpg': 'https://picsum.photos/1024/1024?random=2',
  'images/abstract-symphony-03.jpg': 'https://picsum.photos/1024/1024?random=3',
  'images/neo-gothic-cathedral-04.jpg': 'https://picsum.photos/1024/1024?random=4',
  'images/steampunk-inventor-05.jpg': 'https://picsum.photos/1024/1024?random=5',
  'images/digital-forest-06.jpg': 'https://picsum.photos/1024/1024?random=6',
  'images/floating-city-07.jpg': 'https://picsum.photos/1024/1024?random=7',
  'images/quantum-particles-08.jpg': 'https://picsum.photos/1024/1024?random=8'
};

// Alternative placeholder service with more artistic images
const alternativeImages = {
  'images/moonscape-01.jpg': 'https://source.unsplash.com/1024x1024/?space,moon',
  'images/cyberpunk-portrait-02.jpg': 'https://source.unsplash.com/1024x1024/?cyberpunk,neon',
  'images/abstract-symphony-03.jpg': 'https://source.unsplash.com/1024x1024/?abstract,colorful',
  'images/neo-gothic-cathedral-04.jpg': 'https://source.unsplash.com/1024x1024/?gothic,architecture',
  'images/steampunk-inventor-05.jpg': 'https://source.unsplash.com/1024x1024/?vintage,mechanical',
  'images/digital-forest-06.jpg': 'https://source.unsplash.com/1024x1024/?forest,digital',
  'images/floating-city-07.jpg': 'https://source.unsplash.com/1024x1024/?city,clouds',
  'images/quantum-particles-08.jpg': 'https://source.unsplash.com/1024x1024/?particles,physics'
};

console.log('Image mappings for development:', sampleImages);
console.log('Alternative image sources:', alternativeImages);
