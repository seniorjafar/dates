const City = ["Bukhara", "Samarqand", "Toshkent", "Farg'ona"];
const Position = ["React", "Nodejs", "Go", "Python"];
const TypePosition = ["junior", "middle", "senior"];

let pupilsJson = localStorage.getItem("pupils");
let pupils = JSON.parse(pupilsJson) ?? [];

const pupilTable = document.getElementById("pupilTable");
const pupilForm = document.getElementById("pupilForm");
const sendBtn = document.getElementById("sendBtn");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const pupilCity = document.getElementById("pupilCity");
const datePupil = document.getElementById("datePupil");
const isMarried = document.getElementById("isMarried");
const positionPupil = document.getElementById("positionPupil");
const typePosition = document.getElementById("typePosition");
const salaryPupil = document.getElementById("salaryPupil");
const formModal = document.querySelector(".modal");
const searchInput = document.getElementById("search");
const filterPosition = document.getElementById("filterPosition");
const filterCity = document.getElementById("filterCity");

let selected = null;

const getRow = ({
  id,
  firstName,
  lastName,
  city,
  date,
  position,
  typeposition,
  salary,
  isMarried,
}) => {
  return `
    <tr>
      <th scope="row">${id}</th>
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${city}</td>  
      <td>${date}</td>
      <td>${position}</td>
      <td>${typeposition}</td>
      <td>${salary}</td>
      <td>${isMarried ? "Ha" : "Yo'q"}</td>
      <td class = "text-end">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pupilModal" onclick="editPupil(${id})">Edit</button>
        <button class="btn btn-danger" onclick="deletePupil(${id})">Delete</button>
      </td>
      </tr>
      `;
};

City.forEach((city) => {
  pupilCity.innerHTML += `<option value="${city}">${city}</option>`;
});

Position.forEach((position) => {
  positionPupil.innerHTML += `<option value="${position}">${position}</option>`;
});

TypePosition.forEach((typeposition) => {
  typePosition.innerHTML += `<option value="${typeposition}">${typeposition}</option>`;
});

["Lavozim turini tanlang", ...TypePosition].forEach((typeposition) => {
  filterPosition.innerHTML += `<option value="${typeposition}">${typeposition}</option>`;
});

["Manzilni tanlang", ...City].forEach((city) => {
  filterCity.innerHTML += `<option value="${city}">${city}</option>`;
});

const getPupils = (newPupils) => {
  pupilTable.innerHTML = "";
  let count = 0;
  (newPupils || pupils).forEach((pupil) => {
    count++;
    pupil.id = count;
    pupilTable.innerHTML += getRow(pupil);
  });
};

getPupils();

pupilForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let check = this.checkValidity();
  this.classList.add("was-validated");
  if (check) {
    bootstrap.Modal.getInstance(formModal).hide();
    let newPupil = {
      firstName: firstName.value,
      lastName: lastName.value,
      city: pupilCity.value,
      date: datePupil.value,
      position: positionPupil.value,
      typeposition: typePosition.value,
      salary: salaryPupil.value,
      isMarried: isMarried.checked,
    };
    if (selected) {
      pupils = pupils.map((pupil) => {
        if (pupil.id == selected.id) {
          return {
            id: selected.id,
            ...newPupil,
          };
        } else {
          return pupil;
        }
      });
    } else {
      newPupil.id = pupils.length;
      pupils.push(newPupil);
    }
    localStorage.setItem("pupils", JSON.stringify(pupils));
    window.location.reload(); // bo'shatish uchun
  }
  getPupils();
});

function editPupil(id) {
  let pupil = pupils.find((pupil) => pupil.id == id);
  selected = pupil;
  firstName.value = pupil.firstName;
  lastName.value = pupil.lastName;
  pupilCity.value = pupil.city;
  datePupil.value = pupil.date;
  positionPupil.value = pupil.position;
  typePosition.value = pupil.typeposition;
  salaryPupil.value = pupil.salary;
  isMarried.checked = pupil.isMarried;
}

function deletePupil(id) {
  let isConfirm = confirm("O'chirishni xohlaysizmi ?");
  if (isConfirm) {
    pupils = pupils.filter((pupil) => pupil.id != id);
    localStorage.setItem("pupils", JSON.stringify(pupils));
    getPupils();
  }
}

searchInput.addEventListener("input", function () {
  let search = this.value.toLowerCase();
  searchPupils = pupils.filter(
    (pupil) =>
      pupil.firstName.toLowerCase().includes(search) ||
      pupil.lastName.toLowerCase().includes(search)
  );
  getPupils(searchPupils);
});

filterPosition.addEventListener("change", function () {
  if (this.value == "Lavozim turini tanlang") {
    getPupils();
  } else {
    filterPupils = pupils.filter((pupil) => pupil.typeposition == this.value);
    getPupils(filterPupils);
  }
});

filterCity.addEventListener("change", function () {
  if (this.value == "Manzilni tanlang") {
    getPupils();
  } else {
    filterPupils = pupils.filter((pupil) => pupil.city == this.value);
    getPupils(filterPupils);
  }
});
