import { SvgIconComponent } from "@mui/icons-material"
import {
  MenuItem as MUIMenuItem,
  ListItemIcon,
  MenuItemProps as MUIMenuItemProps,
} from "@mui/material"
import { MouseEvent } from "react"
import { NavigateOptions, To, useNavigate } from "react-router-dom"

type MenuItemProps = {
  icon?: SvgIconComponent
  to?: To
  opts?: NavigateOptions
} & MUIMenuItemProps

export default function MenuItem(props: MenuItemProps) {
  const { icon: Icon, to, opts, onClick, children, ...etc } = props
  const navigate = useNavigate()

  const handleClick = (e: MouseEvent<HTMLLIElement>) => {
    if (onClick) {
      onClick(e)
    }
    if (to) {
      if (opts) {
        void navigate(to, opts)
      } else {
        void navigate(to)
      }
    }
  }

  return (
    <MUIMenuItem
      {...etc}
      // component={to ? Link : "li"}
      // to={to}
      sx={{
        "&:hover": {
          color: "inherit",
        },
        ...etc.sx,
      }}
      onClick={handleClick}>
      {Icon && (
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
      )}
      {children}
    </MUIMenuItem>
  )
}
