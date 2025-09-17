const url = "http://localhost:3001/dioses";

const form = document.getElementById("god-form");
const nameInput = document.getElementById("name");
const domainInput = document.getElementById("domain");
const symbolInput = document.getElementById("symbol");
const powerInput = document.getElementById("power");
const cityInput = document.getElementById("city");
const godList = document.getElementById("gods-list");

// Botones y controles
const showAllBtn = document.getElementById("show-all-btn");
const showNameDomainBtn = document.getElementById("show-name-domain-btn");
const attributeInput = document.getElementById("attribute-input");

let editingId = null;
let allGods = [];



async function getGods() {
  try {
    const res = await fetch(url);
    allGods = await res.json();
    showAllGods();
  } catch (error) {
    console.error("Error al cargar dioses:", error);
  }
}



function showAllGods() {
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
        const res = await fetch(`${url}/${god.id}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const godData = await res.json();
        nameInput.value = godData.nombre;
        domainInput.value = godData.dominio;
        symbolInput.value = godData.simbolo;
        cityInput.value = godData.ciudad;
        powerInput.value = godData.poder;
        editingId = godData.id;
        console.log("Datos cargados para editar:", godData);
      } catch (error) {
        console.error("Error al cargar datos para editar:", error);
        alert("Error al cargar los datos del dios. Revisa la consola.");
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
        console.log("Eliminando dios con ID:", god.id);
        const res = await fetch(`${url}/${god.id}`, { method: "DELETE" });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        console.log("Dios eliminado exitosamente");

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
  godList.innerHTML = "";
  
  allGods.forEach(god => {
    const li = document.createElement("li");
    li.textContent = `${god.nombre} - ${god.dominio}`;
    godList.appendChild(li);
  });
}

// Funcion para mostrar por atributo
function showAttribute(attribute) {
  godList.innerHTML = "";
  
  const validAttributes = ["nombre", "dominio", "simbolo", "poder", "ciudad"];
  if (!validAttributes.includes(attribute)) {
    const li = document.createElement("li");
    li.textContent = `Atributo "${attribute}" no válido. Usa: nombre, dominio, simbolo, poder, ciudad`;
    li.style.padding = "10px";
    godList.appendChild(li);
    return;
  }
  
  allGods.forEach(god => {
    const li = document.createElement("li");
    li.textContent = `${god[attribute]}`;
    li.style.padding = "10px";
    li.style.borderBottom = "1px solid #eee";
    godList.appendChild(li);
  });
}

// Event listeners
showAllBtn.addEventListener("click", showAllGods);
showNameDomainBtn.addEventListener("click", showNameAndDomain);
attributeInput.addEventListener("input", (e) => {
  showAttribute(e.target.value.trim());
});

// Inicializar
getGods();

// Evento del formulario para crear o editar un dios
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const god = {
    nombre: nameInput.value,
    dominio: domainInput.value,
    simbolo: symbolInput.value,
    poder: parseInt(powerInput.value) || powerInput.value,
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