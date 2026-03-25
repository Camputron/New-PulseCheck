import { createTheme, alpha, PaletteMode, Shadows } from "@mui/material/styles"

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    highlighted: true
  }
}
declare module "@mui/material/styles" {
  interface ColorRange {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface PaletteColor extends ColorRange {}

  interface Palette {
    baseShadow: string
  }
}

const defaultTheme = createTheme()

const customShadows: Shadows = [...defaultTheme.shadows]

export const teal = {
  50: "hsl(174, 80%, 95%)",
  100: "hsl(174, 80%, 90%)",
  200: "hsl(174, 80%, 80%)",
  300: "hsl(174, 80%, 65%)",
  400: "hsl(174, 80%, 42%)",
  500: "hsl(174, 85%, 35%)",
  600: "hsl(174, 90%, 28%)",
  700: "hsl(174, 95%, 22%)",
  800: "hsl(174, 100%, 15%)",
  900: "hsl(174, 100%, 10%)",
}

export const amber = {
  50: "hsl(45, 100%, 96%)",
  100: "hsl(45, 100%, 90%)",
  200: "hsl(45, 100%, 80%)",
  300: "hsl(45, 95%, 65%)",
  400: "hsl(45, 95%, 50%)",
  500: "hsl(45, 95%, 43%)",
  600: "hsl(40, 96%, 36%)",
  700: "hsl(38, 97%, 28%)",
  800: "hsl(35, 100%, 20%)",
  900: "hsl(33, 100%, 14%)",
}

export const gray = {
  50: "hsl(220, 35%, 97%)",
  100: "hsl(220, 30%, 94%)",
  200: "hsl(220, 25%, 88%)",
  300: "hsl(220, 20%, 80%)",
  400: "hsl(220, 20%, 65%)",
  500: "hsl(220, 20%, 42%)",
  600: "hsl(220, 20%, 35%)",
  700: "hsl(220, 20%, 25%)",
  800: "hsl(220, 30%, 6%)",
  900: "hsl(220, 35%, 3%)",
}

export const green = {
  50: "hsl(150, 80%, 95%)",
  100: "hsl(150, 75%, 87%)",
  200: "hsl(150, 70%, 72%)",
  300: "hsl(150, 65%, 55%)",
  400: "hsl(150, 70%, 40%)",
  500: "hsl(150, 75%, 32%)",
  600: "hsl(150, 80%, 25%)",
  700: "hsl(150, 85%, 18%)",
  800: "hsl(150, 90%, 12%)",
  900: "hsl(150, 95%, 7%)",
}

export const orange = {
  50: "hsl(30, 100%, 96%)",
  100: "hsl(30, 95%, 88%)",
  200: "hsl(28, 90%, 76%)",
  300: "hsl(25, 90%, 62%)",
  400: "hsl(22, 90%, 50%)",
  500: "hsl(20, 92%, 42%)",
  600: "hsl(18, 95%, 34%)",
  700: "hsl(16, 97%, 26%)",
  800: "hsl(14, 100%, 18%)",
  900: "hsl(12, 100%, 12%)",
}

export const red = {
  50: "hsl(0, 100%, 97%)",
  100: "hsl(0, 90%, 90%)",
  200: "hsl(0, 85%, 80%)",
  300: "hsl(0, 80%, 68%)",
  400: "hsl(0, 80%, 55%)",
  500: "hsl(0, 80%, 45%)",
  600: "hsl(0, 85%, 36%)",
  700: "hsl(0, 90%, 28%)",
  800: "hsl(0, 95%, 20%)",
  900: "hsl(0, 100%, 12%)",
}

export const getDesignTokens = (mode: PaletteMode) => {
  customShadows[1] =
    mode === "dark"
      ? "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px"
      : "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px"

  return {
    palette: {
      mode,
      primary: {
        light: teal[200],
        main: teal[400],
        dark: teal[700],
        contrastText: teal[50],
        ...(mode === "dark" && {
          contrastText: teal[50],
          light: teal[300],
          main: teal[500],
          dark: teal[700],
        }),
      },
      secondary: {
        light: amber[200],
        main: amber[400],
        dark: amber[700],
        contrastText: amber[900],
        ...(mode === "dark" && {
          light: amber[300],
          main: amber[400],
          dark: amber[700],
          contrastText: amber[900],
        }),
      },
      info: {
        light: teal[100],
        main: teal[300],
        dark: teal[600],
        contrastText: gray[50],
        ...(mode === "dark" && {
          contrastText: teal[300],
          light: teal[500],
          main: teal[700],
          dark: teal[900],
        }),
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
        ...(mode === "dark" && {
          light: orange[400],
          main: orange[500],
          dark: orange[700],
        }),
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
        ...(mode === "dark" && {
          light: red[400],
          main: red[500],
          dark: red[700],
        }),
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
        ...(mode === "dark" && {
          light: green[400],
          main: green[500],
          dark: green[700],
        }),
      },
      grey: {
        ...gray,
      },
      divider: mode === "dark" ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
      background: {
        default: "hsl(0, 0%, 99%)",
        paper: "hsl(220, 35%, 97%)",
        ...(mode === "dark" && {
          default: gray[900],
          paper: "hsl(220, 30%, 7%)",
        }),
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        ...(mode === "dark" && {
          primary: "hsl(0, 0%, 100%)",
          secondary: gray[400],
        }),
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
        ...(mode === "dark" && {
          hover: alpha(gray[600], 0.2),
          selected: alpha(gray[600], 0.3),
        }),
      },
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5,
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2,
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(14),
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400,
      },
      caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 4,
    },
    shadows: customShadows,
  }
}
