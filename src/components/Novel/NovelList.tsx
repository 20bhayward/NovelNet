import React, { useEffect, useState } from 'react';

import NovelItem from './NovelItem';

const NovelList = () => {
  const [novels, setNovels] = useState([]);

  useEffect(() => {


  }, []);

  return (
    <div>
      {novels.map((novel:any) => (
        <NovelItem key={novel.id} novel={novel} />
      ))}
    </div>
  );
};

export default NovelList;
