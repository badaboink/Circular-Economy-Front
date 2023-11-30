// import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

// const icon = (name) => (
//   <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
// );
const titleList = [
  'Resource type1',
  'Resource type2',
  'Resource type3',
  'Resource type4',
  'Resource type5',
  'Resource type6',
];
const navConfig = titleList.map((title, index) => ({
  title,
  path: `/resource/${index}`,
}));

export default navConfig;
