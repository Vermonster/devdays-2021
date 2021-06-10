import { extract } from './extract'

const questionnaire: fhir4.Questionnaire = {
  resourceType: 'Questionnaire',
  status: 'unknown',
  item: [
    {
      linkId: 'a',
      type: 'boolean',
      code: [{ code: '1234' }]
    },
    {
      linkId: 'b',
      text: 'Hemoglobin A1C',
      type: 'quantity',
      code: [{ system: 'http://loinc.org', code: '4548-4' }]
    }
  ]
}

const questionnaireResponse: fhir4.QuestionnaireResponse = {
  resourceType: 'QuestionnaireResponse',
  status: 'completed',
  contained: [
    questionnaire
  ],
  item: [
    {
      linkId: 'a',
      answer: [
        {
          valueBoolean: true
        },
        {
          valueBoolean: false
        }
      ]
    },
    {
      linkId: 'b',
      answer: [
        {
          valueQuantity: {
            value: 4,
            unit: '%',
            code: '%'
          }
        }
      ]
    }
  ]
}

const extracted: fhir4.Bundle = extract(questionnaireResponse)

console.dir(extracted, { depth: 10 })