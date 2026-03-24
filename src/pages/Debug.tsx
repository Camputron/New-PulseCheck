import ComponentShowcaseTab from "@/components/debug/ComponentShowcaseTab"
import DesignSystemTab from "@/components/debug/DesignSystemTab"
import PulseCheckShowcaseTab from "@/components/debug/PulseCheckShowcaseTab"
import { Box, Container, Tab, Tabs } from "@mui/material"
import { useState, type SyntheticEvent } from "react"

export default function Debug() {
  const [tab, setTab] = useState(0)

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label='Design System' />
          <Tab label='Component Showcase' />
          <Tab label='PulseCheck Components' />
        </Tabs>
      </Box>
      {tab === 0 && <DesignSystemTab />}
      {tab === 1 && <ComponentShowcaseTab />}
      {tab === 2 && <PulseCheckShowcaseTab />}
    </Container>
  )
}
