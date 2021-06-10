import { v4 } from 'uuid'

const valuesFromQuestionnareResponseItem = (
  questionnaireResponseItem: fhir4.QuestionnaireResponseItem
): Array<string | boolean | number | fhir4.Attachment | fhir4.Coding | fhir4.Quantity | fhir4.Reference> => {
  return questionnaireResponseItem.answer.map(answer => {
    return answer.valueAttachment
      || answer.valueCoding
      || answer.valueDate
      || answer.valueDateTime
      || answer.valueDecimal
      || answer.valueInteger
      || answer.valueQuantity
      || answer.valueQuantity
      || answer.valueReference
      || answer.valueString
      || answer.valueTime
      || answer.valueUri
      || answer.valueBoolean
  })
}

const extractObservationFromQuestionnaireItem = (
  questionnaireResponseItem: fhir4.QuestionnaireResponseItem,
  questionnaireItem: fhir4.QuestionnaireItem
): fhir4.Observation[] => {
  const coding: fhir4.Coding[] = questionnaireItem.code.map(c => c)
  const values = valuesFromQuestionnareResponseItem(questionnaireResponseItem)

  return values.map(value => {
    return {
      resourceType: 'Observation',
      id: v4(),
      status: 'final',
      code: { coding },
      value: value
    }
  })
}

const isQuestionnare = (resource: fhir4.Resource): resource is fhir4.Questionnaire => {
  return (resource.resourceType === 'Questionnaire')
}

const containedQuestionnare = (resource: fhir4.DomainResource): fhir4.Questionnaire => {
  const contained = resource.contained.find(item => item.resourceType === 'Questionnaire')
  return isQuestionnare(contained) ? contained : null
}

const questionnaireItemByLinkId = (
  questionnaire: fhir4.Questionnaire,
  linkId: string
): fhir4.QuestionnaireItem => {
  return questionnaire.item.find(item => item.linkId === linkId)
}

export const extract = (questionnaireResponse: fhir4.QuestionnaireResponse): fhir4.Bundle => {
  const questionnaire = containedQuestionnare(questionnaireResponse)

  const observations: fhir4.Observation[] = questionnaireResponse.item.reduce((acc, qrItem) => {
    const qItem = questionnaireItemByLinkId(questionnaire, qrItem.linkId)
    acc.push(
      ...extractObservationFromQuestionnaireItem(qrItem, qItem)
    )
    return acc
  }, [])

  const bundleEntries: fhir4.BundleEntry[] = observations.map(observation => {
    return {
      fullUrl: `uuid:${observation.id}`,
      resource: observation,
      request: {
        method: 'POST',
        url: '/Observation'
      }
    }
  })

  return {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: bundleEntries
  }
}
