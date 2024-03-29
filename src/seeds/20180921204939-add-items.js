

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('items', [{
    model: 'Nintendo DS',
    brand: 'Nintendo',
    aditional: "Comes with its charger and it's color blue",
    state: '5 years old',
    category: 'Video Game Console',
    screenSize: 3.0,
    publication_id: 1,
    image: 'items/images/1-nintendodsblue.png',
    createdAt: new Date(2018, 0, 1),
    updatedAt: new Date(2018, 0, 2),
  },
  {
    model: 'Iphone 4',
    brand: 'Apple',
    aditional: "Has a little crack in one corner, doesn't come with the original charger nor the original headphones",
    state: '3 years old',
    category: 'Cellphone',
    screenSize: 3.5,
    publication_id: 2,
    image: 'items/images/2-iPhone4cracked.jpg',
    createdAt: new Date(2018, 1, 1),
    updatedAt: new Date(2018, 1, 2),
  },
  {
    model: 'Smart Watch P10',
    brand: 'Lhotse',
    aditional: 'Camera: 0.3 MP \n CPU: MRK6260 360MHz \n Bluetooth: V 3.0 \n RAM: 64 MB \n ROM: 128MB \n Admits Micro SD memory card \n Compatible with Android and iOS',
    state: 'Brand New',
    category: 'Smartwatch',
    screenSize: 1.54,
    publication_id: 3,
    image: 'items/images/3-smartwatch.jpg',
    createdAt: new Date(2018, 2, 1),
    updatedAt: new Date(2018, 2, 2),
  },
  {
    model: 'PSP-3000',
    brand: 'Sony',
    aditional: "It's not touch, comes with its charger, connects to wifi",
    state: '3 years old',
    category: 'Video Game Console',
    screenSize: 4.3,
    publication_id: 4,
    image: 'items/images/4-psp.jpg',
    createdAt: new Date(2018, 3, 1),
    updatedAt: new Date(2018, 3, 2),
  },
  {
    model: 'DRC740TV',
    brand: 'RCA',
    aditional: 'Compatible with DVD / Audio CD / HDCD / WMA / S-VCD / DVD-R / DVD-RW',
    state: '5 years old',
    category: 'Gadget',
    screenSize: 9,
    publication_id: 5,
    image: 'items/images/5-dvd.jpeg',
    createdAt: new Date(2018, 4, 1),
    updatedAt: new Date(2018, 4, 2),
  },
  {
    model: 'Tamagotchi',
    brand: 'Unknown',
    aditional: 'Comes with new batteries',
    state: '8 years old',
    category: 'Gadget',
    screenSize: 1,
    publication_id: 6,
    image: 'items/images/6-tamagotchi.jpg',
    createdAt: new Date(2018, 5, 1),
    updatedAt: new Date(2018, 5, 2),
  },
  {
    model: 'MP4',
    brand: 'Sony',
    aditional: 'Reproduces MP3 \n Battery: 3.7V 180mAh rechargable \n Battery time: 2.5 hours \n Memory: 5 GB',
    state: '5 years old',
    category: 'Music Player',
    screenSize: 1.8,
    publication_id: 7,
    image: 'items/images/7-mp4.jpg',
    createdAt: new Date(2018, 6, 1),
    updatedAt: new Date(2018, 6, 2),
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('items', null, {}),
};
