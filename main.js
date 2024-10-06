const animalsContainer = document.getElementById('animals');
const skeletonContainer = document.getElementById('skeleton');

// Fetching and displaying all animals when the website loads
document.addEventListener('DOMContentLoaded', async () => {
  
  await fetchAnimals();
});


// Function to simulate data loading with skeleton
function showSkeletonAndLoadData() {
  // Show skeleton and hide actual data
  skeletonContainer.classList.remove('hidden');
  animalsContainer.classList.add('hidden');

  // Simulate 2 seconds loading
  setTimeout(() => {
      skeletonContainer.classList.add('hidden');
      animalsContainer.classList.remove('hidden');

     
  }, 2000);
}





// Function to fetch all pets
async function fetchAnimals() {
  try {
      const response = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
      const data = await response.json();
      showSkeletonAndLoadData();
      if (data.status) {
          displayAnimals(data.pets);
      }
  } catch (error) {
      console.error('Error fetching pets:', error);
  }
}

// Function to fetch and display pet details in a modal
async function fetchAndDisplayPetDetails(petId) {
  try {
      const response = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`);
      const data = await response.json();
     // console.log("details clicked: ", data.petData);
      if (data.status) {
          const pet = data.petData;
          document.getElementById('modalImage').src =  `${pet.image ? pet.image : "Image isn't found!"}`;
          document.getElementById('modalName').textContent =`${pet.pet_name ? pet.pet_name : 'Unknown'}`;
          document.getElementById('modalBreed').textContent = `⬘ Breed: ${pet.breed ? pet.breed : 'Unknown'}`;
          document.getElementById('modalBirth').textContent = `🗓️ Birth: ${pet.date_of_birth || 'Unknown'}`;
          document.getElementById('modalGender').textContent = `♀︎ Gender: ${pet.gender ? pet.gender : 'Unknown'}`;
          document.getElementById('modalPrice').textContent = `💰 Price: $${pet.price ? pet.price : Unknown}`;
          document.getElementById('modalDescription').textContent = `Description: $${pet.pet_details ? pet.pet_details : 'Unknown'}`;

          // Show the modal
          document.getElementById('petModal').classList.remove('hidden');
      }
  } catch (error) {
      console.error('Error fetching pet details:', error);
  }
}

// Event delegation for dynamically created details buttons
document.getElementById('animals').addEventListener('click', function (event) {
  if (event.target.classList.contains('details-btn')) {
      const petId = event.target.getAttribute('data-pet-id'); 
      fetchAndDisplayPetDetails(petId); 
  }
});

// Close modal event
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('petModal').classList.add('hidden');
});



// Event delegation for dynamically created adopt buttons
document.getElementById('animals').addEventListener('click', function (event) {
  if (event.target.classList.contains('adopt-btn')) {
    document.getElementById('adoptModal').classList.remove('hidden');
  }
});

// Close adopt modal event
document.getElementById('closeAdoptModal').addEventListener('click', () => {
  document.getElementById('adoptModal').classList.add('hidden');
});




// Function to display pets dynamically
function displayAnimals(pets) {
  const animalsDiv = document.getElementById('animals');
  animalsDiv.innerHTML = ''; // Clearing previous entries

  if (pets.length === 0) {
      animalsDiv.innerHTML = `
    <div class="flex flex-col gap-3 mx-auto">
      <img src="./images/error.webp" alt="errorImage" class="w-full md:w-[300px] md:h-[400px] mx-auto">
      <h1 class="text-xl md:text-3xl text-gray-900 font-bold text-center">No Information Found!</h1>
    </div>`;
      return;
  }

  pets.forEach(pet => {
      const card = document.createElement('div');
      card.classList.add('flex', 'flex-col', 'gap-3', 'p-1', 'md:p-3');

      card.innerHTML = `
      <div class="flex flex-col gap-3 p-2 border border-gray-200 rounded-lg">
        <img src="${pet.image}" alt="${pet.pet_name}" class="w-[350px] h-[300px] border rounded-lg">
        <h2 class="text-base font-bold text-gray-900">${pet.pet_name ? pet.pet_name : 'Unknown'}</h2>
        <h4 class="text-sm text-gray-500">⬘ Breed: ${pet.breed ? pet.breed : 'Unknown'}</h4>
        <h4 class="text-sm text-gray-500">🗓️ Birth: ${pet.date_of_birth ? pet.date_of_birth : 'Unknown'}</h4>
        <h4 class="text-sm text-gray-500">♀︎ Gender: ${pet.gender ? pet.gender : 'Unknown'}</h4>
        <h4 class="text-sm text-gray-500">💰 Price: $${pet.price ? pet.price : "Unknown"}</h4>
      </div>

      <div class="flex justify-between border border-gray-200 rounded-lg p-2">
        <button class="like-btn bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-100 px-4 py-2" data-img="${pet.image}">👍</button>
        <button class="adopt-btn bg-white border border-gray-200 rounded-lg text-green-600 hover:bg-gray-100 px-4 py-2">Adopt</button>
        <button class="details-btn bg-white border border-gray-200 rounded-lg text-green-600 hover:bg-gray-100 px-4 py-2" data-pet-id="${pet.petId}">Details</button>
      </div>`;

      // Adding to the main animals div
      animalsDiv.appendChild(card);
  });

  // Adding event listeners for like buttons
  const likeButtons = document.querySelectorAll('.like-btn');
  likeButtons.forEach(btn => {
      btn.addEventListener('click', function () {
          addToLikedAnimals(this.getAttribute('data-img'));
      });
  });
}

// Function to filter animals by category
async function fetchByCategory(categoryName) {
  showSkeletonAndLoadData();
  try {
      const response = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${categoryName}`);
      const data = await response.json();
      showSkeletonAndLoadData();
      if (data.status) {
          displayAnimals(data.data);
      }
  } catch (error) {
      console.error('Error fetching category data:', error);
  }
}

