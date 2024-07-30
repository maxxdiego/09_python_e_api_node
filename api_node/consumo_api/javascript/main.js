// AXIOS CONFIG
const axiosConfig = {
  headers: {
    authorization: "Bearer " + localStorage.getItem("token"),
  },
};

// LOGIN
function login() {
  var emailField = document.getElementById("email");
  var passwordField = document.getElementById("password");

  var email = emailField.value;
  var password = passwordField.value;

  axios
    .post("https://09-api-node.vercel.app/auth", {
      email,
      password,
    })
    .then((res) => {
      var token = res.data.token;
      localStorage.setItem("token", token);
      axiosConfig.headers.authorization =
        "Bearer " + localStorage.getItem("token");
      // alert("Login realizado com sucesso!");
      location.href = "home.html";
    })
    .catch((err) => {
      alert("Login incorreto!");
    });
}

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  // alert("Deslogado com sucesso!");
  location.href = "index.html";
}

// Capturando o botão de alterar
const updateBtn = document.getElementById("updateBtn");
// Escuta ao evento click no botão de alterar
updateBtn.addEventListener("click", updateGame);

// LISTANDO OS JOGOS
axios
  .get("https://09-api-node.vercel.app/games", axiosConfig)
  .then((response) => {
    const games = response.data.games;
    const listGames = document.getElementById("games");

    games.forEach((game) => {
      let item = document.createElement("ul");

      // Setando os atributos ID, título, price e descrição para cada game
      item.setAttribute("data-id", game._id);
      item.setAttribute("data-title", game.title);
      item.setAttribute("data-platform", game.platform);
      item.setAttribute("data-year", game.year);
      item.setAttribute("data-price", game.price);

      item.innerHTML = `<img src="images/game_cd_cover.png" alt="Jogo em estoque">
      <h3>${game.title}</h3>
        <li>Plataforma: ${game.platform}</li> 
        <li>Ano: ${game.year}</li> 
        <li>Preço: ${game.price.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })}</li>`;

      var deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "Deletar";
      deleteBtn.classList.add("btnDel");
      deleteBtn.addEventListener("click", () => {
        deleteGame(item);
      });

      var editBtn = document.createElement("button");
      editBtn.innerHTML = "Editar";
      editBtn.classList.add("btnEdit");
      editBtn.addEventListener("click", () => {
        var modal = document.querySelector(".editModal");
        modal.style.display = "block";
        var span = document.querySelector(".modalClose");
        span.onclick = () => {
          modal.style.display = "none";
        };
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        };
        loadForm(item);
      });

      item.appendChild(deleteBtn);
      item.appendChild(editBtn);
      listGames.appendChild(item);
    });
  })
  .catch((error) => {
    console.log(error);
  });


// EXCLUSÃO

// Função para DELETAR games
function deleteGame(listItem) {
  const id = listItem.getAttribute("data-id");
  axios
    .delete(`https://09-api-node.vercel.app/game/${id}`, axiosConfig)
    .then((response) => {
      alert("Game deletado!");
      location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
}

// Função para carregar formulário de edição
function loadForm(listItem) {
  const id = listItem.getAttribute("data-id");
  const title = listItem.getAttribute("data-title");
  const platform = listItem.getAttribute("data-platform");
  const year = listItem.getAttribute("data-year");
  const price = listItem.getAttribute("data-price");

  document.getElementById("idEdit").value = id;
  document.getElementById("titleEdit").value = title;
  document.getElementById("platformEdit").value = platform;
  document.getElementById("yearEdit").value = year;
  document.getElementById("priceEdit").value = price;
}

// CADASTRO

// Capturando o botão de cadastrar
const createBtn = document.getElementById("createBtn");
// Escuta ao evento click no botão
createBtn.addEventListener("click", createGame);

// Função para CADASTRAR games
function createGame() {
  const form = document.getElementById("createForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o envio padrão do formulário
  });

  const titleInput = document.getElementById("title");
  const platformInput = document.getElementById("platform");
  const yearInput = document.getElementById("year");
  const priceInput = document.getElementById("price");

  const game = {
    title: titleInput.value,
    platform: platformInput.value,
    year: yearInput.value,
    price: priceInput.value,
  };
  axios
    .post("https://09-api-node.vercel.app/game", game, axiosConfig)
    .then((response) => {
      if (response.status == 201) {
        alert("Game cadastrado!");
        location.href = "home.html";
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// ALTERAÇÃO

// Função para ALTERAR games
function updateGame() {
  const form = document.getElementById("editForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o envio padrão do formulário
  });

  const idInput = document.getElementById("idEdit");
  const titleInput = document.getElementById("titleEdit");
  const platformInput = document.getElementById("platformEdit");
  const yearInput = document.getElementById("yearEdit");
  const priceInput = document.getElementById("priceEdit");

  const game = {
    title: titleInput.value,
    platform: platformInput.value,
    year: yearInput.value,
    price: priceInput.value,
  };

  var id = idInput.value;

  axios
    .put(`https://09-api-node.vercel.app/game/${id}`, game, axiosConfig)
    .then((response) => {
      if (response.status == 200) {
        alert("Game atualizado!");
        location.reload();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}