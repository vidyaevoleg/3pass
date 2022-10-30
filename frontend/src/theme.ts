const colors = {
  blue1: '#83c5fa',
  blue2: '#491bb3',
  blue3: '#0c82d9',
  blue4: '#045edc',
  blue5: '#61a4d3',
  white: '#fff',
  gray1: '#adabab',
  black: 'rgba(0, 0, 0, 0.87)'
}

const textPalette = {
  primary: colors.black,
  secondary: colors.gray1,
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
    fontFamily: ['"Source Sans Pro"', 'sans-serif'].join(','),
    h1: {
      fontSize: '3.6rem',
      color: textPalette.primary,
      fontWeight: 300
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 300
    },
    h3: {
      fontSize: '2.4rem',
      fontWeight: 300
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
  palette,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const
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
    }
  }
};
