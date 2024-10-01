// показываю/скрываю выпадабщий список монстров запускаю поиск
function initializeSelectHandlers(handleSubListChange) {
    const subList = document.querySelectorAll(".subList");
    const select = document.getElementById("select-box1");
    const selectBox = document.querySelector(".select-box");
  
    subList.forEach(function (item) {
      item.addEventListener("change", function (event) {
        handleSubListChange(event);
      });
    });
  
    select.addEventListener("change", function () {
      document.querySelectorAll(".sub-select").forEach(function (subSelect) {
        subSelect.style.display = "none";
      });
  
      const selectOption = document.getElementById(`sub-select${select.selectedIndex}`);
      selectOption.style.display = "block";

      // сохранине название главного label
      const labelFor = select.id;
      const selection = select.options[select.selectedIndex].text;
      const label = document.querySelector(`[for='${labelFor}']`);
      label.querySelector(".label-desc").textContent = selection;
    });
  
    select.addEventListener("click", function () {
      selectBox.classList.toggle("open");
    });
  }
  
  // показываю/скрываю бокс поиск
  function initializeSearchCheckboxHandler() {
    const selectBox = document.querySelector(".select-box");
    const searchCheckbox = document.getElementById("searchCheckbox");
    const wraperListMonstrs = document.getElementById("wraperListMonstrs");
  
    searchCheckbox.addEventListener("click", function () {
      wraperListMonstrs.classList.toggle("show");
      selectBox.classList.toggle("show");
    });
  }
  
  export { initializeSelectHandlers, initializeSearchCheckboxHandler };
  