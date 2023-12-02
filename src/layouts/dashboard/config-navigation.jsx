// import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

// const icon = (name) => (
//   <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
// );
// const titleList = [
//   'Resource type1',
//   'Resource type2',
//   'Resource type3',
//   'Resource type4',
//   'Resource type5',
//   'Resource type6',
// ];
// const navConfig = titleList.map((title, index) => ({
//   title,
//   path: `/resource/${index}`,
// }));

// export default navConfig;
import {RESOURCE_TYPES_URL} from '../../utils/apiUrls';


export const generateNavConfig = async () => {
  try {
    const response = await fetch(RESOURCE_TYPES_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    const navConfig = responseData.data.map((item, index) => ({
      title: item.description,
      path: `/resource/${item.name}`,
    }));

    return navConfig;
  } catch (error) {
    console.error('Error fetching resource type descriptions:', error);
    return [];
  }
};