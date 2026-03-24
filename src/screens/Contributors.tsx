import { Box, Container, Skeleton, Typography } from "@mui/material"
import { RA } from "@/styles"
import { useEffect, useState } from "react"

const GITHUB_USERNAMES = [
  "Camputron",
  "Bran7astic",
  "Pgeorgaklis21",
  "tdhillon113",
  "VerySirias",
  "ZairaGarcia17",
]

const FALLBACK_NAMES: Record<string, string> = {
  Camputron: "Michael Campos",
  Bran7astic: "Brandon Budhan",
  Pgeorgaklis21: "Peter Georgaklis",
  tdhillon113: "Trinity Dhillon",
  VerySirias: "Daniel Sirias",
  ZairaGarcia17: "Zaira Garcia",
}

interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
}

export default function Contributors() {
  const [contributors, setContributors] = useState<GitHubUser[]>([])
  const [loading, setLoading] = useState(true)

  console.debug(contributors)

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const results = await Promise.all(
          GITHUB_USERNAMES.map(async (username) => {
            const res = await fetch(`https://api.github.com/users/${username}`)
            if (!res.ok) {
              return {
                login: username,
                name: null,
                avatar_url: "",
                html_url: `https://github.com/${username}`,
              } as GitHubUser
            }
            return (await res.json()) as GitHubUser
          })
        )
        setContributors(results)
      } catch (err) {
        console.error("Failed to fetch contributors:", err)
      } finally {
        setLoading(false)
      }
    }

    void fetchContributors()
  }, [])

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        minHeight: "80vh",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(160deg, rgba(0,150,136,0.15) 0%, rgba(0,0,0,0) 60%)"
            : "linear-gradient(160deg, rgba(0,150,136,0.08) 0%, rgba(255,255,255,0) 60%)",
      }}>
      <Container maxWidth='sm'>
        <RA.Fade triggerOnce duration={600}>
          <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 8 } }}>
            <Typography
              variant='overline'
              sx={{
                letterSpacing: { xs: 2, sm: 3 },
                color: "primary.main",
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
              }}>
              The Team
            </Typography>
            <Typography
              variant='h3'
              fontWeight={800}
              sx={{
                mt: 0.5,
                mb: 1,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                lineHeight: 1.2,
              }}>
              Meet the Contributors
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                maxWidth: 420,
                mx: "auto",
                lineHeight: 1.6,
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              }}>
              The developers who brought PulseCheck to life.
            </Typography>
          </Box>
        </RA.Fade>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
            gap: { xs: 4, sm: 6 },
            justifyItems: "center",
          }}>
          {loading
            ? GITHUB_USERNAMES.map((username) => (
                <Box
                  key={username}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.5,
                    width: { xs: 100, sm: 120 },
                  }}>
                  <Skeleton variant='circular' width={96} height={96} />
                  <Skeleton variant='text' width={80} />
                  <Skeleton variant='text' width={60} />
                </Box>
              ))
            : contributors.map((contributor, i) => (
                <RA.Fade
                  key={contributor.login}
                  triggerOnce
                  duration={500}
                  delay={i * 100}>
                  <GitHubUserCard
                    login={contributor.login}
                    name={FALLBACK_NAMES[contributor.login]}
                    avatarUrl={contributor.avatar_url}
                    htmlUrl={contributor.html_url}
                  />
                </RA.Fade>
              ))}
        </Box>
      </Container>
    </Box>
  )
}

import { Avatar } from "@mui/material"
import { GitHub } from "@mui/icons-material"

interface GitHubUserProps {
  login: string
  name: string
  avatarUrl: string
  htmlUrl: string
}

function GitHubUserCard({ login, name, avatarUrl, htmlUrl }: GitHubUserProps) {
  return (
    <Box
      component='a'
      href={htmlUrl}
      target='_blank'
      rel='noopener noreferrer'
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
        // width: { xs: 90, sm: 110 },
        height: { xs: 130, sm: 150 },
        textDecoration: "none",
        color: "inherit",
        "&:hover .github-user-avatar": {
          borderColor: "primary.main",
          transform: "scale(1.05)",
        },
        "&:hover .github-user-name": {
          color: "primary.main",
        },
        "&:hover .github-user-handle": {
          color: "primary.main",
        },
      }}>
      <Avatar
        className='github-user-avatar'
        src={avatarUrl}
        alt={name}
        sx={{
          // width: { xs: 64, sm: 72 },
          // height: { xs: 64, sm: 72 },
          width: 96,
          height: 96,
          border: 2,
          borderStyle: "solid",
          borderColor: "divider",
          transition: "border-color 0.2s, transform 0.2s ease-out",
        }}
      />
      <Typography
        className='github-user-name'
        // variant='caption'
        fontWeight={700}
        sx={{
          textAlign: "center",
          lineHeight: 1.3,
          transition: "color 0.2s",
          mt: 0.5,
        }}>
        {name}
      </Typography>
      <Box
        className='github-user-handle'
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          color: "text.secondary",
          transition: "color 0.2s",
        }}>
        <GitHub sx={{ fontSize: 12 }} />
        <Typography variant='subtitle2'>{login}</Typography>
      </Box>
    </Box>
  )
}
