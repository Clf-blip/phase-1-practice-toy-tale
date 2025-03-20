let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch all toys from API and render them
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy));
    });

  // Function to render a toy card
  function renderToy(toy) {
    const toyCard = document.createElement("div");
    toyCard.classList.add("card");
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    // Like button event listener
    toyCard.querySelector(".like-btn").addEventListener("click", () => {
      increaseLikes(toy, toyCard);
    });

    toyCollection.appendChild(toyCard);
  }

  // Add a new toy when form is submitted
  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const toyName = e.target.name.value;
    const toyImage = e.target.image.value;

    if (toyName && toyImage) {
      fetch("http://localhost:3000/toys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name: toyName,
          image: toyImage,
          likes: 0
        })
      })
      .then(res => res.json())
      .then(newToy => {
        renderToy(newToy); // Add new toy to DOM
        toyForm.reset(); // Clear the form
      });
    }
  });

  // Function to update likes
  function increaseLikes(toy, toyCard) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
    .then(res => res.json())
    .then(updatedToy => {
      toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      toy.likes = updatedToy.likes; // Update toy object
    });
  }
});
