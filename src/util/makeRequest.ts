import https from 'https'

export const makeRequest = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        headers: {
          'content-type': 'application/json',
          accept: 'application/json'
        }
      },
      (res) => {
        const responseData: Buffer[] = []

        res.on('data', (chunk) => {
          responseData.push(chunk)
        })

        res.on('end', () => {
          resolve(Buffer.concat(responseData).toString('utf-8'))
        })
      }
    )

    request.on('error', reject)
    request.end()
  })
