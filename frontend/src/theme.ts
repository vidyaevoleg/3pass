export const colors = {
  blue1: '#83c5fa',
  blue2: '#491bb3',
  blue3: '#0c82d9',
  blue4: '#045edc',
  blue5: '#61a4d3',
  blue6: '#4869E1', // lock icon
  white: '#fff',
  gray1: '#adabab',
  gray2: '#EDEFF2', // borders
  gray3: '#ABB3C1', // grid icon
  gray4: '#76839E', // expand more icon, no iems selected text
  gray5: '#D7DAE0', // NewItem button border
  black: 'rgba(0, 0, 0, 0.87)',
  black2: '#202327', // NewItem button
}

const textPalette = {
  primary: colors.black2,
  secondary: colors.gray4,
  link: colors.blue4,
  linkHover: colors.blue3
};

const palette = {
  text: {
    primary: textPalette.primary,
    secondary: textPalette.secondary
  },
  primary: {
    disabled: colors.blue1 ,
    light: colors.blue2,
    main: colors.blue3,
    dark: colors.blue4,
    contrastText: colors.white
  },
  info: {
    light: colors.blue1,
    main: colors.blue2,
    dark: colors.blue4,
    contrastText: colors.white
  }
};

export const ThemeOptions = {
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontSize: '3.6rem',
      color: textPalette.primary,
      fontWeight: 400
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 400
    },
    h3: {
      fontSize: '2.4rem',
      fontWeight: 400
    },
    h4: {
      fontSize: '2.2rem'
    },
    h5: {
      fontSize: '1.6rem'
    },
    h6: {
      fontSize: '1.2rem'
    },
    p: {
      fontSize: '1.4rem'
    }
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1440, // now this value
      xl: 1600,
    },
  },

  palette,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
        },
        contained: {
          textTransform: 'uppercase' as const,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        },
        containedPrimary: {
          '&$disabled': {
            backgroundColor: palette.primary.disabled,
            color: palette.primary.contrastText
          }
        },
        containedSecondary: {
          backgroundColor: colors.blue1,
          color: colors.white,
          '&:hover': {
            backgroundColor: colors.blue5
          }
        }
      },
    },
    MuiLink: {
      styleOverrides: {
        underlineHover: {
          color: textPalette.link,
          '&:hover': {
            textDecoration: 'underline',
            color: textPalette.linkHover
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '80%',
          lineHeight: '1.2'
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          background: colors.white,
          color: colors.black
        }
      }
    },
  }
};
