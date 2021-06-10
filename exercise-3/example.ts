import Client from 'fhir-kit-client'

const client = new Client({ baseUrl: 'http://hapi.fhir.org/baseR4' })

const isPatient = (resource: fhir4.Resource): resource is fhir4.Patient => {
  return resource.resourceType === 'Patient'
}

client
  .read({ resourceType: 'Patient', id: '1274805' })
  .then(res => {
    if (isPatient(res)) { console.dir(res, {depth: 4 }) }
  })
  .catch(e => console.error(e))
