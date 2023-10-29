import DOMPurify from "dompurify";
import { sendAPIData, fetchAPIData } from "../api/api";
import { countInputSearch, categoryMap } from "@/config";
import { mobsTypesColors } from '../utils/contrastColor'


const COUNT_INPUT = countInputSearch;
const MAXLENGTH = 100;
const MINLENGTH = 100;

let inputFieldCount = 0;

let listsNameMonsters = [];
let editCyrcelMap = false

const editForm = document.getElementById("editForm");

export async function addform() {
  if (!listsNameMonsters.length) {
    const addNamsMonsters = await fetchAPIData({
      category: "ListsNameOllMonsters",
    });
    listsNameMonsters = addNamsMonsters.map((item) => item.names).sort();
  }

  // создаем форму
  const newForm = document.createElement("form");
  newForm.id = `searchForm`;
  newForm.classList.add("addFormPoint");

  // создаю кнопку отправки
  const newBtn = document.createElement("button");
  newBtn.type = `submit`;
  newBtn.classList.add("button");
  newBtn.textContent = `Отправить`;

  // создаю кнопку добавление селектов
  const newAddSelect = document.createElement("button");
  newAddSelect.id = `addInput`;
  newAddSelect.classList.add("button");
  newAddSelect.classList.add("add-input-field");
  newAddSelect.textContent = `Добавить поле`;

  editForm.appendChild(newForm);
  newForm.appendChild(newBtn);
  newForm.appendChild(newAddSelect);
  addSelect();

  newAddSelect.addEventListener("click", (event) => {
    event.preventDefault();
    addSelect();
  });
}

function addSelect() {
  addInputField();
  const form = document.getElementById("searchForm");
  inputFieldCount++;

  // Создаем новый input
  const newInputField = document.createElement("input");
  newInputField.id = `inputField${inputFieldCount}`;
  newInputField.maxLength = MAXLENGTH;
  newInputField.minLength = MINLENGTH;
  newInputField.placeholder = `Монстр ${inputFieldCount}`;
  newInputField.classList.add("inputField");

  // Создаем новый select
  const newSelect = document.createElement("select");
  newSelect.id = `selectField${inputFieldCount}`;
  newSelect.classList.add("selectField");

  // Создаем опции для select
  const option = document.createElement("option");
  option.value = "";
  option.text = "Выбери монстра";
  option.selected = true;
  newSelect.appendChild(option);

  for (let i = 0; i < listsNameMonsters.length; i++) {
    const option = document.createElement("option");
    option.value = listsNameMonsters[i];
    option.text = listsNameMonsters[i];
    newSelect.appendChild(option);
  }
  const addButton = document.getElementById("addInput");
  // Добавляем элементы в контейнер
  form.appendChild(addButton);
  form.appendChild(newInputField);
  form.appendChild(newSelect);
}

// Функция для скрытия кнопки, если инпутов достаточно
function addInputField() {
  const addInputButton = document.getElementById("addInput");
  if (inputFieldCount <= COUNT_INPUT - 1) {
    addInputButton.style.display = "block";
  }
  if (inputFieldCount >= COUNT_INPUT - 1) {
    addInputButton.style.display = "none";
  }
}

export async function addInfoCircle({ circles, idCircle }) {
  await addInfo({ circles, idCircle });
  editForm.style.display = "grid";
  const paragraphElement = editForm.querySelector("p");
  paragraphElement.textContent = `ID: ${idCircle}`;
}

// размонтируем форму после закрытия
function hideEditForm() {
  inputFieldCount = 0;
  const form = document.getElementById("searchForm");
  // Отписываемся от событий
  form.removeEventListener("submit", handleSubmit);
  form.removeEventListener("change", changeSelectForm);

  // Удаляем форму и все её дочерние элементы
  form.parentNode.removeChild(form);

  const paragraphElement = editForm.querySelector("p");
  paragraphElement.textContent = "";
  editForm.style.display = "none";
}

// ищем и возвращаем тип точки
function findTypeCircles(noEmptyCircles, inputValues) {
  let newCircles = noEmptyCircles;
  inputValues.forEach((inputValue) => {
    const filtrationStage = newCircles.filter((circle) =>
      circle.listsMonsters.includes(inputValue)
    );

    if (filtrationStage.length > 0) {
      newCircles = filtrationStage;
    } else {
      newCircles = [{ type: "newType", listsMonsters: "" }];
    }
  });
  //Сортировка массива по длине значения в поле "listsMonsters"
  newCircles.sort(function (a, b) {
    return a.listsMonsters.length - b.listsMonsters.length;
  });

  return newCircles[0].type;
}

