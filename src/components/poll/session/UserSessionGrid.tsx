import { RA } from "@/styles"
import { Grid2 } from "@mui/material"
import React from "react"
import UserSessionCard from "./UserSessionCard"
import { DocumentData, QuerySnapshot } from "firebase/firestore"
import { SessionQuestionResults, SessionUser } from "@/types"

interface UserSessionGridProps {
  users?: QuerySnapshot<SessionUser, DocumentData>
  results?: SessionQuestionResults | null
  anonymous: boolean
}

/**
 * @brief Displays Grid of Users in Session
 */
export default function UserSessionGrid(props: UserSessionGridProps) {
  const { users, results, anonymous } = props

  if (!users) {
    return <></>
  }

  return (
    <React.Fragment>
      <Grid2 container spacing={2}>
        {users.docs.map((x) => (
          <Grid2 key={x.id} size={{ xl: 3, lg: 3, md: 3, sm: 4 }}>
            <RA.Zoom triggerOnce>
              <UserSessionCard
                u_ss={x}
                res={results?.responses[x.id]}
                anonymous={anonymous}
              />
            </RA.Zoom>
          </Grid2>
        ))}
      </Grid2>
    </React.Fragment>
  )
}
