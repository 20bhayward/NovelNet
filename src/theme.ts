// theme.ts
import { extendTheme } from '@chakra-ui/react';

// 2. Add your color mode config
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const colors = {
  background: '#202020',
  subbackground: '#282828',
  header: '#131415',
  button: '#313131',
  section: '#424242',
  subheading: '#959595',
  heading: '#fefffe',
  text: "#ebebeb"
};

const theme = extendTheme({
  colors: {
    ...colors,
  },
  config
});

export default theme;