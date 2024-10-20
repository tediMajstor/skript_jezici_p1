document.addEventListener("DOMContentLoaded", () => {
    const departmentSelect = document.getElementById("department-select");
    const searchForm = document.getElementById("search-form");
    const apiEndpoint = "https://collectionapi.metmuseum.org/public/collection/v1/";
  
    // Fetch departments list and populate dropdown
    fetch(apiEndpoint + "departments")
      .then(response => response.json())
      .then(data => {
        data.departments.forEach(department => {
          const option = document.createElement("option");
          option.value = department.departmentId;
          option.textContent = department.displayName;
          departmentSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error fetching department data:', error));
  
    // Handle department selection change
    departmentSelect.addEventListener("change", () => {
      const departmentId = departmentSelect.value;
      if (departmentId) {
        // Redirect to departments.html with departmentId as a query parameter
        window.location.href = `departments.html?departmentId=${departmentId}`;
      }
    });
  
    // Handle search form submission
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const searchQuery = document.getElementById("search-input").value.trim();
      if (searchQuery) {
        // Redirect to departments.html with search query as a query parameter
        window.location.href = `departments.html?search=${encodeURIComponent(searchQuery)}`;
      }
    });
  });
  