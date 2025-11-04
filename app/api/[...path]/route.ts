export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  const pathSegments = params.path
  const pathString = pathSegments.join("/")
  const url = `https://posters.aiml.cgify.com/api/${pathString}`

  const searchParams = new URL(request.url).searchParams
  const queryString = searchParams.toString()
  const fullUrl = queryString ? `${url}?${queryString}` : url

  console.log("[v0] API GET request to:", fullUrl)

  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
    })

    if (!response.ok) {
      console.error(`[v0] API returned status ${response.status}:`, await response.text())
      const data = await response.json().catch(() => ({}))
      return Response.json(data, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] API GET error:", error)
    return Response.json({ error: "Failed to fetch from external API" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { path: string[] } }) {
  const pathSegments = params.path
  const pathString = pathSegments.join("/")
  const url = `https://posters.aiml.cgify.com/api/${pathString}`

  console.log("[v0] API POST request to:", url)

  try {
    const body = await request.json()
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      console.error(`[v0] API returned status ${response.status}:`, await response.text())
      const data = await response.json().catch(() => ({}))
      return Response.json(data, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] API POST error:", error)
    return Response.json({ error: "Failed to fetch from external API" }, { status: 500 })
  }
}
