const url = "http://localhost:3001/dioses";

const form = document.getElementById("god-form");
const nameInput = document.getElementById("name");
const domainInput = document.getElementById("domain");
const symbolInput = document.getElementById("symbol");
const powerInput = document.getElementById("power");
const cityInput = document.getElementById("city");
const godList = document.getElementById("gods-list");
const headerList = document.getElementById("header-list");

//buttons and input for filtering
const showAllBtn = document.getElementById("show-all-btn");
const showNameDomainBtn = document.getElementById("show-name-domain-btn");
const attributeInput = document.getElementById("attribute-input");
const showAttributeBtn = document.getElementById("show-attribute-btn");


let editingId = null;
let allGods = [];


async function getGods() {
  try {
    const response = await fetch(url);
    allGods = await response.json();
    showAllGods();
  } catch (error) {
    console.error("Error al cargar dioses:", error);
  }
}



function showAllGods() {
  headerList.innerHTML = "<strong>ID - Nombre - Dominio - Poder - Simbolo - Ciudad</strong>";
  godList.innerHTML = "";
  
  allGods.forEach(god => {
    const li = document.createElement("li");
    li.innerHTML = `${god.id} - ${god.nombre} - ${god.dominio} - ${god.poder} - ${god.simbolo} - ${god.ciudad}`;

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("edit-button");
    editButton.classList.add("button-group");
    editButton.addEventListener("click", async () => {
      try {
        console.log("Editando dios con ID:", god.id);
        const response = await fetch(`${url}/${god.id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const godData = await response.json();
        nameInput.value = godData.nombre;
        domainInput.value = godData.dominio;
        symbolInput.value = godData.simbolo;
        cityInput.value = godData.ciudad;
        powerInput.value = godData.poder;
        editingId = godData.id;
      } catch (error) {
        console.error("Error al cargar datos para editar:", error);
        alert("Error al cargar los datos del dios.");
      }
    });

    const divBtn=document.createElement("div");
    divBtn.classList.add("button-group");

    li.appendChild(divBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.classList.add("delete-button");
    deleteBtn.addEventListener("click", async () => {
      try {
        const response = await fetch(`${url}/${god.id}`, { method: "DELETE" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        getGods();
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar al dios");
      }
    });

    divBtn.appendChild(editButton);
    divBtn.appendChild(deleteBtn);
    
    // li.appendChild(editButton);
    // li.appendChild(deleteBtn);
    godList.appendChild(li);
  });
}

// Funcion para mostrar solo nombre y dominio
function showNameAndDomain() {
    headerList.innerHTML = "<strong>Nombre - Dominio</strong>";
    godList.innerHTML = "";
  
    allGods.forEach(god => {
    const li = document.createElement("li");
    li.textContent = `${god.nombre} - ${god.dominio}`;
    godList.appendChild(li);
  });
}

// Funcion para mostrar por atributo
function showAttribute() {
  const attribute = attributeInput.value;
  
  if (!attribute) {
    alert("Por favor ingresa un atributo");
    return;
  }

  const validAttributes = ["nombre", "dominio", "simbolo", "poder", "ciudad"];
  if (!validAttributes.includes(attribute)) {
    alert(`Atributo "${attribute}" no válido. Usa: nombre, dominio, simbolo, poder o ciudad`);
    return;
  }
  // headerList.innerHTML = "";
 headerList.innerHTML = `<strong>${attribute}</strong>`;
  godList.innerHTML = "";
  
  allGods.forEach(god => {
    const li = document.createElement("li");
    li.textContent = `${god[attribute]}`;

    godList.appendChild(li);
  });
  
  attributeInput.value = "";
}


showAllBtn.addEventListener("click", showAllGods);
showNameDomainBtn.addEventListener("click", showNameAndDomain);
showAttributeBtn.addEventListener("click", showAttribute);
getGods();

// Evento del formulario para crear o editar un dios
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const god = {
    nombre: nameInput.value,
    dominio: domainInput.value,
    simbolo: symbolInput.value,
    poder: powerInput.value,
    ciudad: cityInput.value
  };

  try {
    if (editingId) {
      await fetch(`${url}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(god)
      });
      editingId = null;
    } else {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(god)
      });
    }
    form.reset();
    getGods();
  } catch (error) {
    console.error("Error al guardar:", error);
  }});