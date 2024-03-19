import { useEffect, useRef, useState } from 'react'
import './App.css'

const BASE_URL = 'https://picsum.photos/v2'

interface Image {
  id: string
  author: string
  download_url: string
}

export default function App() {
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<Image[]>([])
  const [page, setPage] = useState(1)

  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true)

      try {
        const response = await fetch(`${BASE_URL}/list?page=${page}&limit=9`, {
          signal: abortControllerRef.current.signal
        })
        const images = (await response.json()) as Image[]
        setImages(images)
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted')
          return
        }

        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [page]);

  if (error) {
    return <h1>Error: {error}</h1>
  }

  return (
    <div>
      <h1>Data fetching in React</h1>
      <div style={{ marginBottom: '20px' }}>
        Page: {page}
      </div>
      <div>
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          style={{ marginRight: '10px' }}
        >
          Previous Page
        </button>
        <button
          type="button"
          onClick={() => setPage(page + 1)}
          style={{ marginLeft: '10px' }}
        >
          Next Page
        </button>
      </div>
      <div>
        {isLoading && <span>Loading...</span>}
      </div>
      <div>
        {
          images.map((image) => (
            <img
              src={image.download_url}
              alt={image.author} key={image.id}
              style={{ width: '300px', height: '300px', margin: '20px' }}
            />
          ))
        }
      </div>
    </div >
  );
}