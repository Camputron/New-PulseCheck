import { alpha, Theme, Components } from "@mui/material/styles"
import { gray, orange, green, red, teal } from "../themePrimitives"

export const feedbackCustomizations: Components<Theme> = {
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 10,
        color: theme.palette.text.primary,
        variants: [
          // ── Standard (light tinted background) ──
          {
            props: { variant: "standard", severity: "success" },
            style: {
              backgroundColor: green[50],
              border: `1px solid ${alpha(green[300], 0.5)}`,
              "& .MuiAlert-icon": { color: green[500] },
              ...theme.applyStyles("dark", {
                backgroundColor: alpha(green[900], 0.5),
                border: `1px solid ${alpha(green[800], 0.5)}`,
              }),
            },
          },
          {
            props: { variant: "standard", severity: "info" },
            style: {
              backgroundColor: teal[50],
              border: `1px solid ${alpha(teal[300], 0.5)}`,
              "& .MuiAlert-icon": { color: teal[500] },
              ...theme.applyStyles("dark", {
                backgroundColor: alpha(teal[900], 0.5),
                border: `1px solid ${alpha(teal[800], 0.5)}`,
              }),
            },
          },
          {
            props: { variant: "standard", severity: "warning" },
            style: {
              backgroundColor: orange[100],
              border: `1px solid ${alpha(orange[300], 0.5)}`,
              "& .MuiAlert-icon": { color: orange[500] },
              ...theme.applyStyles("dark", {
                backgroundColor: alpha(orange[900], 0.5),
                border: `1px solid ${alpha(orange[800], 0.5)}`,
              }),
            },
          },
          {
            props: { variant: "standard", severity: "error" },
            style: {
              backgroundColor: red[50],
              border: `1px solid ${alpha(red[200], 0.5)}`,
              "& .MuiAlert-icon": { color: red[500] },
              ...theme.applyStyles("dark", {
                backgroundColor: alpha(red[900], 0.5),
                border: `1px solid ${alpha(red[800], 0.5)}`,
              }),
            },
          },
          // ── Outlined (transparent bg, colored border) ──
          {
            props: { variant: "outlined", severity: "success" },
            style: {
              backgroundColor: "transparent",
              border: `1px solid ${green[300]}`,
              color: green[700],
              "& .MuiAlert-icon": { color: green[500] },
              ...theme.applyStyles("dark", {
                border: `1px solid ${green[700]}`,
                color: green[200],
              }),
            },
          },
          {
            props: { variant: "outlined", severity: "info" },
            style: {
              backgroundColor: "transparent",
              border: `1px solid ${teal[300]}`,
              color: teal[700],
              "& .MuiAlert-icon": { color: teal[500] },
              ...theme.applyStyles("dark", {
                border: `1px solid ${teal[700]}`,
                color: teal[200],
              }),
            },
          },
          {
            props: { variant: "outlined", severity: "warning" },
            style: {
              backgroundColor: "transparent",
              border: `1px solid ${orange[300]}`,
              color: orange[700],
              "& .MuiAlert-icon": { color: orange[500] },
              ...theme.applyStyles("dark", {
                border: `1px solid ${orange[700]}`,
                color: orange[200],
              }),
            },
          },
          {
            props: { variant: "outlined", severity: "error" },
            style: {
              backgroundColor: "transparent",
              border: `1px solid ${red[300]}`,
              color: red[700],
              "& .MuiAlert-icon": { color: red[500] },
              ...theme.applyStyles("dark", {
                border: `1px solid ${red[700]}`,
                color: red[200],
              }),
            },
          },
          // ── Filled (solid colored background) ──
          {
            props: { variant: "filled", severity: "success" },
            style: {
              backgroundColor: green[500],
              color: "white",
              border: "none",
              "& .MuiAlert-icon": { color: "white" },
              ...theme.applyStyles("dark", {
                backgroundColor: green[600],
              }),
            },
          },
          {
            props: { variant: "filled", severity: "info" },
            style: {
              backgroundColor: teal[500],
              color: "white",
              border: "none",
              "& .MuiAlert-icon": { color: "white" },
              ...theme.applyStyles("dark", {
                backgroundColor: teal[600],
              }),
            },
          },
          {
            props: { variant: "filled", severity: "warning" },
            style: {
              backgroundColor: orange[400],
              color: "white",
              border: "none",
              "& .MuiAlert-icon": { color: "white" },
              ...theme.applyStyles("dark", {
                backgroundColor: orange[500],
              }),
            },
          },
          {
            props: { variant: "filled", severity: "error" },
            style: {
              backgroundColor: red[400],
              color: "white",
              border: "none",
              "& .MuiAlert-icon": { color: "white" },
              ...theme.applyStyles("dark", {
                backgroundColor: red[500],
              }),
            },
          },
        ],
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: ({ theme }) => ({
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          border: "1px solid",
          borderColor: theme.palette.divider,
        },
      }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 8,
        borderRadius: 8,
        backgroundColor: gray[200],
        ...theme.applyStyles("dark", {
          backgroundColor: gray[800],
        }),
      }),
    },
  },
}
