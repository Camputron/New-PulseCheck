import { alpha, Theme, Components } from "@mui/material/styles"
import { outlinedInputClasses } from "@mui/material/OutlinedInput"
import { svgIconClasses } from "@mui/material/SvgIcon"
import { toggleButtonGroupClasses } from "@mui/material/ToggleButtonGroup"
import { toggleButtonClasses } from "@mui/material/ToggleButton"
import { gray, teal, amber, red, green, orange } from "../themePrimitives"

export const inputsCustomizations: Components<Theme> = {
  MuiButtonBase: {
    defaultProps: {
      // disableTouchRipple: true,
      // disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        boxSizing: "border-box",
        transition: "all 100ms ease-in",
        "&:focus-visible": {
          outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          outlineOffset: "2px",
        },
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: "none",
        borderRadius: theme.shape.borderRadius,
        textTransform: "none" as const,
        fontWeight: 500,
        borderColor: "transparent",
        variants: [
          {
            props: { size: "small" },
            style: {
              height: "2.25rem",
              padding: "8px 12px",
            },
          },
          {
            props: { size: "medium" },
            style: {
              height: "2.5rem",
            },
          },
          {
            props: { color: "primary", variant: "contained" },
            style: {
              color: "white",
              backgroundColor: teal[500],
              backgroundImage: `linear-gradient(to bottom, ${teal[400]}, ${teal[500]})`,
              boxShadow: `inset 0 1px 0 ${alpha(teal[200], 0.3)}, inset 0 -1px 0 ${alpha(teal[800], 0.3)}`,
              border: `1px solid ${teal[500]}`,
              "&:hover": {
                backgroundImage: "none",
                backgroundColor: teal[600],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: teal[700],
              },
              ...theme.applyStyles("dark", {
                color: "white",
                backgroundColor: teal[500],
                backgroundImage: `linear-gradient(to bottom, ${teal[400]}, ${teal[500]})`,
                boxShadow: `inset 0 1px 0 ${alpha(teal[300], 0.3)}, inset 0 -1px 0 ${alpha(teal[700], 0.3)}`,
                border: `1px solid ${teal[500]}`,
                "&:hover": {
                  backgroundImage: "none",
                  backgroundColor: teal[600],
                  boxShadow: "none",
                },
                "&:active": {
                  backgroundColor: teal[700],
                },
              }),
            },
          },
          {
            props: { color: "secondary", variant: "contained" },
            style: {
              color: amber[900],
              backgroundColor: amber[400],
              backgroundImage: `linear-gradient(to bottom, ${alpha(amber[400], 0.9)}, ${amber[500]})`,
              boxShadow: `inset 0 2px 0 ${alpha(amber[200], 0.3)}, inset 0 -2px 0 ${alpha(amber[700], 0.3)}`,
              border: `1px solid ${amber[500]}`,
              "&:hover": {
                backgroundColor: amber[600],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: amber[700],
                backgroundImage: "none",
              },
            },
          },
          {
            props: { color: "success", variant: "contained" },
            style: {
              color: "white",
              backgroundColor: green[500],
              backgroundImage: `linear-gradient(to bottom, ${green[400]}, ${green[500]})`,
              boxShadow: `inset 0 1px 0 ${alpha(green[200], 0.3)}, inset 0 -1px 0 ${alpha(green[800], 0.3)}`,
              border: `1px solid ${green[500]}`,
              "&:hover": {
                backgroundImage: "none",
                backgroundColor: green[600],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: green[700],
              },
            },
          },
          {
            props: { color: "error", variant: "contained" },
            style: {
              color: "white",
              backgroundColor: red[400],
              backgroundImage: `linear-gradient(to bottom, ${red[300]}, ${red[400]})`,
              boxShadow: `inset 0 1px 0 ${alpha(red[200], 0.3)}, inset 0 -1px 0 ${alpha(red[700], 0.3)}`,
              border: `1px solid ${red[400]}`,
              "&:hover": {
                backgroundImage: "none",
                backgroundColor: red[500],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: red[600],
              },
            },
          },
          {
            props: { color: "warning", variant: "contained" },
            style: {
              color: "white",
              backgroundColor: orange[400],
              backgroundImage: `linear-gradient(to bottom, ${orange[300]}, ${orange[400]})`,
              boxShadow: `inset 0 1px 0 ${alpha(orange[200], 0.3)}, inset 0 -1px 0 ${alpha(orange[700], 0.3)}`,
              border: `1px solid ${orange[400]}`,
              "&:hover": {
                backgroundImage: "none",
                backgroundColor: orange[500],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: orange[600],
              },
            },
          },
          {
            props: { color: "info", variant: "contained" },
            style: {
              color: "white",
              backgroundColor: teal[400],
              backgroundImage: `linear-gradient(to bottom, ${teal[300]}, ${teal[400]})`,
              boxShadow: `inset 0 1px 0 ${alpha(teal[200], 0.3)}, inset 0 -1px 0 ${alpha(teal[700], 0.3)}`,
              border: `1px solid ${teal[400]}`,
              "&:hover": {
                backgroundImage: "none",
                backgroundColor: teal[500],
                boxShadow: "none",
              },
              "&:active": {
                backgroundColor: teal[600],
              },
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              color: theme.palette.text.primary,
              border: "1px solid",
              borderColor: gray[200],
              backgroundColor: alpha(gray[50], 0.3),
              "&:hover": {
                backgroundColor: gray[100],
                borderColor: gray[300],
              },
              "&:active": {
                backgroundColor: gray[200],
              },
              ...theme.applyStyles("dark", {
                backgroundColor: gray[800],
                borderColor: gray[700],
                "&:hover": {
                  backgroundColor: gray[900],
                  borderColor: gray[600],
                },
                "&:active": {
                  backgroundColor: gray[900],
                },
              }),
            },
          },
          {
            props: { color: "primary", variant: "outlined" },
            style: {
              color: teal[500],
              border: "1px solid",
              borderColor: teal[200],
              backgroundColor: alpha(teal[50], 0.3),
              "&:hover": {
                backgroundColor: teal[100],
                borderColor: teal[400],
              },
              "&:active": {
                backgroundColor: alpha(teal[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: teal[300],
                border: "1px solid",
                borderColor: teal[900],
                backgroundColor: alpha(teal[900], 0.3),
                "&:hover": {
                  borderColor: teal[700],
                  backgroundColor: alpha(teal[900], 0.6),
                },
                "&:active": {
                  backgroundColor: alpha(teal[900], 0.5),
                },
              }),
            },
          },
          {
            props: { color: "secondary", variant: "outlined" },
            style: {
              color: amber[700],
              border: "1px solid",
              borderColor: amber[200],
              backgroundColor: amber[50],
              "&:hover": {
                backgroundColor: amber[100],
                borderColor: amber[400],
              },
              "&:active": {
                backgroundColor: alpha(amber[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: amber[50],
                border: "1px solid",
                borderColor: amber[900],
                backgroundColor: alpha(amber[900], 0.3),
                "&:hover": {
                  borderColor: amber[700],
                  backgroundColor: alpha(amber[900], 0.6),
                },
                "&:active": {
                  backgroundColor: alpha(amber[900], 0.5),
                },
              }),
            },
          },
          {
            props: { color: "error", variant: "outlined" },
            style: {
              color: red[500],
              border: "1px solid",
              borderColor: red[200],
              backgroundColor: alpha(red[50], 0.3),
              "&:hover": {
                backgroundColor: red[100],
                borderColor: red[400],
              },
              "&:active": {
                backgroundColor: alpha(red[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: red[300],
                border: "1px solid",
                borderColor: red[900],
                backgroundColor: alpha(red[900], 0.3),
                "&:hover": {
                  borderColor: red[700],
                  backgroundColor: alpha(red[900], 0.6),
                },
                "&:active": {
                  backgroundColor: alpha(red[900], 0.5),
                },
              }),
            },
          },
          {
            props: { color: "success", variant: "outlined" },
            style: {
              color: green[500],
              border: "1px solid",
              borderColor: green[200],
              backgroundColor: alpha(green[50], 0.3),
              "&:hover": {
                backgroundColor: green[100],
                borderColor: green[400],
              },
              "&:active": {
                backgroundColor: alpha(green[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: green[300],
                border: "1px solid",
                borderColor: green[900],
                backgroundColor: alpha(green[900], 0.3),
                "&:hover": {
                  borderColor: green[700],
                  backgroundColor: alpha(green[900], 0.6),
                },
                "&:active": {
                  backgroundColor: alpha(green[900], 0.5),
                },
              }),
            },
          },
          {
            props: { color: "warning", variant: "outlined" },
            style: {
              color: orange[500],
              border: "1px solid",
              borderColor: orange[200],
              backgroundColor: alpha(orange[50], 0.3),
              "&:hover": {
                backgroundColor: orange[100],
                borderColor: orange[400],
              },
              "&:active": {
                backgroundColor: alpha(orange[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: orange[300],
                border: "1px solid",
                borderColor: orange[900],
                backgroundColor: alpha(orange[900], 0.3),
                "&:hover": {
                  borderColor: orange[700],
                  backgroundColor: alpha(orange[900], 0.6),
                },
                "&:active": {
                  backgroundColor: alpha(orange[900], 0.5),
                },
              }),
            },
          },
          {
            props: { color: "info", variant: "outlined" },
            style: {
              color: teal[500],
              border: "1px solid",
              borderColor: teal[200],
              backgroundColor: alpha(teal[50], 0.3),
              "&:hover": {
                backgroundColor: teal[100],
                borderColor: teal[400],
              },
              "&:active": {
                backgroundColor: alpha(teal[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: teal[300],
                border: "1px solid",
                borderColor: teal[900],
                backgroundColor: alpha(teal[900], 0.3),
                "&:hover": {
                  borderColor: teal[700],
                  backgroundColor: alpha(teal[900], 0.6),
                },
                "&:active": {
                  backgroundColor: alpha(teal[900], 0.5),
                },
              }),
            },
          },
          {
            props: { variant: "text" },
            style: {
              color: gray[600],
              border: "none",
              "&:hover": {
                backgroundColor: gray[100],
                border: "none",
              },
              "&:active": {
                backgroundColor: gray[200],
              },
              ...theme.applyStyles("dark", {
                color: gray[50],
                "&:hover": {
                  backgroundColor: gray[700],
                  border: "none",
                },
                "&:active": {
                  backgroundColor: alpha(gray[700], 0.7),
                },
              }),
            },
          },
          {
            props: { color: "primary", variant: "text" },
            style: {
              color: teal[500],
              border: "none",
              "&:hover": {
                backgroundColor: alpha(teal[100], 0.5),
                border: "none",
              },
              "&:active": {
                backgroundColor: alpha(teal[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: teal[300],
                "&:hover": {
                  backgroundColor: alpha(teal[900], 0.5),
                  border: "none",
                },
                "&:active": {
                  backgroundColor: alpha(teal[900], 0.3),
                },
              }),
            },
          },
          {
            props: { color: "secondary", variant: "text" },
            style: {
              color: amber[600],
              "&:hover": {
                backgroundColor: alpha(amber[100], 0.5),
              },
              "&:active": {
                backgroundColor: alpha(amber[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: amber[300],
                "&:hover": {
                  backgroundColor: alpha(amber[900], 0.5),
                },
                "&:active": {
                  backgroundColor: alpha(amber[900], 0.3),
                },
              }),
            },
          },
          {
            props: { color: "success", variant: "text" },
            style: {
              color: green[500],
              "&:hover": {
                backgroundColor: alpha(green[100], 0.5),
              },
              "&:active": {
                backgroundColor: alpha(green[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: green[300],
                "&:hover": {
                  backgroundColor: alpha(green[900], 0.5),
                },
                "&:active": {
                  backgroundColor: alpha(green[900], 0.3),
                },
              }),
            },
          },
          {
            props: { color: "error", variant: "text" },
            style: {
              color: red[500],
              "&:hover": {
                backgroundColor: alpha(red[100], 0.5),
              },
              "&:active": {
                backgroundColor: alpha(red[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: red[300],
                "&:hover": {
                  backgroundColor: alpha(red[900], 0.5),
                },
                "&:active": {
                  backgroundColor: alpha(red[900], 0.3),
                },
              }),
            },
          },
          {
            props: { color: "warning", variant: "text" },
            style: {
              color: orange[500],
              "&:hover": {
                backgroundColor: alpha(orange[100], 0.5),
              },
              "&:active": {
                backgroundColor: alpha(orange[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: orange[300],
                "&:hover": {
                  backgroundColor: alpha(orange[900], 0.5),
                },
                "&:active": {
                  backgroundColor: alpha(orange[900], 0.3),
                },
              }),
            },
          },
          {
            props: { color: "info", variant: "text" },
            style: {
              color: teal[500],
              "&:hover": {
                backgroundColor: alpha(teal[100], 0.5),
              },
              "&:active": {
                backgroundColor: alpha(teal[200], 0.7),
              },
              ...theme.applyStyles("dark", {
                color: teal[300],
                "&:hover": {
                  backgroundColor: alpha(teal[900], 0.5),
                },
                "&:active": {
                  backgroundColor: alpha(teal[900], 0.3),
                },
              }),
            },
          },
        ],
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: "none",
        borderRadius: "50%",
        color: theme.palette.text.primary,
        "&:hover": {
          backgroundColor: alpha(theme.palette.action.hover, 0.08),
        },
        "&:active": {
          backgroundColor: alpha(theme.palette.action.active, 0.12),
        },
        variants: [
          {
            props: { size: "small" },
            style: {
              width: "2.25rem",
              height: "2.25rem",
              padding: "0.25rem",
              [`& .${svgIconClasses.root}`]: { fontSize: "1rem" },
            },
          },
          {
            props: { size: "medium" },
            style: {
              width: "2.5rem",
              height: "2.5rem",
            },
          },
          {
            props: { color: "primary" },
            style: {
              color: teal[500],
              "&:hover": {
                backgroundColor: alpha(teal[100], 0.5),
              },
              ...theme.applyStyles("dark", {
                color: teal[300],
                "&:hover": {
                  backgroundColor: alpha(teal[900], 0.5),
                },
              }),
            },
          },
          {
            props: { color: "secondary" },
            style: {
              color: amber[600],
              "&:hover": {
                backgroundColor: alpha(amber[100], 0.5),
              },
              ...theme.applyStyles("dark", {
                color: amber[300],
                "&:hover": {
                  backgroundColor: alpha(amber[900], 0.5),
                },
              }),
            },
          },
          {
            props: { color: "success" },
            style: {
              color: green[500],
              "&:hover": {
                backgroundColor: alpha(green[100], 0.5),
              },
              ...theme.applyStyles("dark", {
                color: green[300],
                "&:hover": {
                  backgroundColor: alpha(green[900], 0.5),
                },
              }),
            },
          },
          {
            props: { color: "error" },
            style: {
              color: red[500],
              "&:hover": {
                backgroundColor: alpha(red[100], 0.5),
              },
              ...theme.applyStyles("dark", {
                color: red[300],
                "&:hover": {
                  backgroundColor: alpha(red[900], 0.5),
                },
              }),
            },
          },
          {
            props: { color: "warning" },
            style: {
              color: orange[500],
              "&:hover": {
                backgroundColor: alpha(orange[100], 0.5),
              },
              ...theme.applyStyles("dark", {
                color: orange[300],
                "&:hover": {
                  backgroundColor: alpha(orange[900], 0.5),
                },
              }),
            },
          },
          {
            props: { color: "info" },
            style: {
              color: teal[500],
              "&:hover": {
                backgroundColor: alpha(teal[100], 0.5),
              },
              ...theme.applyStyles("dark", {
                color: teal[300],
                "&:hover": {
                  backgroundColor: alpha(teal[900], 0.5),
                },
              }),
            },
          },
        ],
      }),
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: "10px",
        boxShadow: `0 4px 16px ${alpha(gray[400], 0.2)}`,
        [`& .${toggleButtonGroupClasses.selected}`]: {
          color: teal[500],
        },
        ...theme.applyStyles("dark", {
          [`& .${toggleButtonGroupClasses.selected}`]: {
            color: "#fff",
          },
          boxShadow: `0 4px 16px ${alpha(teal[700], 0.5)}`,
        }),
      }),
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: "12px 16px",
        textTransform: "none" as const,
        borderRadius: "10px",
        fontWeight: 500,
        ...theme.applyStyles("dark", {
          color: gray[400],
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
          [`&.${toggleButtonClasses.selected}`]: {
            color: teal[300],
          },
        }),
      }),
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        border: "none",
      },
      input: {
        "&::placeholder": {
          opacity: 0.7,
          color: gray[500],
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        padding: "8px 12px",
      },
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
        transition: "border 120ms ease-in",
        "&:hover": {
          borderColor: gray[400],
        },
        [`&.${outlinedInputClasses.focused}`]: {
          outline: `3px solid ${alpha(teal[500], 0.5)}`,
          borderColor: teal[400],
        },
        ...theme.applyStyles("dark", {
          "&:hover": {
            borderColor: gray[500],
          },
        }),
      }),
      notchedOutline: {
        border: "none",
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.secondary,
        "&.Mui-focused": {
          color: theme.palette.primary.main,
        },
      }),
      outlined: {
        "&.MuiInputLabel-shrink": {
          transform: "translate(14px, -9px) scale(0.75)",
          backgroundColor: "var(--mui-palette-background-default, inherit)",
          padding: "0 4px",
        },
      },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.grey[500],
        ...theme.applyStyles("dark", {
          color: theme.palette.grey[400],
        }),
      }),
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        typography: theme.typography.caption,
        marginBottom: 8,
      }),
    },
  },
}
