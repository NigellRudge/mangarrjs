const PageInfoQuery = `
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }

`;

const MangaQuery = `
        id
        title {
          romaji
          english
          native
        }
        description
        averageScore
        chapters
        startDate {
          year
          month
          day
        }
        coverImage {
          large
          medium
        }
        bannerImage
    
`;

export const popularMangasQuery = `
query ($page: Int = 1, $perPage: Int = 10) {
   Page(page:$page, perPage:$perPage) {
  ${PageInfoQuery}
    media(sort: POPULARITY_DESC, type: MANGA) {
        ${MangaQuery}
      }
  }
}

`;

export const searchGraphQlQuery = `
query ($search: String, $page: Int, $perPage: Int, $minScore: Int, $genres: [String]) {
    Page(page: $page, perPage: $perPage) {
        ${PageInfoQuery}
        media(
            search: $search
            type: MANGA
            averageScore_greater: $minScore
            sort: [POPULARITY_DESC, CHAPTERS_DESC ]
            genre_in: $genres
        ) {
            ${MangaQuery}
        }
    }
}
    `;

export const browseGraphQlQuery = `
query BrowseMangaByGenre($page: Int, $perPage: Int, $genres: [String]) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(type: MANGA, genre_in: $genres, sort: POPULARITY_DESC) {
      id
      title {
        romaji
        english
        native
      }
      genres
      popularity
      coverImage {
        large
        extraLarge
      }
      bannerImage
      description(asHtml: false)
      averageScore
      status
    }
  }
}
    `;

export const healthCheckQuery = `
query {
  Page(page: 1, perPage: 1) {
    pageInfo {
      total
    }
    media(type: MANGA) {
      id
      title {
        english
      }
    }
  }
}
`;

export const highlightedItems = `
query GetTrendingMedia {
  Page(perPage: 6) {
    media(sort: TRENDING_DESC) {
      id
      title {
        romaji
        english
        native
      }
      averageScore
      type
      bannerImage
      coverImage {
        large
        extraLarge
      }
    }
  }
}
`;

export const mangaMetadataQuery = `
query GetMangaById($id: Int) {
  Media(id: $id, type: MANGA) {
    id
    title {
      romaji
      english
      native
    }
    description(asHtml: false)
    averageScore
    genres
    status
    chapters
    volumes
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    bannerImage
    coverImage {
      extraLarge
      large
      medium
    }
    siteUrl
  }
}
`;

export const getMangaGenresQuery = `
query {
  Page(perPage: 50) {
    media(type: MANGA) {
      genres
    }
  }
}
`;

export const getMangasByGenresQuery = `
query GetTopMangaByGenres($genres: [String]) {
  Page(perPage: 10) {
    media(
      type: MANGA
      genre_in: $genres
      sort: [POPULARITY_DESC,TRENDING_DESC]
    ) {
        ${MangaQuery}
    }
  }
}
`;
