import { AIQuestions } from "@/types"
import { GenerativeModel } from "firebase/vertexai"

export default class VertexStore {
  private readonly _model: GenerativeModel

  constructor(model: GenerativeModel) {
    this._model = model
  }

  private get model() {
    return this._model
  }

  public async generatePollQuestions(n: number, uri: string) {
    const prompt_extract =
      "Extract Text! Return Return it as formatted text per page."
    const prompt_multi_choice = `Generate ${n} questions and 4 multiple choice style options where only one is correct for each question in a JSON format. Format the JSON as an array where each object has 'question': string, options: string[], and correct_answer: string.`
    const image = {
      fileData: {
        mimeType: "application/pdf",
        fileUri: uri,
      },
    }
    const ai1 = await this.model.generateContent([prompt_extract, image])
    const parsed_text = ai1.response.text()
    const ai2 = await this.model.generateContent([
      parsed_text,
      prompt_multi_choice,
    ])
    const PREFIX = "```json"
    const POSTFIX = "```"
    const body = ai2.response.text()
    const i = body.indexOf(PREFIX) + PREFIX.length
    const j = body.lastIndexOf(POSTFIX)
    const clean_body = body.substring(i, j)
    const payload = JSON.parse(clean_body) as AIQuestions
    // console.debug(payload)
    return payload
  }
}
