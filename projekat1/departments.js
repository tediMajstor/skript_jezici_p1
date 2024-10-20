document.addEventListener("DOMContentLoaded", () => {
  const exhibitGrid = document.querySelector(".grid");
  const nextButton = document.querySelector(".next");
  const prevButton = document.querySelector(".prev");
  const pageButtonsContainer = document.getElementById("page-buttons");
  const pageNumberDisplay = document.querySelector(".pageNumberDisplay");
  const pageTitle = document.getElementById("page-title");
  const apiEndpoint = "https://collectionapi.metmuseum.org/public/collection/v1/";
  const params = new URLSearchParams(window.location.search);
  const departmentId = params.get('departmentId');
  const searchQuery = params.get('search');

  let exhibitsList = [];
  let pageNumber = 0;
  const itemsPerPage = 10;
  let totalPages = 0;

  // fetch and display
  if (departmentId) {
    // for department
    fetch(`${apiEndpoint}search?departmentId=${departmentId}&q=art`)
      .then(response => response.json())
      .then(data => {
        exhibitsList = data.objectIDs;
        totalPages = Math.ceil(exhibitsList.length / itemsPerPage);
        displayExhibits(pageNumber);
        updatePaginationButtons();
        updatePageTitle();
      })
      .catch(error => console.error('Error fetching department exhibits:', error));
  } else if (searchQuery) {
    // for search query
    fetch(`${apiEndpoint}search?q=${encodeURIComponent(searchQuery)}`)
      .then(response => response.json())
      .then(data => {
        exhibitsList = data.objectIDs;
        totalPages = Math.ceil(exhibitsList.length / itemsPerPage);
        displayExhibits(pageNumber);
        updatePaginationButtons();
        updatePageTitle();
      })
      .catch(error => console.error('Error fetching search results:', error));
  }

  // exhibits for page
  function displayExhibits(page) {
    exhibitGrid.innerHTML = '';
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    const objectIDs = exhibitsList.slice(start, end);

    objectIDs.forEach(id => {
      fetch(`${apiEndpoint}objects/${id}`)
        .then(response => response.json())
        .then(objectData => {
          const card = document.createElement("div");
          card.className = "exhibit-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300";
          card.innerHTML = `
            <a href="exhibit.html?objectID=${id}">
              <img src="${objectData.primaryImageSmall || 'placeholder.jpg'}" alt="${objectData.title}" class="w-full h-48 object-cover rounded mb-4">
              <h3 class="text-xl font-bold mb-2 text-gray-800">${objectData.title}</h3>
              <p class="text-gray-600">${objectData.artistDisplayName || "Unknown Artist"}</p>
            </a>
          `;
          exhibitGrid.appendChild(card);
        })
        .catch(error => console.error('Error fetching exhibit details:', error));
    });
  }


  // page title
  function updatePageTitle() {
    pageTitle.textContent = `search results (${exhibitsList.length})`;
  }

  // pagination button menu
  function updatePaginationButtons() {
    pageButtonsContainer.innerHTML = '';
  
    const rangeSize = 5;
    const startRange = Math.max(0, pageNumber - Math.floor(rangeSize / 2));
    const endRange = Math.min(totalPages, startRange + rangeSize);
  
    for (let i = startRange; i < endRange; i++) {
      const button = document.createElement("button");
      button.textContent = i + 1;
      button.classList.add("bg-white", "px-4", "py-2", "rounded", "hover:bg-blue-100");
  
      if (i === pageNumber) {
        button.classList.add("bg-blue-500", "text-white");
      }
  
      button.addEventListener("click", () => {
        pageNumber = i;
        displayExhibits(pageNumber);
        updatePaginationButtons(); // color and update buttons
      });
  
      pageButtonsContainer.appendChild(button);
    }
  }
  

  // next, prev button listeners
  nextButton.addEventListener("click", () => {
    if (pageNumber + 1 < totalPages) {
      pageNumber++;
      displayExhibits(pageNumber);
      updatePaginationButtons();
    }
  });

  prevButton.addEventListener("click", () => {
    if (pageNumber > 0) {
      pageNumber--;
      displayExhibits(pageNumber);
      updatePaginationButtons();
    }
  });
});
