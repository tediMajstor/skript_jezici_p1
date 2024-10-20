document.addEventListener("DOMContentLoaded", () => {
  const apiEndpoint = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";
  const params = new URLSearchParams(window.location.search);
  const objectID = params.get('objectID');

  if (objectID) {
    fetch(`${apiEndpoint}${objectID}`)
      .then(response => response.json())
      .then(data => {
        // title
        document.getElementById("exhibit-title").textContent = data.title;

        // primary image
        const exhibitImage = document.getElementById("exhibit-image");
        exhibitImage.src = data.primaryImage || 'placeholder.jpg';
        exhibitImage.alt = data.title;

        // description and additional info
        const descriptionElement = document.querySelector("p");
        descriptionElement.innerHTML = `
          <strong>Medium:</strong> ${data.medium || "No medium available"}<br>
          <strong>Repository:</strong> ${data.repository || "No repository information"}<br>
          <strong>Credit Line:</strong> ${data.creditLine || "No credit line information available"}
        `;

        const additionalInfo = document.querySelector("ul");
        additionalInfo.innerHTML = `
          <li><strong>Year:</strong> ${data.objectDate || 'Unknown'}</li>
          <li><strong>Category:</strong> ${data.classification || 'Unknown'}</li>
          <li><strong>Artist:</strong> ${data.artistDisplayName || 'Unknown Artist'}</li>
        `;

        // additional images
        const gallery = document.getElementById("gallery");
        if (data.additionalImages && data.additionalImages.length > 0) {
          data.additionalImages.forEach(imageUrl => {
            const imgElement = document.createElement("img");
            imgElement.src = imageUrl;
            imgElement.alt = "Additional exhibit image";
            // imgElement.classList.add("w-full", "object-contain", "rounded-lg", "shadow-md");
            imgElement.classList.add("w-96", "h-96", "object-cover", "rounded-lg", "shadow-md");
            gallery.appendChild(imgElement);
          });
        } else {
          gallery.innerHTML = "<p class='text-gray-600'>No additional images available.</p>";
        }
      })
      .catch(error => console.error('Error fetching exhibit details:', error));
  }
});
