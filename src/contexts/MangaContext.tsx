import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

interface MangaContextProps {
  _id: string | undefined;
}

interface MangaLists {
  followedManga: any[];
  favoriteManga: any[];
  readingManga: any[];
}

export const MangaContext = createContext<{
  mangaLists: MangaLists;
  updateMangaLists: (lists: MangaLists) => void;
}>({
  mangaLists: { followedManga: [], favoriteManga: [], readingManga: [] },
  updateMangaLists: () => {},
});

export const MangaProvider: React.FC<MangaContextProps> = ({ children, _id }) => {
  const [mangaLists, setMangaLists] = useState<MangaLists>({
    followedManga: [],
    favoriteManga: [],
    readingManga: [],
  });

  useEffect(() => {
    const fetchUserManga = async () => {
      try {
        if (_id) {
          const response = await api.get(`/api/users/${_id}/manga`);
          const { followedManga, favoriteManga, readingManga } = response.data;
          setMangaLists({ followedManga, favoriteManga, readingManga });
        }
      } catch (error) {
        console.error('Error fetching user manga:', error);
      }
    };

    if (_id) {
      fetchUserManga();
    }
  }, [_id]);

  const updateMangaLists = (lists: MangaLists) => {
    setMangaLists(lists);
  };

  return (
    <MangaContext.Provider value={{ mangaLists, updateMangaLists }}>
      {children}
    </MangaContext.Provider>
  );
};