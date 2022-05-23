export async function retrieveFiles(client, cid) {
  try {
    const res = await client.get(cid)
    const files = await res.files()
    return files[0].name
  } catch (error) {
    console.log('fileserr', error)
  }
}