// Event listeners for category buttons
document.getElementById('cat-btn').addEventListener('click', () => fetchByCategory('cat'));
document.getElementById('dog-btn').addEventListener('click', () => fetchByCategory('dog'));
document.getElementById('rabbit-btn').addEventListener('click', () => fetchByCategory('rabbit'));
document.getElementById('bird-btn').addEventListener('click', () => fetchByCategory('bird'));

// Event listener for sort button
document.getElementById('sort-btn').addEventListener('click', () => {
  const animalsDiv = document.getElementById('animals');
  const cards = Array.from(animalsDiv.children);

  const sortedCards = cards.sort((a, b) => {
      const priceElementA = a.querySelector('h4:nth-of-type(4)');
      const priceElementB = b.querySelector('h4:nth-of-type(4)');

      if (!priceElementA || !priceElementB) {
          console.warn('Price element not found for one of the cards:', a, b);
          return 0;
      }

      const priceA = parseFloat(priceElementA.textContent.replace('💰 Price: $', ''));
      const priceB = parseFloat(priceElementB.textContent.replace('💰 Price: $', ''));

      return priceB - priceA;
  });

  // Clear and append sorted cards
  animalsDiv.innerHTML = '';
  showSkeletonAndLoadData();
  sortedCards.forEach(card => animalsDiv.appendChild(card));
});

// Function to add liked animal's image to the "selected-animals" div
function addToLikedAnimals(imgUrl) {
  const selectedAnimalsDiv = document.getElementById('selected-animals');
  const img = document.createElement('img');
  img.src = imgUrl;
  img.alt = 'Liked Animal';
  img.classList.add('w-[150px]', 'h-[100px]', 'md:w-[250px]', 'md:h-[200px]', 'border', 'rounded-lg');
  selectedAnimalsDiv.appendChild(img);
}











