import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Venue, VenuesResponse } from '../types/venue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const PAGE_SIZE = 24

function buildUrl(query: string, page: number): string {
  const base = query
    ? `${API_BASE_URL}/holidaze/venues/search?q=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/holidaze/venues`
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}sort=created&sortOrder=desc&limit=${PAGE_SIZE}&page=${page}`
}

async function fetchPage(query: string, page: number, signal: AbortSignal): Promise<VenuesResponse> {
  const response = await fetch(buildUrl(query, page), { signal })
  if (!response.ok) throw new Error('Failed to fetch venues')
  return (await response.json()) as VenuesResponse
}

type VenueState = {
  venues: Venue[]
  /** The query these venues belong to — undefined means no fetch has resolved yet */
  fetchedQuery: string | undefined
  loadingMore: boolean
  error: string | null
  hasMore: boolean
}

const initialState: VenueState = {
  venues: [],
  fetchedQuery: undefined,
  loadingMore: false,
  error: null,
  hasMore: true,
}

export function useVenues(query: string) {
  const [state, setState] = useState<VenueState>(initialState)

  const pageRef = useRef(1)
  const hasMoreRef = useRef(true)
  const loadingMoreRef = useRef(false)

  // Derive loading from whether the current state matches the active query
  const loading = state.fetchedQuery !== query

  // Initial fetch & reset on query change — no synchronous setState needed
  useEffect(() => {
    const controller = new AbortController()
    pageRef.current = 1
    hasMoreRef.current = true
    loadingMoreRef.current = false

    fetchPage(query, 1, controller.signal)
      .then((json) => {
        hasMoreRef.current = !json.meta.isLastPage
        setState({
          venues: json.data,
          fetchedQuery: query,
          loadingMore: false,
          error: null,
          hasMore: !json.meta.isLastPage,
        })
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        hasMoreRef.current = false
        setState({
          venues: [],
          fetchedQuery: query,
          loadingMore: false,
          error: err instanceof Error ? err.message : 'An error occurred',
          hasMore: false,
        })
      })

    return () => controller.abort()
  }, [query])

  // Load next page — uses refs so the callback identity is stable
  const loadMore = useCallback(() => {
    if (loadingMoreRef.current || !hasMoreRef.current) return

    const currentQuery = query
    loadingMoreRef.current = true
    setState((prev) => ({ ...prev, loadingMore: true }))
    const nextPage = pageRef.current + 1

    fetchPage(currentQuery, nextPage, new AbortController().signal)
      .then((json) => {
        // Guard against stale responses if query changed during the fetch
        if (currentQuery !== query) return
        pageRef.current = nextPage
        hasMoreRef.current = !json.meta.isLastPage
        setState((prev) => ({
          ...prev,
          venues: [...prev.venues, ...json.data],
          hasMore: !json.meta.isLastPage,
          loadingMore: false,
        }))
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        if (currentQuery !== query) return
        hasMoreRef.current = false
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : 'An error occurred',
          hasMore: false,
          loadingMore: false,
        }))
      })
      .finally(() => {
        loadingMoreRef.current = false
      })
  }, [query])

  return useMemo(
    () => ({ venues: state.venues, loading, loadingMore: state.loadingMore, error: state.error, hasMore: state.hasMore, loadMore }),
    [state, loading, loadMore]
  )
}
