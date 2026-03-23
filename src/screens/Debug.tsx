import DesignSystemTab from "@/components/debug/DesignSystemTab"
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
        </Tabs>
      </Box>
      {tab === 0 && <DesignSystemTab />}
    </Container>
  )
}
