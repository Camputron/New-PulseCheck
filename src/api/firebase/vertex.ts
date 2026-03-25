import { AIQuestions } from "@/types"
import { Functions, httpsCallable } from "firebase/functions"

export default class VertexStore {
  private readonly _functions: Functions

  constructor(functions: Functions) {
    this._functions = functions
  }

  public async generatePollQuestions(
    n: number,
    uri: string
  ): Promise<AIQuestions> {
    const callable = httpsCallable<
      { n: number; uri: string },
      { questions: AIQuestions }
    >(this._functions, "generateQuestions")
    const result = await callable({ n, uri })
    return result.data.questions
  }
}
