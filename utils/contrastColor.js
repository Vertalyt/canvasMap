import { typeColorsSort} from './listsTypeAndColors.js'
import { fetchAPIData } from "../api/api";
import { typeGroupMob } from '@/config'

const filtersClasses = {
    category: typeGroupMob,
  };
  
let typeMob
export async function mobsTypesColors(typeToFind) {

    if(!typeMob) {
        const fetchTypeMob = await fetchAPIData(filtersClasses);

        typeMob = fetchTypeMob.map(item => {
            return {
                ...item,
                type: item.type.split(', ')
            };
        });
    }

  const foundItem = typeMob.find(item => item.type && item.type.includes(typeToFind));

  if (foundItem) {
      const index = foundItem.type.indexOf(typeToFind);
      const result = typeColorsSort.find(item => item.count === foundItem.count).colors[index]
      if(result) {
          return result
      } else {
          return ["rgba(255, 192, 192, 0.8)"]
      }
  }
  }