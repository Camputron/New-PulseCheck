import { getDoc } from "firebase/firestore"
import { Poll, PollPDFData, PollPDFQuestion } from "@/types"

export default async function fetchPollPDFData(
  poll: Poll,
): Promise<PollPDFData> {
  const questions: PollPDFQuestion[] = await Promise.all(
    poll.questions.map(async (qRef) => {
      const qSnap = await getDoc(qRef)
      const question = qSnap.data()
      if (!question) {
        throw new Error(`Failed to fetch question ${qRef.path}`)
      }

      const options = await Promise.all(
        question.options.map(async (oRef) => {
          const oSnap = await getDoc(oRef)
          const option = oSnap.data()
          if (!option) {
            throw new Error(`Failed to fetch option ${oRef.path}`)
          }
          return { text: option.text }
        }),
      )

      return {
        prompt: question.prompt,
        promptType: question.prompt_type,
        options,
      }
    }),
  )

  return {
    title: poll.title,
    createdAt: poll.created_at.toDate(),
    questions,
  }
}
