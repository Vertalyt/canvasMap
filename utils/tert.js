const xDifference = 70;

const coordinates  = [];
let firstPointId;

// Подгрузка файла с координатами с использованием Fetch API
fetch("coords2.html")
  .then((response) => response.text())
  .then((fl) => {
    fl.split(/\r?\n/).forEach((item) => {


        const xposMatch = item.match(/xpos="(\d+)"/);
        const yposMatch = item.match(/ypos="(\d+)"/);
        const ptypeMatch = item.match(/ptype="([^"]+)"/);
        const pnameMatch = item.match(/pname="([^"]+)"/);
      
        if (xposMatch && yposMatch && ptypeMatch && pnameMatch) {
          const x = parseInt(xposMatch[1]);
          const y = parseInt(yposMatch[1]);
          const ptype = ptypeMatch[1];
          const pname = pnameMatch[1];
      
          const point = {
            x: Number(x),
            y: Number(y),
            pname: pname,
            ptype: ptype,
          };
      
          // Точка для создания координат akvilion
          if (point.x === 22 && point.y === 27) {
            point.id = 4305;
            firstPointId = 4305;
          }
      
          // Фильтрация пустых точек
          if (point.pname !== "Ось Y" && point.pname !== "Ось X") {
            coordinates.push(point);
          }
        }
      });


    coordinates.forEach((point) => {
        if (!point.id) {
            calculatePointId(point, coordinates.find(p => p.id == firstPointId));
        }
    });


    // Теперь в переменной coordinates у вас есть массив объектов с нужными данными.
  });


  function calculatePointId(point, firstPoint) {
    point.id = firstPoint.id;

    //calculate x
    if (point.x > firstPoint.x) {
        point.id += (point.x - firstPoint.x) * xDifference;
    } else if (point.x < firstPoint.x) {
        point.id -= (firstPoint.x - point.x) * xDifference;
    }


    //calculate y
    if (point.y > firstPoint.y) {
        point.id += (point.y - firstPoint.y);
    } else if (point.y < firstPoint.y) {
        point.id -= (firstPoint.y - point.y);
    }

    return point;
} 
console.log(coordinates);