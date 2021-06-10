import fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import fastifyCors from 'fastify-cors'

const server: FastifyInstance = fastify({
  logger: { prettyPrint: true }
})

server.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS']
})

server.get('/cds-services', async () => {
  return {
    services: [
      {
        id: 'open-me',
        hook: 'patient-view',
        title: 'Example',
        description: 'Example',
        prefetch: {
          conditions: 'Condition?patient={{context.patientId}}'
        }
      }
    ]
  } as CDSHooks.DiscoveryResponse
})


server.post('/cds-services/open-me', async (req: FastifyRequest) => {
  const payload = req.body as CDSHooks.HookRequest

  const count = payload.prefetch?.conditions?.entry?.length || 0

  return {
    cards: [
      {
        uuid: '1111-2222-3333-4444',
        summary: `You have ${count} problem(s)!`,
        indicator: 'critical',
        links: [
          {
            type: 'absolute',
            label: 'Visit the hospital',
            url: 'https://simpsons.fandom.com/wiki/Dr._Nick%27s_Walk-In_Clinic'
          }
        ]
      }
    ]
  } as CDSHooks.HookResponse
})

const start = async () => {
  try {
    await server.listen(3000)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