// Назначаем обработчик на все существующие select-элементы
const selectElements = document.querySelectorAll(".selectField");

selectElements.forEach((select, index) => {
  select.addEventListener("change", function () {
    const selectedValue = select.value;
    const inputField = document.getElementById(`inputField${index + 1}`);

    if (inputField) {
      inputField.value = selectedValue;
    }
  });
});

// переносим выбранные данные селекта в инпут
function changeSelectForm(event) {
  const select = event.target;

  if (select.classList.contains("selectField")) {
    const selectedValue = select.value;
    const inputField = document.getElementById(
      `inputField${select.id.replace("selectField", "")}`
    );

    if (inputField) {
      inputField.value = selectedValue;
    }
  }
}

export async function addInfo({ circles, idCircle }) {
  await addform();
  const form = document.getElementById("searchForm");
  form.addEventListener("submit", async (event) =>
  await handleSubmit(event, circles, idCircle)
  );

  form.addEventListener("change", (event) => changeSelectForm(event));
}

let lastRequestTime = 0; // Переменная для отслеживания времени последней отправки запроса

async function handleSubmit(event, circles, idCircle) {
  event.preventDefault();

  const currentTime = Date.now(); // Получаем текущее время

  // Проверяем, прошло ли уже 15 секунд с последней отправки запроса
  if (currentTime - lastRequestTime < 15000) {
    console.log(
      `Подождите 15 секунд перед отправкой следующего запроса, осталось ${
        Math.round(15 - (currentTime - lastRequestTime ) / 1000)
      } секунд`
    );
    console.alert(
      `Подождите 15 секунд перед отправкой следующего запроса, осталось ${
        Math.round(15 - (currentTime - lastRequestTime ) / 1000)
      } секунд`
    );
    return; // Если не прошло 15 секунд, выходим из функции
  }

  const inputValues = Array.from(document.querySelectorAll(".inputField")).map(
    (input) => DOMPurify.sanitize(input.value)
  );

  const noEmptyCircles = circles.filter((circle) => circle.listsMonsters);

  if (inputValues.length > 0 && inputValues[0] !== "") {
    const filteredCirclesByMonsterType = findTypeCircles(
      noEmptyCircles,
      inputValues
    );
    const inputValuesToString = inputValues.join(", ");

    const absenceCheck = noEmptyCircles.find(
      (item) => item.idCircles === Number(idCircle)
    );

    if (absenceCheck) {
      const addEditPoint = {
        idCircle: idCircle,
        type: filteredCirclesByMonsterType,
        listsMonsters: inputValuesToString,
        map: categoryMap,
        timePoint: Date.now(),
        table: "listsEditPoint",
        typeOfEdit: "forChecking",
      };
      await sendAPIData(addEditPoint);
    } else {
     const sucesfull1 = await sendAPIData({
        idCircle: idCircle,
        type: filteredCirclesByMonsterType,
        listsMonsters: inputValuesToString,
        map: categoryMap,
        timePoint: Date.now(),
        table: "listsEditPoint",
        typeOfEdit: "editAdded",
      });

    const sucesfull2 = await sendAPIData({
        idCircle: idCircle,
        type: filteredCirclesByMonsterType,
        listsMonsters: inputValuesToString,
        table: "mapVM",
      });

      if(sucesfull1 && sucesfull2) {
        editCyrcelMap = true
      } else {
        editCyrcelMap = false
      }
    }
    // Обновляем время последней отправки запроса
    lastRequestTime = currentTime;
    hideEditForm();

    if(editCyrcelMap === true) {
      // перерисовка елемента карты
      await editCircleForID({
        circles,
        idCircle: idCircle,
        type: filteredCirclesByMonsterType,
        listsMonsters: inputValuesToString,
      })
    }
  }
}
 async function editCircleForID({circles, idCircle, type, listsMonsters }) {
  const findTypeCircle = circles.find(item => item.idCircles === idCircle);
  if (findTypeCircle) {
    findTypeCircle.type = type;
    findTypeCircle.listsMonsters = listsMonsters;
    findTypeCircle.color = await mobsTypesColors(type);
  }
}

const closeButton = document.getElementById("closeButton");
closeButton.addEventListener("click", function (event) {
  event.preventDefault();
  hideEditForm();
});

const wrapperInfoText = document.getElementById("wrapperInfoText");
const wrapperExclamation = document.getElementById("wrapperExclamation");
wrapperExclamation.addEventListener("click", function () {
  wrapperInfoText.classList.toggle("show");
});
