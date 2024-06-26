import type { CSFDMovie } from 'node-csfd-api/interfaces/movie.interface';

const API_URL = 'https://csfd.worker.bladesheng.com';

export async function getCsfdMovie(
	mediaType: 'movie' | 'tv',
	name: string,
	year: number
): Promise<CSFDMovie> {
	const res = await fetch(`${API_URL}/detail/${mediaType}?name=${name}&year=${year}`);

	let body = await res.json();

	if (body.status === 404) {
		// try again, this time without the year - movies sometimes get delayed - csfd and tmdb can be out of sync
		const res = await fetch(`${API_URL}/detail/${mediaType}?name=${name}`);
		body = await res.json();
	}

	return body;
}
