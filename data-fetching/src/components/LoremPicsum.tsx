import { useEffect, useRef, useState } from 'react'
import '../App.css'

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
                const response = await fetch(`${BASE_URL}/list?page=${page}`, {
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
        <>
            <div className='flex'>
                <header className="grow h-14 overflow-y-scroll no-scrollbar h-[100vh] bg-cream">
                    <section className="text-center">
                        <p className="text-lg font-bold">Page: {page}</p>
                    </section>
                    <nav className='flex justify-center gap-10'>
                        <button
                            type='button'
                            onClick={() => setPage(page - 1)} disabled={page === 1}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-2 rounded w-[30%]"
                        >
                            Previous
                        </button>
                        <button
                            type='button'
                            onClick={() => setPage(page + 1)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-2 rounded w-[30%]"
                        >
                            Next
                        </button>
                    </nav>

                    <section>
                        {isLoading && <h1>Loading...</h1>}
                        <ul className='flex flex-wrap flex-col items-center'>
                            {images.map((image) => (
                                <figure key={image.id}>
                                    <img
                                        src={image.download_url}
                                        alt={image.author}
                                        width="300px"
                                        height="300px"
                                        className="rounded-lg my-2 grayscale hover:grayscale-0 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                                    />
                                </figure>
                            ))}
                        </ul>
                    </section>
                </header>

                <section className='grow h-14'>
                    <h1>Column 2</h1>
                </section>
                <section className='grow h-14'>
                    <h1>Column 3</h1>
                </section>
            </div>
        </>
    );
}